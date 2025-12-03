// ===========================================
// filepath: src/components/CandidateCard.tsx
// ===========================================

import React, { useState } from "react";
import MatchDetailsModal from "./MatchDetailsModal";
import type { MatchBreakdown } from "../services/match";
import { API_BASE } from "../services/api";

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
  const tags = Array.isArray(p.tags) ? p.tags : [];

  // Using API_BASE already includes "/api/v1"; do not add another "/api".
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
      setTimeout(() => setOpenInterview(false), 800);
    } catch (error: any) {
      setErr(error?.message || "Error sending email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="card p-4 flex flex-col gap-3">
        {score !== null && (
          <div className="absolute right-3 top-3">
            <span className="px-2 py-1 rounded-xl bg-blue-600 text-white text-xs font-semibold">
              {score}% match
            </span>
          </div>
        )}

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-semibold">
              {initials}
            </div>

            <div>
              <div className="font-semibold">{name}</div>
              <div className="text-xs text-[var(--muted)]">
                {years} years • {p.role || "—"}
              </div>
            </div>
          </div>
        </div>

        {score !== null && (
          <div className="mt-1">
            <div className="h-2 w-full rounded bg-slate-200">
              <div className="h-2 rounded bg-blue-600" style={{ width: `${score}%` }} />
            </div>
            <div className="mt-1 text-xs text-[var(--muted)]">
              {p.bestRoleTitle ? (
                <>
                  Best role: <span className="font-medium">{p.bestRoleTitle}</span>
                </>
              ) : (
                "—"
              )}
            </div>
          </div>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 6).map((t) => (
              <span
                key={t}
                className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => setShowDetails(true)}>
            View Details
          </button>

          <button className="btn" onClick={() => setOpenInterview(true)}>
            Schedule Interview
          </button>
        </div>
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-xl w-[380px] shadow-xl">
            <h2 className="text-lg font-semibold mb-3">
              Schedule Interview — {name}
            </h2>

            <form onSubmit={sendInterviewMail} className="space-y-3">
              <div>
                <label className="text-sm font-medium">Interview Date</label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="input w-full mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Interview Time</label>
                <input
                  type="time"
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  className="input w-full mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Meeting Link</label>
                <input
                  type="url"
                  placeholder="https://zoom.us/..."
                  value={interviewLink}
                  onChange={(e) => setInterviewLink(e.target.value)}
                  className="input w-full mt-1"
                  required
                />
              </div>

              {err && <div className="text-red-600 text-sm">{err}</div>}
              {msg && <div className="text-green-600 text-sm">{msg}</div>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn bg-gray-200 text-black"
                  onClick={() => setOpenInterview(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="btn" disabled={loading}>
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
