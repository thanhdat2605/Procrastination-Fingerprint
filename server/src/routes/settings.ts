import { Router } from 'express';
import { settings, replaceSettings } from '../store';

export const settingsRouter = Router();

settingsRouter.get('/', (_req, res) => res.json(settings));
settingsRouter.put('/', (req, res) => {
  replaceSettings(req.body);
  res.json({ ok: true });
});


