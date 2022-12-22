import Server from './classes/server';
import router from './routes/router';
import bodyParser from 'body-parser';
import cors from 'cors';

const server = Server.instance;

// BodyParser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// CORS
server.app.use(cors({ origin: true, credentials: true }));

// Routes
server.app.use('/', router);

server.start((type: string) => {
  if (type === 'http') {
    console.log(`Server http is running on port ${server.portHttp}`);
  } else {
    console.log(`Server https is running on port ${server.portHttps}`);
  }
});
