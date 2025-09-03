import React from "react";
import {
  MapPin,
  Phone,
  Clock,
  Globe,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Send,
} from "lucide-react";

export type NavLink = { label: string; href: string };
export type SocialLink = { label: string; href: string; icon: React.ReactNode };

export default function YatraFooter({
  year = new Date().getFullYear(),
  brand = { name: "Yatra AI", tagline: "Trip planning with superpowers" },
  nav = {
    explore: [
      { label: "Destinations", href: "/create-new-trip" },
      { label: "Trips", href: "/create-new-trip" },
      { label: "Blog", href: "/blog" },
    ],
    plan: [
      { label: "Create a Trip", href: "/create-new-trip" },
      { label: "Support", href: "/contact" },
    ],
    company: [
      { label: "About", href: "/About" },
      { label: "Contact", href: "/contact" },
    ],
  },
  socials = [
    { label: "Twitter", href: "https://x.com/Sourav_sahoo3", icon: <Twitter className="h-5 w-5" /> },
    { label: "Instagram", href: "https://www.instagram.com/souravsahoo137/", icon: <Instagram className="h-5 w-5" /> },
    { label: "Facebook", href: "https://www.facebook.com/profile.php?id=100051930940893", icon: <Facebook className="h-5 w-5" /> },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/sourav-sahoo7/", icon: <Linkedin className="h-5 w-5" /> },
  ],
}: {
  year?: number;
  brand?: { name: string; tagline?: string };
  nav?: { explore: NavLink[]; plan: NavLink[]; company: NavLink[] };
  socials?: SocialLink[];
}) {
  return (
    <footer className="relative mt-24 border-t border-gray-200 bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-700 dark:border-white/10 dark:from-slate-900 dark:via-slate-950 dark:to-black dark:text-slate-300">
      {/* Glow */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-8 mx-auto h-20 w-11/12 rounded-full bg-gradient-to-r from-purple-500/20 via-purple-500/20 to-cyan-500/20 blur-2xl" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Brand + Newsletter */}
        <div className="flex flex-col gap-10 border-b border-gray-200 py-12 dark:border-white/10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" aria-label="Yatra AI logo">
                  <path fill="currentColor" d="M12 2a9 9 0 0 0-9 9c0 6.5 9 11 9 11s9-4.5 9-11a9 9 0 0 0-9-9Zm0 12.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {brand.name}
                </h3>
                {brand.tagline && (
                  <p className="text-sm text-gray-600 dark:text-slate-400">{brand.tagline}</p>
                )}
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-gray-600 dark:text-slate-400">
              Plan smarter, travel further. Yatra AI crafts hyper-personalized itineraries, optimizes budgets, and keeps your plans in sync across devices.
            </p>

            {/* Contact badges */}
            <div className="mt-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
              <Badge icon={<MapPin className="h-4 w-4" />} text="Global" />
              <Badge icon={<Phone className="h-4 w-4" />} text="24×7 support" />
              <Badge icon={<Clock className="h-4 w-4" />} text="Live trip updates" />
            </div>
          </div>

          {/* Newsletter */}
          <div className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-5 backdrop-blur sm:p-6 dark:border-white/10 dark:bg-white/5 md:max-w-lg">
            <h4 className="text-base font-medium text-gray-900 dark:text-white">Get smart travel tips</h4>
            <p className="mt-1 text-xs text-gray-600 dark:text-slate-400">
              Monthly insights, destination ideas, and feature drops. No spam—unsubscribe anytime.
            </p>
            <form
              className="mt-4 flex w-full items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
                if (email) alert(`Subscribed: ${email}`);
              }}
            >
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="YatraAI@gmail.com"
                className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-purple-500 dark:border-white/10 dark:bg-white/10 dark:text-white dark:placeholder-slate-400 dark:focus:border-purple-400/60 dark:focus:bg-white/15"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-purple-500 to-purple-800 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-purple-500/30 transition active:scale-[.98] hover:brightness-110"
              >
                <Send className="h-4 w-4" /> Send
              </button>
              <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" />
            </form>
            <p className="mt-2 text-[11px] leading-5 text-gray-500 dark:text-slate-500">
              By subscribing, you agree to our{" "}
              <a className="underline underline-offset-4 hover:text-gray-700 dark:hover:text-slate-300" href="/privecy">Privacy Policy</a> and{" "}
              <a className="underline underline-offset-4 hover:text-gray-700 dark:hover:text-slate-300" href="/Terms">Terms</a>.
            </p>
          </div>
        </div>

        {/* Links + Apps */}
        <div className="grid grid-cols-2 gap-10 py-12 sm:grid-cols-3 lg:grid-cols-6">
          <LinkColumn title="Explore" links={nav.explore} />
          <LinkColumn title="Plan" links={nav.plan} />
          <LinkColumn title="Company" links={nav.company} />
          <div className="col-span-2 flex flex-col gap-5 lg:col-span-3">
            <div>
              <h5 className="text-sm font-semibold tracking-wide text-gray-900 dark:text-white">Get the app</h5>
              <div className="mt-3 flex flex-wrap gap-3">
                <StoreBadge label="App Store" sub="Soon" />
                <StoreBadge label="Google Play" sub="Soon" />
              </div>
            </div>
            <div>
              <h5 className="text-sm font-semibold tracking-wide text-gray-900 dark:text-white">We keep you safe</h5>
              <ul className="mt-3 grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-slate-400 sm:grid-cols-3">
                <li className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-white/10 dark:bg-white/5">SSL/TLS 1.3</li>
                <li className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-white/10 dark:bg-white/5">GDPR-ready</li>
                <li className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-white/10 dark:bg-white/5">ISO 27001</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-6 border-t border-gray-200 py-8 dark:border-white/10 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-gray-600 dark:text-slate-400">© {year} {brand.name}. All rights reserved.</div>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <a className="hover:text-gray-900 dark:hover:text-slate-200" href="/Terms">Terms</a>
            <a className="hover:text-gray-900 dark:hover:text-slate-200" href="/privecy">Privacy</a>
            <a className="hover:text-gray-900 dark:hover:text-slate-200" href="/cookies">Cookies</a>
            <a className="hover:text-gray-900 dark:hover:text-slate-200" href="/sitemap">Sitemap</a>
          </nav>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              <Globe className="h-4 w-4" />
              <select className="bg-transparent outline-none">
                <option className="bg-white dark:bg-slate-900">English (IN)</option>
                <option className="bg-white dark:bg-slate-900">हिन्दी</option>
              </select>
            </div>
            <ul className="flex items-center gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="grid h-9 w-9 place-items-center rounded-xl border border-gray-200 bg-gray-50 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                    {s.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* Reusable Components */
function LinkColumn({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      <h5 className="text-sm font-semibold tracking-wide text-gray-900 dark:text-white">{title}</h5>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <a className="text-gray-600 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200" href={l.href}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StoreBadge({ label, sub }: { label: string; sub: string }) {
  return (
    <a href="#" className="group inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm text-gray-900 transition hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
      <div className="rounded-lg bg-gray-100 p-2 dark:bg-white/10">
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path fill="currentColor" d="M5 3h14a2 2 0 0 1 2 2v6H3V5a2 2 0 0 1 2-2Zm-2 10h20v4a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-4Z"/>
        </svg>
      </div>
      <div>
        <div className="text-[10px] leading-3 text-gray-500 dark:text-slate-400">Available on</div>
        <div className="font-medium leading-5">{label} · <span className="text-emerald-600 dark:text-emerald-300">{sub}</span></div>
      </div>
    </a>
  );
}

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 dark:border-white/10 dark:bg-white/5">
      <span>{icon}</span>
      <span className="text-gray-700 dark:text-slate-300">{text}</span>
    </div>
  );
}
