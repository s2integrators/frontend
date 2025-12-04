// // src/components/CandidateCard.tsx
// import React, { useState } from "react";
// import MatchDetailsModal from "./MatchDetailsModal";
// import type { MatchBreakdown } from "../services/match";
// import { postJSON } from "../services/api";

// type Person = {
//   id?: string | number;
//   name?: string;
//   role?: string;
//   initials?: string;
//   score?: number | null;
//   years?: number | null;
//   updated?: string;
//   badge?: string;
//   tags?: string[];
//   education?: number | null;
//   raw_text?: string | null;
//   bestRoleTitle?: string | null;
//   breakdown?: MatchBreakdown | null;
//   details?: Record<string, number> | null;
// };  

// type Props =
//   | { person: Person; candidate?: never }
//   | { candidate: Person; person?: never }
//   | { person?: Person; candidate?: Person };

// export default function CandidateCard(props: Props) {
//   const p: Person = (props as any).person || (props as any).candidate || {};
//   const [showDetails, setShowDetails] = useState(false);
//   const [openInterview, setOpenInterview] = useState(false);

//   const [interviewDate, setInterviewDate] = useState("");
//   const [interviewTime, setInterviewTime] = useState("");
//   const [generatedLink, setGeneratedLink] = useState<string | null>(null);

//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState<string | null>(null);
//   const [err, setErr] = useState<string | null>(null);

//   const name = p.name || "Candidate";
//   const initials =
//     p.initials ||
//     name
//       .split(" ")
//       .filter(Boolean)
//       .map((s) => s[0])
//       .slice(0, 2)
//       .join("")
//       .toUpperCase();

//   const years = Number.isFinite(p.years as number) ? (p.years as number) : 0;
//   const score = typeof p.score === "number" ? Math.round(p.score as number) : null;
//   const tags = Array.isArray(p.tags) ? p.tags : [];

//   async function sendInterviewMail(e: React.FormEvent) {
//     e.preventDefault();
//     setErr(null);
//     setMsg(null);
//     setGeneratedLink(null);

//     // Validation
//     if (!p.id) {
//       setErr("Missing resume ID.");
//       return;
//     }
//     if (!interviewDate || !interviewTime) {
//       setErr("Please fill date and time.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await postJSON(
//         `/interview/schedule/${encodeURIComponent(String(p.id))}`,
//         {
//           interview_date: interviewDate,
//           interview_time: interviewTime,
//         }
//       );

//       setMsg(response.message || "Interview email sent successfully!");
//       setGeneratedLink(response.meeting_link);
      
//       // Close modal after showing success for 2 seconds
//       setTimeout(() => {
//         handleCloseModal();
//       }, 2000);
      
//     } catch (error: any) {
//       setErr(error?.message || "Failed to send interview email. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   function handleCloseModal() {
//     setOpenInterview(false);
//     setErr(null);
//     setMsg(null);
//     setGeneratedLink(null);
//     setInterviewDate("");
//     setInterviewTime("");
//   }

//   return (
//     <>
//       <div className="card p-4 flex flex-col gap-3">
//         {score !== null && (
//           <div className="absolute right-3 top-3">
//             <span className="px-2 py-1 rounded-xl bg-blue-600 text-white text-xs font-semibold">
//               {score}% match
//             </span>
//           </div>
//         )}

//         <div className="flex items-start justify-between">
//           <div className="flex items-center gap-3">
//             <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-semibold">
//               {initials}
//             </div>

//             <div>
//               <div className="font-semibold">{name}</div>
//               <div className="text-xs text-[var(--muted)]">
//                 {years} years • {p.role || "—"}
//               </div>
//             </div>
//           </div>
//         </div>

//         {score !== null && (
//           <div className="mt-1">
//             <div className="h-2 w-full rounded bg-slate-200">
//               <div className="h-2 rounded bg-blue-600" style={{ width: `${score}%` }} />
//             </div>
//             <div className="mt-1 text-xs text-[var(--muted)]">
//               {p.bestRoleTitle ? (
//                 <>
//                   Best role: <span className="font-medium">{p.bestRoleTitle}</span>
//                 </>
//               ) : (
//                 "—"
//               )}
//             </div>
//           </div>
//         )}

//         {tags.length > 0 && (
//           <div className="flex flex-wrap gap-1">
//             {tags.slice(0, 6).map((t) => (
//               <span
//                 key={t}
//                 className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
//               >
//                 {t}
//               </span>
//             ))}
//           </div>
//         )}

//         <div className="flex gap-2">
//           <button className="btn-secondary" onClick={() => setShowDetails(true)}>
//             View Details
//           </button>

//           <button className="btn" onClick={() => setOpenInterview(true)}>
//             Schedule Interview
//           </button>
//         </div>
//       </div>

//       <MatchDetailsModal
//         open={showDetails}
//         onClose={() => setShowDetails(false)}
//         name={name}
//         bestRoleTitle={p.bestRoleTitle}
//         score={score ?? 0}
//         breakdown={p.breakdown}
//         details={p.details}
//       />

//       {openInterview && (
//         <div 
//           className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
//           onClick={handleCloseModal}
//         >
//           <div 
//             className="bg-white p-5 rounded-xl w-[420px] shadow-xl max-h-[90vh] overflow-y-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2 className="text-lg font-semibold mb-3">
//               Schedule Interview — {name}
//             </h2>

//             <form onSubmit={sendInterviewMail} className="space-y-3">
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Interview Date <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="date"
//                   value={interviewDate}
//                   onChange={(e) => setInterviewDate(e.target.value)}
//                   min={new Date().toISOString().split('T')[0]}
//                   className="input w-full"
//                   required
//                   disabled={loading}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Interview Time <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="time"
//                   value={interviewTime}
//                   onChange={(e) => setInterviewTime(e.target.value)}
//                   className="input w-full"
//                   required
//                   disabled={loading}
//                 />
//               </div>

//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//                 <div className="flex items-start gap-2">
//                   <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <div className="text-sm text-blue-800">
//                     <p className="font-medium">Meeting Link Auto-Generated</p>
//                     <p className="text-xs mt-1">A Jitsi Meet room will be created automatically and sent to the candidate.</p>
//                   </div>
//                 </div>
//               </div>

//               {err && (
//                 <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
//                   ⚠️ {err}
//                 </div>
//               )}
              
//               {msg && (
//                 <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm">
//                   <div className="flex items-center gap-2">
//                     <span>✅ {msg}</span>
//                   </div>
//                   {generatedLink && (
//                     <div className="mt-2 pt-2 border-t border-green-300">
//                       <p className="text-xs font-medium mb-1">Generated Meeting Link:</p>
//                       <a 
//                         href={generatedLink} 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                         className="text-xs text-blue-600 hover:underline break-all"
//                       >
//                         {generatedLink}
//                       </a>
//                     </div>
//                   )}
//                 </div>
//               )}

//               <div className="flex justify-end gap-2 pt-2">
//                 <button
//                   type="button"
//                   className="btn bg-gray-200 text-black hover:bg-gray-300"
//                   onClick={handleCloseModal}
//                   disabled={loading}
//                 >
//                   Cancel
//                 </button>

//                 <button 
//                   type="submit" 
//                   className="btn disabled:opacity-50 disabled:cursor-not-allowed" 
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <span className="inline-block animate-spin mr-2">⏳</span>
//                       Sending...
//                     </>
//                   ) : (
//                     "Send Email"
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }





// // filepath: src/components/CandidateCard.tsx
// import React, { useState } from "react";
// import MatchDetailsModal from "./MatchDetailsModal";
// import type { MatchBreakdown } from "../services/match";
// import { API_BASE } from "../services/api";
// import useSoftDelete from "../hooks/useSoftDelete"; // NEW

// // --- THEME CONSTANTS (Dark Blue/Indigo) ---
// const PRIMARY_ACCENT = "#4361EE"; // Deep Indigo
// const HOVER_ACCENT = "#5945FF"; // Deeper Purple/Blue
// const CARD_BG = "#1C2A4A";
// const TEXT_COLOR = "text-gray-200";
// const MUTED_COLOR = "text-gray-400";
// const DELETE_COLOR = "#FF4500"; // Orange-Red for Delete
// // -----------------------------------------------------------

// type Person = {
//   id?: string | number;
//   name?: string;
//   role?: string;
//   initials?: string;
//   score?: number | null;
//   years?: number | null;
//   updated?: string;
//   badge?: string;
//   tags?: string[];
//   education?: number | null;
//   raw_text?: string | null;
//   bestRoleTitle?: string | null;
//   breakdown?: MatchBreakdown | null;
//   details?: Record<string, number> | null;
// };

// type Props =
//   | { person: Person; candidate?: never }
//   | { candidate: Person; person?: never }
//   | { person?: Person; candidate?: Person };

// export default function CandidateCard(props: Props) {
//   const p: Person = (props as any).person || (props as any).candidate || {};
//   const [showDetails, setShowDetails] = useState(false);
//   const [openInterview, setOpenInterview] = useState(false);
//   const [interviewDate, setInterviewDate] = useState("");
//   const [interviewTime, setInterviewTime] = useState("");
//   const [interviewLink, setInterviewLink] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState<string | null>(null);
//   const [err, setErr] = useState<string | null>(null);

//   const name = p.name || "Candidate";
//   const initials =
//     p.initials ||
//     name
//       .split(" ")
//       .filter(Boolean)
//       .map((s) => s[0])
//       .slice(0, 2)
//       .join("")
//       .toUpperCase();

//   const years = Number.isFinite(p.years as number) ? (p.years as number) : 0;
//   const score = typeof p.score === "number" ? Math.round(p.score as number) : null;
//   const tags = Array.isArray(p.tags) ? (p.tags as string[]) : [];

//   async function sendInterviewMail(e: React.FormEvent) {
//     e.preventDefault();
//     setErr(null);
//     setMsg(null);
//     if (!p.id) {
//       setErr("Missing resume ID.");
//       return;
//     }
//     if (!interviewDate || !interviewTime || !interviewLink) {
//       setErr("Please fill all fields.");
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `${API_BASE}/interview/send-interview-mail/${encodeURIComponent(String(p.id))}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             interview_date: interviewDate,
//             interview_time: interviewTime,
//             interview_link: interviewLink,
//           }),
//         }
//       );
//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(text || "Failed to send email");
//       }
//       setMsg("Interview email sent!");
//       setTimeout(() => {
//         setOpenInterview(false);
//         setInterviewDate("");
//         setInterviewTime("");
//         setInterviewLink("");
//       }, 800);
//     } catch (error: any) {
//       setErr(error?.message || "Error sending email.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // NEW: use frontend-only soft delete hook
//   const { deleteResume } = useSoftDelete();

//   function softDeleteResume() {
//     if (!p.id) {
//       setErr("Missing resume ID.");
//       return;
//     }
//     const confirmed = window.confirm(
//       `Are you sure you want to delete ${name}?\n\nThis will move the resume to the Bin where it will be kept for 2 months before permanent deletion.`
//     );
//     if (!confirmed) return;
//     setLoading(true);
//     setErr(null);
//     setMsg(null);

//     try {
//       // frontend-only delete (no backend calls)
//       deleteResume(p.id);
//       setMsg("Moved to Bin (frontend-only).");
//       setTimeout(() => {
//         setLoading(false);
//       }, 300);
//     } catch (e: any) {
//       console.error("Soft delete error:", e);
//       setErr("Error performing soft-delete.");
//       setLoading(false);
//     }
//   }

//   return (
//     <>
//       <div
//         className={`rounded-xl shadow-lg border border-gray-600 p-6 flex flex-col transition-all duration-300 relative hover:shadow-xl ${TEXT_COLOR}`}
//         style={{ backgroundColor: CARD_BG, borderColor: score && score >= 90 ? PRIMARY_ACCENT : '#2D3E50' }}
//       >
//         {score !== null && (
//           <div className="absolute right-3 top-3">
//             <span
//               className="px-3 py-1 rounded-full text-xs font-bold text-white"
//               style={{ backgroundColor: PRIMARY_ACCENT }}
//             >
//               {score}% match
//             </span>
//           </div>
//         )}

//         <div className="flex items-start justify-between mb-4 border-b border-gray-700 pb-4">
//           <div className="flex items-center gap-3">
//             <div
//               className="h-10 w-10 rounded-full text-white flex items-center justify-center font-bold text-lg flex-shrink-0"
//               style={{ backgroundColor: HOVER_ACCENT }}
//             >
//               {initials}
//             </div>

//             <div>
//               <div className="font-bold text-xl text-white">{name}</div>
//               <div className={`text-xs ${MUTED_COLOR}`}>
//                 {years} years • {p.bestRoleTitle || "—"}
//               </div>
//             </div>
//           </div>
//         </div>

//         {score !== null && (
//           <div className="mt-1">
//             <div className="h-2 w-full rounded-full bg-gray-700">
//               <div
//                 className="h-2 rounded-full transition-all duration-300"
//                 style={{ width: `${score}%`, backgroundColor: PRIMARY_ACCENT }}
//               />
//             </div>
//             <div className={`mt-2 text-xs ${MUTED_COLOR}`}>
//               {p.bestRoleTitle ? (
//                 <>
//                   <span className="font-semibold">Best role:</span>{" "}
//                   <span className="font-medium text-gray-300">{p.bestRoleTitle}</span>
//                 </>
//               ) : (
//                 "—"
//               )}
//             </div>
//           </div>
//         )}

//         {tags.length > 0 && (
//           <div className="flex flex-wrap gap-2 mt-4 min-h-[50px]">
//             {tags.slice(0, 6).map((t, idx) => (
//               <span
//                 key={`${t}-${idx}`}
//                 className={`rounded-full px-3 py-1 text-xs font-medium text-white`}
//                 style={{ backgroundColor: HOVER_ACCENT }}
//               >
//                 {t}
//               </span>
//             ))}
//             {tags.length > 6 && (
//               <span
//                 className={`rounded-full px-3 py-1 text-xs font-medium ${MUTED_COLOR}`}
//                 style={{ backgroundColor: '#2D3E50' }}
//               >
//                 +{tags.length - 6} more
//               </span>
//             )}
//           </div>
//         )}

//         <div className="flex gap-2 mt-4 pt-3 border-t border-gray-700">
//           <button
//             className={`flex-1 font-semibold py-2 rounded-xl transition-all duration-300 border-2 ${TEXT_COLOR} hover:scale-[1.05] hover:bg-[#2D3E50]`}
//             style={{ borderColor: PRIMARY_ACCENT, color: PRIMARY_ACCENT, backgroundColor: CARD_BG }}
//             onClick={() => setShowDetails(true)}
//             disabled={loading}
//           >
//             View Details
//           </button>

//           <button
//             className="flex-1 font-semibold py-2 rounded-xl text-white transition-all duration-300 hover:scale-[1.05] active:scale-[0.95]"
//             style={{ background: `linear-gradient(45deg, ${PRIMARY_ACCENT}, ${HOVER_ACCENT})` }}
//             onClick={() => setOpenInterview(true)}
//             disabled={loading}
//           >
//             Schedule Interview
//           </button>

//           <button
//             className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 border-2 text-lg hover:bg-red-600 hover:text-white hover:border-red-600 active:scale-[0.9]"
//             style={{
//               borderColor: DELETE_COLOR,
//               color: DELETE_COLOR,
//               backgroundColor: CARD_BG,
//             }}
//             onClick={softDeleteResume}
//             disabled={loading}
//             title="Move to Bin (2-month retention)"
//           >
//             🗑️
//           </button>
//         </div>

//         {(err || msg) && (
//           <div
//             className={`mt-3 text-sm font-medium px-3 py-2 rounded-lg border ${
//               err
//                 ? "text-red-400 bg-red-900/50 border-red-800"
//                 : "text-green-400 bg-green-900/50 border-green-800"
//             }`}
//           >
//             {err || msg}
//           </div>
//         )}
//       </div>

//       <MatchDetailsModal
//         open={showDetails}
//         onClose={() => setShowDetails(false)}
//         name={name}
//         bestRoleTitle={p.bestRoleTitle}
//         score={score ?? 0}
//         breakdown={p.breakdown}
//         details={p.details}
//       />

//       {openInterview && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
//           <div className={`p-6 rounded-xl w-[400px] shadow-2xl ${TEXT_COLOR}`} style={{ backgroundColor: CARD_BG }}>
//             <h2 className="text-xl font-bold mb-4 text-white">
//               Schedule Interview — {name}
//             </h2>

//             <form onSubmit={sendInterviewMail} className="space-y-4">
//               <div>
//                 <label className={`text-sm font-semibold block mb-1 ${TEXT_COLOR}`}>
//                   Interview Date
//                 </label>
//                 <input
//                   type="date"
//                   value={interviewDate}
//                   onChange={(e) => setInterviewDate(e.target.value)}
//                   className={`w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-700 ${TEXT_COLOR}`}
//                   required
//                 />
//               </div>

//               <div>
//                 <label className={`text-sm font-semibold block mb-1 ${TEXT_COLOR}`}>
//                   Interview Time
//                 </label>
//                 <input
//                   type="time"
//                   value={interviewTime}
//                   onChange={(e) => setInterviewTime(e.target.value)}
//                   className={`w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-700 ${TEXT_COLOR}`}
//                   required
//                 />
//               </div>

//               <div>
//                 <label className={`text-sm font-semibold block mb-1 ${TEXT_COLOR}`}>
//                   Meeting Link
//                 </label>
//                 <input
//                   type="url"
//                   placeholder="https://zoom.us/j/..."
//                   value={interviewLink}
//                   onChange={(e) => setInterviewLink(e.target.value)}
//                   className={`w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-700 ${TEXT_COLOR}`}
//                   required
//                 />
//               </div>

//               {err && (
//                 <div className="text-red-400 text-sm bg-red-900/50 p-2 rounded border border-red-800">
//                   {err}
//                 </div>
//               )}
//               {msg && (
//                 <div className="text-green-400 text-sm bg-green-900/50 p-2 rounded border border-green-800">
//                   {msg}
//                 </div>
//               )}

//               <div className="flex justify-end gap-2 pt-2">
//                 <button
//                   type="button"
//                   className="bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
//                   onClick={() => {
//                     setOpenInterview(false);
//                     setErr(null);
//                     setMsg(null);
//                   }}
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="font-semibold py-2 px-4 rounded-lg text-white transition-all duration-300 hover:scale-[1.05] active:scale-[0.95]"
//                   style={{ background: `linear-gradient(45deg, ${PRIMARY_ACCENT}, ${HOVER_ACCENT})` }}
//                   disabled={loading}
//                 >
//                   {loading ? "Sending..." : "Send Email"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }



// src/components/CandidateCard.tsx
import React, { useState } from "react";
import MatchDetailsModal from "./MatchDetailsModal";
import type { MatchBreakdown } from "../services/match";
import { postJSON } from "../services/api";
import useSoftDelete from "../hooks/useSoftDelete";

// --- THEME CONSTANTS (Dark Blue/Indigo) ---
const PRIMARY_ACCENT = "#4361EE"; // Deep Indigo
const HOVER_ACCENT = "#5945FF"; // Deeper Purple/Blue
const CARD_BG = "#1C2A4A";
const TEXT_COLOR = "text-gray-200";
const MUTED_COLOR = "text-gray-400";
const DELETE_COLOR = "#FF4500"; // Orange-Red for Delete
// -----------------------------------------------------------

type Person = {
  id?: string | number;
  name?: string;
  role?: string;
  initials?: string;
  score?: number | null;
  years?: number | null;
  updated?: string;
  badge?: string;
  tags?: string[];
  education?: number | null;
  raw_text?: string | null;
  bestRoleTitle?: string | null;
  breakdown?: MatchBreakdown | null;
  details?: Record<string, number> | null;
};

type Props =
  | { person: Person; candidate?: never }
  | { candidate: Person; person?: never }
  | { person?: Person; candidate?: Person };

export default function CandidateCard(props: Props) {
  const p: Person = (props as any).person || (props as any).candidate || {};
  const [showDetails, setShowDetails] = useState(false);
  const [openInterview, setOpenInterview] = useState(false);

  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const name = p.name || "Candidate";
  const initials =
    p.initials ||
    name
      .split(" ")
      .filter(Boolean)
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const years = Number.isFinite(p.years as number) ? (p.years as number) : 0;
  const score = typeof p.score === "number" ? Math.round(p.score as number) : null;
  const tags = Array.isArray(p.tags) ? (p.tags as string[]) : [];

  // Use frontend-only soft delete hook
  const { deleteResume } = useSoftDelete();

  async function sendInterviewMail(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setGeneratedLink(null);

    // Validation
    if (!p.id) {
      setErr("Missing resume ID.");
      return;
    }
    if (!interviewDate || !interviewTime) {
      setErr("Please fill date and time.");
      return;
    }

    setLoading(true);
    try {
      const response = await postJSON(
        `/interview/schedule/${encodeURIComponent(String(p.id))}`,
        {
          interview_date: interviewDate,
          interview_time: interviewTime,
        }
      );

      setMsg(response.message || "Interview email sent successfully!");
      setGeneratedLink(response.meeting_link);
      
      // Close modal after showing success for 2 seconds
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
      
    } catch (error: any) {
      setErr(error?.message || "Failed to send interview email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleCloseModal() {
    setOpenInterview(false);
    setErr(null);
    setMsg(null);
    setGeneratedLink(null);
    setInterviewDate("");
    setInterviewTime("");
  }

  function softDeleteResume() {
    if (!p.id) {
      setErr("Missing resume ID.");
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}?\n\nThis will move the resume to the Bin where it will be kept for 2 months before permanent deletion.`
    );
    if (!confirmed) return;
    setLoading(true);
    setErr(null);
    setMsg(null);

    try {
      // frontend-only delete (no backend calls)
      deleteResume(p.id);
      setMsg("Moved to Bin (frontend-only).");
      setTimeout(() => {
        setLoading(false);
      }, 300);
    } catch (e: any) {
      console.error("Soft delete error:", e);
      setErr("Error performing soft-delete.");
      setLoading(false);
    }
  }

  return (
    <>
      <div
        className={`rounded-xl shadow-lg border border-gray-600 p-6 flex flex-col transition-all duration-300 relative hover:shadow-xl ${TEXT_COLOR}`}
        style={{ backgroundColor: CARD_BG, borderColor: score && score >= 90 ? PRIMARY_ACCENT : '#2D3E50' }}
      >
        {score !== null && (
          <div className="absolute right-3 top-3">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: PRIMARY_ACCENT }}
            >
              {score}% match
            </span>
          </div>
        )}

        <div className="flex items-start justify-between mb-4 border-b border-gray-700 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-full text-white flex items-center justify-center font-bold text-lg flex-shrink-0"
              style={{ backgroundColor: HOVER_ACCENT }}
            >
              {initials}
            </div>

            <div>
              <div className="font-bold text-xl text-white">{name}</div>
              <div className={`text-xs ${MUTED_COLOR}`}>
                {years} years • {p.bestRoleTitle || "—"}
              </div>
            </div>
          </div>
        </div>

        {score !== null && (
          <div className="mt-1">
            <div className="h-2 w-full rounded-full bg-gray-700">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{ width: `${score}%`, backgroundColor: PRIMARY_ACCENT }}
              />
            </div>
            <div className={`mt-2 text-xs ${MUTED_COLOR}`}>
              {p.bestRoleTitle ? (
                <>
                  <span className="font-semibold">Best role:</span>{" "}
                  <span className="font-medium text-gray-300">{p.bestRoleTitle}</span>
                </>
              ) : (
                "—"
              )}
            </div>
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 min-h-[50px]">
            {tags.slice(0, 6).map((t, idx) => (
              <span
                key={`${t}-${idx}`}
                className={`rounded-full px-3 py-1 text-xs font-medium text-white`}
                style={{ backgroundColor: HOVER_ACCENT }}
              >
                {t}
              </span>
            ))}
            {tags.length > 6 && (
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${MUTED_COLOR}`}
                style={{ backgroundColor: '#2D3E50' }}
              >
                +{tags.length - 6} more
              </span>
            )}
          </div>
        )}

        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-700">
          <button
            className={`flex-1 font-semibold py-2 rounded-xl transition-all duration-300 border-2 ${TEXT_COLOR} hover:scale-[1.05] hover:bg-[#2D3E50]`}
            style={{ borderColor: PRIMARY_ACCENT, color: PRIMARY_ACCENT, backgroundColor: CARD_BG }}
            onClick={() => setShowDetails(true)}
            disabled={loading}
          >
            View Details
          </button>

          <button
            className="flex-1 font-semibold py-2 rounded-xl text-white transition-all duration-300 hover:scale-[1.05] active:scale-[0.95]"
            style={{ background: `linear-gradient(45deg, ${PRIMARY_ACCENT}, ${HOVER_ACCENT})` }}
            onClick={() => setOpenInterview(true)}
            disabled={loading}
          >
            Schedule Interview
          </button>

          <button
            className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 border-2 text-lg hover:bg-red-600 hover:text-white hover:border-red-600 active:scale-[0.9]"
            style={{
              borderColor: DELETE_COLOR,
              color: DELETE_COLOR,
              backgroundColor: CARD_BG,
            }}
            onClick={softDeleteResume}
            disabled={loading}
            title="Move to Bin (2-month retention)"
          >
            🗑️
          </button>
        </div>

        {(err || msg) && (
          <div
            className={`mt-3 text-sm font-medium px-3 py-2 rounded-lg border ${
              err
                ? "text-red-400 bg-red-900/50 border-red-800"
                : "text-green-400 bg-green-900/50 border-green-800"
            }`}
          >
            {err || msg}
          </div>
        )}
      </div>

      <MatchDetailsModal
        open={showDetails}
        onClose={() => setShowDetails(false)}
        name={name}
        bestRoleTitle={p.bestRoleTitle}
        score={score ?? 0}
        breakdown={p.breakdown}
        details={p.details}
      />

      {openInterview && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div 
            className={`p-6 rounded-xl w-[420px] shadow-2xl max-h-[90vh] overflow-y-auto ${TEXT_COLOR}`}
            style={{ backgroundColor: CARD_BG }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4 text-white">
              Schedule Interview — {name}
            </h2>

            <form onSubmit={sendInterviewMail} className="space-y-4">
              <div>
                <label className={`text-sm font-semibold block mb-1 ${TEXT_COLOR}`}>
                  Interview Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 bg-gray-700 ${TEXT_COLOR}`}
                  style={{ outlineColor: PRIMARY_ACCENT }}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className={`text-sm font-semibold block mb-1 ${TEXT_COLOR}`}>
                  Interview Time <span className="text-red-400">*</span>
                </label>
                <input
                  type="time"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className={`w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 bg-gray-700 ${TEXT_COLOR}`}
                  style={{ outlineColor: PRIMARY_ACCENT }}
                  required
                  disabled={loading}
                />
              </div>

              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-300">
                    <p className="font-semibold">Meeting Link Auto-Generated</p>
                    <p className="text-xs mt-1 text-blue-400">A Jitsi Meet room will be created automatically and sent to the candidate.</p>
                  </div>
                </div>
              </div>

              {err && (
                <div className="text-red-400 text-sm bg-red-900/50 p-3 rounded-lg border border-red-800 flex items-start gap-2">
                  <span className="text-lg">⚠️</span>
                  <span>{err}</span>
                </div>
              )}
              
              {msg && (
                <div className="text-green-400 text-sm bg-green-900/50 p-3 rounded-lg border border-green-800">
                  <div className="flex items-center gap-2">
                    <span>✅ {msg}</span>
                  </div>
                  {generatedLink && (
                    <div className="mt-2 pt-2 border-t border-green-700">
                      <p className="text-xs font-semibold mb-1">Generated Meeting Link:</p>
                      <a 
                        href={generatedLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 hover:underline break-all"
                      >
                        {generatedLink}
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  onClick={handleCloseModal}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button 
                  type="submit" 
                  className="font-semibold py-2 px-4 rounded-lg text-white transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: `linear-gradient(45deg, ${PRIMARY_ACCENT}, ${HOVER_ACCENT})` }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Sending...
                    </>
                  ) : (
                    "Send Email"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}