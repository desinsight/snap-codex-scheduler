import { Server } from 'socket.io';
export class WebSocketService {
    static instance;
    io;
    userSockets;
    constructor() {
        this.userSockets = new Map();
    }
    static getInstance() {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }
    initialize(server) {
        this.io = new Server(server, {
            cors: {
                origin: process.env.CORS_ORIGIN || '*',
                methods: ['GET', 'POST']
            }
        });
        this.setupEventHandlers();
    }
    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);
            socket.on('authenticate', (userId) => {
                this.associateUserWithSocket(userId, socket.id);
            });
            socket.on('disconnect', () => {
                this.removeSocket(socket.id);
                console.log('Client disconnected:', socket.id);
            });
        });
    }
    associateUserWithSocket(userId, socketId) {
        if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, []);
        }
        this.userSockets.get(userId)?.push(socketId);
    }
    removeSocket(socketId) {
        for (const [userId, sockets] of this.userSockets.entries()) {
            const index = sockets.indexOf(socketId);
            if (index !== -1) {
                sockets.splice(index, 1);
                if (sockets.length === 0) {
                    this.userSockets.delete(userId);
                }
                break;
            }
        }
    }
    async sendNotification(userId, content, template) {
        try {
            const sockets = this.userSockets.get(userId);
            if (!sockets || sockets.length === 0) {
                console.log(`No active sockets for user: ${userId}`);
                return;
            }
            const notification = {
                content,
                template,
                timestamp: new Date().toISOString()
            };
            sockets.forEach(socketId => {
                this.io.to(socketId).emit('notification', notification);
            });
            console.log(`Notification sent to user ${userId} via ${sockets.length} sockets`);
        }
        catch (error) {
            console.error('Failed to send WebSocket notification:', error);
            throw error;
        }
    }
    getActiveUsers() {
        return Array.from(this.userSockets.keys());
    }
    getActiveSockets(userId) {
        return this.userSockets.get(userId) || [];
    }
}
