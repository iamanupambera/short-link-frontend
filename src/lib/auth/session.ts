import 'server-only';

import { serverEnv } from '@/env';
import { refreshTokenRequest } from '@/features/auth/api/refresh-token';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import type { AuthSession } from '@/features/auth/types/auth.types';
import { isRecord } from '@/lib/api/client';

const SESSION_COOKIE_NAME = 'shortlink.session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const encryptedSession = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!encryptedSession) {
    return refreshSession();
  }

  const session = decryptSession(encryptedSession);

  if (!session || Date.parse(session.expiresAt) <= Date.now()) {
    return refreshSession();
  }

  return session;
}

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return session;
}

export async function setSession(session: Omit<AuthSession, 'expiresAt'>) {
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  const cookieStore = await cookies();

  cookieStore.set(
    SESSION_COOKIE_NAME,
    encryptSession({
      ...session,
      expiresAt: expiresAt.toISOString(),
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      expires: expiresAt,
    },
  );
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

async function refreshSession(): Promise<AuthSession | null> {
  try {
    const session = await refreshTokenRequest();
    await setSession(session);
    return session;
  } catch {
    return null;
  }
}

function encryptSession(session: AuthSession) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(session), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [
    iv.toString('base64url'),
    tag.toString('base64url'),
    encrypted.toString('base64url'),
  ].join('.');
}

function decryptSession(value: string): AuthSession | null {
  try {
    const [ivPart, tagPart, encryptedPart] = value.split('.');

    if (!ivPart || !tagPart || !encryptedPart) {
      return null;
    }

    const decipher = createDecipheriv(
      'aes-256-gcm',
      getEncryptionKey(),
      Buffer.from(ivPart, 'base64url'),
    );
    decipher.setAuthTag(Buffer.from(tagPart, 'base64url'));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedPart, 'base64url')),
      decipher.final(),
    ]);
    const session = JSON.parse(decrypted.toString('utf8')) as unknown;

    return isAuthSession(session) ? session : null;
  } catch {
    return null;
  }
}

function getEncryptionKey() {
  const { SESSION_SECRET: secret } = serverEnv();

  return createHash('sha256').update(secret).digest();
}

function isAuthSession(value: unknown): value is AuthSession {
  return (
    isRecord(value) &&
    typeof value.accessToken === 'string' &&
    typeof value.expiresAt === 'string' &&
    isRecord(value.user) &&
    typeof value.user.id === 'number' &&
    typeof value.user.email === 'string'
  );
}
