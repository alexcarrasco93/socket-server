import express from 'express';
import { SERVER_PORT } from '../global/environment';
import io from 'socket.io';
import http from 'http';
import * as sockets from '../sockets/sockets';

export default class Server {
  private static _instance: Server;

  public app: express.Application;
  public port: number;
  public io: io.Server;
  private httpServer: http.Server;

  private constructor() {
    this.app = express();
    this.port = SERVER_PORT;

    this.httpServer = new http.Server(this.app);
    this.io = new io.Server(this.httpServer, { cors: { credentials: true } });

    this.listenSockets();
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }

  private listenSockets() {
    console.log('listnening to connection - sockets');

    this.io.on('connection', (socket) => {
      sockets.connectSocket(socket, this.io);

      sockets.configureUser(socket, this.io);

      sockets.emitUsers(socket, this.io);

      sockets.message(socket, this.io);

      sockets.disconnect(socket, this.io);

      sockets.getGraphicData(socket, this.io);

      sockets.mapSockets(socket, this.io);
    });
  }

  start(callback: Function) {
    this.httpServer.listen(this.port, callback());
  }
}
