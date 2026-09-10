import dotenv from 'dotenv';

import express, { Request, Response, Router } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import prisma from './libs/prisma';
import userRouter from './routes/userRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const origins = process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()) || [];
      const hostname = new URL(origin).hostname;
      const allowed = origins.some((allowedOrigin) => hostname.endsWith(allowedOrigin));

      if (allowed) {
        callback(null, true);
      } else if (process.env.NODE_ENV !== 'production') {
        // in dev, allow everything
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
);

// Every route lives under /api, both locally and when deployed, so the URLs
// you use in development are the URLs that run in production.
const api = Router();

// Is the API up?
api.get('/', (req: Request, res: Response) => {
  res.json({ status: 'ReDiCycle API is running' });
});

// Is the API up *and* able to reach the database?
// Returns 503 when it cannot, which is what a health check should report.
api.get('/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: 'ok',
      database: 'connected',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check failed:', error);

    res.status(503).json({
      status: 'degraded',
      database: 'unreachable',
      timestamp: new Date().toISOString(),
    });
  }
});

// Routes
api.use('/users', userRouter);

app.use('/api', api);

const protocol = process.env.PROTOCOL ?? 'http';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ?? 4000;

const server = app.listen(Number(port), () => {
  console.log(`⚡️ Server is running on ${protocol}://${host}:${port}`);
  console.log(`🔄 API: ${protocol}://${host}:${port}/api`);
});

server.on('error', (error) => {
  console.error(
    '❌ Failed to start server:',
    error instanceof Error ? error.message : 'Unknown error'
  );
  process.exit(1);
});

export default app;
