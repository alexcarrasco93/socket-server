"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_HTTPS_PORT = exports.SERVER_HTTP_PORT = void 0;
exports.SERVER_HTTP_PORT = Number(process.env.HTTP_PORT) || 80;
exports.SERVER_HTTPS_PORT = Number(process.env.HTTPS_PORT) || 443;
