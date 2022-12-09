import { Socket } from 'socket.io';
import io from 'socket.io';

export const disconnect = (client: Socket) => {
  client.on('disconnect', () => {
    console.log('the client is disconnected');
  });
};

export const message = (client: Socket, io: io.Server) => {
  client.on('message', (payload: { from: string; msg: string }) => {
    console.log('Message received', payload);

    io.emit('new-message', payload);
  });
};
