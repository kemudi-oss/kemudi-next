import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./auth";
import { Menu, X } from "lucide-react";

export default function Nav() {
  const { user, logout } = useAuth();
  const [open, setOpen] = React.useState(false);
  const nav = useNavigate();
  const loc = useLocation();

  const dashHref = user ? (user.role === "therapist" ? "/portal" : "/find") : "/login";

  const NavLink = ({ to, children, testid }) => (
    <Link
      to={to}
      data-testid={testid}
      className={`text-sm font-medium tracking-wide transition-colors ${
        loc.pathname === to ? "text-primary" : "text-ink/80 hover:text-primary"
      }`}
      onClick={() => setOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <header
      className="sticky top-0 z-40 border-b border-line/60"
      style={{ background: "#F9F6F0" }}
      data-testid="app-header"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" data-testid="brand-home-link">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-serif text-lg leading-none">k</span>
          </div>
          <span className="font-serif text-2xl leading-none tracking-tight">Kemudi</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/find" testid="nav-find">Find a therapist</NavLink>
          <NavLink to="/quiz" testid="nav-quiz">Match quiz</NavLink>
          <NavLink to="/for-therapists" testid="nav-therapists">For therapists</NavLink>
          <NavLink to="/about" testid="nav-about">About</NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to={dashHref} className="btn btn-ghost" data-testid="nav-dashboard">
                {user.role === "therapist" ? "Portal" : "My matches"}
              </Link>
              <button onClick={() => { logout(); nav("/"); }} className="btn btn-primary" data-testid="nav-logout">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" data-testid="nav-login">Sign in</Link>
              <Link to="/register?role=therapist" className="btn btn-primary" data-testid="nav-therapist-signup">
                Therapist sign up
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          data-testid="mobile-menu-toggle"
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line/60 px-6 py-5 flex flex-col gap-4">
          <NavLink to="/find" testid="m-nav-find">Find a therapist</NavLink>
          <NavLink to="/quiz" testid="m-nav-quiz">Match quiz</NavLink>
          <NavLink to="/for-therapists" testid="m-nav-therapists">For therapists</NavLink>
          <NavLink to="/about" testid="m-nav-about">About</NavLink>
          {user ? (
            <>
              <Link to={dashHref} className="btn btn-ghost" onClick={() => setOpen(false)}>Dashboard</Link>
              <button onClick={() => { logout(); setOpen(false); nav("/"); }} className="btn btn-primary">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" onClick={() => setOpen(false)}>Sign in</Link>
              <Link to="/register?role=therapist" className="btn btn-primary" onClick={() => setOpen(false)}>Therapist sign up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
