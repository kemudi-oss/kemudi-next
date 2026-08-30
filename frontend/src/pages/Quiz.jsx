import React, { useState } from "react";
import api from "../api";
import { TherapistCard } from "./Find";
import { ArrowRight } from "lucide-react";

const STEPS = [
  {
    key: "concerns", title: "What brings you here today?",
    subtitle: "Pick anything that resonates — you can always change your mind.",
    type: "multi",
    options: ["Anxiety", "Depression", "Trauma", "Relationships", "Family", "Grief", "Burnout", "Identity", "PTSD", "Life Transitions"],
  },
  {
    key: "language", title: "Which language feels most natural?",
    subtitle: "Therapy works best in a language you dream in.",
    type: "single",
    options: ["English", "Bahasa Malaysia", "Mandarin", "Tamil"],
  },
  {
    key: "mode", title: "Online or in-person?",
    subtitle: "There's no wrong answer.",
    type: "single",
    options: ["online", "in-person"],
    labels: { online: "Online", "in-person": "In-person" },
  },
  {
    key: "max_price", title: "What feels comfortable per session?",
    subtitle: "In Malaysian ringgit. This is your ceiling, not a target.",
    type: "single",
    options: [180, 250, 350, 500],
    labels: { 180: "Up to RM180", 250: "Up to RM250", 350: "Up to RM350", 500: "RM500+" },
  },
];

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ concerns: [], language: null, mode: null, max_price: null });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const s = STEPS[step];

  const toggle = (val) => {
    if (s.type === "multi") {
      const cur = answers[s.key] || [];
      const next = cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val];
      setAnswers({ ...answers, [s.key]: next });
    } else {
      setAnswers({ ...answers, [s.key]: val });
    }
  };

  const next = async () => {
    if (step < STEPS.length - 1) { setStep(step + 1); return; }
    setLoading(true);
    const payload = { ...answers };
    if (typeof payload.max_price === "string") payload.max_price = parseInt(payload.max_price);
    const { data } = await api.post("/quiz/match", payload);
    setResults(data);
    setLoading(false);
  };

  const isPicked = (val) => s.type === "multi" ? (answers[s.key] || []).includes(val) : answers[s.key] === val;
  const canProceed = s.type === "multi" ? (answers[s.key] || []).length > 0 : answers[s.key] !== null;

  if (results) {
    return (
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-14" data-testid="quiz-results">
        <div className="label text-primary mb-3">Your matches</div>
        <h1 className="font-serif text-4xl sm:text-5xl tracking-tight mb-3">Here's who might fit.</h1>
        <p className="text-muted mb-10 max-w-xl">Ranked by how closely their focus overlaps with what you shared. You know yourself best — trust that.</p>
        {results.length === 0 ? (
          <div className="card p-10 text-center text-muted">No exact matches. Try loosening your filters in the directory.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {results.map((t) => <TherapistCard key={t.id} t={t} />)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16" data-testid="quiz-page">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-6">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1 rounded-full flex-1 transition-colors ${i <= step ? "bg-primary" : "bg-line"}`} />
          ))}
        </div>
        <div className="label text-primary">Step {step + 1} of {STEPS.length}</div>
      </div>

      <h1 className="font-serif text-4xl sm:text-5xl tracking-tighter leading-none mb-4 fade-up" key={step}>{s.title}</h1>
      <p className="text-muted mb-10">{s.subtitle}</p>

      <div className="grid sm:grid-cols-2 gap-3 mb-10">
        {s.options.map((o) => (
          <button
            key={o}
            onClick={() => toggle(o)}
            className={`text-left p-5 rounded-xl border transition-all ${
              isPicked(o) ? "border-primary bg-primary/5" : "border-line bg-white hover:border-primary/50"
            }`}
            data-testid={`quiz-opt-${o}`}
          >
            <div className="font-medium">{s.labels ? s.labels[o] : o}</div>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        {step > 0 ? (
          <button onClick={() => setStep(step - 1)} className="btn btn-ghost" data-testid="quiz-back">Back</button>
        ) : <div />}
        <button
          onClick={next}
          disabled={!canProceed || loading}
          className="btn btn-primary disabled:opacity-40"
          data-testid="quiz-next"
        >
          {step === STEPS.length - 1 ? (loading ? "Matching…" : "See my matches") : "Continue"}
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
}
