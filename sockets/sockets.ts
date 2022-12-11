import { Socket } from 'socket.io';
import io from 'socket.io';
import { UsersList } from '../classes/users-list';
import { User } from '../classes/user';
import { GraphicData } from '../classes/graphic-data';

export const connectedUsers = new UsersList();

export const connectSocket = (socket: Socket, io: io.Server) => {
  const user = new User(socket.id);
  connectedUsers.add(user);
};

export const disconnect = (socket: Socket, io: io.Server) => {
  socket.on('disconnect', () => {
    connectedUsers.deleteUser(socket.id);
    console.log('the socket is disconnected');
    io.emit('active-users', connectedUsers.getList());
  });
};

export const message = (socket: Socket, io: io.Server) => {
  socket.on('message', (payload: { from: string; msg: string }) => {
    console.log('Message received', payload);

    io.emit('new-message', payload);
  });
};

export const configureUser = (socket: Socket, io: io.Server) => {
  socket.on(
    'configure-user',
    (payload: { name: string }, callback: Function) => {
      connectedUsers.updateName(socket.id, payload.name);

      io.emit('active-users', connectedUsers.getList());

      callback({
        ok: true,
        msg: `User ${payload.name} configured`,
      });
    }
  );
};

export const emitUsers = (socket: Socket, io: io.Server) => {
  socket.on('emit-users', () => {
    io.to(socket.id).emit('active-users', connectedUsers.getList());
  });
};

export const getGraphicData = (socket: Socket, io: io.Server) => {
  const graphic = GraphicData.instance;

  socket.on('graphic-data', () => {
    io.to(socket.id).emit('graphic-change', { data: graphic.getGraphicData() });
  });
};
