import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api";
import { Check, ArrowLeft } from "lucide-react";

export default function Compare() {
  const [params] = useSearchParams();
  const ids = (params.get("ids") || "").split(",").filter(Boolean);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (ids.length === 0) return;
    api.post("/therapists/compare", { ids }).then((r) => setItems(r.data));
  }, [params]);

  if (ids.length === 0) return (
    <div className="max-w-4xl mx-auto p-10 text-center">
      <p className="text-muted">Select therapists from the directory to compare.</p>
      <Link to="/find" className="btn btn-primary mt-4 inline-flex">Go to directory</Link>
    </div>
  );

  const rows = [
    { label: "Session fee", get: (t) => `RM${t.price_myr}` },
    { label: "Location", get: (t) => t.location },
    { label: "Languages", get: (t) => (t.languages || []).join(", ") },
    { label: "Specialties", get: (t) => (t.specialties || []).join(", ") },
    { label: "Approach", get: (t) => (t.modalities || []).join(", ") },
    { label: "Mode", get: (t) => (t.modes || []).join(", ") },
    { label: "Experience", get: (t) => `${t.years_experience || 0} yrs` },
    { label: "Credentials", get: (t) => t.credentials || "—" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10" data-testid="compare-page">
      <Link to="/find" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink mb-6">
        <ArrowLeft size={14} /> Back
      </Link>
      <div className="label text-primary mb-2">Side by side</div>
      <h1 className="font-serif text-4xl tracking-tight mb-10">Compare your shortlist.</h1>

      <div className="grid gap-6" style={{ gridTemplateColumns: `220px repeat(${items.length}, 1fr)` }}>
        <div></div>
        {items.map((t) => (
          <div key={t.id} className="card p-5 flex flex-col items-center text-center">
            {t.photo_url ? (
              <img src={t.photo_url} alt={t.name} className="w-20 h-20 rounded-full object-cover border border-line mb-3" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-accent mb-3" />
            )}
            <div className="font-serif text-xl">{t.name}</div>
            <div className="text-xs text-muted">{t.title}</div>
            <Link to={`/therapist/${t.id}`} className="btn btn-primary mt-4 w-full" data-testid={`compare-view-${t.id}`}>View profile</Link>
          </div>
        ))}

        {rows.map((r) => (
          <React.Fragment key={r.label}>
            <div className="label text-muted py-4 border-t border-line/60 flex items-center">{r.label}</div>
            {items.map((t) => (
              <div key={t.id + r.label} className="py-4 border-t border-line/60 text-sm text-ink/90">
                {r.get(t)}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
