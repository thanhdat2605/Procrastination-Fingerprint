import { Router } from 'express';
import { focusSessions } from '../store';

export const focusRouter = Router();

focusRouter.post('/start', (_req, res) => {
  focusSessions.push({ id: `fs_${Date.now()}`, startTime: Date.now() });
  res.json({ ok: true });
});

focusRouter.post('/end', (_req, res) => {
  const last = [...focusSessions].reverse().find(s => !s.endTime);
  if (last) last.endTime = Date.now();
  res.json({ ok: true });
});


