import { Request, Response, Router } from 'express';
import { GraphicData } from '../classes/graphic-data';
import Server from '../classes/server';
import { Ticket } from '../interfaces/ticket';
import { connectedUsers, existingTickets, map } from '../sockets/sockets';

const router = Router();

const graphic = GraphicData.instance;

// CUES
router.get('/api/cues', (req: Request, res: Response) => {
  res.json({
    tickets: existingTickets.getTicketsToAttend(),
  });
});

router.post('/api/cues', (req: Request, res: Response) => {
  const ticket = req.body.ticket as Ticket;

  existingTickets.addTicketToAttend();

  const server = Server.instance;
  server.io.emit('new-ticket', ticket);

  res.json(ticket);
});

// MAP
router.get('/api/map', (req: Request, res: Response) => {
  res.json(map.getMarkers());
});

// GRAPHIC SOCKETS
router.get('/api/graphic', (req: Request, res: Response) => {
  res.json({ data: graphic.getGraphicData() });
});

router.post('/api/graphic', (req: Request, res: Response) => {
  const month = req.body.month;
  const value = Number(req.body.value);

  graphic.changeValue(month, value);

  const server = Server.instance;
  server.io.emit('graphic-change', { data: graphic.getGraphicData() });

  res.json({ data: graphic.getGraphicData() });
});

// BASIC CHAT SOCKETS
router.get('/api/messages', (req: Request, res: Response) => {
  res.json({
    ok: true,
    msg: 'GET ok',
  });
});

router.post('/api/messages', (req: Request, res: Response) => {
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

router.post('/api/messages/:id', (req: Request, res: Response) => {
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

router.get('/api/users', async (req: Request, res: Response) => {
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

router.get('/api/users/detail', async (req: Request, res: Response) => {
  res.json({
    ok: true,
    users: connectedUsers.getList(),
  });
});

export default router;
