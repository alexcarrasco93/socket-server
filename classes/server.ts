import express from 'express';
import { SERVER_PORT } from '../global/environment';
import io from 'socket.io';
import http from 'http';
import * as socket from '../sockets/socket';

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

    this.io.on('connection', (client) => {
      console.log('new client connected');

      socket.message(client, this.io);

      socket.disconnect(client);
    });
  }

  start(callback: Function) {
    this.httpServer.listen(this.port, callback());
  }
}
