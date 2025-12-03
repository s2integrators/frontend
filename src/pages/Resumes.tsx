// // filepath: src/pages/Resumes.tsx
// import React, { useRef, useState } from "react";
// import { uploadResume, type UploadMode, type UploadResponse } from "../services/http";

// export default function Resumes() {
//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const [file, setFile] = useState<File | null>(null);
//   const [mode, setMode] = useState<UploadMode>("upload");
//   const [busy, setBusy] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [result, setResult] = useState<UploadResponse | null>(null);

//   const onPick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
//     setFile(e.target.files?.[0] ?? null);
//     setResult(null);
//     setError(null);
//   };

//   const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
//     e.preventDefault();
//     if (!file) return setError("Please choose a file");
//     setBusy(true); setError(null); setResult(null);
//     try {
//       const data = await uploadResume(file, mode);
//       setResult(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Upload failed");
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
//       <h2>Upload Resume</h2>
//       <form onSubmit={onSubmit}>
//         <input
//           ref={inputRef}
//           type="file"
//           accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp"
//           onChange={onPick}
//           disabled={busy}
//         />
//         <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
//           <button type="button" disabled={busy} onClick={() => setMode("upload")}>
//             Upload Only
//           </button>
//           <button type="button" disabled={busy} onClick={() => setMode("full")}>
//             Upload &amp; Parse
//           </button>
//           <button type="submit" disabled={busy || !file}>
//             {busy ? "Working..." : mode === "upload" ? "Send to /upload" : "Send to /full-pipeline"}
//           </button>
//         </div>
//       </form>

//       {error && <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>}

//       {result && (
//         <pre
//           style={{
//             marginTop: 16,
//             background: "#111",
//             color: "#eee",
//             padding: 12,
//             borderRadius: 8,
//             overflowX: "auto",
//           }}
//         >
//           {JSON.stringify(result, null, 2)}
//         </pre>
//       )}
//     </div>
//   );
// }





// filepath: src/pages/Resumes.tsx
import React, { useEffect, useMemo, useState } from "react";
import CandidateCard from "../components/CandidateCard";
import UploadModal from "../components/UploadModal";
import ResumeUpload from "../components/ResumeUpload";
import { ResumesAPI } from "../services/http";
import type { ResumeRecord } from "../services/http";
import useSoftDelete from "../hooks/useSoftDelete";

// --- THEME CONSTANTS (match Dashboard) ---
const PRIMARY_ACCENT = "#4361EE"; // Deep Indigo
const HOVER_ACCENT = "#5945FF";   // Deeper Purple/Blue
const CARD_BG = "#1C2A4A";        // Card background
const TEXT_COLOR = "text-gray-200";
const MUTED_COLOR = "text-gray-400";
// -----------------------------------------

type Person = {
  id: string;
  name: string;
  role: string;
  initials: string;
  score: number | null;
  years: number | null;
  updated: string;
  badge: string;
  tags: string[];
  education: number | null;
  raw_text: string | null;
  bestRoleTitle?: string | null;
  breakdown?: null;
  details?: null;
};

const initials = (n?: string) =>
  (n || "??")
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function ResumesPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openUpload, setOpenUpload] = useState(false);

  const { isDeleted } = useSoftDelete();

  // Map backend ResumeRecord → Person (shape CandidateCard expects)
  const mapResumes = (rows: ResumeRecord[]): Person[] =>
    rows
      .filter((r) => r.name && r.name !== "Candidate")
      .map((r) => ({
        id: r.id,
        name: r.name || "Candidate",
        role: "—",
        initials: initials(r.name),
        score: null, // No scoring on this page
        years: r.years_experience != null ? Number(r.years_experience) : null,
        updated: new Date(
          r.updated_at || r.created_at || Date.now()
        ).toISOString(), // use ISO for stable sorting
        badge: "New",
        tags: Array.isArray(r.skills) ? r.skills : [],
        education: r.education != null ? Number(r.education) : null,
        raw_text: r.raw_text != null ? String(r.raw_text) : null,
        bestRoleTitle: null,
        breakdown: null,
        details: null,
      }));

  const fetchResumes = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await ResumesAPI.list<ResumeRecord[]>();

      const byId = new Map<string, ResumeRecord>();
      list.forEach((r) => byId.set(r.id, r));

      const mapped = mapResumes(Array.from(byId.values()));

      // Stable order: newest updated first
      mapped.sort(
        (a, b) =>
          new Date(b.updated).getTime() - new Date(a.updated).getTime()
      );

      setPeople(mapped);
    } catch (e: any) {
      console.error("Resumes load failed", e);
      setError("Failed to load resumes. Please check your backend/API.");
      setPeople([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load + refresh when "resumes:changed" event fires
  useEffect(() => {
    fetchResumes();

    const handler = () => {
      fetchResumes();
    };
    window.addEventListener("resumes:changed", handler as EventListener);
    return () => window.removeEventListener("resumes:changed", handler as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Remove soft-deleted resumes
  const visiblePeople = useMemo(
    () => people.filter((p) => !isDeleted(p.id)),
    [people, isDeleted]
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Main container card for this page */}
      <div
        className="rounded-2xl border border-gray-700 p-6 shadow-2xl"
        style={{ backgroundColor: CARD_BG }}
      >
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Resumes
            </h1>
            <p className={`${MUTED_COLOR} text-sm mt-1`}>
              All resumes uploaded into the system. This list is stable and easy to scan.
            </p>
          </div>

          {/* Upload button (same behavior as Dashboard) */}
          <button
            className="text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: `linear-gradient(45deg, ${HOVER_ACCENT}, ${PRIMARY_ACCENT})`,
            }}
            onClick={() => setOpenUpload(true)}
          >
            ⬆ Upload Resume
          </button>
        </div>

        {/* Loading / error messages */}
        {loading && (
          <div
            className={`mb-4 rounded-lg border border-gray-600 px-4 py-3 text-sm ${TEXT_COLOR}`}
            style={{ backgroundColor: "#111827" }}
          >
            Loading resumes…
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-700 bg-red-900/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* List or empty state */}
        {visiblePeople.length === 0 && !loading ? (
          <div
            className={`mt-4 rounded-xl border border-dashed border-gray-600 p-8 text-center ${TEXT_COLOR}`}
            style={{ backgroundColor: "#111827" }}
          >
            <p className="text-lg mb-2">No resumes found.</p>
            <p className={MUTED_COLOR + " mb-4"}>
              Upload a resume here or from the Dashboard. All uploaded resumes will appear in this list.
            </p>
            <button
              className="text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: `linear-gradient(45deg, ${HOVER_ACCENT}, ${PRIMARY_ACCENT})`,
              }}
              onClick={() => setOpenUpload(true)}
            >
              ⬆ Upload Resume
            </button>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 mt-4">
            {visiblePeople.map((p) => (
              <CandidateCard key={p.id} person={p} />
            ))}
          </section>
        )}
      </div>

      {/* Upload modal (re-uses existing components) */}
      <UploadModal open={openUpload} onClose={() => setOpenUpload(false)}>
        <ResumeUpload />
      </UploadModal>
    </div>
  );
}

