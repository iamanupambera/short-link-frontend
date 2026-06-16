import Link from 'next/link';

type AuthLayoutProps = {
  title: string;
  description: string;
  switchLabel?: string;
  switchHref?: string;
  switchText?: string;
  children: React.ReactNode;
};

export function AuthLayout({
  title,
  description,
  switchLabel,
  switchHref,
  switchText,
  children,
}: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.16),transparent_28rem),linear-gradient(135deg,#0f172a_0%,#111827_45%,#1c1917_100%)] px-4 py-8 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_430px]">
        <section className="max-w-2xl">
          <div className="mb-8 inline-flex h-9 items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 text-sm font-medium">
            <span className="size-2 rounded-full bg-teal-300" />
            ShortLink
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
