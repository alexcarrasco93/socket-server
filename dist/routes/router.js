"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const graphic_data_1 = require("../classes/graphic-data");
const server_1 = __importDefault(require("../classes/server"));
const sockets_1 = require("../sockets/sockets");
const router = (0, express_1.Router)();
const graphic = graphic_data_1.GraphicData.instance;
// CUES
router.get('/api/cues', (req, res) => {
    res.json({
        tickets: sockets_1.existingTickets.getTicketsToAttend(),
    });
});
router.post('/api/cues', (req, res) => {
    const ticket = req.body.ticket;
    sockets_1.existingTickets.addTicketToAttend();
    const server = server_1.default.instance;
    server.io.emit('new-ticket', ticket);
    res.json(ticket);
});
// MAP
router.get('/api/map', (req, res) => {
    res.json(sockets_1.map.getMarkers());
});
// GRAPHIC SOCKETS
router.get('/api/graphic', (req, res) => {
    res.json({ data: graphic.getGraphicData() });
});
router.post('/api/graphic', (req, res) => {
    const month = req.body.month;
    const value = Number(req.body.value);
    graphic.changeValue(month, value);
    const server = server_1.default.instance;
    server.io.emit('graphic-change', { data: graphic.getGraphicData() });
    res.json({ data: graphic.getGraphicData() });
});
// BASIC CHAT SOCKETS
router.get('/api/messages', (req, res) => {
    res.json({
        ok: true,
        msg: 'GET ok',
    });
});
router.post('/api/messages', (req, res) => {
    const msg = req.body.msg;
    const from = req.body.from;
    const payload = {
        from,
        msg,
    };
    const server = server_1.default.instance;
    server.io.emit('new-message', payload);
    res.json({
        ok: true,
        msg,
        from,
    });
});
router.post('/api/messages/:id', (req, res) => {
    const msg = req.body.msg;
    const from = req.body.from;
    const id = req.params.id;
    const payload = {
        from,
        msg,
    };
    const server = server_1.default.instance;
    server.io.in(id).emit('private-message', payload);
    res.json({
        ok: true,
        msg,
        from,
        id,
    });
});
router.get('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const server = server_1.default.instance;
    try {
        const sockets = yield server.io.fetchSockets();
        const socketsIds = [];
        for (const socket of sockets) {
            socketsIds.push(socket.id);
        }
        res.json({
            ok: true,
            socketsIds,
        });
    }
    catch (error) {
        console.log('ERROR' + error);
        res.status(400).json({
            ok: false,
            error: 'Error fetching sockets',
        });
    }
}));
router.get('/api/users/detail', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json({
        ok: true,
        users: sockets_1.connectedUsers.getList(),
    });
}));
exports.default = router;
