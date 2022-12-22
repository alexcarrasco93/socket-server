"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureUser = exports.message = exports.disconnect = exports.connectSocket = exports.connectedUsers = void 0;
const users_list_1 = require("../classes/users-list");
const user_1 = require("../classes/user");
exports.connectedUsers = new users_list_1.UsersList();
const connectSocket = (socket) => {
    const user = new user_1.User(socket.id);
    exports.connectedUsers.add(user);
};
exports.connectSocket = connectSocket;
const disconnect = (socket) => {
    socket.on('disconnect', () => {
        exports.connectedUsers.deleteUser(socket.id);
        console.log('the socket is disconnected');
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
        callback({
            ok: true,
            msg: `User ${payload.name} configured`,
        });
    });
};
exports.configureUser = configureUser;
