import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../auth";
import { toast } from "sonner";

export default function Auth({ mode }) {
  const isLogin = mode === "login";
  const nav = useNavigate();
  const { login, register } = useAuth();
  const [params] = useSearchParams();
  const roleParam = params.get("role") === "therapist" ? "therapist" : "client";
  const [form, setForm] = useState({ email: "", password: "", name: "", role: roleParam });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const user = isLogin
        ? await login(form.email, form.password)
        : await register(form);
      toast.success(isLogin ? "Welcome back" : "Welcome to Kemudi");
      nav(user.role === "therapist" ? "/portal" : "/find");
    } catch (err) {
      const d = err?.response?.data?.detail;
      toast.error(typeof d === "string" ? d : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20" data-testid="auth-page">
      <div className="label text-primary mb-3">{isLogin ? "Welcome back" : "Join Kemudi"}</div>
      <h1 className="font-serif text-4xl tracking-tight mb-2">{isLogin ? "Sign in" : (form.role === "therapist" ? "Grow your practice" : "Create your account")}</h1>
      <p className="text-muted mb-8">{isLogin ? "Continue where you left off." : "Free forever. Upgrade only if you need it."}</p>

      <form onSubmit={submit} className="space-y-4">
        {!isLogin && (
          <>
            <div>
              <label className="label block mb-1 text-muted">Full name</label>
              <input required className="input" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} data-testid="auth-name" />
            </div>
            <div>
              <label className="label block mb-1 text-muted">I am a</label>
              <div className="grid grid-cols-2 gap-2">
                {["client", "therapist"].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setForm({...form, role: r})}
                    className={`p-3 rounded-lg border text-sm transition-colors ${
                      form.role === r ? "border-primary bg-primary/5 text-primary" : "border-line bg-white"
                    }`}
                    data-testid={`role-${r}`}
                  >
                    {r === "client" ? "Looking for care" : "A therapist"}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        <div>
          <label className="label block mb-1 text-muted">Email</label>
          <input required type="email" className="input" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} data-testid="auth-email" />
        </div>
        <div>
          <label className="label block mb-1 text-muted">Password</label>
          <input required minLength={6} type="password" className="input" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} data-testid="auth-password" />
        </div>
        <button className="btn btn-primary w-full" disabled={busy} data-testid="auth-submit">
          {busy ? "…" : (isLogin ? "Sign in" : "Create account")}
        </button>
      </form>

      <p className="text-sm text-muted mt-6 text-center">
        {isLogin ? (
          <>New here? <Link to="/register" className="text-primary hover:underline" data-testid="switch-register">Create an account</Link></>
        ) : (
          <>Have an account? <Link to="/login" className="text-primary hover:underline" data-testid="switch-login">Sign in</Link></>
        )}
      </p>
    </div>
  );
}
