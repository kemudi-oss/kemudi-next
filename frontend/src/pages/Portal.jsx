import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../auth";
import { Users, Inbox, Sparkles, Crown, Plus, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function Portal() {
  const { user } = useAuth();
  const [tab, setTab] = useState("overview");
  const [summary, setSummary] = useState(null);
  const [profile, setProfile] = useState(null);
  const [clients, setClients] = useState([]);
  const [referrals, setReferrals] = useState([]);

  const refresh = async () => {
    const [s, p, c, r] = await Promise.all([
      api.get("/portal/summary"), api.get("/portal/profile"),
      api.get("/portal/clients"), api.get("/portal/referrals"),
    ]);
    setSummary(s.data); setProfile(p.data); setClients(c.data); setReferrals(r.data);
  };
  useEffect(() => { if (user?.role === "therapist") refresh(); }, [user]);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "therapist") return <Navigate to="/" replace />;
  if (!summary) return <div className="p-10 text-muted">Loading…</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10" data-testid="portal-page">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="label text-primary mb-2">Practice</div>
          <h1 className="font-serif text-4xl tracking-tight">Hello, {user.name.split(" ")[0]}.</h1>
        </div>
        <TierBadge tier={summary.tier} />
      </div>

      <div className="flex gap-2 border-b border-line mb-8 overflow-x-auto">
        {[
          ["overview", "Overview"],
          ["clients", `Clients (${summary.total_clients})`],
          ["referrals", `Referrals (${summary.new_referrals} new)`],
          ["profile", "Profile"],
          ["billing", "Billing"],
        ].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              tab === k ? "border-primary text-primary" : "border-transparent text-muted hover:text-ink"
            }`}
            data-testid={`tab-${k}`}
          >{l}</button>
        ))}
      </div>

      {tab === "overview" && <Overview summary={summary} onUpgrade={() => setTab("billing")} />}
      {tab === "clients" && <Clients clients={clients} summary={summary} onChange={refresh} onUpgrade={() => setTab("billing")} />}
      {tab === "referrals" && <Referrals referrals={referrals} onChange={refresh} />}
      {tab === "profile" && <Profile profile={profile} onSaved={refresh} />}
      {tab === "billing" && <Billing summary={summary} />}
    </div>
  );
}

function TierBadge({ tier }) {
  return tier === "pro" ? (
    <span className="chip" style={{ background: "#2B5341", color: "#fff", borderColor: "#2B5341" }} data-testid="tier-badge">
      <Crown size={12} /> Kemudi Pro
    </span>
  ) : (
    <span className="chip" data-testid="tier-badge">Free tier</span>
  );
}

function Stat({ icon: Icon, label, value, hint }) {
  return (
    <div className="card-flat p-5">
      <div className="flex items-center gap-2 text-muted"><Icon size={14} /><span className="label">{label}</span></div>
      <div className="mt-3 font-serif text-4xl">{value}</div>
      {hint && <div className="text-xs text-muted mt-1">{hint}</div>}
    </div>
  );
}

function Overview({ summary, onUpgrade }) {
  const capHint = summary.active_cap ? `of ${summary.active_cap} on free tier` : "unlimited on Pro";
  return (
    <div className="space-y-6" data-testid="overview">
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat icon={Users} label="Active clients" value={summary.active_clients} hint={capHint} />
        <Stat icon={Inbox} label="New referrals" value={summary.new_referrals} />
        <Stat icon={Sparkles} label="Total clients" value={summary.total_clients} />
      </div>
      {summary.tier !== "pro" && (
        <div className="card p-6 flex flex-wrap items-center justify-between gap-4" style={{ background: "#F5EDD8" }}>
          <div>
            <div className="label text-secondary mb-1">Upgrade</div>
            <div className="font-serif text-2xl">Unlock unlimited clients and referrals.</div>
            <p className="text-muted text-sm mt-1">RM99 / month. Cancel anytime.</p>
          </div>
          <button onClick={onUpgrade} className="btn btn-primary" data-testid="upgrade-cta">Upgrade to Pro</button>
        </div>
      )}
    </div>
  );
}

function Clients({ clients, summary, onChange, onUpgrade }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "", status: "active" });
  const capReached = summary.active_cap && summary.active_clients >= summary.active_cap;

  const add = async (e) => {
    e.preventDefault();
    try {
      await api.post("/portal/clients", form);
      setForm({ name: "", email: "", phone: "", notes: "", status: "active" });
      setShowAdd(false); onChange();
      toast.success("Client added");
    } catch (err) {
      const d = err?.response?.data?.detail;
      toast.error(typeof d === "string" ? d : "Failed to add");
    }
  };

  const toggleStatus = async (c) => {
    try {
      await api.patch(`/portal/clients/${c.id}`, { status: c.status === "active" ? "archived" : "active" });
      onChange();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Failed");
    }
  };
  const del = async (c) => { await api.delete(`/portal/clients/${c.id}`); onChange(); };

  return (
    <div data-testid="clients-tab">
      <div className="flex justify-between mb-4">
        <div className="text-sm text-muted">
          {summary.active_cap ? (
            <>Active: <span className={capReached ? "text-secondary font-semibold" : "text-ink font-semibold"}>{summary.active_clients} / {summary.active_cap}</span> on free tier</>
          ) : "Unlimited on Pro"}
        </div>
        {capReached ? (
          <button onClick={onUpgrade} className="btn btn-secondary" data-testid="upgrade-from-cap">
            <Crown size={14} className="mr-1.5" /> Upgrade for more
          </button>
        ) : (
          <button onClick={() => setShowAdd(!showAdd)} className="btn btn-primary" data-testid="add-client-btn">
            <Plus size={14} className="mr-1.5" /> Add client
          </button>
        )}
      </div>

      {showAdd && (
        <form onSubmit={add} className="card-flat p-5 mb-4 grid sm:grid-cols-2 gap-3" data-testid="add-client-form">
          <input required className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} data-testid="client-name" />
          <input type="email" className="input" placeholder="Email (optional)" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
          <input className="input" placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} />
          <input className="input" placeholder="Short notes" value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} />
          <button className="btn btn-primary sm:col-span-2" type="submit" data-testid="submit-client">Save</button>
        </form>
      )}

      {clients.length === 0 ? (
        <div className="card p-10 text-center text-muted">No clients yet. Add your first one above.</div>
      ) : (
        <div className="card-flat overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-accent/40">
              <tr className="text-left">
                <th className="p-3 label text-muted">Name</th>
                <th className="p-3 label text-muted">Contact</th>
                <th className="p-3 label text-muted">Notes</th>
                <th className="p-3 label text-muted">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-t border-line/60" data-testid={`client-row-${c.id}`}>
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3 text-muted">{c.email || c.phone || "—"}</td>
                  <td className="p-3 text-muted max-w-xs truncate">{c.notes || "—"}</td>
                  <td className="p-3">
                    <button onClick={() => toggleStatus(c)} className={`chip ${c.status === "active" ? "" : "opacity-60"}`}>
                      {c.status}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => del(c)} className="text-muted hover:text-secondary" title="Delete" data-testid={`delete-client-${c.id}`}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Referrals({ referrals, onChange }) {
  const setStatus = async (r, status) => {
    await api.patch(`/portal/referrals/${r.id}`, { status });
    onChange();
    toast.success(`Referral marked ${status}`);
  };
  if (referrals.length === 0) return <div className="card p-10 text-center text-muted" data-testid="referrals-empty">No referrals yet. When someone requests you from the directory, they'll show up here.</div>;
  return (
    <div className="space-y-4" data-testid="referrals-tab">
      {referrals.map((r) => (
        <div key={r.id} className="card p-6" data-testid={`referral-${r.id}`}>
          <div className="flex flex-wrap justify-between gap-2 mb-2">
            <div>
              <div className="font-serif text-2xl">{r.client_name}</div>
              <div className="text-xs text-muted">{r.client_email}</div>
            </div>
            <span className={`chip ${r.status === "new" ? "bg-secondary text-white border-secondary" : ""}`} style={r.status === "new" ? { background: "#C05C3D", color: "#fff", borderColor: "#C05C3D" } : {}}>
              {r.status}
            </span>
          </div>
          <p className="text-ink/85 leading-relaxed mt-2">{r.concern}</p>
          <div className="text-xs text-muted mt-3 flex gap-4">
            {r.preferred_language && <span>Lang: {r.preferred_language}</span>}
            {r.preferred_mode && <span>Mode: {r.preferred_mode}</span>}
          </div>
          {r.status === "new" && (
            <div className="flex gap-2 mt-4">
              <button onClick={() => setStatus(r, "accepted")} className="btn btn-primary" data-testid={`accept-${r.id}`}><Check size={14} className="mr-1" />Accept</button>
              <button onClick={() => setStatus(r, "declined")} className="btn btn-ghost" data-testid={`decline-${r.id}`}><X size={14} className="mr-1" />Decline</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Profile({ profile, onSaved }) {
  const [form, setForm] = useState(profile);
  const save = async (e) => {
    e.preventDefault();
    await api.put("/portal/profile", {
      ...form,
      specialties: typeof form.specialties === "string" ? form.specialties.split(",").map((s) => s.trim()).filter(Boolean) : form.specialties,
      languages: typeof form.languages === "string" ? form.languages.split(",").map((s) => s.trim()).filter(Boolean) : form.languages,
      modalities: typeof form.modalities === "string" ? form.modalities.split(",").map((s) => s.trim()).filter(Boolean) : form.modalities,
      modes: typeof form.modes === "string" ? form.modes.split(",").map((s) => s.trim()).filter(Boolean) : form.modes,
      price_myr: parseInt(form.price_myr) || 0,
      years_experience: parseInt(form.years_experience) || 0,
    });
    toast.success("Profile saved"); onSaved();
  };
  const val = (k) => Array.isArray(form[k]) ? form[k].join(", ") : (form[k] || "");
  return (
    <form onSubmit={save} className="card p-6 grid sm:grid-cols-2 gap-4" data-testid="profile-form">
      <div className="sm:col-span-2"><label className="label block mb-1 text-muted">Display name</label><input className="input" value={form.name || ""} onChange={(e) => setForm({...form, name: e.target.value})} data-testid="pf-name" /></div>
      <div><label className="label block mb-1 text-muted">Title</label><input className="input" value={form.title || ""} onChange={(e) => setForm({...form, title: e.target.value})} data-testid="pf-title" /></div>
      <div><label className="label block mb-1 text-muted">Location</label><input className="input" value={form.location || ""} onChange={(e) => setForm({...form, location: e.target.value})} data-testid="pf-location" /></div>
      <div className="sm:col-span-2"><label className="label block mb-1 text-muted">Bio</label><textarea rows={4} className="input" value={form.bio || ""} onChange={(e) => setForm({...form, bio: e.target.value})} data-testid="pf-bio" /></div>
      <div><label className="label block mb-1 text-muted">Specialties (comma-separated)</label><input className="input" value={val("specialties")} onChange={(e) => setForm({...form, specialties: e.target.value})} data-testid="pf-spec" /></div>
      <div><label className="label block mb-1 text-muted">Languages</label><input className="input" value={val("languages")} onChange={(e) => setForm({...form, languages: e.target.value})} data-testid="pf-lang" /></div>
      <div><label className="label block mb-1 text-muted">Modalities</label><input className="input" value={val("modalities")} onChange={(e) => setForm({...form, modalities: e.target.value})} /></div>
      <div><label className="label block mb-1 text-muted">Modes (online, in-person)</label><input className="input" value={val("modes")} onChange={(e) => setForm({...form, modes: e.target.value})} /></div>
      <div><label className="label block mb-1 text-muted">Price / session (RM)</label><input type="number" className="input" value={form.price_myr || 0} onChange={(e) => setForm({...form, price_myr: e.target.value})} data-testid="pf-price" /></div>
      <div><label className="label block mb-1 text-muted">Years of experience</label><input type="number" className="input" value={form.years_experience || 0} onChange={(e) => setForm({...form, years_experience: e.target.value})} /></div>
      <div className="sm:col-span-2"><label className="label block mb-1 text-muted">Photo URL</label><input className="input" value={form.photo_url || ""} onChange={(e) => setForm({...form, photo_url: e.target.value})} /></div>
      <button className="btn btn-primary sm:col-span-2" type="submit" data-testid="pf-save">Save profile</button>
    </form>
  );
}

function Billing({ summary }) {
  const [busy, setBusy] = useState(false);
  const upgrade = async () => {
    setBusy(true);
    try {
      const { data } = await api.post("/payments/checkout", {
        lookup_key: "kemudi_pro_monthly",
        origin_url: window.location.origin,
      });
      window.location.href = data.checkout_url;
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Checkout failed");
      setBusy(false);
    }
  };
  return (
    <div className="grid lg:grid-cols-2 gap-6" data-testid="billing-tab">
      <div className="card p-6">
        <div className="label text-muted mb-2">Current plan</div>
        <div className="font-serif text-3xl">{summary.tier === "pro" ? "Kemudi Pro" : "Free"}</div>
        <p className="text-muted mt-2 text-sm">
          {summary.tier === "pro" ? "Unlimited clients and referrals." : "Free forever. Up to 5 active clients."}
        </p>
      </div>
      {summary.tier !== "pro" && (
        <div className="card p-6" style={{ background: "#F5EDD8" }}>
          <div className="label text-secondary mb-2">Upgrade to Pro</div>
          <div className="font-serif text-4xl">RM99<span className="text-lg text-muted"> / month</span></div>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex gap-2"><Check size={14} className="text-primary mt-1" />Unlimited clients</li>
            <li className="flex gap-2"><Check size={14} className="text-primary mt-1" />Referral inbox with status</li>
            <li className="flex gap-2"><Check size={14} className="text-primary mt-1" />Public directory listing</li>
            <li className="flex gap-2"><Check size={14} className="text-primary mt-1" />Cancel anytime</li>
          </ul>
          <button onClick={upgrade} disabled={busy} className="btn btn-primary mt-6 w-full" data-testid="checkout-btn">
            {busy ? "…" : "Upgrade with card"}
          </button>
          <p className="text-xs text-muted mt-3">Test card: 4242 4242 4242 4242 · any future date · any CVC</p>
        </div>
      )}
    </div>
  );
}
