import express from 'express';
import cors from 'cors';
import { statsRouter } from './routes/stats';
import { settingsRouter } from './routes/settings';
import { eventsRouter } from './routes/events';
import { focusRouter } from './routes/focus';

const app = express();
app.use(cors({ origin: ['http://localhost:8080'], credentials: false }));
app.use(express.json());

app.use('/api/stats', statsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/focus', focusRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on :${PORT}`));


