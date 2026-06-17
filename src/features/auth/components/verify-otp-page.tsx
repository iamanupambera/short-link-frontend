'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2Icon, CheckCircle2Icon, AlertCircleIcon } from 'lucide-react';
import { verifyOtpRequest } from '@/features/auth/api/verify-otp';
import { setSession } from '@/lib/auth/cookies';
import Link from 'next/link';

interface VerifyOtpPageProps {
  code: string;
  email: string;
}

type VerificationState = 'loading' | 'success' | 'error';

export function VerifyOtpPage({ code, email }: VerifyOtpPageProps) {
  const router = useRouter();
  const [state, setState] = useState<VerificationState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const result = await verifyOtpRequest({
          email,
          otp: code,
        });

        if (result.session) {
          await setSession(result.session);
          setState('success');
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } else {
          setState('success');
          setTimeout(() => {
            router.push('/auth/login');
          }, 2000);
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Verification failed. Please try again.',
        );
        setState('error');
      }
    };

    verifyEmail();
  }, [code, email, router]);

  if (state === 'loading') {
    return (
      <div className="space-y-5">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <Loader2Icon className="size-12 animate-spin text-teal-600" />
          <div className="text-center">
            <p className="text-sm font-medium text-slate-950">
              Verifying your email...
            </p>
            <p className="text-xs text-slate-500">
              Please wait while we process your verification.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (state === 'success') {
    return (
      <div className="space-y-5">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2Icon className="size-8 text-emerald-600" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-slate-950">
              Email verified!
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Your email has been successfully verified.
            </p>
            <p className="mt-3 text-xs text-slate-500">
              Redirecting you to your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-red-200 bg-red-50 py-8">
        <AlertCircleIcon className="size-12 text-red-600" />
        <div className="text-center">
          <h2 className="text-lg font-semibold text-red-950">
            Verification failed
          </h2>
          <p className="mt-1 text-sm text-red-700">{errorMessage}</p>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/auth/verify-email"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Request new OTP
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
