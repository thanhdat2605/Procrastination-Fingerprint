import { Router } from 'express';
import { events } from '../store';
import { computeBuckets, computeNextBestWindow, computeTodayTimeline, computeTopTriggers, computeWeeklyStats } from '../services/stats';

export const statsRouter = Router();

statsRouter.get('/buckets', (_req, res) => res.json(computeBuckets(events)));
statsRouter.get('/timeline/today', (_req, res) => res.json(computeTodayTimeline(events)));
statsRouter.get('/weekly', (_req, res) => res.json(computeWeeklyStats(events)));
statsRouter.get('/triggers/top', (_req, res) => res.json(computeTopTriggers(events)));
statsRouter.get('/recommendations/next-window', (_req, res) => res.json(computeNextBestWindow(events)));


