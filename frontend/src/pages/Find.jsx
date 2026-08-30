import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { Filter, X, MapPin, Globe, GitCompare } from "lucide-react";
import { toast } from "sonner";

const SPECIALTIES = ["Anxiety", "Depression", "Trauma", "Relationships", "Family", "Grief", "Burnout", "Identity", "Children", "Teens", "Couples", "PTSD", "Complex Trauma", "Life Transitions", "Communication"];
const LANGUAGES = ["English", "Bahasa Malaysia", "Mandarin", "Tamil"];
const MODES = ["online", "in-person"];

export default function Find() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ specialty: "", language: "", mode: "", max_price: "", q: "" });
  const [selected, setSelected] = useState([]);

  const fetchList = async (f = filters) => {
    setLoading(true);
    const params = {};
    Object.entries(f).forEach(([k, v]) => { if (v) params[k] = v; });
    const { data } = await api.get("/therapists", { params });
    setTherapists(data);
    setLoading(false);
  };

  useEffect(() => { fetchList(); }, []);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) { toast("You can compare up to 3 therapists"); return prev; }
      return [...prev, id];
    });
  };

  const resetFilters = () => {
    const empty = { specialty: "", language: "", mode: "", max_price: "", q: "" };
    setFilters(empty); fetchList(empty);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14" data-testid="find-page">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <div>
          <div className="label text-primary mb-3">Directory</div>
          <h1 className="font-serif text-4xl sm:text-5xl tracking-tight leading-tight">
            Find your therapist.
          </h1>
          <p className="text-muted mt-3 max-w-lg">Filter honestly. Compare up to three side by side. Reach out when you're ready.</p>
        </div>
        {selected.length > 0 && (
          <Link
            to={`/compare?ids=${selected.join(",")}`}
            className="btn btn-secondary"
            data-testid="compare-btn"
          >
            <GitCompare size={16} className="mr-2" />
            Compare ({selected.length})
          </Link>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Filters */}
        <aside className="lg:col-span-3 space-y-6" data-testid="filter-panel">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 label text-ink/80"><Filter size={12} /> Filters</div>
            <button onClick={resetFilters} className="text-xs text-secondary hover:underline" data-testid="reset-filters">Reset</button>
          </div>

          <div>
            <label className="label block mb-2 text-muted">Search</label>
            <input
              className="input"
              placeholder="Name, keyword…"
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              onBlur={() => fetchList()}
              data-testid="filter-search"
            />
          </div>

          <div>
            <label className="label block mb-2 text-muted">Specialty</label>
            <select
              className="input"
              value={filters.specialty}
              onChange={(e) => { const n = { ...filters, specialty: e.target.value }; setFilters(n); fetchList(n); }}
              data-testid="filter-specialty"
            >
              <option value="">Any</option>
              {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="label block mb-2 text-muted">Language</label>
            <select
              className="input"
              value={filters.language}
              onChange={(e) => { const n = { ...filters, language: e.target.value }; setFilters(n); fetchList(n); }}
              data-testid="filter-language"
            >
              <option value="">Any</option>
              {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label className="label block mb-2 text-muted">Mode</label>
            <div className="flex gap-2">
              {MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => { const n = { ...filters, mode: filters.mode === m ? "" : m }; setFilters(n); fetchList(n); }}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                    filters.mode === m ? "bg-primary text-white border-primary" : "bg-white text-ink border-line hover:bg-accent"
                  }`}
                  data-testid={`filter-mode-${m}`}
                >
                  {m === "online" ? "Online" : "In-person"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label block mb-2 text-muted">Max price (RM)</label>
            <input
              type="number"
              className="input"
              placeholder="e.g. 300"
              value={filters.max_price}
              onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
              onBlur={() => fetchList()}
              data-testid="filter-price"
            />
          </div>
        </aside>

        {/* Results */}
        <div className="lg:col-span-9">
          {loading ? (
            <div className="text-muted">Loading…</div>
          ) : therapists.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-muted">No therapists match those filters. Try loosening a few.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {therapists.map((t) => (
                <TherapistCard key={t.id} t={t} onCompare={toggleSelect} isSelected={selected.includes(t.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function TherapistCard({ t, onCompare, isSelected }) {
  return (
    <div className="card p-6 flex flex-col" data-testid={`therapist-card-${t.id}`}>
      <div className="flex gap-4">
        {t.photo_url ? (
          <img src={t.photo_url} alt={t.name} className="w-20 h-20 rounded-full object-cover border border-line" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center font-serif text-2xl text-primary">
            {t.name?.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-xl leading-tight truncate">{t.name}</h3>
          <p className="text-xs text-muted mt-0.5">{t.title}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-1"><MapPin size={12} />{t.location}</span>
            <span className="flex items-center gap-1"><Globe size={12} />{(t.languages || []).slice(0, 2).join(", ")}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted leading-relaxed mt-4 line-clamp-3">{t.bio}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {(t.specialties || []).slice(0, 3).map((s) => <span key={s} className="chip">{s}</span>)}
      </div>
      <div className="mt-5 pt-5 border-t border-line/60 flex items-center justify-between">
        <div>
          <div className="label text-muted">From</div>
          <div className="font-serif text-xl">RM{t.price_myr}<span className="text-xs text-muted"> / session</span></div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onCompare && onCompare(t.id)}
            className={`btn ${isSelected ? "btn-secondary" : "btn-ghost"}`}
            data-testid={`compare-toggle-${t.id}`}
          >
            {isSelected ? <><X size={14} className="mr-1" />Selected</> : "Compare"}
          </button>
          <Link to={`/therapist/${t.id}`} className="btn btn-primary" data-testid={`view-therapist-${t.id}`}>
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
