import { User } from './auth';

// 인증 관련 타입
export type AuthMethod = 'password' | 'oauth' | 'jwt' | 'apiKey' | 'mfa';
export type AuthStatus = 'authenticated' | 'unauthenticated' | 'pending' | 'blocked';
export type AuthProvider = 'google' | 'github' | 'facebook' | 'apple' | 'local';

// 권한 관련 타입
export type Permission = 
  | 'read:schedules'
  | 'write:schedules'
  | 'delete:schedules'
  | 'manage:users'
  | 'manage:roles'
  | 'view:analytics'
  | 'manage:settings'
  | 'manage:notifications';

export type Resource = 
  | 'user'
  | 'schedule'
  | 'notification'
  | 'setting'
  | 'report'
  | 'system';

// 역할 타입
export type Role = 'admin' | 'manager' | 'user' | 'guest';

// 보안 정책 타입
export interface SecurityPolicy {
  password: {
    minLength: number;
    requireNumbers: boolean;
    requireSymbols: boolean;
    requireUppercase: boolean;
    requireLowercase: boolean;
    maxAge: number;
    historySize: number;
  };
  session: {
    duration: number;
    extendable: boolean;
    maxConcurrent: number;
    inactivityTimeout: number;
  };
  mfa: {
    required: boolean;
    methods: Array<'totp' | 'sms' | 'email'>;
    gracePeriod: number;
    rememberDevice: boolean;
  };
  rateLimit: {
    enabled: boolean;
    maxRequests: number;
    windowMs: number;
    blockDuration: number;
  };
  cors: {
    enabled: boolean;
    origins: string[];
    methods: string[];
    headers: string[];
    credentials: boolean;
  };
}

// 보안 규칙 타입
export interface SecurityRule {
  resource: Resource;
  permissions: Permission[];
  conditions?: {
    timeRestriction?: {
      start?: string;
      end?: string;
      timezone?: string;
    };
    ipRestriction?: string[];
    deviceRestriction?: string[];
    locationRestriction?: string[];
  };
  action: 'allow' | 'deny';
}

// 인증 자격 증명 타입
export interface Credentials {
  username?: string;
  password?: string;
  token?: string;
  apiKey?: string;
  provider?: AuthProvider;
  mfaCode?: string;
}

// 보안 설정 타입
export interface SecurityConfig {
  auth: {
    methods: AuthMethod[];
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    passwordPolicy: PasswordPolicy;
    mfaPolicy: MFAPolicy;
  };
  encryption: EncryptionConfig;
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  cors: {
    origins: string[];
    methods: string[];
    allowedHeaders: string[];
    exposedHeaders: string[];
    credentials: boolean;
  };
}

// 비밀번호 정책 타입
export interface PasswordPolicy {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventReuse: number;
  expirationDays: number;
}

// MFA 정책 타입
export interface MFAPolicy {
  required: boolean;
  methods: Array<'authenticator' | 'sms' | 'email'>;
  backupCodes: number;
  rememberDevice: boolean;
  rememberPeriod: number;
}

// 보안 이벤트 타입
export type SecurityEventType =
  | 'login'
  | 'logout'
  | 'passwordChange'
  | 'mfaEnabled'
  | 'mfaDisabled'
  | 'accessDenied'
  | 'policyViolation';

export interface SecurityEvent {
  type: SecurityEventType;
  userId: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  details: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// 보안 위협 타입
export interface SecurityThreat {
  id: string;
  type: 'bruteForce' | 'injection' | 'xss' | 'csrf' | 'dos';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: {
    ip: string;
    location?: string;
    userAgent?: string;
  };
  target: {
    resource: Resource;
    endpoint?: string;
    userId?: string;
  };
  timestamp: Date;
  status: 'detected' | 'analyzing' | 'blocked' | 'resolved';
  details: Record<string, any>;
}

// 보안 감사 타입
export interface SecurityAudit {
  id: string;
  type: 'policy' | 'access' | 'configuration' | 'compliance';
  timestamp: Date;
  performer: {
    id: string;
    role: Role;
  };
  changes: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;
  reason?: string;
}

// 보안 메트릭 타입
export interface SecurityMetrics {
  authenticationSuccess: number;
  authenticationFailures: number;
  activeUsers: number;
  activeSessions: number;
  blockedAttempts: number;
  policyViolations: number;
  averageResponseTime: number;
  threatDetections: number;
}

// 보안 리포트 타입
export interface SecurityReport {
  period: {
    start: Date;
    end: Date;
  };
  metrics: SecurityMetrics;
  threats: SecurityThreat[];
  violations: SecurityEvent[];
  recommendations: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    remediation: string;
  }>;
}

// 보안 관리자 인터페이스
export interface SecurityManager {
  // 인증 관리
  authenticate: (credentials: Credentials) => Promise<AuthToken>;
  validateToken: (token: string) => Promise<boolean>;
  revokeToken: (token: string) => Promise<void>;
  
  // 권한 관리
  checkPermission: (userId: string, resource: Resource, permission: Permission) => Promise<boolean>;
  assignRole: (userId: string, role: Role) => Promise<void>;
  
  // 정책 관리
  createPolicy: (policy: SecurityPolicy) => Promise<void>;
  updatePolicy: (id: string, policy: Partial<SecurityPolicy>) => Promise<void>;
  deletePolicy: (id: string) => Promise<void>;
  
  // 위협 관리
  detectThreats: () => Promise<SecurityThreat[]>;
  blockThreat: (threatId: string) => Promise<void>;
  
  // 감사 및 모니터링
  audit: (event: SecurityEvent) => Promise<void>;
  generateReport: (startDate: Date, endDate: Date) => Promise<SecurityReport>;
  
  // 암호화
  encrypt: (data: string, keyId: string) => Promise<string>;
  decrypt: (data: string, keyId: string) => Promise<string>;
  rotateKeys: () => Promise<void>;
}

// Authentication Types
export interface AuthCredentials {
  username: string;
  password: string;
  mfaCode?: string;
}

export interface AuthSession {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  lastActivity: string;
  device: {
    type: string;
    os: string;
    browser: string;
    ip: string;
  };
  mfa?: {
    verified: boolean;
    method: 'totp' | 'sms' | 'email';
    lastVerified: string;
  };
}

// Authorization Types
export interface AccessPolicy {
  id: string;
  name: string;
  description: string;
  effect: 'allow' | 'deny';
  actions: Permission[];
  resources: string[];
  conditions?: Record<string, any>;
  priority: number;
}

// Encryption Types
export interface EncryptionConfig {
  algorithm: string;
  keySize: number;
  saltRounds: number;
  ivLength: number;
  tagLength: number;
}

export interface EncryptedData {
  data: string;
  iv: string;
  tag: string;
  algorithm: string;
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
  algorithm: string;
  createdAt: string;
  expiresAt: string;
}

// Audit Types
export interface AuditEvent {
  id: string;
  type: string;
  actor: {
    id: string;
    type: 'user' | 'system' | 'service';
    name: string;
  };
  action: {
    type: string;
    target: string;
    data?: any;
  };
  context: {
    ip: string;
    userAgent: string;
    location?: {
      country: string;
      region: string;
      city: string;
    };
    session?: string;
  };
  metadata: {
    timestamp: string;
    status: 'success' | 'failure';
    reason?: string;
  };
}

export interface AuditLog {
  events: AuditEvent[];
  filters: {
    startDate: string;
    endDate: string;
    types?: string[];
    actors?: string[];
    status?: 'success' | 'failure';
  };
  export: (format: 'csv' | 'json') => Promise<string>;
}

// Threat Detection Types
export interface ThreatIndicator {
  type: 'ip' | 'domain' | 'hash' | 'pattern';
  value: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  source: string;
  lastUpdated: string;
}

export interface ThreatAlert {
  id: string;
  indicator: ThreatIndicator;
  detectedAt: string;
  context: {
    request: {
      method: string;
      url: string;
      headers: Record<string, string>;
      body?: any;
    };
    user?: User;
    session?: AuthSession;
  };
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  resolution?: {
    type: string;
    notes: string;
    resolvedBy: string;
    resolvedAt: string;
  };
}

// Security Service Types
export interface SecurityService {
  // Authentication
  authenticate: (credentials: AuthCredentials) => Promise<AuthToken>;
  validateToken: (token: string) => Promise<boolean>;
  refreshToken: (refreshToken: string) => Promise<AuthToken>;
  revokeToken: (token: string) => Promise<void>;
  
  // Authorization
  checkPermission: (userId: string, permission: Permission) => Promise<boolean>;
  getRoles: (userId: string) => Promise<Role[]>;
  getPolicies: (roleId: string) => Promise<AccessPolicy[]>;
  
  // Encryption
  encrypt: (data: any, config?: Partial<EncryptionConfig>) => Promise<EncryptedData>;
  decrypt: (encryptedData: EncryptedData) => Promise<any>;
  generateKeyPair: () => Promise<KeyPair>;
  
  // Audit
  logAuditEvent: (event: Omit<AuditEvent, 'id'>) => Promise<void>;
  getAuditLog: (filters: AuditLog['filters']) => Promise<AuditLog>;
  
  // Threat Detection
  addThreatIndicator: (indicator: Omit<ThreatIndicator, 'lastUpdated'>) => Promise<void>;
  detectThreats: (context: ThreatAlert['context']) => Promise<ThreatAlert[]>;
  updateAlert: (alertId: string, update: Partial<ThreatAlert>) => Promise<void>;
  
  // Policy Management
  getSecurityPolicy: () => Promise<SecurityPolicy>;
  updateSecurityPolicy: (policy: Partial<SecurityPolicy>) => Promise<void>;
  enforcePolicy: (policy: SecurityPolicy) => Promise<void>;
}

// Security Context Types
export interface SecurityContext {
  user?: User;
  session?: AuthSession;
  token?: AuthToken;
  roles: Role[];
  permissions: Permission[];
  policies: AccessPolicy[];
}

// Security Provider Props
export interface SecurityProviderProps {
  children: React.ReactNode;
  service: SecurityService;
  initialContext?: Partial<SecurityContext>;
  onAuthStateChange?: (context: SecurityContext) => void;
  onSecurityEvent?: (event: AuditEvent) => void;
  onThreatDetected?: (alert: ThreatAlert) => void;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface AuthService {
  authenticate: (credentials: Credentials) => Promise<AuthToken>;
  refreshToken: (refreshToken: string) => Promise<AuthToken>;
  logout: () => Promise<void>;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token?: AuthToken;
  loading: boolean;
  error: string | null;
} 