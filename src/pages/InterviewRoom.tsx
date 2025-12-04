// // src/pages/InterviewRoom.tsx

// import React, { useState } from "react";
// import { useParams } from "react-router-dom";

// const InterviewRoom: React.FC = () => {
//   const { roomId } = useParams<{ roomId: string }>();
//   const [loading, setLoading] = useState(false);

//   const handleJoin = () => {
//     if (!roomId) return;
//     setLoading(true);

//     setTimeout(() => {
//       window.location.href = `https://meet.jit.si/${roomId}`;
//     }, 900);
//   };

//   const safeRoomLabel = roomId || "S2 Interview Room";

//   return (
//     <>
//       <div className="s2-room-root">
//         {/* Floating background blobs */}
//         <div className="s2-room-blob s2-room-blob-1" />
//         <div className="s2-room-blob s2-room-blob-2" />
//         <div className="s2-room-blob s2-room-blob-3" />

//         {/* HEADER */}
//         <header className="s2-room-header">
//           <div className="s2-logo">
//             <span className="s2-logo-mark">S2</span>
//             <div className="s2-logo-text">
//               <span className="s2-logo-name">Integrators</span>
//               <span className="s2-logo-tagline">Empowering Innovation</span>
//             </div>
//           </div>

//           <div className="s2-header-chip">
//             <span className="s2-chip-dot" />
//             AI Interview Session
//           </div>
//         </header>

//         {/* MAIN CONTENT */}
//         <main className="s2-room-main">
//           <section className="s2-room-card">
//             {/* Top badge */}
//             <div className="s2-room-badge">
//               <span className="s2-room-badge-dot" />
//               Waiting lobby
//             </div>

//             {/* Avatar / icon */}
//             <div className="s2-avatar">
//               <span className="s2-avatar-initial">
//                 {safeRoomLabel.trim().charAt(0).toUpperCase()}
//               </span>
//             </div>

//             {/* Titles */}
//             <h1 className="s2-room-title">Asking to join meeting…</h1>
//             <h2 className="s2-room-subtitle">{safeRoomLabel}</h2>

//             {/* Status text */}
//             <p className="s2-room-text">
//               The conference has not started yet because no moderators have
//               joined.
//               <br />
//               Please wait for the interviewer or join the meeting using the
//               button below.
//             </p>

//             {/* Loading animation */}
//             {loading && (
//               <div className="s2-loader-wrapper">
//                 <div className="s2-loader-orbit">
//                   <span className="s2-dot s2-dot-1" />
//                   <span className="s2-dot s2-dot-2" />
//                   <span className="s2-dot s2-dot-3" />
//                 </div>
//                 <div className="s2-loader-text">Connecting to meeting…</div>
//               </div>
//             )}

//             {/* Join button */}
//             {!loading && (
//               <button
//                 onClick={handleJoin}
//                 className="s2-join-btn"
//                 disabled={!roomId}
//               >
//                 Join Meeting
//               </button>
//             )}

//             {/* Helper text */}
//             <p className="s2-help-text">
//               Use a modern browser (Chrome / Edge / Firefox) and ensure your
//               camera & microphone are enabled.
//             </p>
//           </section>
//         </main>

//         {/* FOOTER */}
//         <footer className="s2-room-footer">
//           <span>
//             © {new Date().getFullYear()} S2 Integrators · AI Hiring Platform
//           </span>
//           <span className="s2-footer-right">
//             Secure video powered by Jitsi · Encrypted connection
//           </span>
//         </footer>
//       </div>

//       {/* STYLES & ANIMATIONS */}
//       <style>{`
//         .s2-room-root {
//           height: 100vh;
//           width: 100vw;
//           overflow: hidden;
//           position: relative;
//           display: flex;
//           flex-direction: column;
//           background: radial-gradient(circle at top left, #2848ff 0, #050816 40%, #040b1a 100%);
//           color: #ffffff;
//           font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif;
//           animation: s2-fade-in 0.7s ease-out;
//         }

//         /* Background blobs */
//         .s2-room-blob {
//           position: absolute;
//           width: 320px;
//           height: 320px;
//           border-radius: 999px;
//           filter: blur(55px);
//           opacity: 0.25;
//           z-index: 0;
//           pointer-events: none;
//         }
//         .s2-room-blob-1 {
//           top: -80px;
//           left: -40px;
//           background: #315bff;
//           animation: s2-blob-move 18s ease-in-out infinite alternate;
//         }
//         .s2-room-blob-2 {
//           bottom: -60px;
//           right: -80px;
//           background: #00b4ff;
//           animation: s2-blob-move 22s ease-in-out infinite alternate-reverse;
//         }
//         .s2-room-blob-3 {
//           top: 40%;
//           left: 60%;
//           width: 220px;
//           height: 220px;
//           background: #7c3aed;
//           animation: s2-blob-move 26s ease-in-out infinite alternate;
//         }

//         /* HEADER */
//         .s2-room-header {
//           position: relative;
//           z-index: 2;
//           padding: 20px 32px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           border-bottom: 1px solid rgba(255,255,255,0.08);
//           background: linear-gradient(to bottom, rgba(6,16,48,0.92), rgba(6,16,48,0.72));
//           backdrop-filter: blur(14px);
//           animation: s2-slide-down 0.7s ease-out;
//         }

//         .s2-logo {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//         }
//         .s2-logo-mark {
//           background: linear-gradient(135deg,#3b82f6,#22c1c3);
//           border-radius: 12px;
//           padding: 9px 12px;
//           font-weight: 800;
//           font-size: 18px;
//           letter-spacing: 0.5px;
//           box-shadow: 0 8px 20px rgba(37, 99, 235, 0.5);
//         }
//         .s2-logo-text {
//           display: flex;
//           flex-direction: column;
//           gap: 1px;
//         }
//         .s2-logo-name {
//           font-weight: 700;
//           font-size: 20px;
//           letter-spacing: 0.8px;
//         }
//         .s2-logo-tagline {
//           font-size: 12px;
//           opacity: 0.8;
//         }

//         .s2-header-chip {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           font-size: 13px;
//           padding: 6px 12px;
//           border-radius: 999px;
//           background: rgba(15,118,255,0.22);
//           border: 1px solid rgba(96,165,250,0.45);
//           box-shadow: 0 0 0 1px rgba(15,23,42,0.4);
//         }
//         .s2-chip-dot {
//           width: 7px;
//           height: 7px;
//           border-radius: 999px;
//           background: #22c55e;
//           box-shadow: 0 0 12px #22c55e;
//           animation: s2-pulse 1.2s ease-in-out infinite;
//         }

//         /* MAIN */
//         .s2-room-main {
//           flex: 1;
//           position: relative;
//           z-index: 1;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 20px;
//         }

//         .s2-room-card {
//           width: 100%;
//           max-width: 560px;
//           background: radial-gradient(circle at top left, rgba(59,130,246,0.28), rgba(15,23,42,0.92));
//           border-radius: 26px;
//           padding: 34px 30px 30px;
//           border: 1px solid rgba(148,163,184,0.3);
//           box-shadow:
//             0 18px 45px rgba(15,23,42,0.85),
//             0 0 0 1px rgba(15,23,42,0.7);
//           backdrop-filter: blur(20px);
//           text-align: center;
//           animation: s2-pop-up 0.8s ease-out;
//         }

//         .s2-room-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           padding: 4px 10px;
//           border-radius: 999px;
//           border: 1px solid rgba(148,163,184,0.45);
//           background: rgba(15,23,42,0.8);
//           font-size: 11px;
//           text-transform: uppercase;
//           letter-spacing: 1.2px;
//           margin-bottom: 18px;
//         }
//         .s2-room-badge-dot {
//           width: 6px;
//           height: 6px;
//           border-radius: 999px;
//           background: #facc15;
//           box-shadow: 0 0 10px rgba(250,204,21,0.85);
//         }

//         .s2-avatar {
//           width: 78px;
//           height: 78px;
//           border-radius: 50%;
//           margin: 0 auto 18px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: conic-gradient(from 180deg,#3b82f6,#a855f7,#22c55e,#3b82f6);
//           padding: 2px;
//           box-shadow:
//             0 0 0 1px rgba(15,23,42,0.6),
//             0 18px 30px rgba(15,23,42,0.8);
//           animation: s2-rotate-slow 10s linear infinite;
//         }
//         .s2-avatar-initial {
//           width: 100%;
//           height: 100%;
//           border-radius: 50%;
//           background: radial-gradient(circle at 30% 30%, #111827, #020617);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 30px;
//           font-weight: 700;
//         }

//         .s2-room-title {
//           margin: 4px 0 4px;
//           font-size: 20px;
//           font-weight: 600;
//         }
//         .s2-room-subtitle {
//           margin: 0 0 16px;
//           font-size: 15px;
//           opacity: 0.9;
//         }

//         .s2-room-text {
//           font-size: 14px;
//           line-height: 1.7;
//           opacity: 0.88;
//           margin-bottom: 22px;
//         }

//         /* Loader */
//         .s2-loader-wrapper {
//           margin-bottom: 26px;
//         }
//         .s2-loader-orbit {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           gap: 8px;
//           margin-bottom: 10px;
//         }
//         .s2-dot {
//           width: 9px;
//           height: 9px;
//           border-radius: 999px;
//           background: #93c5fd;
//           opacity: 0.7;
//           animation: s2-bounce 1.1s infinite ease-in-out;
//         }
//         .s2-dot-2 {
//           animation-delay: 0.15s;
//         }
//         .s2-dot-3 {
//           animation-delay: 0.3s;
//         }
//         .s2-loader-text {
//           font-size: 13px;
//           opacity: 0.9;
//         }

//         /* Join button */
//         .s2-join-btn {
//           width: 100%;
//           border: none;
//           outline: none;
//           margin-top: 4px;
//           padding: 14px 18px;
//           border-radius: 999px;
//           font-size: 16px;
//           font-weight: 650;
//           cursor: pointer;
//           color: #ffffff;
//           background: linear-gradient(135deg,#2563eb,#4f46e5,#22c1c3);
//           background-size: 200% 200%;
//           box-shadow:
//             0 10px 25px rgba(37,99,235,0.6),
//             0 0 0 1px rgba(15,23,42,0.8);
//           transition: transform 0.18s ease, box-shadow 0.18s ease, background-position 0.6s ease;
//           text-shadow: 0 1px 2px rgba(15,23,42,0.7);
//         }
//         .s2-join-btn:hover {
//           transform: translateY(-1px) scale(1.02);
//           background-position: 100% 0%;
//           box-shadow:
//             0 14px 30px rgba(37,99,235,0.8),
//             0 0 0 1px rgba(129,140,248,0.7);
//         }
//         .s2-join-btn:active {
//           transform: translateY(0) scale(0.99);
//           box-shadow:
//             0 8px 18px rgba(15,23,42,0.9),
//             0 0 0 1px rgba(15,23,42,0.9);
//         }
//         .s2-join-btn:disabled {
//           opacity: 0.5;
//           cursor: not-allowed;
//           box-shadow: none;
//         }

//         .s2-help-text {
//           margin-top: 16px;
//           font-size: 12px;
//           opacity: 0.78;
//         }

//         /* FOOTER */
//         .s2-room-footer {
//           position: relative;
//           z-index: 1;
//           padding: 10px 22px;
//           font-size: 12px;
//           color: rgba(226,232,240,0.9);
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           border-top: 1px solid rgba(148,163,184,0.3);
//           background: radial-gradient(circle at top, rgba(15,23,42,0.92), rgba(2,6,23,0.96));
//         }
//         .s2-footer-right {
//           opacity: 0.78;
//         }

//         /* ANIMATIONS */
//         @keyframes s2-fade-in {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes s2-slide-down {
//           from { opacity: 0; transform: translateY(-18px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes s2-pop-up {
//           from { opacity: 0; transform: translateY(18px) scale(0.96); }
//           to { opacity: 1; transform: translateY(0) scale(1); }
//         }
//         @keyframes s2-blob-move {
//           from { transform: translate3d(0,0,0) scale(1); }
//           to { transform: translate3d(40px, -30px,0) scale(1.1); }
//         }
//         @keyframes s2-pulse {
//           0%, 100% { transform: scale(1); opacity: 1; }
//           50% { transform: scale(1.4); opacity: 0.6; }
//         }
//         @keyframes s2-bounce {
//           0%, 80%, 100% { transform: scale(0.8); opacity: 0.6; }
//           40% { transform: scale(1.2); opacity: 1; }
//         }
//         @keyframes s2-rotate-slow {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }

//         /* RESPONSIVE */
//         @media (max-width: 640px) {
//           .s2-room-header {
//             padding: 14px 16px;
//           }
//           .s2-logo-name {
//             font-size: 17px;
//           }
//           .s2-room-card {
//             padding: 26px 20px 24px;
//           }
//           .s2-room-footer {
//             flex-direction: column;
//             gap: 4px;
//             text-align: center;
//           }
//         }
//       `}</style>
//     </>
//   );
// };

// export default InterviewRoom;



// // new code 03-12-2025

// // src/pages/InterviewRoom.tsx
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { apiBase } from "../services/env";

// type RoomStatus = {
//   room_name: string;
//   hr_accepted: boolean;
//   ai_accepted: boolean;
//   meeting_active: boolean;
//   meeting_url?: string | null;
//   created_at: string;
//   updated_at: string;
// };

// const POLL_INTERVAL_MS = 7000;

// /**
//  * Try a primary URL and if it returns 404 or network error, try fallback.
//  */
// async function fetchWithFallback<T>(primary: string, fallback: string): Promise<Response> {
//   try {
//     const r = await fetch(primary);
//     if (r.ok || r.status !== 404) return r; // return even non-200 so caller can inspect
//   } catch (err) {
//     // swallow and try fallback
//   }
//   return fetch(fallback);
// }

// const InterviewRoom: React.FC = () => {
//   const { roomId } = useParams<{ roomId: string }>();
//   const [status, setStatus] = useState<RoomStatus | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const base = (apiBase && typeof apiBase === "function" ? apiBase() : "") || "";
//   const safeRoomLabel = roomId || "S2 Interview Room";

//   async function fetchStatus() {
//     if (!roomId) {
//       setError("Missing room id");
//       setLoading(false);
//       return;
//     }
//     setError(null);
//     setLoading(true);

//     // two candidate URLs:
//     const urlWithApi = `${base}/api/interview-access/status/${encodeURIComponent(roomId)}`;
//     const urlNoApi = `${base}/interview-access/status/${encodeURIComponent(roomId)}`;

//     try {
//       const res = await fetchWithFallback(urlWithApi, urlNoApi);
//       if (res.status === 404) {
//         setError("Interview room not found (404). Backend route may be at /interview-access/* (no /api) or vice versa.");
//         setLoading(false);
//         return;
//       }
//       if (!res.ok) {
//         const txt = await res.text().catch(() => "");
//         throw new Error(`Status ${res.status} ${txt}`);
//       }
//       const data: RoomStatus = await res.json();
//       setStatus(data);
//       setLoading(false);
//       if (data.meeting_active && data.meeting_url) {
//         window.location.href = data.meeting_url;
//       }
//     } catch (err: any) {
//       console.error("fetchStatus error:", err);
//       setError(String(err?.message || err));
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchStatus();
//     const id = setInterval(fetchStatus, POLL_INTERVAL_MS);
//     return () => clearInterval(id);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [roomId]);

//   return (
//     <>
//       <div className="s2-room-root">
//         {/* keep your existing header / layout */}
//         <header className="s2-room-header">
//           <div className="s2-logo">
//             <span className="s2-logo-mark">S2</span>
//             <div className="s2-logo-text">
//               <span className="s2-logo-name">Integrators</span>
//               <span className="s2-logo-tagline">Empowering Innovation</span>
//             </div>
//           </div>

//           <div className="s2-header-chip">
//             <span className="s2-chip-dot" />
//             AI Interview Session
//           </div>
//         </header>

//         <main className="s2-room-main">
//           <section className="s2-room-card">
//             <div className="s2-room-badge">
//               <span className="s2-room-badge-dot" />
//               Waiting lobby
//             </div>

//             <div className="s2-avatar">
//               <span className="s2-avatar-initial">{safeRoomLabel.trim().charAt(0).toUpperCase()}</span>
//             </div>

//             <h1 className="s2-room-title">{status?.meeting_active ? "Joining meeting…" : "Asking to join meeting…"}</h1>
//             <h2 className="s2-room-subtitle">{safeRoomLabel}</h2>

//             <p className="s2-room-text">
//               The conference has not started yet because moderators haven't accepted.
//               <br />
//               This page is a waiting lobby — you will be redirected automatically once HR and AI accept.
//             </p>

//             {loading && <div className="s2-loader-text">Loading status…</div>}

//             {error && (
//               <div style={{ color: "#ff8b8b", marginTop: 12 }}>
//                 <strong>{error}</strong>
//                 <div style={{ marginTop: 6, fontSize: 13 }}>
//                   Quick checks: is backend running and are routes mounted? (Try the backend status endpoint in browser.)
//                 </div>
//               </div>
//             )}

//             {!status && !loading && !error && <div className="s2-help-text">Waiting for status…</div>}

//             <p className="s2-help-text">
//               Use a modern browser (Chrome / Edge / Firefox) and ensure your camera & microphone are enabled.
//             </p>
//           </section>
//         </main>

//         <footer className="s2-room-footer">
//           <span>© {new Date().getFullYear()} S2 Integrators · AI Hiring Platform</span>
//           <span className="s2-footer-right">Secure video powered by Jitsi · Encrypted connection</span>
//         </footer>
//       </div>

//       {/* keep your existing styles (you can paste your old CSS block here) */}
//       <style>{`/* keep your InterviewRoom styles here (unchanged) */`}</style>
//     </>
//   );
// };

// export default InterviewRoom;



// src/pages/InterviewRoom.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiBase } from "../services/env";

type RoomStatus = {
  room_name: string;
  hr_accepted: boolean;
  ai_accepted: boolean;
  meeting_active: boolean;
  meeting_url?: string | null;
  created_at?: string;
  updated_at?: string;
};

const POLL_INTERVAL_MS = 7000;

/** Try primary then fallback URL (works with or without /api prefix) */
async function fetchWithFallback(primary: string, fallback: string, opts?: RequestInit) {
  try {
    const r = await fetch(primary, opts);
    // if primary exists and is not 404 return it (even if 500)
    if (r.status !== 404) return r;
  } catch {
    // ignore and try fallback
  }
  return fetch(fallback, opts);
}

/**
 * Candidate waiting page — HR-only approval required (AI acceptance no longer required)
 * - on mount: call status/{room} to create/refresh DB row
 * - poll backend: when hr_accepted === true => redirect candidate to Jitsi
 */
const InterviewRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [status, setStatus] = useState<RoomStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const base = (apiBase && typeof apiBase === "function" ? apiBase() : "") || "";
  const roomLabel = roomId || "S2 Interview Room";

  async function fetchStatus() {
    if (!roomId) {
      setError("Missing room id");
      setLoading(false);
      return;
    }

    setError(null);
    setLoading(true);

    const primary = `${base}/api/interview-access/status/${encodeURIComponent(roomId)}`;
    const fallback = `${base}/interview-access/status/${encodeURIComponent(roomId)}`;

    try {
      const res = await fetchWithFallback(primary, fallback);
      if (res.status === 404) {
        setError("Interview room not found (404).");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Server returned ${res.status} ${txt}`);
      }
      const data: RoomStatus = await res.json();
      setStatus(data);
      setLoading(false);

      // --- NEW: Redirect as soon as HR accepts (no AI dependency) ---
      if (data.hr_accepted) {
        // Use backend-provided meeting_url when available, otherwise build Jitsi URL on the fly.
        const destination = data.meeting_url || `https://meet.jit.si/${encodeURIComponent(roomId)}`;
        // replace (so back button does not come back to waiting page)
        window.location.replace(destination);
      }
      // -----------------------------------------------------------------

      // If backend sets meeting_active and meeting_url, we also redirect (redundant)
      if (data.meeting_active && data.meeting_url) {
        window.location.replace(data.meeting_url);
      }
    } catch (err: any) {
      console.error("fetchStatus error:", err);
      setError(String(err?.message || err));
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial registration + polling
    fetchStatus();
    const id = setInterval(fetchStatus, POLL_INTERVAL_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return (
    <>
      <div className="s2-room-root">
        <div className="s2-room-blob s2-room-blob-1" />
        <div className="s2-room-blob s2-room-blob-2" />
        <div className="s2-room-blob s2-room-blob-3" />

        <header className="s2-room-header">
          <div className="s2-logo">
            <span className="s2-logo-mark">S2</span>
            <div className="s2-logo-text">
              <span className="s2-logo-name">Integrators</span>
              <span className="s2-logo-tagline">Empowering Innovation</span>
            </div>
          </div>

          <div className="s2-header-chip">
            <span className="s2-chip-dot" />
            AI Interview Session
          </div>
        </header>

        <main className="s2-room-main">
          <section className="s2-room-card">
            <div className="s2-room-badge">
              <span className="s2-room-badge-dot" />
              Waiting lobby
            </div>

            <div className="s2-avatar">
              <span className="s2-avatar-initial">{roomLabel.trim().charAt(0).toUpperCase()}</span>
            </div>

            <h1 className="s2-room-title">{status?.meeting_active ? "Joining meeting…" : "Asking to join meeting…"}</h1>
            <h2 className="s2-room-subtitle">{roomLabel}</h2>

            <p className="s2-room-text">
              The conference has not started yet because moderators haven't accepted.
              <br />
              Your request has been recorded. Please wait — you will be redirected automatically when HR accepts.
            </p>

            {loading && (
              <div className="s2-loader-wrapper">
                <div className="s2-loader-orbit">
                  <span className="s2-dot s2-dot-1" />
                  <span className="s2-dot s2-dot-2" />
                  <span className="s2-dot s2-dot-3" />
                </div>
                <div className="s2-loader-text">Waiting for HR approval…</div>
              </div>
            )}

            {!loading && status && (
              <div style={{ marginTop: 12, fontSize: 14 }}>
                <div style={{ color: "#9fb0ff" }}>
                  HR: {status.hr_accepted ? "Accepted" : "Waiting"} {status.ai_accepted ? " · AI: Accepted" : ""}
                </div>
                {!status.hr_accepted && (
                  <div style={{ marginTop: 8, fontSize: 13, color: "#cbd5e1" }}>
                    Please wait — HR will accept the meeting when ready.
                  </div>
                )}
              </div>
            )}

            {error && (
              <div style={{ marginTop: 12, color: "#ff9b9b" }}>
                <strong>Error: {error}</strong>
                <div style={{ marginTop: 6, fontSize: 13 }}>
                  Quick check: is the backend running and reachable? Try calling the status endpoint in a browser.
                </div>
              </div>
            )}

            <p className="s2-help-text">
              Use a modern browser (Chrome / Edge / Firefox). Camera & microphone will be requested when the meeting opens.
            </p>
          </section>
        </main>

        <footer className="s2-room-footer">
          <span>© {new Date().getFullYear()} S2 Integrators · AI Hiring Platform</span>
          <span className="s2-footer-right">Secure video powered by Jitsi · Encrypted connection</span>
        </footer>
      </div>

      {/* Minimal styles (keeps existing look; you can keep your full CSS block here) */}
      <style>{`
        .s2-room-root { height:100vh; width:100vw; overflow:hidden; position:relative; display:flex; flex-direction:column; background: radial-gradient(circle at top left,#2848ff 0,#050816 40%, #040b1a 100%); color:#fff; font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif; }
        .s2-room-blob{ position:absolute; width:320px; height:320px; border-radius:999px; filter: blur(55px); opacity:0.25; z-index:0; pointer-events:none; }
        .s2-room-blob-1{ top:-80px; left:-40px; background:#315bff; }
        .s2-room-blob-2{ bottom:-60px; right:-80px; background:#00b4ff; }
        .s2-room-blob-3{ top:40%; left:60%; width:220px; height:220px; background:#7c3aed; }
        .s2-room-header{ z-index:2; padding:20px 32px; display:flex; align-items:center; justify-content:space-between; background:linear-gradient(to bottom, rgba(6,16,48,0.92), rgba(6,16,48,0.72)); }
        .s2-room-main{ flex:1; display:flex; align-items:center; justify-content:center; padding:20px; }
        .s2-room-card{ width:100%; max-width:560px; background: radial-gradient(circle at top left, rgba(59,130,246,0.28), rgba(15,23,42,0.92)); border-radius:26px; padding:34px 30px 30px; text-align:center; }
        .s2-room-badge{ display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:999px; background: rgba(15,23,42,0.8); margin-bottom:18px; }
        .s2-avatar{ width:78px; height:78px; border-radius:50%; margin:0 auto 18px; display:flex; align-items:center; justify-content:center; background: conic-gradient(from 180deg,#3b82f6,#a855f7,#22c55e,#3b82f6); padding:2px; }
        .s2-avatar-initial{ width:100%; height:100%; border-radius:50%; background: radial-gradient(circle at 30% 30%, #111827, #020617); display:flex; align-items:center; justify-content:center; font-size:30px; font-weight:700; }
        .s2-room-title{ margin:4px 0 4px; font-size:20px; font-weight:600; }
        .s2-room-subtitle{ margin:0 0 16px; font-size:15px; opacity:0.9; }
        .s2-room-text{ font-size:14px; line-height:1.7; opacity:0.88; margin-bottom:22px; }
        .s2-loader-wrapper{ margin-bottom:26px; }
        .s2-loader-orbit{ display:flex; justify-content:center; align-items:center; gap:8px; margin-bottom:10px; }
        .s2-dot{ width:9px; height:9px; border-radius:999px; background:#93c5fd; opacity:0.7; animation: s2-bounce 1.1s infinite ease-in-out; }
        .s2-loader-text{ font-size:13px; opacity:0.9; }
        .s2-help-text{ margin-top:16px; font-size:12px; opacity:0.78; }
        .s2-room-footer{ padding:10px 22px; font-size:12px; color: rgba(226,232,240,0.9); display:flex; justify-content:space-between; align-items:center; background: radial-gradient(circle at top, rgba(15,23,42,0.92), rgba(2,6,23,0.96)); }
        @keyframes s2-bounce { 0%,80%,100%{ transform: scale(0.8); opacity:0.6 } 40%{ transform: scale(1.2); opacity:1 } }
      `}</style>
    </>
  );
};

export default InterviewRoom;
