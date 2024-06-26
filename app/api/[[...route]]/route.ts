import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';

export const runtime = 'edge';

const app = new Hono().basePath('/api');

app
  .get('/hello', clerkMiddleware(), (ctx) => {
    const auth = getAuth(ctx);

    if (!auth?.userId) {
      return ctx.json({ error: 'unauthorized' });
    }

    return ctx.json({
      message: 'Hello Next.js!',
      userId: auth.userId,
    });
  })
  .get(
    '/hello/:test',
    zValidator('param', z.object({ test: z.string() })),
    (ctx) => {
      const { test } = ctx.req.valid('param');
      return ctx.json({
        message: 'hello',
        test: test,
      });
    }
  )
  .post(
    '/create/:postId',
    zValidator('json', z.object({ name: z.string(), userId: z.number() })),
    (ctx) => {
      const { name, userId } = ctx.req.valid('json');
      return ctx.json({});
    }
  );

export const GET = handle(app);
export const POST = handle(app);
