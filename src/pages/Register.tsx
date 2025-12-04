// src/pages/Register.tsx
import React, { JSX, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { axiosApi } from "../services/api";
import FancyButton from "../components/FancyButton";

/* ---------------- password helpers ---------------- */
function scorePassword(pw: string) {
  let score = 0;
  if (pw.length >= 8) score += 2;
  if (pw.length >= 12) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return Math.min(score, 6);
}
function strengthLabel(score: number) {
  if (score <= 1) return { label: "Very weak", color: "bg-red-600" };
  if (score === 2) return { label: "Weak", color: "bg-orange-500" };
  if (score === 3) return { label: "Okay", color: "bg-yellow-500" };
  if (score === 4) return { label: "Good", color: "bg-sky-500" };
  if (score >= 5) return { label: "Strong", color: "bg-teal-400" };
  return { label: "—", color: "bg-gray-400" };
}

/* ---------------- page ---------------- */
export default function RegisterPage(): JSX.Element {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPw, setShowPw] = useState(false);
  const pwScore = scorePassword(password);
  const pwStr = strengthLabel(pwScore);

  /* 3D card motion */
  const cardRef = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(mx, { stiffness: 160, damping: 18 });
  const rotX = useSpring(my, { stiffness: 160, damping: 18 });
  const scale = useSpring(1, { stiffness: 180, damping: 20 });

  useEffect(() => {
    return () => {
      mx.set(0);
      my.set(0);
      scale.set(1);
    };
  }, [mx, my, scale]);

  function handlePointerMove(e: React.PointerEvent) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 14;
    const rotateX = (0.5 - py) * 10;
    mx.set(rotateY);
    my.set(rotateX);
    scale.set(1.02);
  }
  function handlePointerLeave() {
    mx.set(0);
    my.set(0);
    scale.set(1);
  }

  useEffect(() => {
    if (error && (email || password)) setError(null);
  }, [email, password, error]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      // use full API path to be explicit
      await axiosApi.post("auth/register", {
        email,
        password,
        full_name: fullName || null,
      });

      // Registration successful — redirect to login (no auto-login)
      navigate("/login", { replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed";
      setError(String(msg));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(1000px 400px at 10% 20%, rgba(6,40,94,0.85), transparent 12%), radial-gradient(800px 350px at 90% 80%, rgba(4,124,128,0.32), transparent 12%), linear-gradient(180deg,#041226 0%, #020816 100%)",
      }}
    >
      {/* animated blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-40 -top-36 w-[720px] h-[720px] rounded-full bg-gradient-to-br from-[#042a6f] to-[#08305a] blur-3xl opacity-60"
        />
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-120px] top-[-80px] w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#0ea5a3] to-[#036b6b] blur-2xl opacity-50"
        />
      </div>

      <div className="relative z-20 w-full max-w-4xl mx-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="hidden md:flex flex-col gap-6 pl-6">
            <motion.img
              src="/Logo.svg"
              alt="S2"
              className="w-24 h-24 rounded-md object-contain"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <div>
              <h1 className="text-5xl font-extrabold text-white leading-tight">Create account</h1>
              <p className="mt-2 text-gray-300 max-w-xs">Start recruiting smarter with S2 — fast parsing, better matches.</p>
            </div>
            <div className="mt-4 text-sm text-gray-400">© {new Date().getFullYear()} S2 Integrators</div>
          </div>

          <div className="mx-auto w-full" style={{ perspective: 1400 }}>
            <motion.div
              ref={cardRef}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              style={{
                rotateY: rotY,
                rotateX: rotX,
                scale: scale,
                transformStyle: "preserve-3d",
              } as any}
              initial={{ opacity: 0, y: 12, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 110, damping: 18 }}
            >
              <div
                className="relative rounded-[20px] p-8"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
                  border: "1px solid rgba(255,255,255,0.06)",
                  backdropFilter: "blur(10px) saturate(120%)",
                  boxShadow: "0 20px 60px rgba(2,6,23,0.7), 0 6px 18px rgba(5,20,40,0.6)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 20,
                    pointerEvents: "none",
                    background:
                      "linear-gradient(120deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005) 30%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0))",
                    mixBlendMode: "overlay",
                    opacity: 0.9,
                  }}
                />

                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0ea5a3] to-[#036b6b] flex items-center justify-center transform translateZ(30px)">
                    <img src="/Logo.svg" alt="logo" className="w-8 h-8 object-contain" />
                  </div>
                  <div className="text-white">
                    <div className="text-lg font-semibold">Create an account</div>
                    <div className="text-sm text-gray-300">Get started with S2 Recruiter</div>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 rounded-md bg-red-800/40 border border-red-700/30 px-4 py-3 text-sm text-red-200 relative z-10">
                    {error}
                  </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4 relative z-10">
                  <label className="block">
                    <span className="text-sm text-gray-300">Full name</span>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe (optional)"
                      className="mt-2 w-full rounded-lg bg-[#061220] border border-white/6 px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0ea5a3]/40"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm text-gray-300">Email</span>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      type="email"
                      required
                      className="mt-2 w-full rounded-lg bg-[#061220] border border-white/6 px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0ea5a3]/40"
                    />
                  </label>

                  <label className="block relative">
                    <span className="text-sm text-gray-300">Password</span>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Choose a strong password"
                        type={showPw ? "text" : "password"}
                        required
                        className="flex-1 rounded-lg bg-[#061220] border border-white/6 px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0ea5a3]/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((s) => !s)}
                        className="p-2 rounded-md bg-white/6 hover:bg-white/8 transition"
                        aria-label={showPw ? "Hide password" : "Show password"}
                      >
                        {showPw ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-100" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M10.58 10.58A3 3 0 0113.42 13.42" />
                            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M2.53 12.53C3.87 8.99 7.2 6.5 12 6.5c1.03 0 2.03.12 2.98.34" />
                            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21.47 11.47C20.13 7.93 16.8 5.44 12 5.44c-1.03 0-2.03.12-2.98.34" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-100" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s4-7.5 9.5-7.5S21.5 12 21.5 12s-4 7.5-9.5 7.5S2.5 12 2.5 12z" />
                          </svg>
                        )}
                      </button>
                    </div>

                    <div className="mt-3">
                      <div className="h-2 w-full bg-white/6 rounded-md overflow-hidden">
                        <div
                          className={`h-2 rounded-md transition-all ${pwStr.color}`}
                          style={{ width: `${(pwScore / 6) * 100}%` }}
                        />
                      </div>
                      <div className="mt-1 text-xs text-gray-300">{pwStr.label}</div>
                    </div>
                  </label>

                  <FancyButton
                    type="submit"
                    variant="primary"
                    disabled={busy}
                    className="w-full"
                  >
                    {busy ? "Creating…" : "Create account"}
                  </FancyButton>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400 relative z-10">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#7dd3fc] hover:underline">
                    Sign in
                  </Link>
                </div>

                <div className="mt-6 text-center text-xs text-gray-500 relative z-10">Secure signup & data encryption</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
