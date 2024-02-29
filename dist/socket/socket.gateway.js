"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SocketGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketGateway = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const websockets_1 = require("@nestjs/websockets");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const socket_io_1 = require("socket.io");
const auth_service_1 = require("../auth/auth.service");
const userCredentials_services_1 = require("../userCredentials/userCredentials.services");
const socket_jwtGuard_1 = require("./socket.jwtGuard");
const socketGatewayOptions = {
    cors: {
        origin: '*',
    },
};
let SocketGateway = SocketGateway_1 = class SocketGateway {
    constructor(configService, authService, userCredentialsService) {
        this.configService = configService;
        this.authService = authService;
        this.userCredentialsService = userCredentialsService;
        this.logger = new common_1.Logger(SocketGateway_1.name);
        this.server = new socket_io_1.Server(this.configService.get('WSPORT'), { transports: ['websocket'], path: '/socketPath1/' });
    }
    handleDisconnect(client) {
        this.logger.log(`Cliend id:${client.id} disconnected`);
    }
    afterInit(server) {
        this.logger.log('SocketGateway initialized, server:', server);
    }
    async handleConnection(client) {
        const { sockets } = this.server.sockets;
        console.log('@SocketGateway handleConnection sockets', sockets);
        console.log('@SocketGateway handleConnection, client:', client);
        try {
            const accessToken = client.handshake.headers.authorization.split(' ')[1];
            const payload = await this.authService.verifyAccessToken(accessToken);
            const user = await this.userCredentialsService.findUserById(payload.userId);
            !user && client.disconnect();
            const isClientConnected = client.connected;
            console.log('@SocketGateway handleConnection connected', isClientConnected);
        }
        catch (wsConnectionError) {
            console.log('@SocketGateway handleConnection error', wsConnectionError);
        }
    }
    findAll(data) {
        return (0, rxjs_1.from)([1, 2, 3]).pipe((0, operators_1.map)((item) => ({ event: 'events', data: item })));
    }
    async identity(data) {
        return data;
    }
    handleEvent(data, client) {
        console.log('handleEvent eventsFromClient incoming data:', data);
        client.emit('eventsEmitFromServer', 'SocketGateway says hello back');
    }
};
exports.SocketGateway = SocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('events'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", rxjs_1.Observable)
], SocketGateway.prototype, "findAll", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('identity'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "identity", null);
__decorate([
    (0, common_1.UseGuards)(socket_jwtGuard_1.SocketJwtGuard),
    (0, websockets_1.SubscribeMessage)('eventsFromClient'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleEvent", null);
exports.SocketGateway = SocketGateway = SocketGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)(socketGatewayOptions),
    __metadata("design:paramtypes", [config_1.ConfigService,
        auth_service_1.AuthService,
        userCredentials_services_1.UserCredentialsService])
], SocketGateway);
//# sourceMappingURL=socket.gateway.js.map