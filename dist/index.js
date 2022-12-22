"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const router_1 = __importDefault(require("./routes/router"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const server = server_1.default.instance;
// BodyParser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// CORS
server.app.use((0, cors_1.default)({ origin: true, credentials: true }));
// Public folder
server.app.use(express_1.default.static('public'));
// Routes
server.app.use('/', router_1.default);
server.app.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, 'public/index.html'));
});
server.start((type) => {
    if (type === 'http') {
        console.log(`Server http is running on port ${server.portHttp}`);
    }
    else {
        console.log(`Server https is running on port ${server.portHttps}`);
    }
});
