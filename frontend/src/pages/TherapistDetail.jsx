import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { MapPin, Globe, Sparkles, ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";

export default function TherapistDetail() {
  const { id } = useParams();
  const [t, setT] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ client_name: "", client_email: "", concern: "", preferred_language: "", preferred_mode: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => { api.get(`/therapists/${id}`).then((r) => setT(r.data)).catch(() => {}); }, [id]);

  if (!t) return <div className="max-w-4xl mx-auto p-10 text-muted">Loading…</div>;

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/referrals", { therapist_id: t.id, ...form });
      setSent(true);
      toast.success("Referral sent to " + t.name);
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed to send");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10" data-testid="therapist-detail">
      <Link to="/find" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-8">
        <ArrowLeft size={14} /> Back to directory
      </Link>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <div className="hero-image-wrap aspect-[4/5]">
            {t.photo_url ? (
              <img src={t.photo_url} alt={t.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-accent flex items-center justify-center font-serif text-6xl text-primary">
                {t.name?.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="label text-primary mb-3">{t.title}</div>
          <h1 className="font-serif text-5xl tracking-tighter leading-none">{t.name}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
            <span className="flex items-center gap-1.5"><MapPin size={14} />{t.location}</span>
            <span className="flex items-center gap-1.5"><Globe size={14} />{(t.languages || []).join(", ")}</span>
            {t.years_experience > 0 && <span className="flex items-center gap-1.5"><Sparkles size={14} />{t.years_experience} yrs experience</span>}
          </div>

          <p className="mt-8 text-lg text-ink/85 leading-relaxed">{t.bio}</p>

          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            <InfoBlock title="Specialties" items={t.specialties} />
            <InfoBlock title="Approach" items={t.modalities} />
            <InfoBlock title="Session format" items={t.modes} />
            <InfoBlock title="Credentials" items={t.credentials ? [t.credentials] : []} />
          </div>

          <div className="mt-10 flex items-center justify-between card p-6">
            <div>
              <div className="label text-muted">Session fee</div>
              <div className="font-serif text-3xl">RM{t.price_myr}</div>
            </div>
            {sent ? (
              <div className="flex items-center gap-2 text-primary">
                <Check size={18} /> <span>Referral sent</span>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={() => setShowForm(true)} data-testid="request-referral-btn">
                Request a referral
              </button>
            )}
          </div>

          {showForm && !sent && (
            <form onSubmit={submit} className="mt-8 card p-6 space-y-4" data-testid="referral-form">
              <h3 className="font-serif text-2xl">Send a warm intro</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label block mb-1 text-muted">Your name</label>
                  <input required className="input" value={form.client_name} onChange={(e) => setForm({...form, client_name: e.target.value})} data-testid="ref-name" />
                </div>
                <div>
                  <label className="label block mb-1 text-muted">Your email</label>
                  <input required type="email" className="input" value={form.client_email} onChange={(e) => setForm({...form, client_email: e.target.value})} data-testid="ref-email" />
                </div>
              </div>
              <div>
                <label className="label block mb-1 text-muted">What's on your mind?</label>
                <textarea required rows={4} className="input" placeholder="A short note — the therapist will see this." value={form.concern} onChange={(e) => setForm({...form, concern: e.target.value})} data-testid="ref-concern" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label block mb-1 text-muted">Preferred language</label>
                  <input className="input" value={form.preferred_language} onChange={(e) => setForm({...form, preferred_language: e.target.value})} data-testid="ref-lang" />
                </div>
                <div>
                  <label className="label block mb-1 text-muted">Preferred mode</label>
                  <select className="input" value={form.preferred_mode} onChange={(e) => setForm({...form, preferred_mode: e.target.value})} data-testid="ref-mode">
                    <option value="">Either</option>
                    <option value="online">Online</option>
                    <option value="in-person">In-person</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-primary" type="submit" data-testid="ref-submit">Send referral</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <div className="label text-muted mb-2">{title}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it) => <span key={it} className="chip">{it}</span>)}
      </div>
    </div>
  );
}
