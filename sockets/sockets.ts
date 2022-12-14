import { Socket } from 'socket.io';
import io from 'socket.io';
import { UsersList } from '../classes/users-list';
import { User } from '../classes/user';
import { GraphicData } from '../classes/graphic-data';
import { Map } from '../classes/map';
import { Marker } from '../interfaces/marker';
import { TicketsList } from '../classes/tickets-list';
import { Ticket } from '../interfaces/ticket';

export const connectedUsers = new UsersList();
export const map = new Map();
export const existingTickets = new TicketsList();

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

export const mapSockets = (socket: Socket, io: io.Server) => {
  socket.on('new-marker', (marker: Marker) => {
    map.addMarker(marker);

    socket.broadcast.emit('new-marker', marker);
  });

  socket.on('delete-marker', (id: string) => {
    map.deleteMarker(id);

    socket.broadcast.emit('delete-marker', id);
  });

  socket.on('move-marker', (marker: Marker) => {
    map.moveMarker(marker);

    socket.broadcast.emit('move-marker', marker);
  });
};

export const cuesSockets = (socket: Socket, io: io.Server) => {
  socket.on('new-ticket', () => {
    existingTickets.addTicketToAttend();

    io.emit('get-tickets-to-attend', existingTickets.getTicketsToAttend());
  });

  socket.on('get-tickets-to-attend', () => {
    console.log('get-tickets-to-attend');
    io.emit('get-tickets-to-attend', existingTickets.getTicketsToAttend());
  });

  socket.on('get-attending-tickets', () => {
    io.emit('get-attending-tickets', existingTickets.getAttendigTickets());
  });

  socket.on(
    'attend-ticket',
    ({ ticket, attendedId }: { ticket: Ticket; attendedId?: number }) => {
      if (attendedId) {
        existingTickets.deleteAttendedTicket(attendedId);
      }
      existingTickets.attendTicket(ticket);

      io.emit('get-tickets-to-attend', existingTickets.getTicketsToAttend());
      io.emit('get-attending-tickets', existingTickets.getAttendigTickets());
    }
  );
};
