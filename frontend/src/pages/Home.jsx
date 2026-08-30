import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Filter, Shield, Sparkles, Compass } from "lucide-react";

export default function Home() {
  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="hero-gradient relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-20 lg:pb-32 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7 fade-up">
              <div className="label text-primary mb-6">Kemudi · Mental health, Malaysia</div>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl tracking-tighter leading-[0.95] font-medium">
                Finding a therapist,{" "}
                <span className="italic text-secondary">without the guesswork.</span>
              </h1>
              <p className="mt-8 text-lg text-muted max-w-xl leading-relaxed">
                Kemudi is your warm older sibling for mental health care. We help you compare therapists in Malaysia clearly, honestly, and at your own pace — so you can choose care that actually fits.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link to="/find" className="btn btn-primary" data-testid="hero-find-btn">
                  Browse therapists <ArrowRight size={16} className="ml-2" />
                </Link>
                <Link to="/quiz" className="btn btn-ghost" data-testid="hero-quiz-btn">
                  Take the 60-second quiz
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-6 text-sm text-muted">
                <div className="flex items-center gap-2"><Shield size={14} /> Vetted profiles</div>
                <div className="flex items-center gap-2"><Heart size={14} /> No cold DMs</div>
                <div className="flex items-center gap-2"><Sparkles size={14} /> Free to use</div>
              </div>
            </div>
            <div className="lg:col-span-5 fade-up delay-2">
              <div className="hero-image-wrap aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1604881991720-f91add269bed?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwyfHx3YXJtJTIwY291bnNlbGluZyUyMHRoZXJhcHklMjBzZXNzaW9ufGVufDB8fHx8MTc4ODA5MjA5OHww&ixlib=rb-4.1.0&q=85"
                  alt="Two people holding hands, offering comfort"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6 z-10 text-white">
                  <div className="label mb-2 opacity-90">Our promise</div>
                  <p className="font-serif text-2xl leading-snug">
                    Clear choices. Human tone. Zero pressure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4">
            <div className="label text-primary mb-4">How it works</div>
            <h2 className="font-serif text-4xl sm:text-5xl tracking-tight leading-tight">
              Three quiet steps<br />
              <span className="italic">toward the right fit.</span>
            </h2>
          </div>
          <div className="lg:col-span-8 grid sm:grid-cols-3 gap-6">
            {[
              { icon: Filter, title: "Filter honestly", desc: "By what actually matters to you — language, price, mode, specialty.", n: "01" },
              { icon: Compass, title: "Compare side by side", desc: "See up to three therapists together. No SEO games. No inflated bios.", n: "02" },
              { icon: Heart, title: "Reach out warmly", desc: "Send a short, guided referral — they see the essentials, you keep control.", n: "03" },
            ].map((step, i) => (
              <div key={i} className="card p-7">
                <div className="label text-secondary mb-4">{step.n}</div>
                <step.icon size={22} className="text-primary mb-4" />
                <h3 className="font-serif text-2xl mb-2 leading-snug">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR THERAPISTS BAND */}
      <section className="py-24" style={{ background: "#E9E1CD" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="hero-image-wrap aspect-[5/4]">
              <img
                src="https://images.unsplash.com/photo-1714976694867-bc0e012fab70?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHw0fHx3YXJtJTIwY291bnNlbGluZyUyMHRoZXJhcHklMjBzZXNzaW9ufGVufDB8fHx8MTc4ODA5MjA5OHww&ixlib=rb-4.1.0&q=85"
                alt="Therapy session"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="label text-primary mb-4">For therapists</div>
            <h2 className="font-serif text-4xl sm:text-5xl tracking-tight leading-tight mb-6">
              Your practice,<br />
              <span className="italic">on one warm dashboard.</span>
            </h2>
            <p className="text-muted text-lg leading-relaxed max-w-lg mb-8">
              Free forever for up to 5 active clients. Upgrade to Kemudi Pro for unlimited clients, qualified referrals from the directory, and a calmer way to run your practice.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register?role=therapist" className="btn btn-primary" data-testid="cta-therapist-signup">
                Start free
              </Link>
              <Link to="/for-therapists" className="btn btn-ghost" data-testid="cta-see-pricing">
                See pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
