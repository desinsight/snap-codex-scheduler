import {
  GatewayConfig,
  RouteConfig,
  GatewayResponse,
  GatewayError,
  GatewayStats,
} from '../types/apiGateway';

class APIGatewayService {
  private config: GatewayConfig;
  private stats: GatewayStats;
  private rateLimiters: Map<string, { count: number; resetTime: number }>;

  constructor(config: GatewayConfig) {
    this.config = config;
    this.stats = {
      totalRequests: 0,
      activeConnections: 0,
      averageResponseTime: 0,
      errorRate: 0,
      routes: {},
    };
    this.rateLimiters = new Map();
    this.initializeHealthCheck();
  }

  private initializeHealthCheck() {
    setInterval(async () => {
      try {
        await this.checkHealth();
      } catch (error) {
        console.error('Health check failed:', error);
      }
    }, this.config.healthCheck.interval * 1000);
  }

  private async checkHealth() {
    for (const route of this.config.routes) {
      try {
        const response = await fetch(route.target, {
          method: 'HEAD',
          timeout: route.timeout,
        });
        if (!response.ok) {
          throw new Error(`Health check failed for ${route.path}`);
        }
      } catch (error) {
        console.error(`Health check failed for ${route.path}:`, error);
      }
    }
  }

  private checkRateLimit(route: RouteConfig, clientId: string): boolean {
    const key = `${route.path}:${clientId}`;
    const now = Date.now();
    const limiter = this.rateLimiters.get(key);

    if (!limiter || now > limiter.resetTime) {
      this.rateLimiters.set(key, {
        count: 1,
        resetTime: now + (route.rateLimit?.interval || 60) * 1000,
      });
      return true;
    }

    if (limiter.count >= (route.rateLimit?.requests || 100)) {
      return false;
    }

    limiter.count++;
    return true;
  }

  private async authenticateRequest(route: RouteConfig, headers: Headers): Promise<boolean> {
    if (!route.authentication?.required) return true;

    const authHeader = headers.get('Authorization');
    if (!authHeader) return false;

    switch (route.authentication.type) {
      case 'jwt':
        return this.validateJWT(authHeader);
      case 'apiKey':
        return this.validateApiKey(authHeader);
      case 'oauth2':
        return this.validateOAuth2(authHeader);
      default:
        return false;
    }
  }

  private async validateJWT(token: string): Promise<boolean> {
    // JWT 검증 로직 구현
    return true;
  }

  private async validateApiKey(apiKey: string): Promise<boolean> {
    // API 키 검증 로직 구현
    return true;
  }

  private async validateOAuth2(token: string): Promise<boolean> {
    // OAuth2 검증 로직 구현
    return true;
  }

  private handleCORS(route: RouteConfig, request: Request): Response | null {
    if (!route.cors) return null;

    const origin = request.headers.get('Origin');
    if (!origin || !route.cors.allowedOrigins.includes(origin)) {
      return new Response(null, { status: 403 });
    }

    const headers = new Headers({
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': route.cors.allowedMethods.join(', '),
      'Access-Control-Allow-Headers': route.cors.allowedHeaders.join(', '),
    });

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers, status: 204 });
    }

    return null;
  }

  async handleRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const route = this.config.routes.find(
      r => r.path === url.pathname && r.method === request.method
    );

    if (!route) {
      return new Response(
        JSON.stringify({
          error: 'Route not found',
          status: 404,
        }),
        { status: 404 }
      );
    }

    // CORS 처리
    const corsResponse = this.handleCORS(route, request);
    if (corsResponse) return corsResponse;

    // 인증 확인
    if (!(await this.authenticateRequest(route, request.headers))) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
          status: 401,
        }),
        { status: 401 }
      );
    }

    // Rate limiting
    const clientId = request.headers.get('X-Client-ID') || 'anonymous';
    if (!this.checkRateLimit(route, clientId)) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          status: 429,
        }),
        { status: 429 }
      );
    }

    // 요청 처리
    try {
      const startTime = Date.now();
      const response = await fetch(route.target, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        timeout: route.timeout,
      });

      const latency = Date.now() - startTime;
      this.updateStats(route.path, response.ok, latency);

      return response;
    } catch (error) {
      this.updateStats(route.path, false, 0);
      return new Response(
        JSON.stringify({
          error: 'Internal server error',
          status: 500,
          details: error.message,
        }),
        { status: 500 }
      );
    }
  }

  private updateStats(path: string, success: boolean, latency: number) {
    this.stats.totalRequests++;
    if (!success) this.stats.errorRate++;

    if (!this.stats.routes[path]) {
      this.stats.routes[path] = {
        requests: 0,
        errors: 0,
        averageLatency: 0,
      };
    }

    const routeStats = this.stats.routes[path];
    routeStats.requests++;
    if (!success) routeStats.errors++;

    routeStats.averageLatency =
      (routeStats.averageLatency * (routeStats.requests - 1) + latency) / routeStats.requests;
  }

  getStats(): GatewayStats {
    return this.stats;
  }

  updateConfig(newConfig: Partial<GatewayConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

export const apiGatewayService = new APIGatewayService({
  routes: [],
  defaultTimeout: 5000,
  defaultRetryAttempts: 3,
  healthCheck: {
    path: '/health',
    interval: 60,
  },
  logging: {
    level: 'info',
    format: 'json',
  },
});
