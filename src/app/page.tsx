import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import {
  Link2Icon,
  Share2Icon,
  BarChart3Icon,
  ArrowRightIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  ZapIcon,
} from 'lucide-react';

export default async function HomePage() {
  const session = await getSession();
  const isAuthenticated = !!session;

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] size-[500px] rounded-full bg-teal-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] size-[500px] rounded-full bg-violet-500/10 blur-[120px]" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-tr from-teal-500 to-cyan-500 text-slate-950 shadow-md">
              <Link2Icon className="size-5 font-bold" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              ShortLink
            </span>
          </div>

          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-4 text-sm font-medium text-white transition-all hover:bg-teal-500 hover:shadow-md hover:shadow-teal-900/30"
              >
                Go to Dashboard
                <ArrowRightIcon className="size-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 px-4 text-sm font-semibold text-slate-950 transition-all hover:opacity-90 hover:shadow-md"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 sm:pt-28 lg:px-8">
        <div className="text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/5 px-4 py-1.5 text-xs font-semibold text-teal-400 backdrop-blur-sm">
            <ZapIcon className="size-3.5 fill-teal-400" />
            Welcome to the future of link management
          </div>
          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Shorten. Share. Track.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            A premium, feature-rich link management platform. Create custom
            shortened URLs, generate downloadable QR codes, and monitor visitor
            traffic with robust, real-time analytics.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-6 font-semibold text-slate-950 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-teal-900/20"
              >
                Launch Dashboard
                <ArrowRightIcon className="size-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-6 font-semibold text-slate-950 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-teal-900/20"
                >
                  Get Started for Free
                  <ArrowRightIcon className="size-4" />
                </Link>
                <Link
                  href="/auth/login"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-6 font-medium text-slate-200 backdrop-blur-sm transition-all hover:bg-slate-900 hover:text-white"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-24 grid gap-8 md:grid-cols-3">
          {/* Card 1: Shorten */}
          <div className="relative rounded-2xl border border-slate-900 bg-slate-900/20 p-8 backdrop-blur-md transition-all hover:border-teal-500/30 hover:bg-slate-900/30">
            <div className="flex size-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
              <Link2Icon className="size-6" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-white">Shorten Links</h3>
            <p className="mt-2 text-slate-400">
              Instantly compress long URLs into short, clean codes. Add custom
              aliases, secure links with passwords, and set optional expiration
              dates.
            </p>
          </div>

          {/* Card 2: Share */}
          <div className="relative rounded-2xl border border-slate-900 bg-slate-900/20 p-8 backdrop-blur-md transition-all hover:border-cyan-500/30 hover:bg-slate-900/30">
            <div className="flex size-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <QrCodeIcon className="size-6" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-white font-heading">
              Share Everywhere
            </h3>
            <p className="mt-2 text-slate-400">
              Every short link comes with an auto-generated high-fidelity QR
              Code. Easily display previews or download high-quality PNGs for
              print or digital sharing.
            </p>
          </div>

          {/* Card 3: Track */}
          <div className="relative rounded-2xl border border-slate-900 bg-slate-900/20 p-8 backdrop-blur-md transition-all hover:border-violet-500/30 hover:bg-slate-900/30">
            <div className="flex size-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <BarChart3Icon className="size-6" />
            </div>
            <h3 className="mt-6 text-xl font-bold text-white">
              Track Performance
            </h3>
            <p className="mt-2 text-slate-400">
              Monitor click performance with real-time stats. Analyze unique
              visitor trends and breakdowns of devices, browsers, geographic
              countries, and referrers.
            </p>
          </div>
        </div>

        {/* Product Goals section */}
        <div className="mt-24 rounded-2xl border border-slate-900 bg-slate-900/20 p-8 backdrop-blur-md md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                Built for Scalability and Speed
              </h2>
              <p className="mt-4 text-slate-400">
                ShortLink handles link shortening and tracking asynchronously
                using Redis queues and cache databases. This ensures high
                throughput and less than 100ms redirect latency under heavy
                loads.
              </p>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-6 items-center justify-center rounded-full bg-teal-500/10 text-teal-400">
                    <ShieldCheckIcon className="size-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-200">
                    Rate Limiting & Abuse Prevention
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex size-6 items-center justify-center rounded-full bg-teal-500/10 text-teal-400">
                    <Share2Icon className="size-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-200">
                    Asynchronous Performance queues
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center p-4">
              <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950/80 p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-500">
                    Live Status
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="size-2 rounded-full bg-emerald-500" />
                    Operational
                  </span>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Average latency</span>
                    <span className="font-semibold text-white">&lt; 100ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">
                      Redirect availability
                    </span>
                    <span className="font-semibold text-white">99.9%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Active URLs</span>
                    <span className="font-semibold text-white">100K+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-600">
        <p>&copy; {new Date().getFullYear()} ShortLink. All rights reserved.</p>
      </footer>
    </div>
  );
}
