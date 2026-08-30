import React from "react";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-10 py-20" data-testid="about-page">
      <div className="label text-primary mb-4">About Kemudi</div>
      <h1 className="font-serif text-5xl tracking-tighter leading-[0.95] mb-8">
        A warm hand,<br />
        <span className="italic text-secondary">not another algorithm.</span>
      </h1>
      <div className="prose max-w-none">
        <p className="text-lg text-muted leading-relaxed">
          "Kemudi" is the Malay word for a rudder — the small thing that quietly steers a boat home. That's the role we want to play for anyone in Malaysia trying to find real, honest mental health care.
        </p>
        <p className="text-lg text-muted leading-relaxed mt-6">
          We're building the warm older sibling of a mental health platform: someone who knows the landscape, sits beside you while you decide, and never rushes you. No inflated bios, no confusing acronyms, no cold call centres. Just clear choices, honest information, and a soft handoff to a therapist who fits.
        </p>
        <p className="text-lg text-muted leading-relaxed mt-6">
          For therapists, we're a quiet operating system for a practice that already has enough noise. A directory that brings you the right clients, a place to keep track of the ones you have, and a monthly subscription that keeps the lights on without ads.
        </p>
      </div>
    </div>
  );
}
