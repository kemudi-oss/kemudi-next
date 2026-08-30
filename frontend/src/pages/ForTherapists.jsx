import React from "react";
import { Link } from "react-router-dom";
import { Check, Users, Inbox, Sparkles } from "lucide-react";

export default function ForTherapists() {
  const features = [
    "Unlimited active clients (Free: 5)",
    "Qualified referrals from the public directory",
    "Client notes & session history",
    "Public profile in the directory",
    "Cancel anytime",
    "Sessions in MYR, no hidden fees",
  ];
  return (
    <div data-testid="for-therapists-page">
      <section className="hero-gradient">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
          <div className="max-w-2xl fade-up">
            <div className="label text-primary mb-4">For therapists</div>
            <h1 className="font-serif text-5xl sm:text-6xl tracking-tighter leading-[0.95]">
              Run a calmer practice.<br />
              <span className="italic text-secondary">Grow it on your terms.</span>
            </h1>
            <p className="mt-6 text-lg text-muted leading-relaxed">
              Kemudi is your quiet operating system: a public profile that brings in the right clients, a soft inbox for referrals, and a place to keep your practice organised.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-2 gap-8">
        <div className="card p-8 flex flex-col">
          <div className="label text-muted mb-3">Kemudi Free</div>
          <div className="font-serif text-5xl">RM0<span className="text-lg text-muted"> / month</span></div>
          <p className="text-muted mt-3">To get you started — no credit card.</p>
          <ul className="mt-6 space-y-2.5 text-sm">
            <li className="flex gap-2"><Check size={16} className="text-primary mt-0.5" />Public directory profile</li>
            <li className="flex gap-2"><Check size={16} className="text-primary mt-0.5" />Up to 5 active clients</li>
            <li className="flex gap-2"><Check size={16} className="text-primary mt-0.5" />Basic referral inbox</li>
          </ul>
          <Link to="/register?role=therapist" className="btn btn-ghost mt-8" data-testid="plan-free-cta">Start free</Link>
        </div>

        <div className="card p-8 flex flex-col relative overflow-hidden" style={{ background: "#F5EDD8", borderColor: "#DFC891" }}>
          <div className="absolute top-6 right-6 chip" style={{ background: "#2B5341", color: "#fff", borderColor: "#2B5341" }}>Recommended</div>
          <div className="label text-secondary mb-3">Kemudi Pro</div>
          <div className="font-serif text-5xl">RM99<span className="text-lg text-muted"> / month</span></div>
          <p className="text-muted mt-3">Everything a growing practice needs.</p>
          <ul className="mt-6 space-y-2.5 text-sm">
            {features.map((f) => (
              <li key={f} className="flex gap-2"><Check size={16} className="text-primary mt-0.5" />{f}</li>
            ))}
          </ul>
          <Link to="/register?role=therapist" className="btn btn-primary mt-8" data-testid="plan-pro-cta">Get started</Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid sm:grid-cols-3 gap-6">
        {[
          { icon: Users, title: "Client list", desc: "One place for names, notes, contact details, and status." },
          { icon: Inbox, title: "Referral inbox", desc: "Warm, pre-qualified messages from clients who read your profile." },
          { icon: Sparkles, title: "Public profile", desc: "Show up honestly. Bio, specialties, price, language, mode." },
        ].map((c, i) => (
          <div key={i} className="card p-6">
            <c.icon size={22} className="text-primary mb-3" />
            <div className="font-serif text-2xl mb-1">{c.title}</div>
            <p className="text-sm text-muted">{c.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
