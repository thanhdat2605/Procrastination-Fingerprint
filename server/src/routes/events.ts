import { Router } from 'express';
import { events } from '../store';
import type { AttentionEvent } from '../types';

export const eventsRouter = Router();

eventsRouter.post('/', (req, res) => {
  const payload = req.body as AttentionEvent | AttentionEvent[];
  if (Array.isArray(payload)) events.push(...payload);
  else events.push(payload);
  res.json({ ok: true });
});


