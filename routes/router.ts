import { Request, Response, Router } from 'express';

const router = Router();

router.get('/messages', (req: Request, res: Response) => {
  res.json({
    ok: true,
    msg: 'GET ok',
  });
});

router.post('/messages/:id', (req: Request, res: Response) => {
  const msg = req.body.msg;
  const from = req.body.from;
  const id = req.params.id;
  res.json({
    ok: true,
    msg,
    from,
    id,
  });
});

export default router;
