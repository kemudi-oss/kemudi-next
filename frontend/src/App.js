import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth";
import Nav from "./Nav";
import Footer from "./Footer";
import Home from "./pages/Home";
import Find from "./pages/Find";
import TherapistDetail from "./pages/TherapistDetail";
import Compare from "./pages/Compare";
import Quiz from "./pages/Quiz";
import Auth from "./pages/Auth";
import Portal from "./pages/Portal";
import ForTherapists from "./pages/ForTherapists";
import About from "./pages/About";
import { PaymentSuccess, PaymentCancel } from "./pages/Payment";

export default function App() {
  return (
    <AuthProvider>
      <div className="relative min-h-screen flex flex-col" style={{ zIndex: 1 }}>
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/find" element={<Find />} />
            <Route path="/therapist/:id" element={<TherapistDetail />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/for-therapists" element={<ForTherapists />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/register" element={<Auth mode="register" />} />
            <Route path="/portal" element={<Portal />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/cancel" element={<PaymentCancel />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
