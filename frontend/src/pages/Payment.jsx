import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api";
import { Check, XCircle } from "lucide-react";

export function PaymentSuccess() {
  const [params] = useSearchParams();
  const sid = params.get("session_id");
  const [status, setStatus] = useState("polling");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!sid) return;
    let cancelled = false;
    let n = 0;
    const poll = async () => {
      if (cancelled) return;
      n += 1; setAttempts(n);
      try {
        const { data } = await api.get(`/payments/status/${sid}`);
        if (data.payment_status === "paid") { setStatus("paid"); return; }
        if (n >= 15) { setStatus("timeout"); return; }
        setTimeout(poll, 2000);
      } catch {
        if (n >= 15) { setStatus("timeout"); return; }
        setTimeout(poll, 2000);
      }
    };
    poll();
    return () => { cancelled = true; };
  }, [sid]);

  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center" data-testid="payment-success-page">
      {status === "paid" ? (
        <>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"><Check className="text-primary" size={28} /></div>
          <h1 className="font-serif text-4xl tracking-tight mb-3">You're on Pro.</h1>
          <p className="text-muted">Unlimited clients unlocked. Thank you for supporting Kemudi.</p>
          <Link to="/portal" className="btn btn-primary mt-8 inline-flex" data-testid="back-to-portal">Back to portal</Link>
        </>
      ) : status === "timeout" ? (
        <>
          <h1 className="font-serif text-3xl tracking-tight mb-3">Still processing…</h1>
          <p className="text-muted">Refresh the portal in a minute. Your upgrade will land automatically.</p>
          <Link to="/portal" className="btn btn-primary mt-6 inline-flex">Go to portal</Link>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-6 animate-pulse" />
          <h1 className="font-serif text-3xl tracking-tight mb-3">Confirming your payment…</h1>
          <p className="text-muted text-sm">Attempt {attempts} of 15</p>
        </>
      )}
    </div>
  );
}

export function PaymentCancel() {
  return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center" data-testid="payment-cancel-page">
      <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-6"><XCircle className="text-secondary" size={28} /></div>
      <h1 className="font-serif text-4xl tracking-tight mb-3">No worries.</h1>
      <p className="text-muted">Your subscription wasn't started. You can try again anytime.</p>
      <Link to="/portal" className="btn btn-primary mt-8 inline-flex">Back to portal</Link>
    </div>
  );
}
