"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const environment_1 = require("../global/environment");
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const sockets = __importStar(require("../sockets/sockets"));
const credentials = {
    key: fs_1.default.readFileSync('sslcert/server.key'),
    cert: fs_1.default.readFileSync('sslcert/server.cert'),
};
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.portHttp = environment_1.SERVER_HTTP_PORT;
        this.portHttps = environment_1.SERVER_HTTPS_PORT;
        this.httpServer = new http_1.default.Server(this.app);
        this.httpsServer = new https_1.default.Server(credentials, this.app);
        this.io = new socket_io_1.default.Server(this.httpServer, { cors: { credentials: true } });
        this.listenSockets();
    }
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    listenSockets() {
        console.log('listnening to connection - sockets');
        this.io.on('connection', (socket) => {
            sockets.connectSocket(socket, this.io);
            sockets.configureUser(socket, this.io);
            sockets.emitUsers(socket, this.io);
            sockets.message(socket, this.io);
            sockets.disconnect(socket, this.io);
            sockets.getGraphicData(socket, this.io);
            sockets.mapSockets(socket, this.io);
            sockets.cuesSockets(socket, this.io);
        });
    }
    start(callback) {
        this.httpServer.listen(this.portHttp, callback('http'));
        this.httpsServer.listen(this.portHttps, callback('https'));
    }
}
exports.default = Server;
