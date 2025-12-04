// src/pages/Login.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { login } from "../services/auth";

export default function LoginPage(): React.ReactNode {
  const navigate = useNavigate();
  const loc = useLocation();
  const from = (loc.state as any)?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPw, setShowPw] = useState(false);

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
    mx.set((px - 0.5) * 14);
    my.set((0.5 - py) * 10);
    scale.set(1.02);
  }
  function handlePointerLeave() {
    mx.set(0);
    my.set(0);
    scale.set(1);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (e: any) {
      setErr(e?.response?.data?.detail || e?.message || "Sign in failed");
    } finally {
      setBusy(false);
    }
  }

  const bgLayerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function onMove(e: MouseEvent) {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const nx = (e.clientX / w - 0.5) * 2;
      const ny = (e.clientY / h - 0.5) * 2;
      if (bgLayerRef.current) {
        bgLayerRef.current.style.setProperty("--px", String(nx));
        bgLayerRef.current.style.setProperty("--py", String(ny));
      }
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      className="app-fullscreen flex items-center justify-center overflow-hidden"
      style={{
        /* kept inline gradient (visual) but the global background prevents white showing */
        background:
          "radial-gradient(1000px 400px at 10% 20%, rgba(6,40,94,0.85), transparent 12%), \
           radial-gradient(800px 350px at 90% 80%, rgba(4,124,128,0.32), transparent 12%), \
           linear-gradient(180deg,#041226 0%, #020816 100%)",
      }}
    >
      <div
        ref={bgLayerRef}
        className="absolute inset-0 pointer-events-none"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          animate={{ opacity: [0.9, 0.7, 0.9] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-40 -top-32 w-[720px] h-[720px] rounded-full bg-gradient-to-br from-[#042a6f] to-[#08305a] blur-3xl opacity-60"
          style={{ transform: "translateZ(-30px)", mixBlendMode: "screen" }}
        />
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[-120px] top-[-80px] w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#0ea5a3] to-[#036b6b] blur-2xl opacity-50"
          style={{ mixBlendMode: "screen" }}
        />
        <motion.div
          animate={{ x: [-20, 20, -20] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[-60px] bottom-[-90px] w-[360px] h-[360px] rounded-full bg-gradient-to-br from-[#4f46e5] to-[#06b6d4] blur-xl opacity-45"
          style={{ mixBlendMode: "screen" }}
        />
      </div>

      <div className="relative z-20 w-full max-w-4xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="hidden md:flex flex-col gap-6 pl-6">
            <motion.img
              src="/Logo.svg"
              alt="S2"
              className="w-24 h-24 rounded-md object-contain"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <div>
              <h1 className="text-5xl font-extrabold text-white leading-tight">Welcome back</h1>
              <p className="mt-2 text-gray-300 max-w-xs">
                Sign in to continue to S2 Recruiter — smarter hiring, faster decisions.
              </p>
            </div>
            <div className="mt-4 text-sm text-gray-400">© {new Date().getFullYear()} S2 Integrators</div>
          </div>

          <div className="mx-auto w-full" style={{ perspective: 1400 }}>
            <motion.div
              ref={cardRef}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerLeave}
              style={{ rotateY: rotY, rotateX: rotX, scale: scale, transformStyle: "preserve-3d" } as any}
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
                }}
              >
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0ea5a3] to-[#036b6b] flex items-center justify-center">
                    <img src="/Logo.svg" alt="logo" className="w-8 h-8 object-contain" />
                  </div>
                  <div className="text-white">
                    <div className="text-lg font-semibold">Sign in</div>
                    <div className="text-sm text-gray-300">Enter your credentials to continue</div>
                  </div>
                </div>

                {err && <div className="mb-4 rounded-md bg-red-800/40 border border-red-700/30 px-4 py-3 text-sm text-red-200">{err}</div>}

                <form onSubmit={submit} className="space-y-4 relative z-10">
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

                  <label className="block">
                    <span className="text-sm text-gray-300">Password</span>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        type={showPw ? "text" : "password"}
                        required
                        className="flex-1 rounded-lg bg-[#061220] border border-white/6 px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0ea5a3]/40"
                      />
                      <button type="button" onClick={() => setShowPw(s => !s)} className="p-2 rounded-md bg-white/6 hover:bg-white/8 transition">
                        {/* eye icons omitted for brevity - use your existing svgs */}
                        {showPw ? "Hide" : "Show"}
                      </button>
                    </div>
                  </label>

                  <div className="flex items-center justify-between text-sm text-gray-300">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-[#0ea5a3]" />
                      <span>Remember me</span>
                    </label>
                    <Link to="/forgot" className="text-[#7dd3fc] hover:underline">Forgot?</Link>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.995 }}
                    type="submit"
                    disabled={busy}
                    className={`w-full mt-2 py-3 rounded-xl font-semibold text-white transition-shadow ${busy ? "bg-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-[#4f46e5] to-[#06b6d4] shadow-lg hover:shadow-2xl"}`}
                  >
                    {busy ? "Signing in…" : "Sign in"}
                  </motion.button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                  New here? <Link to="/register" className="text-[#7dd3fc] hover:underline">Create an account</Link>
                </div>

                <div className="mt-6 text-center text-xs text-gray-500">Secure video powered by Jitsi</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
