export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-lg font-bold text-white">
            E
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">EcoKnot</h1>
            <p className="text-xs text-slate-500">Community Connected</p>
          </div>
        </a>

        {/* Navigation */}
        <nav className="hidden items-center gap-7 lg:flex">
          <a
            href="#"
            className="text-sm font-semibold text-emerald-700"
          >
            Home
          </a>

          <a
            href="#blood"
            className="text-sm font-medium text-slate-600 transition hover:text-emerald-700"
          >
            Blood Donation
          </a>

          <a
            href="#campaigns"
            className="text-sm font-medium text-slate-600 transition hover:text-emerald-700"
          >
            Campaigns
          </a>

          <a
            href="#resources"
            className="text-sm font-medium text-slate-600 transition hover:text-emerald-700"
          >
            Resources
          </a>

          <a
            href="#academic"
            className="text-sm font-medium text-slate-600 transition hover:text-emerald-700"
          >
            Academic Hub
          </a>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          <button className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block">
            Log In
          </button>

          <button className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800">
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
}