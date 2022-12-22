"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersList = void 0;
class UsersList {
    constructor() {
        this.list = [];
    }
    add(user) {
        this.list.push(user);
        console.log(this.list);
        return user;
    }
    updateName(id, name) {
        for (const user of this.list) {
            if (user.id === id) {
                user.name = name;
                break;
            }
        }
        console.log('=== Updating user ===');
        console.log(this.list);
    }
    getList() {
        return this.list.filter((user) => user.name !== 'no-name');
    }
    getUser(id) {
        return this.list.find((user) => user.id === id);
    }
    getAllUsersInRoom(room) {
        return this.list.filter((user) => user.room === room);
    }
    deleteUser(id) {
        const userTemp = this.getUser(id);
        this.list = this.list.filter((user) => user.id !== id);
        return userTemp;
    }
}
exports.UsersList = UsersList;
