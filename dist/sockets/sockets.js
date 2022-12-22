"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cuesSockets = exports.mapSockets = exports.getGraphicData = exports.emitUsers = exports.configureUser = exports.message = exports.disconnect = exports.connectSocket = exports.existingTickets = exports.map = exports.connectedUsers = void 0;
const users_list_1 = require("../classes/users-list");
const user_1 = require("../classes/user");
const graphic_data_1 = require("../classes/graphic-data");
const map_1 = require("../classes/map");
const tickets_list_1 = require("../classes/tickets-list");
exports.connectedUsers = new users_list_1.UsersList();
exports.map = new map_1.Map();
exports.existingTickets = new tickets_list_1.TicketsList();
const connectSocket = (socket, io) => {
    const user = new user_1.User(socket.id);
    exports.connectedUsers.add(user);
};
exports.connectSocket = connectSocket;
const disconnect = (socket, io) => {
    socket.on('disconnect', () => {
        exports.connectedUsers.deleteUser(socket.id);
        console.log('the socket is disconnected');
        io.emit('active-users', exports.connectedUsers.getList());
    });
};
exports.disconnect = disconnect;
const message = (socket, io) => {
    socket.on('message', (payload) => {
        console.log('Message received', payload);
        io.emit('new-message', payload);
    });
};
exports.message = message;
const configureUser = (socket, io) => {
    socket.on('configure-user', (payload, callback) => {
        exports.connectedUsers.updateName(socket.id, payload.name);
        io.emit('active-users', exports.connectedUsers.getList());
        callback({
            ok: true,
            msg: `User ${payload.name} configured`,
        });
    });
};
exports.configureUser = configureUser;
const emitUsers = (socket, io) => {
    socket.on('emit-users', () => {
        io.to(socket.id).emit('active-users', exports.connectedUsers.getList());
    });
};
exports.emitUsers = emitUsers;
const getGraphicData = (socket, io) => {
    const graphic = graphic_data_1.GraphicData.instance;
    socket.on('graphic-data', () => {
        io.to(socket.id).emit('graphic-change', { data: graphic.getGraphicData() });
    });
};
exports.getGraphicData = getGraphicData;
const mapSockets = (socket, io) => {
    socket.on('new-marker', (marker) => {
        exports.map.addMarker(marker);
        socket.broadcast.emit('new-marker', marker);
    });
    socket.on('delete-marker', (id) => {
        exports.map.deleteMarker(id);
        socket.broadcast.emit('delete-marker', id);
    });
    socket.on('move-marker', (marker) => {
        exports.map.moveMarker(marker);
        socket.broadcast.emit('move-marker', marker);
    });
};
exports.mapSockets = mapSockets;
const cuesSockets = (socket, io) => {
    socket.on('new-ticket', () => {
        exports.existingTickets.addTicketToAttend();
        io.emit('get-tickets-to-attend', exports.existingTickets.getTicketsToAttend());
    });
    socket.on('get-tickets-to-attend', () => {
        console.log('get-tickets-to-attend');
        io.emit('get-tickets-to-attend', exports.existingTickets.getTicketsToAttend());
    });
    socket.on('get-attending-tickets', () => {
        io.emit('get-attending-tickets', exports.existingTickets.getAttendigTickets());
    });
    socket.on('attend-ticket', ({ ticket, attendedId }) => {
        if (attendedId) {
            exports.existingTickets.deleteAttendedTicket(attendedId);
        }
        exports.existingTickets.attendTicket(ticket);
        io.emit('get-tickets-to-attend', exports.existingTickets.getTicketsToAttend());
        io.emit('get-attending-tickets', exports.existingTickets.getAttendigTickets());
    });
};
exports.cuesSockets = cuesSockets;
