import React from "react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line/60" style={{ background: "#F1EADB" }} data-testid="app-footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-serif text-lg leading-none">k</span>
            </div>
            <span className="font-serif text-2xl tracking-tight">Kemudi</span>
          </div>
          <p className="text-muted max-w-md leading-relaxed">
            A warm, honest guide to therapy in Malaysia. We help you find care that fits—and we help therapists run better practices.
          </p>
        </div>
        <div>
          <div className="label mb-3 text-ink/70">For clients</div>
          <ul className="space-y-2 text-sm text-muted">
            <li>Directory</li>
            <li>Match quiz</li>
            <li>How to choose</li>
          </ul>
        </div>
        <div>
          <div className="label mb-3 text-ink/70">For therapists</div>
          <ul className="space-y-2 text-sm text-muted">
            <li>Practice tools</li>
            <li>Referrals</li>
            <li>Pricing</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line/60 px-6 lg:px-10 py-6 text-xs text-muted flex justify-between max-w-7xl mx-auto">
        <span>© {new Date().getFullYear()} Kemudi</span>
        <span>Made with care in Malaysia</span>
      </div>
    </footer>
  );
}
