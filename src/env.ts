import { z } from 'zod';

const publicSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.url().readonly(),
  NEXT_PUBLIC_APP_URL: z.url().readonly(),
  NEXT_PUBLIC_SHORT_URL_BASE: z.url().readonly(),
});

const serverSchema = z.object({
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters'),
});

const isServer = typeof window === 'undefined';

const publicResult = publicSchema.safeParse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SHORT_URL_BASE: process.env.NEXT_PUBLIC_SHORT_URL_BASE,
});

if (!publicResult.success && isServer) {
  console.error('❌ Public env validation failed:', publicResult.error.format());
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Missing required public environment variables.');
  }
}

export const publicEnv = publicResult.data ?? {
  NEXT_PUBLIC_API_BASE_URL: '',
  NEXT_PUBLIC_APP_URL: '',
  NEXT_PUBLIC_SHORT_URL_BASE: '',
};

let _serverEnv: z.infer<typeof serverSchema> | null = null;

export function serverEnv() {
  if (!isServer) {
    throw new Error('serverEnv() must not be called in the browser.');
  }
  if (!_serverEnv) {
    const result = serverSchema.safeParse({
      SESSION_SECRET: process.env.SESSION_SECRET,
    });
    if (!result.success) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error(
          'Missing required server environment variables: ' + JSON.stringify(result.error.format()),
        );
      }
      console.warn('⚠️ Server env validation failed:', result.error.format());
      _serverEnv = {
        SESSION_SECRET: 'shortlink-dev-session-secret-change-me',
      };
    } else {
      _serverEnv = result.data;
    }
  }
  return _serverEnv;
}

export function validateAllEnv() {
  const errors: string[] = [];

  if (!publicResult.success) {
    errors.push(
      '❌ Public env errors:\n' +
        publicResult.error.issues.map((i) => `  • ${i.path}: ${i.message}`).join('\n'),
    );
  }

  const serverResult = serverSchema.safeParse({
    SESSION_SECRET: process.env.SESSION_SECRET,
  });
  if (!serverResult.success) {
    errors.push(
      '❌ Server env errors:\n' +
        serverResult.error.issues.map((i) => `  • ${i.path}: ${i.message}`).join('\n'),
    );
  }

  if (errors.length > 0) {
    const divider = '='.repeat(60);
    const msg = `\n${divider}\n⛔ ENVIRONMENT VALIDATION FAILED\n${divider}\n${errors.join('\n')}\n${divider}\n`;
    console.error(msg);
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Environment validation failed. See logs above.');
    }
  }
}
