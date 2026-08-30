import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';

import { clerkMiddleware } from '@clerk/express';

import job from './lib/cron.js';
import { connectDB } from './lib/db.js';
import { app, server } from './lib/socket.js';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import clerkWebhook from './webhooks/clerk.webhook.js';

const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

const publicDir = path.join(process.cwd(), 'public');

// Clerk must run before routes that use getAuth()
app.use(clerkMiddleware());

// Clerk webhook needs the raw request body.
// clerkMiddleware does not parse the request body, so this can remain raw.
app.use(
  '/api/webhooks/clerk',
  express.raw({ type: 'application/json' }),
  clerkWebhook,
);

app.use(express.json());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

// Serve frontend in production
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get('/{*any}', (req, res, next) => {
    res.sendFile(path.join(publicDir, 'index.html'), (err) => next(err));
  });
}

server.listen(PORT, async () => {
  await connectDB();

  console.log('Server is up and running on PORT:', PORT);

  if (process.env.NODE_ENV === 'production') {
    job.start();
  }
});
