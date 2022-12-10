import { Request, Response, Router } from 'express';
import Server from '../classes/server';
import { connectedUsers } from '../sockets/sockets';

const router = Router();

router.get('/messages', (req: Request, res: Response) => {
  res.json({
    ok: true,
    msg: 'GET ok',
  });
});

router.post('/messages', (req: Request, res: Response) => {
  const msg = req.body.msg;
  const from = req.body.from;
  const payload = {
    from,
    msg,
  };

  const server = Server.instance;

  server.io.emit('new-message', payload);
  res.json({
    ok: true,
    msg,
    from,
  });
});

router.post('/messages/:id', (req: Request, res: Response) => {
  const msg = req.body.msg;
  const from = req.body.from;
  const id = req.params.id;
  const payload = {
    from,
    msg,
  };

  const server = Server.instance;

  server.io.in(id).emit('private-message', payload);
  res.json({
    ok: true,
    msg,
    from,
    id,
  });
});

router.get('/users', async (req: Request, res: Response) => {
  const server = Server.instance;

  try {
    const sockets = await server.io.fetchSockets();
    const socketsIds: string[] = [];
    for (const socket of sockets) {
      socketsIds.push(socket.id);
    }
    res.json({
      ok: true,
      socketsIds,
    });
  } catch (error) {
    console.log('ERROR' + error);
    res.status(400).json({
      ok: false,
      error: 'Error fetching sockets',
    });
  }
});

router.get('/users/detail', async (req: Request, res: Response) => {
  res.json({
    ok: true,
    users: connectedUsers.getList(),
  });
});

export default router;
