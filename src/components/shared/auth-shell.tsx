import Link from 'next/link';
import { Link2Icon } from 'lucide-react';

type AuthShellProps = {
  title: string;
  description: string;
  switchLabel?: string;
  switchHref?: string;
  switchText?: string;
  children: React.ReactNode;
};

export function AuthShell({
  title,
  description,
  switchLabel,
  switchHref,
  switchText,
  children,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.16),transparent_28rem),linear-gradient(135deg,#0f172a_0%,#111827_45%,#1c1917_100%)] px-4 py-8 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_430px]">
        <section className="max-w-2xl">
          <div className="mb-8 flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-tr from-teal-500 to-cyan-500 text-slate-950 shadow-md">
              <Link2Icon className="size-5 font-bold" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              ShortLink
            </span>
          </div>
          <h1 className="text-4xl font-semibold tracking-normal text-balance sm:text-5xl">
            Shorten. Share. Track.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-200">
            Create managed short URLs, protect important links, and read the
            click signals that matter after every share.
          </p>
        </section>

        <section className="rounded-lg border border-white/12 bg-white/[0.96] p-6 text-slate-950 shadow-2xl shadow-black/30">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-normal">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {description}
            </p>
          </div>
          {children}
          {switchHref && switchText && switchLabel ? (
            <p className="mt-6 text-center text-sm text-slate-600">
              {switchLabel}{' '}
              <Link
                href={switchHref}
                className="font-medium text-teal-700 underline-offset-4 hover:underline"
              >
                {switchText}
              </Link>
            </p>
          ) : null}
        </section>
      </div>
    </main>
  );
}
