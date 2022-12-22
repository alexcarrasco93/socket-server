import express from 'express';
import { SERVER_HTTP_PORT, SERVER_HTTPS_PORT } from '../global/environment';
import io from 'socket.io';
import http from 'http';
import https from 'https';
import fs from 'fs';
import * as sockets from '../sockets/sockets';

const credentials = {
  key: fs.readFileSync('sslcert/server.key'),
  cert: fs.readFileSync('sslcert/server.cert'),
};

export default class Server {
  private static _instance: Server;

  public app: express.Application;
  public portHttp: number;
  public portHttps: number;
  public io: io.Server;
  private httpServer: http.Server;
  private httpsServer: https.Server;

  private constructor() {
    this.app = express();
    this.portHttp = SERVER_HTTP_PORT;
    this.portHttps = SERVER_HTTPS_PORT;

    this.httpServer = new http.Server(this.app);
    this.httpsServer = new https.Server(credentials, this.app);
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

      sockets.cuesSockets(socket, this.io);
    });
  }

  start(callback: Function) {
    this.httpServer.listen(this.portHttp, callback('http'));
    this.httpsServer.listen(this.portHttps, callback('https'));
  }
}
