import Link from 'next/link';
import {
  ArrowRightIcon,
  BarChart3Icon,
  Link2Icon,
  QrCodeIcon,
  Share2Icon,
  ShieldCheckIcon,
  ZapIcon,
} from 'lucide-react';

type HomePageContentProps = {
  isAuthenticated: boolean;
};

export function HomePageContent({ isAuthenticated }: HomePageContentProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      <BackgroundGlow />
      <HomeHeader isAuthenticated={isAuthenticated} />
      <main className="mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 sm:pt-28 lg:px-8">
        <HeroSection isAuthenticated={isAuthenticated} />
        <FeatureGrid />
        <StatusSection />
      </main>
      <HomeFooter />
    </div>
  );
}

function BackgroundGlow() {
  return (
    <>
      <div className="absolute top-[-10%] left-[-10%] size-125 rounded-full bg-teal-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] size-125 rounded-full bg-violet-500/10 blur-[120px]" />
    </>
  );
}

function HomeHeader({ isAuthenticated }: HomePageContentProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-linear-to-tr from-teal-500 to-cyan-500 text-slate-950 shadow-md">
            <Link2Icon className="size-5 font-bold" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">ShortLink</span>
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
                className="inline-flex h-9 items-center justify-center rounded-lg bg-linear-to-r from-teal-500 to-cyan-500 px-4 text-sm font-semibold text-slate-950 transition-all hover:opacity-90 hover:shadow-md"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function HeroSection({ isAuthenticated }: HomePageContentProps) {
  return (
    <section className="text-center">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/5 px-4 py-1.5 text-xs font-semibold text-teal-400 backdrop-blur-sm">
        <ZapIcon className="size-3.5 fill-teal-400" />
        Welcome to the future of link management
      </div>
      <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
        Shorten. Share. Track.
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
        A premium, feature-rich link management platform. Create custom shortened URLs, generate
        downloadable QR codes, and monitor visitor traffic with robust, real-time analytics.
      </p>

      <div className="mt-10 flex justify-center gap-4">
        {isAuthenticated ? (
          <Link
            href="/dashboard"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-teal-500 to-cyan-500 px-6 font-semibold text-slate-950 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-teal-900/20"
          >
            Launch Dashboard
            <ArrowRightIcon className="size-4" />
          </Link>
        ) : (
          <>
            <Link
              href="/auth/register"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-teal-500 to-cyan-500 px-6 font-semibold text-slate-950 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-teal-900/20"
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
    </section>
  );
}

function FeatureGrid() {
  const features = [
    {
      title: 'Shorten Links',
      description:
        'Instantly compress long URLs into short, clean codes. Add custom aliases, secure links with passwords, and set optional expiration dates.',
      icon: Link2Icon,
      iconTone: 'bg-teal-500/10 text-teal-400',
      hoverTone: 'hover:border-teal-500/30',
    },
    {
      title: 'Share Everywhere',
      description:
        'Every short link comes with an auto-generated high-fidelity QR Code. Easily display previews or download high-quality PNGs for print or digital sharing.',
      icon: QrCodeIcon,
      iconTone: 'bg-cyan-500/10 text-cyan-400',
      hoverTone: 'hover:border-cyan-500/30',
    },
    {
      title: 'Track Performance',
      description:
        'Monitor click performance with real-time stats. Analyze unique visitor trends and breakdowns of devices, browsers, geographic countries, and referrers.',
      icon: BarChart3Icon,
      iconTone: 'bg-violet-500/10 text-violet-400',
      hoverTone: 'hover:border-violet-500/30',
    },
  ];

  return (
    <section className="mt-24 grid gap-8 md:grid-cols-3">
      {features.map((feature) => (
        <article
          key={feature.title}
          className={`relative rounded-2xl border border-slate-900 bg-slate-900/20 p-8 backdrop-blur-md transition-all hover:bg-slate-900/30 ${feature.hoverTone}`}
        >
          <div
            className={`flex size-12 items-center justify-center rounded-xl ${feature.iconTone}`}
          >
            <feature.icon className="size-6" />
          </div>
          <h3 className="mt-6 text-xl font-bold text-white">{feature.title}</h3>
          <p className="mt-2 text-slate-400">{feature.description}</p>
        </article>
      ))}
    </section>
  );
}

function StatusSection() {
  return (
    <section className="mt-24 rounded-2xl border border-slate-900 bg-slate-900/20 p-8 backdrop-blur-md md:p-12">
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Built for Scalability and Speed
          </h2>
          <p className="mt-4 text-slate-400">
            ShortLink handles link shortening and tracking asynchronously using Redis queues and
            cache databases. This ensures high throughput and less than 100ms redirect latency under
            heavy loads.
          </p>
          <div className="mt-6 space-y-4">
            <StatusBenefit icon={ShieldCheckIcon}>Rate Limiting & Abuse Prevention</StatusBenefit>
            <StatusBenefit icon={Share2Icon}>Asynchronous Performance queues</StatusBenefit>
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
              <StatusMetric label="Average latency" value="< 100ms" />
              <StatusMetric label="Redirect availability" value="99.9%" />
              <StatusMetric label="Active URLs" value="100K+" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusBenefit({
  children,
  icon: Icon,
}: {
  children: string;
  icon: typeof ShieldCheckIcon;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-6 items-center justify-center rounded-full bg-teal-500/10 text-teal-400">
        <Icon className="size-4" />
      </div>
      <span className="text-sm font-medium text-slate-200">{children}</span>
    </div>
  );
}

function StatusMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

function HomeFooter() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-600">
      <p>&copy; {new Date().getFullYear()} ShortLink. All rights reserved.</p>
    </footer>
  );
}
