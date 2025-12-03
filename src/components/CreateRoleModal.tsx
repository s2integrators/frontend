
// // filepath: src/components/CreateRoleModal.tsx
// import React, { useEffect, useMemo, useState } from "react";
// import type { JobRequirements } from "../types";

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onCreate: (payload: Omit<JobRequirements, "id">) => Promise<JobRequirements>;
// };

// const EDU_OPTIONS = [
//   { value: 0, label: "None" },
//   { value: 1, label: "High School / GED" },
//   { value: 2, label: "Associate" },
//   { value: 3, label: "Bachelor's" },
//   { value: 4, label: "Master's" },
//   { value: 5, label: "Doctorate" },
// ];

// function splitList(v: string): string[] {
//   // why: accept comma/newline/“and” separated lists
//   return v
//     .split(/[\n,]|(?:\band\b)/gi)
//     .map((s) => s.trim())
//     .filter(Boolean);
// }

// export default function CreateRoleModal({ open, onClose, onCreate }: Props) {
//   const [title, setTitle] = useState("");
//   const [must, setMust] = useState("");
//   const [nice, setNice] = useState("");
//   const [minYears, setMinYears] = useState<number>(0);
//   const [edu, setEdu] = useState<number>(3);
//   const [desc, setDesc] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [err, setErr] = useState<string | null>(null);

//   useEffect(() => {
//     if (!open) return;
//     const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [open, onClose]);

//   useEffect(() => {
//     if (!open) return;
//     setTitle("");
//     setMust("");
//     setNice("");
//     setMinYears(0);
//     setEdu(3);
//     setDesc("");
//     setSaving(false);
//     setErr(null);
//   }, [open]);

//   const disabled = useMemo(
//     () => saving || title.trim().length === 0,
//     [saving, title]
//   );

//   const handleSave = async () => {
//     setErr(null);
//     setSaving(true);
//     try {
//       const payload: Omit<JobRequirements, "id"> = {
//         title: title.trim(),
//         description: desc.trim(),
//         min_years_experience: Number.isFinite(minYears) ? minYears : 0,
//         required_education: Number.isFinite(edu) ? edu : 0,
//         must_have_skills: splitList(must),
//         nice_to_have_skills: splitList(nice),
//       };
//       const created = await onCreate(payload);
//       if (created) onClose();
//     } catch (e: any) {
//       setErr(e?.message || "Failed to create role");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (!open) return null;

//   return (
//     <div
//       role="dialog"
//       aria-modal="true"
//       className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6"
//       onClick={onClose}
//     >
//       <div
//         className="w-full max-w-2xl rounded-xl bg-white shadow-xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between border-b px-6 py-4">
//           <div className="text-lg font-semibold">Create Role / Requirements</div>
//           <button className="btn-secondary" onClick={onClose}>
//             Close
//           </button>
//         </div>

//         <div className="space-y-4 p-6">
//           {err && (
//             <div className="rounded border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
//               {err}
//             </div>
//           )}

//           <div className="grid gap-4">
//             <label className="grid gap-1">
//               <span className="text-sm font-medium">Title *</span>
//               <input
//                 className="input"
//                 placeholder="e.g., Java Developer"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//               />
//             </label>

//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <label className="grid gap-1">
//                 <span className="text-sm font-medium">Min. Years Experience</span>
//                 <input
//                   className="input"
//                   type="number"
//                   min={0}
//                   value={minYears}
//                   onChange={(e) => setMinYears(parseInt(e.target.value || "0", 10))}
//                 />
//               </label>

//               <label className="grid gap-1">
//                 <span className="text-sm font-medium">Required Education</span>
//                 <select
//                   className="input"
//                   value={edu}
//                   onChange={(e) => setEdu(parseInt(e.target.value, 10))}
//                 >
//                   {EDU_OPTIONS.map((o) => (
//                     <option key={o.value} value={o.value}>
//                       {o.label}
//                     </option>
//                   ))}
//                 </select>
//               </label>
//             </div>

//             <label className="grid gap-1">
//               <span className="text-sm font-medium">Must-have Skills</span>
//               <textarea
//                 className="input"
//                 rows={3}
//                 placeholder="React, TypeScript, GraphQL"
//                 value={must}
//                 onChange={(e) => setMust(e.target.value)}
//               />
//               <span className="text-xs text-[var(--muted)]">
//                 Separate by commas or new lines. We’ll split safely.
//               </span>
//             </label>

//             <label className="grid gap-1">
//               <span className="text-sm font-medium">Nice-to-have Skills</span>
//               <textarea
//                 className="input"
//                 rows={3}
//                 placeholder="AWS, Docker, Terraform"
//                 value={nice}
//                 onChange={(e) => setNice(e.target.value)}
//               />
//             </label>

//             <label className="grid gap-1">
//               <span className="text-sm font-medium">Description</span>
//               <textarea
//                 className="input"
//                 rows={4}
//                 placeholder="Short summary of the role…"
//                 value={desc}
//                 onChange={(e) => setDesc(e.target.value)}
//               />
//             </label>
//           </div>
//         </div>

//         <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
//           <button className="btn-secondary" onClick={onClose}>
//             Cancel
//           </button>
//           <button className="btn" onClick={handleSave} disabled={disabled}>
//             {saving ? "Saving…" : "Create Role"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



// filepath: src/components/CandidateCard.tsx
import React, { useState } from "react";
import MatchDetailsModal from "./MatchDetailsModal";
import type { MatchBreakdown } from "../services/match";
import { API_BASE } from "../services/api";
import useSoftDelete from "../hooks/useSoftDelete"; // NEW

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
  const [interviewLink, setInterviewLink] = useState("");
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

  async function sendInterviewMail(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    if (!p.id) {
      setErr("Missing resume ID.");
      return;
    }
    if (!interviewDate || !interviewTime || !interviewLink) {
      setErr("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/interview/send-interview-mail/${encodeURIComponent(String(p.id))}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            interview_date: interviewDate,
            interview_time: interviewTime,
            interview_link: interviewLink,
          }),
        }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to send email");
      }
      setMsg("Interview email sent!");
      setTimeout(() => {
        setOpenInterview(false);
        setInterviewDate("");
        setInterviewTime("");
        setInterviewLink("");
      }, 800);
    } catch (error: any) {
      setErr(error?.message || "Error sending email.");
    } finally {
      setLoading(false);
    }
  }

  // NEW: use frontend-only soft delete hook
  const { deleteResume } = useSoftDelete();

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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className={`p-6 rounded-xl w-[400px] shadow-2xl ${TEXT_COLOR}`} style={{ backgroundColor: CARD_BG }}>
            <h2 className="text-xl font-bold mb-4 text-white">
              Schedule Interview — {name}
            </h2>

            <form onSubmit={sendInterviewMail} className="space-y-4">
              <div>
                <label className={`text-sm font-semibold block mb-1 ${TEXT_COLOR}`}>
                  Interview Date
                </label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className={`w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-700 ${TEXT_COLOR}`}
                  required
                />
              </div>

              <div>
                <label className={`text-sm font-semibold block mb-1 ${TEXT_COLOR}`}>
                  Interview Time
                </label>
                <input
                  type="time"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className={`w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-700 ${TEXT_COLOR}`}
                  required
                />
              </div>

              <div>
                <label className={`text-sm font-semibold block mb-1 ${TEXT_COLOR}`}>
                  Meeting Link
                </label>
                <input
                  type="url"
                  placeholder="https://zoom.us/j/..."
                  value={interviewLink}
                  onChange={(e) => setInterviewLink(e.target.value)}
                  className={`w-full border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-700 ${TEXT_COLOR}`}
                  required
                />
              </div>

              {err && (
                <div className="text-red-400 text-sm bg-red-900/50 p-2 rounded border border-red-800">
                  {err}
                </div>
              )}
              {msg && (
                <div className="text-green-400 text-sm bg-green-900/50 p-2 rounded border border-green-800">
                  {msg}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="bg-gray-600 text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    setOpenInterview(false);
                    setErr(null);
                    setMsg(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="font-semibold py-2 px-4 rounded-lg text-white transition-all duration-300 hover:scale-[1.05] active:scale-[0.95]"
                  style={{ background: `linear-gradient(45deg, ${PRIMARY_ACCENT}, ${HOVER_ACCENT})` }}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Email"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}