// // // // // filepath: src/pages/Dashboard.tsx
// // // // import React, { useEffect, useMemo, useState } from "react";
// // // // import { useNavigate } from "react-router-dom"; // <-- added
// // // // import CandidateCard from "../components/CandidateCard";
// // // // import UploadModal from "../components/UploadModal";
// // // // import ResumeUpload from "../components/ResumeUpload";
// // // // import QuestionsPanel from "../components/QuestionsPanel";
// // // // import { JobsAPI, ResumesAPI } from "../services/http"; // keep your existing http.ts
// // // // import type { JobRequirements, ResumeRecord } from "../services/http";
// // // // import MatchAPI, { toPercent } from "../services/match";
// // // // import { apiBase } from "../services/env";
// // // // import CreateRoleModal from "../components/CreateRoleModal";

// // // // // --- PROFESSIONAL THEME CONSTANTS ---
// // // // const PRIMARY_ACCENT = "#007B80"; // Deep Teal
// // // // const HOVER_ACCENT = "#008C99";
// // // // const ACTIVE_SIDEBAR_BG = "#E6F4F5";
// // // // const MAIN_BG = "bg-gray-50"; // Subtle off-white background

// // // // type Person = {
// // // //   id: string;
// // // //   name: string;
// // // //   role: string;
// // // //   initials: string;
// // // //   score: number; // always 0..100 in UI
// // // //   years: number;
// // // //   updated: string;
// // // //   badge: string;
// // // //   tags: string[];
// // // //   education: number;
// // // //   raw_text: string;
// // // //   bestRoleTitle?: string | null;
// // // //   breakdown?: import("../services/match").MatchBreakdown | null;
// // // //   details?: Record<string, number> | null;
// // // // };

// // // // const initials = (n?: string) =>
// // // //   (n || "??")
// // // //     .split(" ")
// // // //     .filter(Boolean)
// // // //     .map((s) => s[0])
// // // //     .slice(0, 2)
// // // //     .join("")
// // // //     .toUpperCase();

// // // // type SortKey = "score_desc" | "exp_desc" | "exp_asc";

// // // // export default function Dashboard() {
// // // //   const navigate = useNavigate(); // <-- useNavigate hook here

// // // //   const [openUpload, setOpenUpload] = useState(false);
// // // //   const [openCreateRole, setOpenCreateRole] = useState(false); // NEW
// // // //   const [jobs, setJobs] = useState<JobRequirements[]>([]);
// // // //   const [selectedJob, setSelectedJob] = useState<JobRequirements | null>(null);
// // // //   const [people, setPeople] = useState<Person[]>([]);
// // // //   const [query, setQuery] = useState("");
// // // //   const [sort, setSort] = useState<SortKey>("score_desc");
// // // //   const [matchErr, setMatchErr] = useState<string | null>(null);

// // // //   const mapResumes = (rows: ResumeRecord[]): Person[] =>
// // // //     rows.map((r) => ({
// // // //       id: r.id,
// // // //       name: r.name || "Candidate",
// // // //       role: "—",
// // // //       initials: initials(r.name),
// // // //       score: 0,
// // // //       years: Number(r.years_experience || 0),
// // // //       updated: new Date(r.updated_at || r.created_at || Date.now()).toDateString(),
// // // //       badge: "New",
// // // //       tags: Array.isArray(r.skills) ? r.skills : [],
// // // //       education: Number(r.education ?? 0),
// // // //       raw_text: String(r.raw_text || ""),
// // // //     }));

// // // //   // initial load
// // // //   useEffect(() => {
// // // //     (async () => {
// // // //       try {
// // // //         const list = await JobsAPI.list<JobRequirements[]>();
// // // //         setJobs(list);
// // // //         setSelectedJob(null); // "All Roles (best match)"
// // // //       } catch (e: any) {
// // // //         console.error("Jobs load failed", e);
// // // //         setJobs([]);
// // // //         setSelectedJob(null);
// // // //       }
// // // //     })();
// // // //     (async () => {
// // // //       try {
// // // //         const list = await ResumesAPI.list<ResumeRecord[]>();
// // // //         const byId = new Map<string, ResumeRecord>();
// // // //         list.forEach((r) => byId.set(r.id, r));
// // // //         setPeople(mapResumes(Array.from(byId.values())));
// // // //       } catch (e: any) {
// // // //         console.error("Resumes load failed", e);
// // // //         setPeople([]);
// // // //       }
// // // //     })();
// // // //   }, []);

// // // //   // live refresh on resumes:changed
// // // //   useEffect(() => {
// // // //     const h = () => {
// // // //       (async () => {
// // // //         try {
// // // //           const list = await ResumesAPI.list<ResumeRecord[]>();
// // // //           const byId = new Map<string, ResumeRecord>();
// // // //           list.forEach((r) => byId.set(r.id, r));
// // // //           setPeople(mapResumes(Array.from(byId.values())));
// // // //         } catch (e: any) {
// // // //           console.error("Resumes refresh failed", e);
// // // //           setPeople([]);
// // // //         }
// // // //       })();
// // // //     };
// // // //     window.addEventListener("resumes:changed", h as EventListener);
// // // //     return () => window.removeEventListener("resumes:changed", h as EventListener);
// // // //   }, []);

// // // //   // payload for /match
// // // //   const resumesForAPI = useMemo(
// // // //     () =>
// // // //       people.map((p) => ({
// // // //         skills: p.tags,
// // // //         years_experience: p.years,
// // // //         education: p.education,
// // // //         raw_text: p.raw_text,
// // // //       })),
// // // //     [people]
// // // //   );

// // // //   // compute scores — selected role (batch) or best role fallback
// // // //   useEffect(() => {
// // // //     (async () => {
// // // //       if (people.length === 0) return;
// // // //       setMatchErr(null);

// // // //       if (selectedJob?.id) {
// // // //         try {
// // // //           const results = await MatchAPI.scoreBatch({ resumes: resumesForAPI, job: selectedJob });
// // // //           setPeople((prev) =>
// // // //             prev.map((p, i) => ({
// // // //               ...p,
// // // //               score: toPercent(results?.[i]?.score),
// // // //               bestRoleTitle: selectedJob.title,
// // // //               breakdown: results?.[i]?.breakdown || null,
// // // //               details: results?.[i]?.details || null,
// // // //             }))
// // // //           );
// // // //           return;
// // // //         } catch (e: any) {
// // // //           setMatchErr(`Match (batch) failed: ${e?.message || e}`);
// // // //           console.error("Match batch error", e);
// // // //           // fall through to best-role
// // // //         }
// // // //       }

// // // //       try {
// // // //         const perCandidate = await Promise.all(
// // // //           resumesForAPI.map((r) => MatchAPI.scoreAgainstAllJobs(r))
// // // //         );
// // // //         setPeople((prev) =>
// // // //           prev.map((p, i) => {
// // // //             const top = perCandidate[i]?.[0];
// // // //             return {
// // // //               ...p,
// // // //               score: toPercent(top?.score),
// // // //               bestRoleTitle: top?.title ?? null,
// // // //               breakdown: top?.breakdown || null,
// // // //               details: top?.details || null,
// // // //             };
// // // //           })
// // // //         );
// // // //       } catch (e: any) {
// // // //         setMatchErr(`Match (best-role) failed: ${e?.message || e}`);
// // // //         console.error("Match best-role error", e);
// // // //       }
// // // //     })();
// // // //   }, [selectedJob?.id, resumesForAPI, people.length]);

// // // //   // search & sort
// // // //   const visiblePeople = useMemo(() => {
// // // //     const q = query.trim().toLowerCase();
// // // //     const filtered = q
// // // //       ? people.filter(
// // // //           (p) =>
// // // //             p.name.toLowerCase().includes(q) ||
// // // //             p.tags.some((t) => t.toLowerCase().includes(q))
// // // //         )
// // // //       : people.slice();

// // // //     switch (sort) {
// // // //       case "exp_desc":
// // // //         filtered.sort((a, b) => (b.years || 0) - (a.years || 0));
// // // //         break;
// // // //       case "exp_asc":
// // // //         filtered.sort((a, b) => (a.years || 0) - (b.years || 0));
// // // //         break;
// // // //       default:
// // // //         filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
// // // //     }
// // // //     return filtered;
// // // //   }, [people, query, sort]);

// // // //   // Create a new role via API and update UI
// // // //   const createRole = async (payload: Omit<JobRequirements, "id">): Promise<JobRequirements> => {
// // // //     const BASE = apiBase();
// // // //     const res = await fetch(`${BASE}/api/v1/jobs`, {
// // // //       method: "POST",
// // // //       headers: { "Content-Type": "application/json" },
// // // //       body: JSON.stringify(payload),
// // // //     });
// // // //     if (!res.ok) {
// // // //       const text = await res.text();
// // // //       throw new Error(text || `HTTP ${res.status}`);
// // // //     }
// // // //     const job = (await res.json()) as JobRequirements;
// // // //     setJobs((prev) => [job, ...prev]);
// // // //     setSelectedJob(job);
// // // //     return job;
// // // //   };

// // // //   return (
// // // //     <div className={`min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr] ${MAIN_BG}`}>
// // // //       {/* Sidebar */}
// // // //       <aside className="hidden md:block border-r border-gray-200 bg-white">
// // // //         <div className="p-5 text-xl font-bold">Recruiter</div>
// // // //         <nav className="px-3 space-y-1">
// // // //           <button
// // // //             onClick={() => navigate("/")}
// // // //             className="block text-left w-full rounded-xl px-3 py-2 font-medium transition-colors duration-150"
// // // //             style={{ backgroundColor: ACTIVE_SIDEBAR_BG, color: PRIMARY_ACCENT }}
// // // //           >
// // // //             Dashboard
// // // //           </button>

// // // //           <button
// // // //             onClick={() => navigate("/recruiter/resumes")}
// // // //             className="block text-left w-full rounded-xl px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-150"
// // // //           >
// // // //             Resumes
// // // //           </button>

// // // //           <button
// // // //             onClick={() => navigate("/recruiter/interviews")}
// // // //             className="block text-left w-full rounded-xl px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-150"
// // // //           >
// // // //             Interviews
// // // //           </button>

// // // //           <button
// // // //             onClick={() => navigate("/recruiter/recommendations")}
// // // //             className="block text-left w-full rounded-xl px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-150"
// // // //           >
// // // //             Recommendations
// // // //           </button>

// // // //           <button
// // // //             onClick={() => navigate("/recruiter/settings")}
// // // //             className="block text-left w-full rounded-xl px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-150"
// // // //           >
// // // //             Settings
// // // //           </button>
// // // //         </nav>
// // // //       </aside>

// // // //       <main className="p-8">
// // // //         <header className="mb-6 flex items-start justify-between gap-3">
// // // //           <div>
// // // //             <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Dashboard</h1>
// // // //             <p className="text-base text-gray-500">
// // // //               Welcome back! Here’s your recruitment overview.
// // // //             </p>
// // // //           </div>
// // // //           <div className="flex gap-2">
// // // //             <select
// // // //               className="input border border-gray-300 rounded-lg shadow-sm focus:border-[#007B80] focus:ring-1 focus:ring-[#007B80] transition-all duration-150"
// // // //               value={selectedJob?.id ?? ""}
// // // //               onChange={(e) =>
// // // //                 setSelectedJob(jobs.find((j) => j.id === e.target.value) || null)
// // // //               }
// // // //             >
// // // //               <option value="">All Roles (best match)</option>
// // // //               {jobs.map((j) => (
// // // //                 <option key={j.id} value={j.id}>
// // // //                   {j.title}
// // // //                 </option>
// // // //               ))}
// // // //             </select>

// // // //             {/* NEW: Create Role */}
// // // //             <button
// // // //               className="btn-secondary"
// // // //               style={{ borderColor: PRIMARY_ACCENT, color: PRIMARY_ACCENT }}
// // // //               onClick={() => setOpenCreateRole(true)}
// // // //             >
// // // //               + New Role
// // // //             </button>

// // // //             <button
// // // //               className="bg-[#007B80] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-[#008C99] transition-colors duration-150"
// // // //               onClick={() => setOpenUpload(true)}
// // // //             >
// // // //               ⬆ Upload Resume
// // // //             </button>
// // // //           </div>
// // // //         </header>

// // // //         {/* visible API error */}
// // // //         {matchErr && (
// // // //           <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 shadow-sm">
// // // //             {matchErr}. Check API base & CORS. (Open console for details.)
// // // //           </div>
// // // //         )}

// // // //         {/* Metric Cards */}
// // // //         <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
// // // //           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
// // // //             <div className="text-sm text-gray-500">Total Applications</div>
// // // //             <div className="text-3xl font-extrabold text-gray-900">{people.length}</div>
// // // //             <div className="text-xs text-gray-400">in system</div>
// // // //           </div>
// // // //           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
// // // //             <div className="text-sm text-gray-500">Pending Reviews</div>
// // // //             <div className="text-3xl font-extrabold text-gray-900">—</div>
// // // //             <div className="text-xs text-gray-400">auto</div>
// // // //           </div>
// // // //           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
// // // //             <div className="text-sm text-gray-500">Scheduled Interviews</div>
// // // //             <div className="text-3xl font-extrabold text-gray-900">—</div>
// // // //             <div className="text-xs text-gray-400">this week</div>
// // // //           </div>
// // // //           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
// // // //             <div className="text-sm text-gray-500">Top Matches</div>
// // // //             <div className="text-3xl font-extrabold text-gray-900">
// // // //               {people.filter((p) => (p.score || 0) >= 90).length}
// // // //             </div>
// // // //             <div className="text-xs text-gray-400">90%+ match</div>
// // // //           </div>
// // // //         </section>

// // // //         <div className="mb-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
// // // //           <div>
// // // //             <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
// // // //               <input
// // // //                 className="input w-full max-w-sm rounded-lg border border-gray-300 shadow-sm px-4 py-2 focus:border-[#007B80] focus:ring-1 focus:ring-[#007B80] transition-all duration-150"
// // // //                 placeholder="Search candidates..."
// // // //                 value={query}
// // // //                 onChange={(e) => setQuery(e.target.value)}
// // // //               />
// // // //               <div className="flex gap-2">
// // // //                 <select
// // // //                   className="input rounded-lg border border-gray-300 shadow-sm px-4 py-2 focus:border-[#007B80] focus:ring-1 focus:ring-[#007B80] transition-all duration-150"
// // // //                   value={sort}
// // // //                   onChange={(e) => setSort(e.target.value as SortKey)}
// // // //                 >
// // // //                   <option value="score_desc">Best Match</option>
// // // //                   <option value="exp_desc">Experience: High → Low</option>
// // // //                   <option value="exp_asc">Experience: Low → High</option>
// // // //                 </select>
// // // //                 <select className="input rounded-lg border border-gray-300 shadow-sm px-4 py-2 focus:border-[#007B80] focus:ring-1 focus:ring-[#007B80] transition-all duration-150">
// // // //                   <option>Status</option>
// // // //                 </select>
// // // //               </div>
// // // //             </div>
// // // //             <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
// // // //               {visiblePeople.map((p) => (
// // // //                 <CandidateCard key={p.id} person={p} />
// // // //               ))}
// // // //             </section>
// // // //           </div>
// // // //           {/* Questions Panel Container */}
// // // //           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 h-fit">
// // // //             <div className="text-lg font-bold mb-3 text-gray-800">Generated Questions</div>
// // // //             <QuestionsPanel />
// // // //           </div>
// // // //         </div>
// // // //       </main>

// // // //       <UploadModal open={openUpload} onClose={() => setOpenUpload(false)}>
// // // //         <ResumeUpload />
// // // //       </UploadModal>

// // // //       {/* NEW: Create Role Modal */}
// // // //       <CreateRoleModal
// // // //         open={openCreateRole}
// // // //         onClose={() => setOpenCreateRole(false)}
// // // //         onCreate={createRole}
// // // //       />
// // // //     </div>
// // // //   );
// // // // }




// // // // filepath: src/pages/Dashboard.tsx
// // // import React, { useEffect, useMemo, useState } from "react";
// // // import CandidateCard from "../components/CandidateCard";
// // // import UploadModal from "../components/UploadModal";
// // // import ResumeUpload from "../components/ResumeUpload";
// // // import QuestionsPanel from "../components/QuestionsPanel";
// // // import { JobsAPI, ResumesAPI } from "../services/http";
// // // import type { JobRequirements, ResumeRecord } from "../services/http";
// // // import MatchAPI, { toPercent } from "../services/match";
// // // import { apiBase } from "../services/env";
// // // import CreateRoleModal from "../components/CreateRoleModal";
// // // import ResumesPage from "./Resumes";
// // // import BinPage from "./Bin";
// // // import useSoftDelete from "../hooks/useSoftDelete";

// // // // --- THEME CONSTANTS (Dark Blue/Indigo) ---
// // // const PRIMARY_ACCENT = "#4361EE"; // Deep Indigo / Primary Button
// // // const HOVER_ACCENT = "#5945FF"; // Deeper Purple/Blue for hover
// // // const CARD_BG = "#1C2A4A"; // Dark Blue/Gray for Cards & Containers
// // // const MAIN_BG = "bg-[#0A1930]"; // Very Dark Blue/Black Canvas
// // // const TEXT_COLOR = "text-gray-200"; // Light text for dark background
// // // const MUTED_COLOR = "text-gray-400"; // Muted light text
// // // const WAITING_ACCENT = "#FFA726"; // Orange/Yellow
// // // // ------------------------------------------

// // // type ActivePage = "dashboard" | "resumes" | "interviews" | "recommendations" | "settings" | "bin";

// // // type Person = {
// // //   id: string;
// // //   name: string;
// // //   role: string;
// // //   initials: string;
// // //   score: number;
// // //   years: number;
// // //   updated: string;
// // //   badge: string;
// // //   tags: string[];
// // //   education: number;
// // //   raw_text: string;
// // //   bestRoleTitle?: string | null;
// // //   breakdown?: import("../services/match").MatchBreakdown | null;
// // //   details?: Record<string, number> | null;
// // // };

// // // const initials = (n?: string) =>
// // //   (n || "??")
// // //     .split(" ")
// // //     .filter(Boolean)
// // //     .map((s) => s[0])
// // //     .slice(0, 2)
// // //     .join("")
// // //     .toUpperCase();

// // // type SortKey = "score_desc" | "exp_desc" | "exp_asc";

// // // export default function Dashboard() {
// // //   const [activePage, setActivePage] = useState<ActivePage>(
// // //     (localStorage.getItem("activePage") as ActivePage) || "dashboard"
// // //   );
// // //   const [openUpload, setOpenUpload] = useState(false);
// // //   const [openCreateRole, setOpenCreateRole] = useState(false);
// // //   const [jobs, setJobs] = useState<JobRequirements[]>([]);
// // //   const [selectedJob, setSelectedJob] = useState<JobRequirements | null>(null);
// // //   const [people, setPeople] = useState<Person[]>([]);
// // //   const [query, setQuery] = useState("");
// // //   const [sort, setSort] = useState<SortKey>("score_desc");
// // //   const [matchErr, setMatchErr] = useState<string | null>(null);

// // //   // Use soft-delete hook
// // //   const { isDeleted } = useSoftDelete();

// // //   const handleSetActivePage = (id: ActivePage) => {
// // //     setActivePage(id);
// // //     localStorage.setItem("activePage", id);
// // //   };

// // //   const mapResumes = (rows: ResumeRecord[]): Person[] =>
// // //     rows
// // //       .filter((r) => r.name && r.name !== "Candidate")
// // //       .map((r) => ({
// // //         id: r.id,
// // //         name: r.name || "Candidate",
// // //         role: "—",
// // //         initials: initials(r.name),
// // //         score: 0,
// // //         years: Number(r.years_experience || 0),
// // //         updated: new Date(r.updated_at || r.created_at || Date.now()).toDateString(),
// // //         badge: "New",
// // //         tags: Array.isArray(r.skills) ? r.skills : [],
// // //         education: Number(r.education ?? 0),
// // //         raw_text: String(r.raw_text || ""),
// // //       }));

// // //   // Initial load
// // //   useEffect(() => {
// // //     (async () => {
// // //       try {
// // //         const list = await JobsAPI.list<JobRequirements[]>();
// // //         setJobs(list);
// // //         setSelectedJob(null);
// // //       } catch (e: any) {
// // //         console.error("Jobs load failed", e);
// // //         setJobs([]);
// // //         setSelectedJob(null);
// // //       }
// // //     })();
// // //     (async () => {
// // //       try {
// // //         const list = await ResumesAPI.list<ResumeRecord[]>();
// // //         const byId = new Map<string, ResumeRecord>();
// // //         list.forEach((r) => byId.set(r.id, r));
// // //         setPeople(mapResumes(Array.from(byId.values())));
// // //       } catch (e: any) {
// // //         console.error("Resumes load failed", e);
// // //         setPeople([]);
// // //       }
// // //     })();
// // //   }, []);

// // //   // Live refresh on resumes:changed
// // //   useEffect(() => {
// // //     const h = () => {
// // //       (async () => {
// // //         try {
// // //           const list = await ResumesAPI.list<ResumeRecord[]>();
// // //           const byId = new Map<string, ResumeRecord>();
// // //           list.forEach((r) => byId.set(r.id, r));
// // //           setPeople(mapResumes(Array.from(byId.values())));
// // //         } catch (e: any) {
// // //           console.error("Resumes refresh failed", e);
// // //           setPeople([]);
// // //         }
// // //       })();
// // //     };
// // //     window.addEventListener("resumes:changed", h as EventListener);
// // //     return () => window.removeEventListener("resumes:changed", h as EventListener);
// // //   }, []);

// // //   // Payload for /match
// // //   const resumesForAPI = useMemo(
// // //     () =>
// // //       people.map((p) => ({
// // //         skills: p.tags,
// // //         years_experience: p.years,
// // //         education: p.education,
// // //         raw_text: p.raw_text,
// // //       })),
// // //     [people]
// // //   );

// // //   // Compute scores — selected role (batch) or best role fallback
// // //   useEffect(() => {
// // //     (async () => {
// // //       if (people.length === 0) return;
// // //       setMatchErr(null);

// // //       if (selectedJob?.id) {
// // //         try {
// // //           const results = await MatchAPI.scoreBatch({ resumes: resumesForAPI, job: selectedJob });
// // //           setPeople((prev) =>
// // //             prev.map((p, i) => ({
// // //               ...p,
// // //               score: toPercent(results?.[i]?.score),
// // //               bestRoleTitle: selectedJob.title,
// // //               breakdown: results?.[i]?.breakdown || null,
// // //               details: results?.[i]?.details || null,
// // //             }))
// // //           );
// // //           return;
// // //         } catch (e: any) {
// // //           setMatchErr(`Match (batch) failed: ${e?.message || e}`);
// // //           console.error("Match batch error", e);
// // //         }
// // //       }

// // //       try {
// // //         const perCandidate = await Promise.all(resumesForAPI.map((r) => MatchAPI.scoreAgainstAllJobs(r)));
// // //         setPeople((prev) =>
// // //           prev.map((p, i) => {
// // //             const top = perCandidate[i]?.[0];
// // //             return {
// // //               ...p,
// // //               score: toPercent(top?.score),
// // //               bestRoleTitle: top?.title ?? null,
// // //               breakdown: top?.breakdown || null,
// // //               details: top?.details || null,
// // //             };
// // //           })
// // //         );
// // //       } catch (e: any) {
// // //         setMatchErr(`Match (best-role) failed: ${e?.message || e}`);
// // //         console.error("Match best-role error", e);
// // //       }
// // //     })();
// // //   }, [selectedJob?.id, resumesForAPI, people.length]);

// // //   // Search, sort, and filter OUT deleted items using isDeleted()
// // //   const visiblePeople = useMemo(() => {
// // //     const q = query.trim().toLowerCase();
// // //     const filtered = q
// // //       ? people.filter((p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)))
// // //       : people.slice();

// // //     // Remove soft-deleted items
// // //     const activeFiltered = filtered.filter((p) => !isDeleted(p.id));

// // //     switch (sort) {
// // //       case "exp_desc":
// // //         activeFiltered.sort((a, b) => (b.years || 0) - (a.years || 0));
// // //         break;
// // //       case "exp_asc":
// // //         activeFiltered.sort((a, b) => (a.years || 0) - (b.years || 0));
// // //         break;
// // //       default:
// // //         activeFiltered.sort((a, b) => (b.score || 0) - (a.score || 0));
// // //     }
// // //     return activeFiltered;
// // //   }, [people, query, sort, isDeleted]);

// // //   // Create a new role via API and update UI
// // //   const createRole = async (payload: Omit<JobRequirements, "id">): Promise<JobRequirements> => {
// // //     const BASE = apiBase();
// // //     const res = await fetch(`${BASE}/api/v1/jobs`, {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json" },
// // //       body: JSON.stringify(payload),
// // //     });
// // //     if (!res.ok) {
// // //       const text = await res.text();
// // //       throw new Error(text || `HTTP ${res.status}`);
// // //     }
// // //     const job = (await res.json()) as JobRequirements;
// // //     setJobs((prev) => [job, ...prev]);
// // //     setSelectedJob(job);
// // //     return job;
// // //   };

// // //   const renderMainContent = () => {
// // //     if (activePage === "resumes") return <ResumesPage />;
// // //     if (activePage === "bin") return <BinPage />;
// // //     if (activePage !== "dashboard")
// // //       return (
// // //         <div className={`p-8 ${TEXT_COLOR}`}>
// // //           <h2 className="text-2xl">{activePage.charAt(0).toUpperCase() + activePage.slice(1)} Page</h2>
// // //           <p className={MUTED_COLOR}>Content goes here.</p>
// // //         </div>
// // //       );

// // //     return (
// // //       <>
// // //         <header className="mb-6 flex items-start justify-between gap-3">
// // //           <div>
// // //             <h1 className="text-4xl font-extrabold tracking-tight text-white">Dashboard</h1>
// // //             <p className="text-base text-gray-400">Welcome back! Here's your recruitment overview.</p>
// // //           </div>
// // //           <div className="flex gap-2">
// // //             <select
// // //               className={`input border border-gray-600 rounded-lg shadow-sm focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-150 bg-[#1C2A4A] ${TEXT_COLOR} appearance-none`}
// // //               value={selectedJob?.id ?? ""}
// // //               onChange={(e) => setSelectedJob(jobs.find((j) => j.id === e.target.value) || null)}
// // //             >
// // //               <option value="">All Roles (best match)</option>
// // //               {jobs.map((j) => (
// // //                 <option key={j.id} value={j.id}>
// // //                   {j.title}
// // //                 </option>
// // //               ))}
// // //             </select>

// // //             <button
// // //               className={`font-semibold py-2 px-4 rounded-lg shadow-sm border transition-all duration-300 ${TEXT_COLOR} hover:shadow-lg`}
// // //               style={{ borderColor: PRIMARY_ACCENT, color: PRIMARY_ACCENT, backgroundColor: CARD_BG }}
// // //               onClick={() => setOpenCreateRole(true)}
// // //             >
// // //               + New Role
// // //             </button>

// // //             <button
// // //               className="text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-500 hover:scale-[1.03] active:scale-[0.98] active:shadow-xl"
// // //               style={{ background: `linear-gradient(45deg, ${HOVER_ACCENT}, ${PRIMARY_ACCENT})` }}
// // //               onClick={() => setOpenUpload(true)}
// // //             >
// // //               ⬆ Upload Resume
// // //             </button>
// // //           </div>
// // //         </header>

// // //         {matchErr && (
// // //           <div className="mb-6 rounded-lg border border-[#FFA726] bg-[#332200] px-4 py-3 text-sm text-[#FFA726] shadow-sm">
// // //             {matchErr}. Check API base & CORS. (Open console for details.)
// // //           </div>
// // //         )}

// // //         <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
// // //           <div className={`rounded-lg shadow-md border border-gray-700 p-5 transition-all duration-300 ${TEXT_COLOR}`} style={{ backgroundColor: CARD_BG }}>
// // //             <div className="text-sm text-gray-400">Total Applications</div>
// // //             <div className="text-3xl font-extrabold text-white">{people.length}</div>
// // //             <div className="text-xs text-gray-500">in system</div>
// // //           </div>
// // //           <div className={`rounded-lg shadow-md border border-gray-700 p-5 transition-all duration-300 ${TEXT_COLOR}`} style={{ backgroundColor: CARD_BG }}>
// // //             <div className="text-sm text-gray-400">Pending Reviews</div>
// // //             <div className="text-3xl font-extrabold text-white">—</div>
// // //             <div className="text-xs text-gray-500">auto</div>
// // //           </div>
// // //           <div className={`rounded-lg shadow-md border border-gray-700 p-5 transition-all duration-300 ${TEXT_COLOR}`} style={{ backgroundColor: CARD_BG }}>
// // //             <div className="text-sm text-gray-400">Scheduled Interviews</div>
// // //             <div className="text-3xl font-extrabold text-white">—</div>
// // //             <div className="text-xs text-gray-500">this week</div>
// // //           </div>
// // //           <div className={`rounded-lg shadow-xl border border-gray-700 p-5 border-2 ${TEXT_COLOR}`} style={{ borderColor: PRIMARY_ACCENT, backgroundColor: CARD_BG }}>
// // //             <div className="text-sm text-gray-400">Top Matches</div>
// // //             <div className="text-3xl font-extrabold" style={{ color: PRIMARY_ACCENT }}>
// // //               {people.filter((p) => (p.score || 0) >= 90).length}
// // //             </div>
// // //             <div className="text-xs text-gray-500">90%+ match</div>
// // //           </div>
// // //         </section>

// // //         <div className="mb-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
// // //           <div>
// // //             <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
// // //               <input
// // //                 className={`input w-full max-w-sm rounded-lg border border-gray-600 shadow-sm px-4 py-2 focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-150 bg-[#1C2A4A] ${TEXT_COLOR}`}
// // //                 placeholder="Search candidates..."
// // //                 value={query}
// // //                 onChange={(e) => setQuery(e.target.value)}
// // //               />
// // //               <div className="flex gap-2">
// // //                 <select
// // //                   className={`input rounded-lg border border-gray-600 shadow-sm px-4 py-2 focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-150 bg-[#1C2A4A] ${TEXT_COLOR} appearance-none`}
// // //                   value={sort}
// // //                   onChange={(e) => setSort(e.target.value as SortKey)}
// // //                 >
// // //                   <option value="score_desc">Best Match</option>
// // //                   <option value="exp_desc">Experience: High → Low</option>
// // //                   <option value="exp_asc">Experience: Low → High</option>
// // //                 </select>
// // //                 <select className={`input rounded-lg border border-gray-600 shadow-sm px-4 py-2 focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-150 bg-[#1C2A4A] ${TEXT_COLOR} appearance-none`}>
// // //                   <option>Status</option>
// // //                 </select>
// // //               </div>
// // //             </div>
// // //             <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
// // //               {visiblePeople.map((p) => (
// // //                 <CandidateCard key={p.id} person={p} />
// // //               ))}
// // //             </section>
// // //           </div>
// // //           <div className={`rounded-lg shadow-sm border border-gray-600 p-5 h-fit ${TEXT_COLOR}`} style={{ backgroundColor: CARD_BG }}>
// // //             <div className="text-lg font-bold mb-3 text-white">Generated Questions</div>
// // //             <QuestionsPanel />
// // //           </div>
// // //         </div>
// // //       </>
// // //     );
// // //   };

// // //   return (
// // //     <div className={`min-h-screen grid grid-cols-1 md:grid-cols-[280px_1fr] ${MAIN_BG}`}>
// // //       <aside className={`hidden md:block shadow-2xl z-10`} style={{ backgroundColor: CARD_BG }}>
// // //         <div className="p-6 text-2xl font-extrabold text-white tracking-wider">S2 Integrators</div>
// // //         <nav className="px-4 space-y-2 pt-6">
// // //           {[
// // //             { id: "dashboard", label: "Dashboard" },
// // //             { id: "resumes", label: "Resumes" },
// // //             { id: "interviews", label: "Interviews" },
// // //             { id: "recommendations", label: "Recommendations" },
// // //             { id: "settings", label: "Settings" },
// // //             { id: "bin", label: "🗑️ Bin" },
// // //           ].map(({ id, label }) => (
// // //             <a
// // //               key={id}
// // //               className={`block rounded-xl pl-5 pr-3 py-2.5 font-medium transition-colors duration-300 relative cursor-pointer ${
// // //                 activePage === id ? "font-bold text-white shadow-lg" : "text-gray-400 hover:bg-[#0A1930] hover:text-white"
// // //               }`}
// // //               style={{
// // //                 backgroundColor: activePage === id ? PRIMARY_ACCENT : 'transparent',
// // //                 color: activePage === id ? 'white' : MUTED_COLOR,
// // //               }}
// // //               onClick={() => handleSetActivePage(id as ActivePage)}
// // //             >
// // //               {label}
// // //             </a>
// // //           ))}
// // //         </nav>
// // //       </aside>

// // //       <main className="p-8">{renderMainContent()}</main>

// // //       <UploadModal open={openUpload} onClose={() => setOpenUpload(false)}>
// // //         <ResumeUpload />
// // //       </UploadModal>

// // //       <CreateRoleModal open={openCreateRole} onClose={() => setOpenCreateRole(false)} onCreate={createRole} />
// // //     </div>
// // //   );
// // // }




// // // // filepath: src/pages/Dashboard.tsx
// // // import React, { useEffect, useMemo, useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import CandidateCard from "../components/CandidateCard";
// // // import UploadModal from "../components/UploadModal";
// // // import ResumeUpload from "../components/ResumeUpload";
// // // import QuestionsPanel from "../components/QuestionsPanel";
// // // import { JobsAPI, ResumesAPI } from "../services/http";
// // // import type { JobRequirements, ResumeRecord } from "../services/http";
// // // import MatchAPI, { toPercent } from "../services/match";
// // // import { apiBase } from "../services/env";
// // // import CreateRoleModal from "../components/CreateRoleModal";
// // // import ResumesPage from "./Resumes";
// // // import BinPage from "./Bin";
// // // import useSoftDelete from "../hooks/useSoftDelete";

// // // // --- THEME CONSTANTS (Dark Blue/Indigo) ---
// // // const PRIMARY_ACCENT = "#4361EE"; // Deep Indigo / Primary Button
// // // const HOVER_ACCENT = "#5945FF"; // Deeper Purple/Blue for hover
// // // const CARD_BG = "#1C2A4A"; // Dark Blue/Gray for Cards & Containers
// // // const MAIN_BG = "bg-[#0A1930]"; // Very Dark Blue/Black Canvas
// // // const TEXT_COLOR = "text-gray-200"; // Light text for dark background
// // // const MUTED_COLOR = "text-gray-400"; // Muted light text
// // // const WAITING_ACCENT = "#FFA726"; // Orange/Yellow
// // // // ------------------------------------------

// // // type ActivePage = "dashboard" | "resumes" | "interviews" | "recommendations" | "settings" | "bin";

// // // type Person = {
// // //   id: string;
// // //   name: string;
// // //   role: string;
// // //   initials: string;
// // //   score: number;
// // //   years: number;
// // //   updated: string;
// // //   badge: string;
// // //   tags: string[];
// // //   education: number;
// // //   raw_text: string;
// // //   bestRoleTitle?: string | null;
// // //   breakdown?: import("../services/match").MatchBreakdown | null;
// // //   details?: Record<string, number> | null;
// // // };

// // // const initials = (n?: string) =>
// // //   (n || "??")
// // //     .split(" ")
// // //     .filter(Boolean)
// // //     .map((s) => s[0])
// // //     .slice(0, 2)
// // //     .join("")
// // //     .toUpperCase();

// // // type SortKey = "score_desc" | "exp_desc" | "exp_asc";

// // // export default function Dashboard() {
// // //   const navigate = useNavigate();
// // //   const [activePage, setActivePage] = useState<ActivePage>(
// // //     (localStorage.getItem("activePage") as ActivePage) || "dashboard"
// // //   );
// // //   const [openUpload, setOpenUpload] = useState(false);
// // //   const [openCreateRole, setOpenCreateRole] = useState(false);
// // //   const [jobs, setJobs] = useState<JobRequirements[]>([]);
// // //   const [selectedJob, setSelectedJob] = useState<JobRequirements | null>(null);
// // //   const [people, setPeople] = useState<Person[]>([]);
// // //   const [query, setQuery] = useState("");
// // //   const [sort, setSort] = useState<SortKey>("score_desc");
// // //   const [matchErr, setMatchErr] = useState<string | null>(null);

// // //   // Use soft-delete hook
// // //   const { isDeleted } = useSoftDelete();

// // //   const handleSetActivePage = (id: ActivePage) => {
// // //     setActivePage(id);
// // //     localStorage.setItem("activePage", id);
    
// // //     // Navigate to recommendations route if that page is selected
// // //     if (id === "recommendations") {
// // //       navigate("/recruiter/recommendations");
// // //     }
// // //   };

// // //   const mapResumes = (rows: ResumeRecord[]): Person[] =>
// // //     rows
// // //       .filter((r) => r.name && r.name !== "Candidate")
// // //       .map((r) => ({
// // //         id: r.id,
// // //         name: r.name || "Candidate",
// // //         role: "—",
// // //         initials: initials(r.name),
// // //         score: 0,
// // //         years: Number(r.years_experience || 0),
// // //         updated: new Date(r.updated_at || r.created_at || Date.now()).toDateString(),
// // //         badge: "New",
// // //         tags: Array.isArray(r.skills) ? r.skills : [],
// // //         education: Number(r.education ?? 0),
// // //         raw_text: String(r.raw_text || ""),
// // //       }));

// // //   // Initial load
// // //   useEffect(() => {
// // //     (async () => {
// // //       try {
// // //         const list = await JobsAPI.list<JobRequirements[]>();
// // //         setJobs(list);
// // //         setSelectedJob(null);
// // //       } catch (e: any) {
// // //         console.error("Jobs load failed", e);
// // //         setJobs([]);
// // //         setSelectedJob(null);
// // //       }
// // //     })();
// // //     (async () => {
// // //       try {
// // //         const list = await ResumesAPI.list<ResumeRecord[]>();
// // //         const byId = new Map<string, ResumeRecord>();
// // //         list.forEach((r) => byId.set(r.id, r));
// // //         setPeople(mapResumes(Array.from(byId.values())));
// // //       } catch (e: any) {
// // //         console.error("Resumes load failed", e);
// // //         setPeople([]);
// // //       }
// // //     })();
// // //   }, []);

// // //   // Live refresh on resumes:changed
// // //   useEffect(() => {
// // //     const h = () => {
// // //       (async () => {
// // //         try {
// // //           const list = await ResumesAPI.list<ResumeRecord[]>();
// // //           const byId = new Map<string, ResumeRecord>();
// // //           list.forEach((r) => byId.set(r.id, r));
// // //           setPeople(mapResumes(Array.from(byId.values())));
// // //         } catch (e: any) {
// // //           console.error("Resumes refresh failed", e);
// // //           setPeople([]);
// // //         }
// // //       })();
// // //     };
// // //     window.addEventListener("resumes:changed", h as EventListener);
// // //     return () => window.removeEventListener("resumes:changed", h as EventListener);
// // //   }, []);

// // //   // Payload for /match
// // //   const resumesForAPI = useMemo(
// // //     () =>
// // //       people.map((p) => ({
// // //         skills: p.tags,
// // //         years_experience: p.years,
// // //         education: p.education,
// // //         raw_text: p.raw_text,
// // //       })),
// // //     [people]
// // //   );

// // //   // Compute scores — selected role (batch) or best role fallback
// // //   useEffect(() => {
// // //     (async () => {
// // //       if (people.length === 0) return;
// // //       setMatchErr(null);

// // //       if (selectedJob?.id) {
// // //         try {
// // //           const results = await MatchAPI.scoreBatch({ resumes: resumesForAPI, job: selectedJob });
// // //           setPeople((prev) =>
// // //             prev.map((p, i) => ({
// // //               ...p,
// // //               score: toPercent(results?.[i]?.score),
// // //               bestRoleTitle: selectedJob.title,
// // //               breakdown: results?.[i]?.breakdown || null,
// // //               details: results?.[i]?.details || null,
// // //             }))
// // //           );
// // //           return;
// // //         } catch (e: any) {
// // //           setMatchErr(`Match (batch) failed: ${e?.message || e}`);
// // //           console.error("Match batch error", e);
// // //         }
// // //       }

// // //       try {
// // //         const perCandidate = await Promise.all(resumesForAPI.map((r) => MatchAPI.scoreAgainstAllJobs(r)));
// // //         setPeople((prev) =>
// // //           prev.map((p, i) => {
// // //             const top = perCandidate[i]?.[0];
// // //             return {
// // //               ...p,
// // //               score: toPercent(top?.score),
// // //               bestRoleTitle: top?.title ?? null,
// // //               breakdown: top?.breakdown || null,
// // //               details: top?.details || null,
// // //             };
// // //           })
// // //         );
// // //       } catch (e: any) {
// // //         setMatchErr(`Match (best-role) failed: ${e?.message || e}`);
// // //         console.error("Match best-role error", e);
// // //       }
// // //     })();
// // //   }, [selectedJob?.id, resumesForAPI, people.length]);

// // //   // Search, sort, and filter OUT deleted items using isDeleted()
// // //   const visiblePeople = useMemo(() => {
// // //     const q = query.trim().toLowerCase();
// // //     const filtered = q
// // //       ? people.filter((p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)))
// // //       : people.slice();

// // //     // Remove soft-deleted items
// // //     const activeFiltered = filtered.filter((p) => !isDeleted(p.id));

// // //     switch (sort) {
// // //       case "exp_desc":
// // //         activeFiltered.sort((a, b) => (b.years || 0) - (a.years || 0));
// // //         break;
// // //       case "exp_asc":
// // //         activeFiltered.sort((a, b) => (a.years || 0) - (b.years || 0));
// // //         break;
// // //       default:
// // //         activeFiltered.sort((a, b) => (b.score || 0) - (a.score || 0));
// // //     }
// // //     return activeFiltered;
// // //   }, [people, query, sort, isDeleted]);

// // //   // Create a new role via API and update UI
// // //   const createRole = async (payload: Omit<JobRequirements, "id">): Promise<JobRequirements> => {
// // //     const BASE = apiBase();
// // //     const res = await fetch(`${BASE}/api/v1/jobs`, {
// // //       method: "POST",
// // //       headers: { "Content-Type": "application/json" },
// // //       body: JSON.stringify(payload),
// // //     });
// // //     if (!res.ok) {
// // //       const text = await res.text();
// // //       throw new Error(text || `HTTP ${res.status}`);
// // //     }
// // //     const job = (await res.json()) as JobRequirements;
// // //     setJobs((prev) => [job, ...prev]);
// // //     setSelectedJob(job);
// // //     return job;
// // //   };

// // //   const renderMainContent = () => {
// // //     if (activePage === "resumes") return <ResumesPage />;
// // //     if (activePage === "bin") return <BinPage />;
// // //     if (activePage === "recommendations") {
// // //       // This case shouldn't render since we navigate away, but just in case
// // //       return null;
// // //     }
// // //     if (activePage !== "dashboard")
// // //       return (
// // //         <div className={`p-8 ${TEXT_COLOR}`}>
// // //           <h2 className="text-2xl">{activePage.charAt(0).toUpperCase() + activePage.slice(1)} Page</h2>
// // //           <p className={MUTED_COLOR}>Content goes here.</p>
// // //         </div>
// // //       );

// // //     return (
// // //       <>
// // //         <header className="mb-6 flex items-start justify-between gap-3">
// // //           <div>
// // //             <h1 className="text-4xl font-extrabold tracking-tight text-white">Dashboard</h1>
// // //             <p className="text-base text-gray-400">Welcome back! Here's your recruitment overview.</p>
// // //           </div>
// // //           <div className="flex gap-2">
// // //             <select
// // //               className={`input border border-gray-600 rounded-lg shadow-sm focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-150 bg-[#1C2A4A] ${TEXT_COLOR} appearance-none`}
// // //               value={selectedJob?.id ?? ""}
// // //               onChange={(e) => setSelectedJob(jobs.find((j) => j.id === e.target.value) || null)}
// // //             >
// // //               <option value="">All Roles (best match)</option>
// // //               {jobs.map((j) => (
// // //                 <option key={j.id} value={j.id}>
// // //                   {j.title}
// // //                 </option>
// // //               ))}
// // //             </select>

// // //             <button
// // //               className={`font-semibold py-2 px-4 rounded-lg shadow-sm border transition-all duration-300 ${TEXT_COLOR} hover:shadow-lg`}
// // //               style={{ borderColor: PRIMARY_ACCENT, color: PRIMARY_ACCENT, backgroundColor: CARD_BG }}
// // //               onClick={() => setOpenCreateRole(true)}
// // //             >
// // //               + New Role
// // //             </button>

// // //             <button
// // //               className="text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-500 hover:scale-[1.03] active:scale-[0.98] active:shadow-xl"
// // //               style={{ background: `linear-gradient(45deg, ${HOVER_ACCENT}, ${PRIMARY_ACCENT})` }}
// // //               onClick={() => setOpenUpload(true)}
// // //             >
// // //               ⬆ Upload Resume
// // //             </button>
// // //           </div>
// // //         </header>

// // //         {matchErr && (
// // //           <div className="mb-6 rounded-lg border border-[#FFA726] bg-[#332200] px-4 py-3 text-sm text-[#FFA726] shadow-sm">
// // //             {matchErr}. Check API base & CORS. (Open console for details.)
// // //           </div>
// // //         )}

// // //         <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
// // //           <div className={`rounded-lg shadow-md border border-gray-700 p-5 transition-all duration-300 ${TEXT_COLOR}`} style={{ backgroundColor: CARD_BG }}>
// // //             <div className="text-sm text-gray-400">Total Applications</div>
// // //             <div className="text-3xl font-extrabold text-white">{people.length}</div>
// // //             <div className="text-xs text-gray-500">in system</div>
// // //           </div>
// // //           <div className={`rounded-lg shadow-md border border-gray-700 p-5 transition-all duration-300 ${TEXT_COLOR}`} style={{ backgroundColor: CARD_BG }}>
// // //             <div className="text-sm text-gray-400">Pending Reviews</div>
// // //             <div className="text-3xl font-extrabold text-white">—</div>
// // //             <div className="text-xs text-gray-500">auto</div>
// // //           </div>
// // //           <div className={`rounded-lg shadow-md border border-gray-700 p-5 transition-all duration-300 ${TEXT_COLOR}`} style={{ backgroundColor: CARD_BG }}>
// // //             <div className="text-sm text-gray-400">Scheduled Interviews</div>
// // //             <div className="text-3xl font-extrabold text-white">—</div>
// // //             <div className="text-xs text-gray-500">this week</div>
// // //           </div>
// // //           <div className={`rounded-lg shadow-xl border border-gray-700 p-5 border-2 ${TEXT_COLOR}`} style={{ borderColor: PRIMARY_ACCENT, backgroundColor: CARD_BG }}>
// // //             <div className="text-sm text-gray-400">Top Matches</div>
// // //             <div className="text-3xl font-extrabold" style={{ color: PRIMARY_ACCENT }}>
// // //               {people.filter((p) => (p.score || 0) >= 90).length}
// // //             </div>
// // //             <div className="text-xs text-gray-500">90%+ match</div>
// // //           </div>
// // //         </section>

// // //         <div className="mb-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
// // //           <div>
// // //             <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
// // //               <input
// // //                 className={`input w-full max-w-sm rounded-lg border border-gray-600 shadow-sm px-4 py-2 focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-150 bg-[#1C2A4A] ${TEXT_COLOR}`}
// // //                 placeholder="Search candidates..."
// // //                 value={query}
// // //                 onChange={(e) => setQuery(e.target.value)}
// // //               />
// // //               <div className="flex gap-2">
// // //                 <select
// // //                   className={`input rounded-lg border border-gray-600 shadow-sm px-4 py-2 focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-150 bg-[#1C2A4A] ${TEXT_COLOR} appearance-none`}
// // //                   value={sort}
// // //                   onChange={(e) => setSort(e.target.value as SortKey)}
// // //                 >
// // //                   <option value="score_desc">Best Match</option>
// // //                   <option value="exp_desc">Experience: High → Low</option>
// // //                   <option value="exp_asc">Experience: Low → High</option>
// // //                 </select>
// // //                 <select className={`input rounded-lg border border-gray-600 shadow-sm px-4 py-2 focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-150 bg-[#1C2A4A] ${TEXT_COLOR} appearance-none`}>
// // //                   <option>Status</option>
// // //                 </select>
// // //               </div>
// // //             </div>
// // //             <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
// // //               {visiblePeople.map((p) => (
// // //                 <CandidateCard key={p.id} person={p} />
// // //               ))}
// // //             </section>
// // //           </div>
// // //           <div className={`rounded-lg shadow-sm border border-gray-600 p-5 h-fit ${TEXT_COLOR}`} style={{ backgroundColor: CARD_BG }}>
// // //             <div className="text-lg font-bold mb-3 text-white">Generated Questions</div>
// // //             <QuestionsPanel />
// // //           </div>
// // //         </div>
// // //       </>
// // //     );
// // //   };

// // //   return (
// // //     <div className={`min-h-screen grid grid-cols-1 md:grid-cols-[280px_1fr] ${MAIN_BG}`}>
// // //       <aside className={`hidden md:block shadow-2xl z-10`} style={{ backgroundColor: CARD_BG }}>
// // //         <div className="p-6 text-2xl font-extrabold text-white tracking-wider">S2 Integrators</div>
// // //         <nav className="px-4 space-y-2 pt-6">
// // //           {[
// // //             { id: "dashboard", label: "Dashboard" },
// // //             { id: "resumes", label: "Resumes" },
// // //             { id: "interviews", label: "Interviews" },
// // //             { id: "recommendations", label: "Recommendations" },
// // //             { id: "settings", label: "Settings" },
// // //             { id: "bin", label: "🗑️ Bin" },
// // //           ].map(({ id, label }) => (
// // //             <a
// // //               key={id}
// // //               className={`block rounded-xl pl-5 pr-3 py-2.5 font-medium transition-colors duration-300 relative cursor-pointer ${
// // //                 activePage === id ? "font-bold text-white shadow-lg" : "text-gray-400 hover:bg-[#0A1930] hover:text-white"
// // //               }`}
// // //               style={{
// // //                 backgroundColor: activePage === id ? PRIMARY_ACCENT : 'transparent',
// // //                 color: activePage === id ? 'white' : MUTED_COLOR,
// // //               }}
// // //               onClick={() => handleSetActivePage(id as ActivePage)}
// // //             >
// // //               {label}
// // //             </a>
// // //           ))}
// // //         </nav>
// // //       </aside>

// // //       <main className="p-8">{renderMainContent()}</main>

// // //       <UploadModal open={openUpload} onClose={() => setOpenUpload(false)}>
// // //         <ResumeUpload />
// // //       </UploadModal>

// // //       <CreateRoleModal open={openCreateRole} onClose={() => setOpenCreateRole(false)} onCreate={createRole} />
// // //     </div>
// // //   );
// // // }



// // // filepath: src/pages/Dashboard.tsx
// // import React, { useEffect, useMemo, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import CandidateCard from "../components/CandidateCard";
// // import UploadModal from "../components/UploadModal";
// // import ResumeUpload from "../components/ResumeUpload";
// // import QuestionsPanel from "../components/QuestionsPanel";
// // import { JobsAPI, ResumesAPI } from "../services/http";
// // import type { JobRequirements, ResumeRecord } from "../services/http";
// // import MatchAPI, { toPercent } from "../services/match";
// // import { apiBase } from "../services/env";
// // import CreateRoleModal from "../components/CreateRoleModal";
// // import ResumesPage from "./Resumes";
// // import BinPage from "./Bin";
// // import useSoftDelete from "../hooks/useSoftDelete";

// // // --- THEME CONSTANTS (Dark Blue/Indigo) ---
// // const PRIMARY_ACCENT = "#4361EE"; // Deep Indigo / Primary Button
// // const HOVER_ACCENT = "#5945FF"; // Deeper Purple/Blue for hover
// // const CARD_BG = "#1C2A4A"; // Dark Blue/Gray for Cards & Containers
// // const MAIN_BG = "bg-[#0A1930]"; // Very Dark Blue/Black Canvas
// // const TEXT_COLOR = "text-gray-200"; // Light text for dark background
// // const MUTED_COLOR = "text-gray-400"; // Muted light text
// // const WAITING_ACCENT = "#FFA726"; // Orange/Yellow
// // // ------------------------------------------

// // type ActivePage = "dashboard" | "resumes" | "interviews" | "recommendations" | "settings" | "bin";

// // type Person = {
// //   id: string;
// //   name: string;
// //   role: string;
// //   initials: string;
// //   score: number;
// //   years: number;
// //   updated: string;
// //   badge: string;
// //   tags: string[];
// //   education: number;
// //   raw_text: string;
// //   bestRoleTitle?: string | null;
// //   breakdown?: import("../services/match").MatchBreakdown | null;
// //   details?: Record<string, number> | null;
// // };

// // const initials = (n?: string) =>
// //   (n || "??")
// //     .split(" ")
// //     .filter(Boolean)
// //     .map((s) => s[0])
// //     .slice(0, 2)
// //     .join("")
// //     .toUpperCase();

// // type SortKey = "score_desc" | "exp_desc" | "exp_asc";

// // export default function Dashboard() {
// //   const navigate = useNavigate();
// //   const [activePage, setActivePage] = useState<ActivePage>(
// //     (localStorage.getItem("activePage") as ActivePage) || "dashboard"
// //   );
// //   const [openUpload, setOpenUpload] = useState(false);
// //   const [openCreateRole, setOpenCreateRole] = useState(false);
// //   const [jobs, setJobs] = useState<JobRequirements[]>([]);
// //   const [selectedJob, setSelectedJob] = useState<JobRequirements | null>(null);
// //   const [people, setPeople] = useState<Person[]>([]);
// //   const [query, setQuery] = useState("");
// //   const [sort, setSort] = useState<SortKey>("score_desc");
// //   const [matchErr, setMatchErr] = useState<string | null>(null);

// //   // Use soft-delete hook
// //   const { isDeleted } = useSoftDelete();

// //   const handleSetActivePage = (id: ActivePage) => {
// //     setActivePage(id);
// //     localStorage.setItem("activePage", id);
    
// //     // Navigate to recommendations route if that page is selected
// //     if (id === "recommendations") {
// //       navigate("/recruiter/recommendations");
// //     }
// //   };

// //   const handleLogout = () => {
// //     localStorage.removeItem("access_token");
// //     navigate("/login", { replace: true });
// //   };

// //   const mapResumes = (rows: ResumeRecord[]): Person[] =>
// //     rows
// //       .filter((r) => r.name && r.name !== "Candidate")
// //       .map((r) => ({
// //         id: r.id,
// //         name: r.name || "Candidate",
// //         role: "—",
// //         initials: initials(r.name),
// //         score: 0,
// //         years: Number(r.years_experience || 0),
// //         updated: new Date(r.updated_at || r.created_at || Date.now()).toDateString(),
// //         badge: "New",
// //         tags: Array.isArray(r.skills) ? r.skills : [],
// //         education: Number(r.education ?? 0),
// //         raw_text: String(r.raw_text || ""),
// //       }));

// //   // Initial load
// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         const list = await JobsAPI.list<JobRequirements[]>();
// //         setJobs(list);
// //         setSelectedJob(null);
// //       } catch (e: any) {
// //         console.error("Jobs load failed", e);
// //         setJobs([]);
// //         setSelectedJob(null);
// //       }
// //     })();
// //     (async () => {
// //       try {
// //         const list = await ResumesAPI.list<ResumeRecord[]>();
// //         const byId = new Map<string, ResumeRecord>();
// //         list.forEach((r) => byId.set(r.id, r));
// //         setPeople(mapResumes(Array.from(byId.values())));
// //       } catch (e: any) {
// //         console.error("Resumes load failed", e);
// //         setPeople([]);
// //       }
// //     })();
// //   }, []);

// //   // Live refresh on resumes:changed
// //   useEffect(() => {
// //     const h = () => {
// //       (async () => {
// //         try {
// //           const list = await ResumesAPI.list<ResumeRecord[]>();
// //           const byId = new Map<string, ResumeRecord>();
// //           list.forEach((r) => byId.set(r.id, r));
// //           setPeople(mapResumes(Array.from(byId.values())));
// //         } catch (e: any) {
// //           console.error("Resumes refresh failed", e);
// //           setPeople([]);
// //         }
// //       })();
// //     };
// //     window.addEventListener("resumes:changed", h as EventListener);
// //     return () => window.removeEventListener("resumes:changed", h as EventListener);
// //   }, []);

// //   // Payload for /match
// //   const resumesForAPI = useMemo(
// //     () =>
// //       people.map((p) => ({
// //         skills: p.tags,
// //         years_experience: p.years,
// //         education: p.education,
// //         raw_text: p.raw_text,
// //       })),
// //     [people]
// //   );

// //   // Compute scores — selected role (batch) or best role fallback
// //   useEffect(() => {
// //     (async () => {
// //       if (people.length === 0) return;
// //       setMatchErr(null);

// //       if (selectedJob?.id) {
// //         try {
// //           const results = await MatchAPI.scoreBatch({ resumes: resumesForAPI, job: selectedJob });
// //           setPeople((prev) =>
// //             prev.map((p, i) => ({
// //               ...p,
// //               score: toPercent(results?.[i]?.score),
// //               bestRoleTitle: selectedJob.title,
// //               breakdown: results?.[i]?.breakdown || null,
// //               details: results?.[i]?.details || null,
// //             }))
// //           );
// //           return;
// //         } catch (e: any) {
// //           setMatchErr(`Match (batch) failed: ${e?.message || e}`);
// //           console.error("Match batch error", e);
// //         }
// //       }

// //       try {
// //         const perCandidate = await Promise.all(resumesForAPI.map((r) => MatchAPI.scoreAgainstAllJobs(r)));
// //         setPeople((prev) =>
// //           prev.map((p, i) => {
// //             const top = perCandidate[i]?.[0];
// //             return {
// //               ...p,
// //               score: toPercent(top?.score),
// //               bestRoleTitle: top?.title ?? null,
// //               breakdown: top?.breakdown || null,
// //               details: top?.details || null,
// //             };
// //           })
// //         );
// //       } catch (e: any) {
// //         setMatchErr(`Match (best-role) failed: ${e?.message || e}`);
// //         console.error("Match best-role error", e);
// //       }
// //     })();
// //   }, [selectedJob?.id, resumesForAPI, people.length]);

// //   // Search, sort, and filter OUT deleted items using isDeleted()
// //   const visiblePeople = useMemo(() => {
// //     const q = query.trim().toLowerCase();
// //     const filtered = q
// //       ? people.filter((p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)))
// //       : people.slice();

// //     // Remove soft-deleted items
// //     const activeFiltered = filtered.filter((p) => !isDeleted(p.id));

// //     switch (sort) {
// //       case "exp_desc":
// //         activeFiltered.sort((a, b) => (b.years || 0) - (a.years || 0));
// //         break;
// //       case "exp_asc":
// //         activeFiltered.sort((a, b) => (a.years || 0) - (b.years || 0));
// //         break;
// //       default:
// //         activeFiltered.sort((a, b) => (b.score || 0) - (a.score || 0));
// //     }
// //     return activeFiltered;
// //   }, [people, query, sort, isDeleted]);

// //   // Create a new role via API and update UI
// //   const createRole = async (payload: Omit<JobRequirements, "id">): Promise<JobRequirements> => {
// //     const BASE = apiBase();
// //     const res = await fetch(`${BASE}/api/v1/jobs`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(payload),
// //     });
// //     if (!res.ok) {
// //       const text = await res.text();
// //       throw new Error(text || `HTTP ${res.status}`);
// //     }
// //     const job = (await res.json()) as JobRequirements;
// //     setJobs((prev) => [job, ...prev]);
// //     setSelectedJob(job);
// //     return job;
// //   };

// //   const renderMainContent = () => {
// //     if (activePage === "resumes") return <ResumesPage />;
// //     if (activePage === "bin") return <BinPage />;
// //     if (activePage === "recommendations") {
// //       // This case shouldn't render since we navigate away, but just in case
// //       return null;
// //     }
// //     if (activePage !== "dashboard")
// //       return (
// //         <div className={`p-8 ${TEXT_COLOR}`}>
// //           <h2 className="text-2xl">{activePage.charAt(0).toUpperCase() + activePage.slice(1)} Page</h2>
// //           <p className={MUTED_COLOR}>Content goes here.</p>
// //         </div>
// //       );

// //     return (
// //       <>
// //         <header className="mb-6 flex items-start justify-between gap-3">
// //           <div>
// //             <h1 className="text-4xl font-extrabold tracking-tight text-white">Dashboard</h1>
// //             <p className="text-base text-gray-400">Welcome back! Here's your recruitment overview.</p>
// //           </div>
// //           <div className="flex gap-2">
// //             <select
// //               className={`input border border-gray-600 rounded-lg shadow-sm focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-150 bg-[#1C2A4A] ${TEXT_COLOR} appearance-none`}
// //               value={selectedJob?.id ?? ""}
// //               onChange={(e) => setSelectedJob(jobs.find((j) => j.id === e.target.value) || null)}
// //             >
// //               <option value="">All Roles (best match)</option>
// //               {jobs.map((j) => (
// //                 <option key={j.id} value={j.id}>
// //                   {j.title}
// //                 </option>
// //               ))}
// //             </select>

// //             <button
// //               className={`font-semibold py-2 px-4 rounded-lg shadow-sm border transition-all duration-300 ${TEXT_COLOR} hover:shadow-lg`}
// //               style={{ borderColor: PRIMARY_ACCENT, color: PRIMARY_ACCENT, backgroundColor: CARD_BG }}
// //               onClick={() => setOpenCreateRole(true)}
// //             >
// //               + New Role
// //             </button>

// //             <button
// //               className="text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-500 hover:scale-[1.03] active:scale-[0.98] active:shadow-xl"
// //               style={{ background: `linear-gradient(45deg, ${HOVER_ACCENT}, ${PRIMARY_ACCENT})` }}
// //               onClick={() => setOpenUpload(true)}
// //             >
// //               ⬆ Upload Resume
// //             </button>
// //           </div>
// //         </header>

// //         {matchErr && (
// //           <div className="mb-6 rounded-lg border border-[#FFA726] bg-[#332200] px-4 py-3 text-sm text-[#FFA726] shadow-sm">
// //             {matchErr}. Check API base & CORS. (Open console for details.)
// //           </div>
// //         )}

// //         <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
// //           <div className={`rounded-lg shadow-md border border-gray-700 p-5 transition-all duration-300 ${TEXT_COLOR}`} style={{ backgroundColor: CARD_BG }}>
// //             <div className="text-sm text-gray-400">Total Applications</div>
// //             <div className="text-3xl font-extrabold text-white">{people.length}</div>
// //             <div className="text-xs text-gray-500">in system</div>
// //           </div>
// //           <div className={`rounded-lg shadow-md border border-gray-700 p-5 transition-all duration-300 ${TEXT_COLOR}`} style={{ backgroundColor: CARD_BG }}>
// //             <div className="text-sm text-gray-400">Pending Reviews</div>
// //             <div className="text-3xl font-extrabold text-white">—</div>
// //             <div className="text-xs text-gray-500">auto</div>
// //           </div>
// //           <div className={`rounded-lg shadow-md border border-gray-700 p-5 transition-all duration-300 ${TEXT_COLOR}`} style={{ backgroundColor: CARD_BG }}>
// //             <div className="text-sm text-gray-400">Scheduled Interviews</div>
// //             <div className="text-3xl font-extrabold text-white">—</div>
// //             <div className="text-xs text-gray-500">this week</div>
// //           </div>
// //           <div className={`rounded-lg shadow-xl border border-gray-700 p-5 border-2 ${TEXT_COLOR}`} style={{ borderColor: PRIMARY_ACCENT, backgroundColor: CARD_BG }}>
// //             <div className="text-sm text-gray-400">Top Matches</div>
// //             <div className="text-3xl font-extrabold" style={{ color: PRIMARY_ACCENT }}>
// //               {people.filter((p) => (p.score || 0) >= 90).length}
// //             </div>
// //             <div className="text-xs text-gray-500">90%+ match</div>
// //           </div>
// //         </section>

// //         <div className="mb-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
// //           <div>
// //             <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
// //               <input
// //                 className={`input w-full max-w-sm rounded-lg border border-gray-600 shadow-sm px-4 py-2 focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-150 bg-[#1C2A4A] ${TEXT_COLOR}`}
// //                 placeholder="Search candidates..."
// //                 value={query}
// //                 onChange={(e) => setQuery(e.target.value)}
// //               />
// //               <div className="flex gap-2">
// //                 <select
// //                   className={`input rounded-lg border border-gray-600 shadow-sm px-4 py-2 focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-150 bg-[#1C2A4A] ${TEXT_COLOR} appearance-none`}
// //                   value={sort}
// //                   onChange={(e) => setSort(e.target.value as SortKey)}
// //                 >
// //                   <option value="score_desc">Best Match</option>
// //                   <option value="exp_desc">Experience: High → Low</option>
// //                   <option value="exp_asc">Experience: Low → High</option>
// //                 </select>
// //                 <select className={`input rounded-lg border border-gray-600 shadow-sm px-4 py-2 focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-150 bg-[#1C2A4A] ${TEXT_COLOR} appearance-none`}>
// //                   <option>Status</option>
// //                 </select>
// //               </div>
// //             </div>
// //             <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
// //               {visiblePeople.map((p) => (
// //                 <CandidateCard key={p.id} person={p} />
// //               ))}
// //             </section>
// //           </div>
// //           <div className={`rounded-lg shadow-sm border border-gray-600 p-5 h-fit ${TEXT_COLOR}`} style={{ backgroundColor: CARD_BG }}>
// //             <div className="text-lg font-bold mb-3 text-white">Generated Questions</div>
// //             <QuestionsPanel />
// //           </div>
// //         </div>
// //       </>
// //     );
// //   };

// //   return (
// //     <div className={`min-h-screen grid grid-cols-1 md:grid-cols-[280px_1fr] ${MAIN_BG}`}>
// //       <aside className={`hidden md:block shadow-2xl z-10`} style={{ backgroundColor: CARD_BG }}>
// //         <div className="p-6 text-2xl font-extrabold text-white tracking-wider">S2 Integrators</div>
// //         <nav className="px-4 space-y-2 pt-6">
// //           {[
// //             { id: "dashboard", label: "Dashboard" },
// //             { id: "resumes", label: "Resumes" },
// //             { id: "interviews", label: "Interviews" },
// //             { id: "recommendations", label: "Recommendations" },
// //             { id: "settings", label: "Settings" },
// //             { id: "bin", label: "🗑️ Bin" },
// //           ].map(({ id, label }) => (
// //             <a
// //               key={id}
// //               className={`block rounded-xl pl-5 pr-3 py-2.5 font-medium transition-colors duration-300 relative cursor-pointer ${
// //                 activePage === id ? "font-bold text-white shadow-lg" : "text-gray-400 hover:bg-[#0A1930] hover:text-white"
// //               }`}
// //               style={{
// //                 backgroundColor: activePage === id ? PRIMARY_ACCENT : 'transparent',
// //                 color: activePage === id ? 'white' : MUTED_COLOR,
// //               }}
// //               onClick={() => handleSetActivePage(id as ActivePage)}
// //             >
// //               {label}
// //             </a>
// //           ))}
          
// //           {/* Logout Button */}
// //           <button
// //             onClick={handleLogout}
// //             className="w-full text-left block rounded-xl pl-5 pr-3 py-2.5 font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors duration-300 cursor-pointer mt-4"
// //           >
// //             Logout
// //           </button>
// //         </nav>
// //       </aside>

// //       <main className="p-8">{renderMainContent()}</main>

// //       <UploadModal open={openUpload} onClose={() => setOpenUpload(false)}>
// //         <ResumeUpload />
// //       </UploadModal>

// //       <CreateRoleModal open={openCreateRole} onClose={() => setOpenCreateRole(false)} onCreate={createRole} />
// //     </div>
// //   );
// // }



// // // filepath: src/pages/Dashboard.tsx
// // import React, { useEffect, useMemo, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import CandidateCard from "../components/CandidateCard";
// // import UploadModal from "../components/UploadModal";
// // import ResumeUpload from "../components/ResumeUpload";
// // import QuestionsPanel from "../components/QuestionsPanel";
// // import { JobsAPI, ResumesAPI } from "../services/http";
// // import type { JobRequirements, ResumeRecord } from "../services/http";
// // import MatchAPI, { toPercent } from "../services/match";
// // import { apiBase } from "../services/env";
// // import CreateRoleModal from "../components/CreateRoleModal";
// // import ResumesPage from "./Resumes";
// // import BinPage from "./Bin";
// // import useSoftDelete from "../hooks/useSoftDelete";

// // // --- THEME CONSTANTS (Dark Blue/Indigo) ---
// // const PRIMARY_ACCENT = "#4361EE"; // Deep Indigo / Primary Button
// // const HOVER_ACCENT = "#5945FF"; // Deeper Purple/Blue for hover
// // const CARD_BG = "#1C2A4A"; // Dark Blue/Gray for Cards & Containers
// // const MAIN_BG = "bg-[#0A1930]"; // Very Dark Blue/Black Canvas
// // const TEXT_COLOR = "text-gray-200"; // Light text for dark background
// // const MUTED_COLOR = "text-gray-400"; // Muted light text
// // const WAITING_ACCENT = "#FFA726"; // Orange/Yellow
// // // ------------------------------------------

// // type ActivePage = "dashboard" | "resumes" | "interviews" | "recommendations" | "settings" | "bin";

// // type Person = {
// //   id: string;
// //   name: string;
// //   role: string;
// //   initials: string;
// //   score: number;
// //   years: number;
// //   updated: string;
// //   badge: string;
// //   tags: string[];
// //   education: number;
// //   raw_text: string;
// //   bestRoleTitle?: string | null;
// //   breakdown?: import("../services/match").MatchBreakdown | null;
// //   details?: Record<string, number> | null;
// // };

// // const initials = (n?: string) =>
// //   (n || "??")
// //     .split(" ")
// //     .filter(Boolean)
// //     .map((s) => s[0])
// //     .slice(0, 2)
// //     .join("")
// //     .toUpperCase();

// // type SortKey = "score_desc" | "exp_desc" | "exp_asc";

// // export default function Dashboard() {
// //   const navigate = useNavigate();
// //   const [activePage, setActivePage] = useState<ActivePage>(
// //     (localStorage.getItem("activePage") as ActivePage) || "dashboard"
// //   );
// //   const [openUpload, setOpenUpload] = useState(false);
// //   const [openCreateRole, setOpenCreateRole] = useState(false);
// //   const [jobs, setJobs] = useState<JobRequirements[]>([]);
// //   const [selectedJob, setSelectedJob] = useState<JobRequirements | null>(null);
// //   const [people, setPeople] = useState<Person[]>([]);
// //   const [query, setQuery] = useState("");
// //   const [sort, setSort] = useState<SortKey>("score_desc");
// //   const [matchErr, setMatchErr] = useState<string | null>(null);

// //   // Use soft-delete hook
// //   const { isDeleted } = useSoftDelete();

// //   const handleSetActivePage = (id: ActivePage) => {
// //     setActivePage(id);
// //     localStorage.setItem("activePage", id);
    
// //     // Navigate to recommendations route if that page is selected
// //     if (id === "recommendations") {
// //       navigate("/recruiter/recommendations");
// //     }
// //   };

// //   const handleLogout = () => {
// //     localStorage.removeItem("access_token");
// //     navigate("/login", { replace: true });
// //   };

// //   const mapResumes = (rows: ResumeRecord[]): Person[] =>
// //     rows
// //       .filter((r) => r.name && r.name !== "Candidate")
// //       .map((r) => ({
// //         id: r.id,
// //         name: r.name || "Candidate",
// //         role: "—",
// //         initials: initials(r.name),
// //         score: 0,
// //         years: Number(r.years_experience || 0),
// //         updated: new Date(r.updated_at || r.created_at || Date.now()).toDateString(),
// //         badge: "New",
// //         tags: Array.isArray(r.skills) ? r.skills : [],
// //         education: Number(r.education ?? 0),
// //         raw_text: String(r.raw_text || ""),
// //       }));

// //   // Initial load
// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         const list = await JobsAPI.list<JobRequirements[]>();
// //         setJobs(list);
// //         setSelectedJob(null);
// //       } catch (e: any) {
// //         console.error("Jobs load failed", e);
// //         setJobs([]);
// //         setSelectedJob(null);
// //       }
// //     })();
// //     (async () => {
// //       try {
// //         const list = await ResumesAPI.list<ResumeRecord[]>();
// //         const byId = new Map<string, ResumeRecord>();
// //         list.forEach((r) => byId.set(r.id, r));
// //         setPeople(mapResumes(Array.from(byId.values())));
// //       } catch (e: any) {
// //         console.error("Resumes load failed", e);
// //         setPeople([]);
// //       }
// //     })();
// //   }, []);

// //   // Live refresh on resumes:changed
// //   useEffect(() => {
// //     const h = () => {
// //       (async () => {
// //         try {
// //           const list = await ResumesAPI.list<ResumeRecord[]>();
// //           const byId = new Map<string, ResumeRecord>();
// //           list.forEach((r) => byId.set(r.id, r));
// //           setPeople(mapResumes(Array.from(byId.values())));
// //         } catch (e: any) {
// //           console.error("Resumes refresh failed", e);
// //           setPeople([]);
// //         }
// //       })();
// //     };
// //     window.addEventListener("resumes:changed", h as EventListener);
// //     return () => window.removeEventListener("resumes:changed", h as EventListener);
// //   }, []);

// //   // Payload for /match
// //   const resumesForAPI = useMemo(
// //     () =>
// //       people.map((p) => ({
// //         skills: p.tags,
// //         years_experience: p.years,
// //         education: p.education,
// //         raw_text: p.raw_text,
// //       })),
// //     [people]
// //   );

// //   // Compute scores — selected role (batch) or best role fallback
// //   useEffect(() => {
// //     (async () => {
// //       if (people.length === 0) return;
// //       setMatchErr(null);

// //       if (selectedJob?.id) {
// //         try {
// //           const results = await MatchAPI.scoreBatch({ resumes: resumesForAPI, job: selectedJob });
// //           setPeople((prev) =>
// //             prev.map((p, i) => ({
// //               ...p,
// //               score: toPercent(results?.[i]?.score),
// //               bestRoleTitle: selectedJob.title,
// //               breakdown: results?.[i]?.breakdown || null,
// //               details: results?.[i]?.details || null,
// //             }))
// //           );
// //           return;
// //         } catch (e: any) {
// //           setMatchErr(`Match (batch) failed: ${e?.message || e}`);
// //           console.error("Match batch error", e);
// //         }
// //       }

// //       try {
// //         const perCandidate = await Promise.all(resumesForAPI.map((r) => MatchAPI.scoreAgainstAllJobs(r)));
// //         setPeople((prev) =>
// //           prev.map((p, i) => {
// //             const top = perCandidate[i]?.[0];
// //             return {
// //               ...p,
// //               score: toPercent(top?.score),
// //               bestRoleTitle: top?.title ?? null,
// //               breakdown: top?.breakdown || null,
// //               details: top?.details || null,
// //             };
// //           })
// //         );
// //       } catch (e: any) {
// //         setMatchErr(`Match (best-role) failed: ${e?.message || e}`);
// //         console.error("Match best-role error", e);
// //       }
// //     })();
// //   }, [selectedJob?.id, resumesForAPI, people.length]);

// //   // Search, sort, and filter OUT deleted items using isDeleted()
// //   const visiblePeople = useMemo(() => {
// //     const q = query.trim().toLowerCase();
// //     const filtered = q
// //       ? people.filter((p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)))
// //       : people.slice();

// //     // Remove soft-deleted items
// //     const activeFiltered = filtered.filter((p) => !isDeleted(p.id));

// //     switch (sort) {
// //       case "exp_desc":
// //         activeFiltered.sort((a, b) => (b.years || 0) - (a.years || 0));
// //         break;
// //       case "exp_asc":
// //         activeFiltered.sort((a, b) => (a.years || 0) - (b.years || 0));
// //         break;
// //       default:
// //         activeFiltered.sort((a, b) => (b.score || 0) - (a.score || 0));
// //     }
// //     return activeFiltered;
// //   }, [people, query, sort, isDeleted]);

// //   // Create a new role via API and update UI
// //   const createRole = async (payload: Omit<JobRequirements, "id">): Promise<JobRequirements> => {
// //     const BASE = apiBase();
// //     const res = await fetch(`${BASE}/api/v1/jobs`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(payload),
// //     });
// //     if (!res.ok) {
// //       const text = await res.text();
// //       throw new Error(text || `HTTP ${res.status}`);
// //     }
// //     const job = (await res.json()) as JobRequirements;
// //     setJobs((prev) => [job, ...prev]);
// //     setSelectedJob(job);
// //     return job;
// //   };

// //   const renderMainContent = () => {
// //     if (activePage === "resumes") return <ResumesPage />;
// //     if (activePage === "bin") return <BinPage />;
// //     if (activePage === "recommendations") {
// //       // This case shouldn't render since we navigate away, but just in case
// //       return null;
// //     }
// //     if (activePage !== "dashboard")
// //       return (
// //         <div className={`p-8 ${TEXT_COLOR}`}>
// //           <h2 className="text-2xl">{activePage.charAt(0).toUpperCase() + activePage.slice(1)} Page</h2>
// //           <p className={MUTED_COLOR}>Content goes here.</p>
// //         </div>
// //       );

// //     return (
// //       <>
// //         <header className="mb-6 flex items-start justify-between gap-3">
// //           <div>
// //             <h1 className="text-4xl font-extrabold tracking-tight text-white">Dashboard</h1>
// //             <p className="text-base text-gray-400">Welcome back! Here's your recruitment overview.</p>
// //           </div>
// //           <div className="flex gap-2">
// //             <select
// //               className={`input border border-gray-600 rounded-lg shadow-sm focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-150 bg-[#1C2A4A] ${TEXT_COLOR} appearance-none`}
// //               value={selectedJob?.id ?? ""}
// //               onChange={(e) => setSelectedJob(jobs.find((j) => j.id === e.target.value) || null)}
// //             >
// //               <option value="">All Roles (best match)</option>
// //               {jobs.map((j) => (
// //                 <option key={j.id} value={j.id}>
// //                   {j.title}
// //                 </option>
// //               ))}
// //             </select>

// //             <button
// //               className={`font-semibold py-2 px-4 rounded-lg shadow-sm border transition-all duration-300 ${TEXT_COLOR} hover:shadow-lg`}
// //               style={{ borderColor: PRIMARY_ACCENT, color: PRIMARY_ACCENT, backgroundColor: CARD_BG }}
// //               onClick={() => setOpenCreateRole(true)}
// //             >
// //               + New Role
// //             </button>

// //             <button
// //               className="text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-500 hover:scale-[1.03] active:scale-[0.98] active:shadow-xl"
// //               style={{ background: `linear-gradient(45deg, ${HOVER_ACCENT}, ${PRIMARY_ACCENT})` }}
// //               onClick={() => setOpenUpload(true)}
// //             >
// //               ⬆ Upload Resume
// //             </button>
// //           </div>
// //         </header>

// //         {matchErr && (
// //           <div className="mb-6 rounded-lg border border-[#FFA726] bg-[#332200] px-4 py-3 text-sm text-[#FFA726] shadow-sm">
// //             {matchErr}. Check API base & CORS. (Open console for details.)
// //           </div>
// //         )}

// //         <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
// //           <div className={`rounded-lg shadow-md border border-gray-700 p-5 transition-all duration-300 ${TEXT_COLOR}`} style={{ backgroundColor: CARD_BG }}>
// //             <div className="text-sm text-gray-400">Total Applications</div>
// //             <div className="text-3xl font-extrabold text-white">{people.length}</div>
// //             <div className="text-xs text-gray-500">in system</div>
// //           </div>
// //           <div className={`rounded-lg shadow-md border border-gray-700 p-5 transition-all duration-300 ${TEXT_COLOR}`} style={{ backgroundColor: CARD_BG }}>
// //             <div className="text-sm text-gray-400">Pending Reviews</div>
// //             <div className="text-3xl font-extrabold text-white">—</div>
// //             <div className="text-xs text-gray-500">auto</div>
// //           </div>
// //           <div className={`rounded-lg shadow-md border border-gray-700 p-5 transition-all duration-300 ${TEXT_COLOR}`} style={{ backgroundColor: CARD_BG }}>
// //             <div className="text-sm text-gray-400">Scheduled Interviews</div>
// //             <div className="text-3xl font-extrabold text-white">—</div>
// //             <div className="text-xs text-gray-500">this week</div>
// //           </div>
// //           <div className={`rounded-lg shadow-xl border border-gray-700 p-5 border-2 ${TEXT_COLOR}`} style={{ borderColor: PRIMARY_ACCENT, backgroundColor: CARD_BG }}>
// //             <div className="text-sm text-gray-400">Top Matches</div>
// //             <div className="text-3xl font-extrabold" style={{ color: PRIMARY_ACCENT }}>
// //               {people.filter((p) => (p.score || 0) >= 90).length}
// //             </div>
// //             <div className="text-xs text-gray-500">90%+ match</div>
// //           </div>
// //         </section>

// //         <div className="mb-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
// //           <div>
// //             <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
// //               <input
// //                 className={`input w-full max-w-sm rounded-lg border border-gray-600 shadow-sm px-4 py-2 focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-150 bg-[#1C2A4A] ${TEXT_COLOR}`}
// //                 placeholder="Search candidates..."
// //                 value={query}
// //                 onChange={(e) => setQuery(e.target.value)}
// //               />
// //               <div className="flex gap-2">
// //                 <select
// //                   className={`input rounded-lg border border-gray-600 shadow-sm px-4 py-2 focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-150 bg-[#1C2A4A] ${TEXT_COLOR} appearance-none`}
// //                   value={sort}
// //                   onChange={(e) => setSort(e.target.value as SortKey)}
// //                 >
// //                   <option value="score_desc">Best Match</option>
// //                   <option value="exp_desc">Experience: High → Low</option>
// //                   <option value="exp_asc">Experience: Low → High</option>
// //                 </select>
// //                 <select className={`input rounded-lg border border-gray-600 shadow-sm px-4 py-2 focus:border-gray-400 focus:ring-1 focus:ring-gray-500 transition-all duration-150 bg-[#1C2A4A] ${TEXT_COLOR} appearance-none`}>
// //                   <option>Status</option>
// //                 </select>
// //               </div>
// //             </div>
// //             <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
// //               {visiblePeople.map((p) => (
// //                 <CandidateCard key={p.id} person={p} />
// //               ))}
// //             </section>
// //           </div>
// //           <div className={`rounded-lg shadow-sm border border-gray-600 p-5 h-fit ${TEXT_COLOR}`} style={{ backgroundColor: CARD_BG }}>
// //             <div className="text-lg font-bold mb-3 text-white">Generated Questions</div>
// //             <QuestionsPanel />
// //           </div>
// //         </div>
// //       </>
// //     );
// //   };

// //   return (
// //     <div className={`min-h-screen grid grid-cols-1 md:grid-cols-[280px_1fr] ${MAIN_BG}`}>
// //       <aside className={`hidden md:block shadow-2xl z-10`} style={{ backgroundColor: CARD_BG }}>
// //         <div className="p-6 text-2xl font-extrabold text-white tracking-wider">S2 Integrators</div>
// //         <nav className="px-4 space-y-2 pt-6">
// //           {[
// //             { id: "dashboard", label: "Dashboard" },
// //             { id: "resumes", label: "Resumes" },
// //             { id: "interviews", label: "Interviews" },
// //             { id: "recommendations", label: "Recommendations" },
// //             { id: "settings", label: "Settings" },
// //             { id: "bin", label: "Bin" },
// //           ].map(({ id, label }) => (
// //             <a
// //               key={id}
// //               className={`block rounded-xl pl-5 pr-3 py-2.5 font-medium transition-colors duration-300 relative cursor-pointer ${
// //                 activePage === id ? "font-bold text-white shadow-lg" : "text-gray-400 hover:bg-[#0A1930] hover:text-white"
// //               }`}
// //               style={{
// //                 backgroundColor: activePage === id ? PRIMARY_ACCENT : 'transparent',
// //                 color: activePage === id ? 'white' : MUTED_COLOR,
// //               }}
// //               onClick={() => handleSetActivePage(id as ActivePage)}
// //             >
// //               {label}
// //             </a>
// //           ))}
          
// //           {/* Logout Button */}
// //           <button
// //             onClick={handleLogout}
// //             className="w-full text-left block rounded-xl pl-5 pr-3 py-2.5 font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors duration-300 cursor-pointer mt-4"
// //           >
// //             Logout
// //           </button>
// //         </nav>
// //       </aside>

// //       <main className="p-8">{renderMainContent()}</main>

// //       <UploadModal open={openUpload} onClose={() => setOpenUpload(false)}>
// //         <ResumeUpload />
// //       </UploadModal>

// //       <CreateRoleModal open={openCreateRole} onClose={() => setOpenCreateRole(false)} onCreate={createRole} />
// //     </div>
// //   );
// // }




// // // filepath: src/pages/Dashboard.tsx
// // import React, { useEffect, useMemo, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import CandidateCard from "../components/CandidateCard";
// // import UploadModal from "../components/UploadModal";
// // import ResumeUpload from "../components/ResumeUpload";
// // import QuestionsPanel from "../components/QuestionsPanel";
// // import { JobsAPI, ResumesAPI } from "../services/http";
// // import type { JobRequirements, ResumeRecord } from "../services/http";
// // import MatchAPI, { toPercent } from "../services/match";
// // import { apiBase } from "../services/env";
// // import CreateRoleModal from "../components/CreateRoleModal";
// // import ResumesPage from "./Resumes";
// // import BinPage from "./Bin";
// // import useSoftDelete from "../hooks/useSoftDelete";

// // // --- THEME CONSTANTS (Dark Blue/Indigo) ---
// // const PRIMARY_ACCENT = "#4361EE"; // Deep Indigo / Primary Button
// // const HOVER_ACCENT = "#5945FF"; // Deeper Purple/Blue for hover
// // const CARD_BG = "#1C2A4A"; // Dark Blue/Gray for Cards & Containers
// // const MAIN_BG = "bg-[#0A1930]"; // Very Dark Blue/Black Canvas
// // const TEXT_COLOR = "text-gray-200"; // Light text for dark background
// // const MUTED_COLOR = "text-gray-400"; // Muted light text
// // const WAITING_ACCENT = "#FFA726"; // Orange/Yellow
// // // ------------------------------------------

// // type ActivePage = "dashboard" | "resumes" | "interviews" | "recommendations" | "settings" | "bin";

// // type Person = {
// //   id: string;
// //   name: string;
// //   role: string;
// //   initials: string;
// //   score: number;
// //   years: number;
// //   updated: string;
// //   badge: string;
// //   tags: string[];
// //   education: number;
// //   raw_text: string;
// //   bestRoleTitle?: string | null;
// //   breakdown?: import("../services/match").MatchBreakdown | null;
// //   details?: Record<string, number> | null;
// // };

// // const initials = (n?: string) =>
// //   (n || "??")
// //     .split(" ")
// //     .filter(Boolean)
// //     .map((s) => s[0])
// //     .slice(0, 2)
// //     .join("")
// //     .toUpperCase();

// // type SortKey = "score_desc" | "exp_desc" | "exp_asc";

// // export default function Dashboard() {
// //   const navigate = useNavigate();
// //   const [activePage, setActivePage] = useState<ActivePage>(
// //     (localStorage.getItem("activePage") as ActivePage) || "dashboard"
// //   );
// //   const [openUpload, setOpenUpload] = useState(false);
// //   const [openCreateRole, setOpenCreateRole] = useState(false);
// //   const [jobs, setJobs] = useState<JobRequirements[]>([]);
// //   const [selectedJob, setSelectedJob] = useState<JobRequirements | null>(null);
// //   const [people, setPeople] = useState<Person[]>([]);
// //   const [query, setQuery] = useState("");
// //   const [sort, setSort] = useState<SortKey>("score_desc");
// //   const [matchErr, setMatchErr] = useState<string | null>(null);

// //   // Use soft-delete hook
// //   const { isDeleted } = useSoftDelete();

// //   const handleSetActivePage = (id: ActivePage) => {
// //     setActivePage(id);
// //     localStorage.setItem("activePage", id);
    
// //     // Navigate to recommendations route if that page is selected
// //     if (id === "recommendations") {
// //       navigate("/recruiter/recommendations");
// //     }
// //   };

// //   const handleLogout = () => {
// //     localStorage.removeItem("access_token");
// //     navigate("/login", { replace: true });
// //   };

// //   const mapResumes = (rows: ResumeRecord[]): Person[] =>
// //     rows
// //       .filter((r) => r.name && r.name !== "Candidate")
// //       .map((r) => ({
// //         id: r.id,
// //         name: r.name || "Candidate",
// //         role: "—",
// //         initials: initials(r.name),
// //         score: 0,
// //         years: Number(r.years_experience || 0),
// //         updated: new Date(r.updated_at || r.created_at || Date.now()).toDateString(),
// //         badge: "New",
// //         tags: Array.isArray(r.skills) ? r.skills : [],
// //         education: Number(r.education ?? 0),
// //         raw_text: String(r.raw_text || ""),
// //       }));

// //   // Initial load
// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         const list = await JobsAPI.list<JobRequirements[]>();
// //         setJobs(list);
// //         setSelectedJob(null);
// //       } catch (e: any) {
// //         console.error("Jobs load failed", e);
// //         setJobs([]);
// //         setSelectedJob(null);
// //       }
// //     })();
// //     (async () => {
// //       try {
// //         const list = await ResumesAPI.list<ResumeRecord[]>();
// //         const byId = new Map<string, ResumeRecord>();
// //         list.forEach((r) => byId.set(r.id, r));
// //         setPeople(mapResumes(Array.from(byId.values())));
// //       } catch (e: any) {
// //         console.error("Resumes load failed", e);
// //         setPeople([]);
// //       }
// //     })();
// //   }, []);

// //   // Live refresh on resumes:changed
// //   useEffect(() => {
// //     const h = () => {
// //       (async () => {
// //         try {
// //           const list = await ResumesAPI.list<ResumeRecord[]>();
// //           const byId = new Map<string, ResumeRecord>();
// //           list.forEach((r) => byId.set(r.id, r));
// //           setPeople(mapResumes(Array.from(byId.values())));
// //         } catch (e: any) {
// //           console.error("Resumes refresh failed", e);
// //           setPeople([]);
// //         }
// //       })();
// //     };
// //     window.addEventListener("resumes:changed", h as EventListener);
// //     return () => window.removeEventListener("resumes:changed", h as EventListener);
// //   }, []);

// //   // Payload for /match
// //   const resumesForAPI = useMemo(
// //     () =>
// //       people.map((p) => ({
// //         skills: p.tags,
// //         years_experience: p.years,
// //         education: p.education,
// //         raw_text: p.raw_text,
// //       })),
// //     [people]
// //   );

// //   // Compute scores — selected role (batch) or best role fallback
// //   useEffect(() => {
// //     (async () => {
// //       if (people.length === 0) return;
// //       setMatchErr(null);

// //       if (selectedJob?.id) {
// //         try {
// //           const results = await MatchAPI.scoreBatch({ resumes: resumesForAPI, job: selectedJob });
// //           setPeople((prev) =>
// //             prev.map((p, i) => ({
// //               ...p,
// //               score: toPercent(results?.[i]?.score),
// //               bestRoleTitle: selectedJob.title,
// //               breakdown: results?.[i]?.breakdown || null,
// //               details: results?.[i]?.details || null,
// //             }))
// //           );
// //           return;
// //         } catch (e: any) {
// //           setMatchErr(`Match (batch) failed: ${e?.message || e}`);
// //           console.error("Match batch error", e);
// //         }
// //       }

// //       try {
// //         const perCandidate = await Promise.all(resumesForAPI.map((r) => MatchAPI.scoreAgainstAllJobs(r)));
// //         setPeople((prev) =>
// //           prev.map((p, i) => {
// //             const top = perCandidate[i]?.[0];
// //             return {
// //               ...p,
// //               score: toPercent(top?.score),
// //               bestRoleTitle: top?.title ?? null,
// //               breakdown: top?.breakdown || null,
// //               details: top?.details || null,
// //             };
// //           })
// //         );
// //       } catch (e: any) {
// //         setMatchErr(`Match (best-role) failed: ${e?.message || e}`);
// //         console.error("Match best-role error", e);
// //       }
// //     })();
// //   }, [selectedJob?.id, resumesForAPI, people.length]);

// //   // Search, sort, and filter OUT deleted items using isDeleted()
// //   const visiblePeople = useMemo(() => {
// //     const q = query.trim().toLowerCase();
// //     const filtered = q
// //       ? people.filter((p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)))
// //       : people.slice();

// //     // Remove soft-deleted items
// //     const activeFiltered = filtered.filter((p) => !isDeleted(p.id));

// //     switch (sort) {
// //       case "exp_desc":
// //         activeFiltered.sort((a, b) => (b.years || 0) - (a.years || 0));
// //         break;
// //       case "exp_asc":
// //         activeFiltered.sort((a, b) => (a.years || 0) - (b.years || 0));
// //         break;
// //       default:
// //         activeFiltered.sort((a, b) => (b.score || 0) - (a.score || 0));
// //     }
// //     return activeFiltered;
// //   }, [people, query, sort, isDeleted]);

// //   // Create a new role via API and update UI
// //   const createRole = async (payload: Omit<JobRequirements, "id">): Promise<JobRequirements> => {
// //     const BASE = apiBase();
// //     const res = await fetch(`${BASE}/api/v1/jobs`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(payload),
// //     });
// //     if (!res.ok) {
// //       const text = await res.text();
// //       throw new Error(text || `HTTP ${res.status}`);
// //     }
// //     const job = (await res.json()) as JobRequirements;
// //     setJobs((prev) => [job, ...prev]);
// //     setSelectedJob(job);
// //     return job;
// //   };

// //   const renderMainContent = () => {
// //     if (activePage === "resumes") return <ResumesPage />;
// //     if (activePage === "bin") return <BinPage />;
// //     if (activePage === "recommendations") {
// //       // This case shouldn't render since we navigate away, but just in case
// //       return null;
// //     }
// //     if (activePage !== "dashboard")
// //       return (
// //         <div className={`p-8 ${TEXT_COLOR} animate-fadeIn`}>
// //           <h2 className="text-2xl">{activePage.charAt(0).toUpperCase() + activePage.slice(1)} Page</h2>
// //           <p className={MUTED_COLOR}>Content goes here.</p>
// //         </div>
// //       );

// //     return (
// //       <div className="animate-fadeIn">
// //         <style>{`
// //           @keyframes fadeIn {
// //             from { opacity: 0; }
// //             to { opacity: 1; }
// //           }
// //           @keyframes slideUp {
// //             from { opacity: 0; transform: translateY(20px); }
// //             to { opacity: 1; transform: translateY(0); }
// //           }
// //           @keyframes slideLeft {
// //             from { opacity: 0; transform: translateX(20px); }
// //             to { opacity: 1; transform: translateX(0); }
// //           }
// //           @keyframes pulse {
// //             0%, 100% { opacity: 1; }
// //             50% { opacity: 0.6; }
// //           }
// //           .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
// //           .animate-slideUp { animation: slideUp 0.6s ease-out backwards; }
// //           .animate-slideLeft { animation: slideLeft 0.6s ease-out; }
          
// //           .glass-card {
// //             background: rgba(28, 42, 74, 0.4);
// //             backdrop-filter: blur(12px);
// //             -webkit-backdrop-filter: blur(12px);
// //           }
// //           .glass-sidebar {
// //             background: rgba(28, 42, 74, 0.5);
// //             backdrop-filter: blur(16px);
// //             -webkit-backdrop-filter: blur(16px);
// //           }
// //           .glass-input, .glass-select {
// //             background: rgba(255, 255, 255, 0.05);
// //             backdrop-filter: blur(8px);
// //             -webkit-backdrop-filter: blur(8px);
// //           }
// //           .glass-nav-item {
// //             backdrop-filter: blur(10px);
// //             -webkit-backdrop-filter: blur(10px);
// //             position: relative;
// //             overflow: hidden;
// //           }
// //           .glass-nav-item::before {
// //             content: '';
// //             position: absolute;
// //             inset: 0;
// //             background: linear-gradient(135deg, rgba(89, 69, 255, 0.1), rgba(67, 97, 238, 0.1));
// //             opacity: 0;
// //             transition: opacity 0.3s ease;
// //           }
// //           .glass-nav-item.active::before {
// //             opacity: 1;
// //           }
// //           .glass-nav-item:hover::before {
// //             opacity: 0.5;
// //           }
// //         `}</style>

// //         <header className="mb-6 flex items-start justify-between gap-3">
// //           <div>
// //             <h1 className="text-4xl font-extrabold tracking-tight text-white">Dashboard</h1>
// //             <p className="text-base text-gray-400">Welcome back! Here's your recruitment overview.</p>
// //           </div>
// //           <div className="flex gap-2">
// //             <select
// //               className={`glass-input border border-white/10 rounded-xl shadow-sm focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/30 transition-all duration-300 ${TEXT_COLOR} appearance-none px-4 py-2`}
// //               value={selectedJob?.id ?? ""}
// //               onChange={(e) => setSelectedJob(jobs.find((j) => j.id === e.target.value) || null)}
// //             >
// //               <option value="">All Roles (best match)</option>
// //               {jobs.map((j) => (
// //                 <option key={j.id} value={j.id}>
// //                   {j.title}
// //                 </option>
// //               ))}
// //             </select>

// //             <button
// //               className={`font-semibold py-2 px-4 rounded-xl shadow-sm border border-[#4361EE]/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:bg-[#4361EE]/10 hover:border-[#4361EE] ${TEXT_COLOR}`}
// //               style={{ color: PRIMARY_ACCENT, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(8px)' }}
// //               onClick={() => setOpenCreateRole(true)}
// //             >
// //               + New Role
// //             </button>

// //             <button
// //               className="text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-all duration-500 hover:scale-[1.03] active:scale-[0.98] hover:shadow-lg hover:shadow-[#4361EE]/50"
// //               style={{ background: `linear-gradient(135deg, ${HOVER_ACCENT}, ${PRIMARY_ACCENT})` }}
// //               onClick={() => setOpenUpload(true)}
// //             >
// //               ⬆ Upload Resume
// //             </button>
// //           </div>
// //         </header>

// //         {matchErr && (
// //           <div className="mb-6 rounded-xl border border-[#FFA726] px-4 py-3 text-sm text-[#FFA726] shadow-sm animate-slideUp glass-card">
// //             {matchErr}. Check API base & CORS. (Open console for details.)
// //           </div>
// //         )}

// //         <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
// //           {[
// //             { label: "Total Applications", value: visiblePeople.length, sub: "in system", delay: 0 },
// //             { label: "Pending Reviews", value: "—", sub: "auto", delay: 100 },
// //             { label: "Scheduled Interviews", value: "—", sub: "this week", delay: 200 },
// //             { label: "Top Matches", value: visiblePeople.filter((p) => (p.score || 0) >= 90).length, sub: "90%+ match", highlight: true, delay: 300 }
// //           ].map((stat, i) => (

// //             <div
// //               key={i}
// //               className={`glass-card rounded-xl shadow-md border p-5 transition-all duration-500 hover:scale-[1.02] animate-slideUp ${
// //                 stat.highlight ? 'border-[#4361EE]/50 hover:border-[#4361EE] hover:shadow-lg hover:shadow-[#4361EE]/30' : 'border-white/10 hover:border-white/20'
// //               } ${TEXT_COLOR}`}
// //               style={{ animationDelay: `${stat.delay}ms` }}
// //             >
// //               <div className="text-sm text-gray-400">{stat.label}</div>
// //               <div className={`text-3xl font-extrabold ${stat.highlight ? 'text-[#4361EE]' : 'text-white'}`}>
// //                 {stat.value}
// //               </div>
// //               <div className="text-xs text-gray-500">{stat.sub}</div>
// //             </div>
// //           ))}
// //         </section>

// //         <div className="mb-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
// //           <div>
// //             <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
// //               <input
// //                 className={`glass-input w-full max-w-sm rounded-xl border border-white/10 shadow-sm px-4 py-2.5 focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/30 transition-all duration-300 ${TEXT_COLOR} placeholder-gray-500`}
// //                 placeholder="Search candidates..."
// //                 value={query}
// //                 onChange={(e) => setQuery(e.target.value)}
// //               />
// //               <div className="flex gap-2">
// //                 <select
// //                   className={`glass-input rounded-xl border border-white/10 shadow-sm px-4 py-2 focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/30 transition-all duration-300 ${TEXT_COLOR} appearance-none`}
// //                   value={sort}
// //                   onChange={(e) => setSort(e.target.value as SortKey)}
// //                 >
// //                   <option value="score_desc">Best Match</option>
// //                   <option value="exp_desc">Experience: High → Low</option>
// //                   <option value="exp_asc">Experience: Low → High</option>
// //                 </select>
// //                 <select className={`glass-input rounded-xl border border-white/10 shadow-sm px-4 py-2 focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/30 transition-all duration-300 ${TEXT_COLOR} appearance-none`}>
// //                   <option>Status</option>
// //                 </select>
// //               </div>
// //             </div>
// //             {visiblePeople.length > 0 ? (
// //               <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
// //                 {visiblePeople.map((p) => (
// //                   <CandidateCard key={p.id} person={p} />
// //                 ))}
// //               </section>
// //             ) : (
// //               <div className="glass-card rounded-xl border border-white/10 p-12 text-center">
// //                 <div className="text-gray-400 text-lg mb-2">No candidates found</div>
// //                 <p className="text-gray-500 text-sm">Upload resumes to get started</p>
// //               </div>
// //             )}
// //           </div>
// //           <div className={`glass-card rounded-xl shadow-sm border border-white/10 p-5 h-fit ${TEXT_COLOR} animate-slideLeft`}>
// //             <div className="text-lg font-bold mb-3 text-white">Generated Questions</div>
// //             <QuestionsPanel />
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className={`min-h-screen grid grid-cols-1 md:grid-cols-[280px_1fr] ${MAIN_BG}`}>
// //       <style>{`
// //         @keyframes fadeIn {
// //           from { opacity: 0; }
// //           to { opacity: 1; }
// //         }
// //         @keyframes slideUp {
// //           from { opacity: 0; transform: translateY(20px); }
// //           to { opacity: 1; transform: translateY(0); }
// //         }
// //         @keyframes slideLeft {
// //           from { opacity: 0; transform: translateX(20px); }
// //           to { opacity: 1; transform: translateX(0); }
// //         }
// //         .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
// //         .animate-slideUp { animation: slideUp 0.6s ease-out backwards; }
// //         .animate-slideLeft { animation: slideLeft 0.6s ease-out; }
        
// //         .glass-card {
// //           background: rgba(28, 42, 74, 0.4);
// //           backdrop-filter: blur(12px);
// //           -webkit-backdrop-filter: blur(12px);
// //         }
// //         .glass-sidebar {
// //           background: rgba(28, 42, 74, 0.5);
// //           backdrop-filter: blur(16px);
// //           -webkit-backdrop-filter: blur(16px);
// //         }
// //         .glass-input, .glass-select {
// //           background: rgba(255, 255, 255, 0.05);
// //           backdrop-filter: blur(8px);
// //           -webkit-backdrop-filter: blur(8px);
// //         }
// //         .glass-nav-item {
// //           backdrop-filter: blur(10px);
// //           -webkit-backdrop-filter: blur(10px);
// //           position: relative;
// //           overflow: hidden;
// //         }
// //         .glass-nav-item::before {
// //           content: '';
// //           position: absolute;
// //           inset: 0;
// //           background: linear-gradient(135deg, rgba(89, 69, 255, 0.1), rgba(67, 97, 238, 0.1));
// //           opacity: 0;
// //           transition: opacity 0.3s ease;
// //         }
// //         .glass-nav-item.active::before {
// //           opacity: 1;
// //         }
// //         .glass-nav-item:hover::before {
// //           opacity: 0.5;
// //         }
// //       `}</style>

// //       <aside className={`hidden md:block shadow-2xl z-10 glass-sidebar`}>
// //         <div className="p-6 text-2xl font-extrabold text-white tracking-wider">S2 Integrators</div>
// //         <nav className="px-4 space-y-2 pt-6">
// //           {[
// //             { id: "dashboard", label: "Dashboard" },
// //             { id: "resumes", label: "Resumes" },
// //             { id: "interviews", label: "Interviews" },
// //             { id: "recommendations", label: "Recommendations" },
// //             { id: "settings", label: "Settings" },
// //             { id: "bin", label: "Bin" },
// //           ].map(({ id, label }) => (
// //             <a
// //               key={id}
// //               className={`glass-nav-item block rounded-xl pl-5 pr-3 py-2.5 font-medium transition-all duration-300 cursor-pointer ${
// //                 activePage === id 
// //                   ? "active font-bold text-white shadow-lg border border-[#4361EE]/50" 
// //                   : "text-gray-400 hover:text-white border border-transparent hover:border-white/10"
// //               }`}
// //               style={{
// //                 background: activePage === id ? 'linear-gradient(135deg, rgba(89, 69, 255, 0.3), rgba(67, 97, 238, 0.3))' : 'transparent',
// //               }}
// //               onClick={() => handleSetActivePage(id as ActivePage)}
// //             >
// //               {label}
// //             </a>
// //           ))}
          
// //           {/* Logout Button */}
// //           <button
// //             onClick={handleLogout}
// //             className="w-full text-left block rounded-xl pl-5 pr-3 py-2.5 font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-300 cursor-pointer mt-4 border border-transparent hover:border-red-500/30"
// //           >
// //             Logout
// //           </button>
// //         </nav>
// //       </aside>

// //       <main className="p-8">{renderMainContent()}</main>

// //       <UploadModal open={openUpload} onClose={() => setOpenUpload(false)}>
// //         <ResumeUpload />
// //       </UploadModal>

// //       <CreateRoleModal open={openCreateRole} onClose={() => setOpenCreateRole(false)} onCreate={createRole} />
// //     </div>
// //   );
// // }




// // new



// // // filepath: src/pages/Dashboard.tsx
// // import React, { useEffect, useMemo, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import CandidateCard from "../components/CandidateCard";
// // import UploadModal from "../components/UploadModal";
// // import ResumeUpload from "../components/ResumeUpload";
// // import QuestionsPanel from "../components/QuestionsPanel";
// // import { JobsAPI, ResumesAPI } from "../services/http";
// // import type { JobRequirements, ResumeRecord } from "../services/http";
// // import MatchAPI, { toPercent } from "../services/match";
// // import { apiBase } from "../services/env";
// // import CreateRoleModal from "../components/CreateRoleModal";
// // import ResumesPage from "./Resumes";
// // import BinPage from "./Bin";
// // import useSoftDelete from "../hooks/useSoftDelete";

// // // --- THEME CONSTANTS (Dark Blue/Indigo) ---
// // const PRIMARY_ACCENT = "#4361EE";
// // const HOVER_ACCENT = "#5945FF";
// // const CARD_BG = "#1C2A4A";
// // const MAIN_BG = "bg-[#0A1930]";
// // const TEXT_COLOR = "text-gray-200";
// // const MUTED_COLOR = "text-gray-400";
// // const WAITING_ACCENT = "#FFA726";
// // // ------------------------------------------

// // type ActivePage = "dashboard" | "resumes" | "interviews" | "recommendations" | "settings" | "bin";

// // type Person = {
// //   id: string;
// //   name: string;
// //   role: string;
// //   initials: string;
// //   score: number;
// //   years: number;
// //   updated: string;
// //   badge: string;
// //   tags: string[];
// //   education: number;
// //   raw_text: string;
// //   bestRoleTitle?: string | null;
// //   breakdown?: import("../services/match").MatchBreakdown | null;
// //   details?: Record<string, number> | null;
// // };

// // const initials = (n?: string) =>
// //   (n || "??")
// //     .split(" ")
// //     .filter(Boolean)
// //     .map((s) => s[0])
// //     .slice(0, 2)
// //     .join("")
// //     .toUpperCase();

// // type SortKey = "score_desc" | "exp_desc" | "exp_asc";

// // export default function Dashboard() {
// //   const navigate = useNavigate();
// //   const [activePage, setActivePage] = useState<ActivePage>(
// //     (localStorage.getItem("activePage") as ActivePage) || "dashboard"
// //   );
// //   const [openUpload, setOpenUpload] = useState(false);
// //   const [openCreateRole, setOpenCreateRole] = useState(false);
// //   const [jobs, setJobs] = useState<JobRequirements[]>([]);
// //   const [selectedJob, setSelectedJob] = useState<JobRequirements | null>(null);
// //   const [people, setPeople] = useState<Person[]>([]);
// //   const [query, setQuery] = useState("");
// //   const [sort, setSort] = useState<SortKey>("score_desc");
// //   const [matchErr, setMatchErr] = useState<string | null>(null);

// //   const { isDeleted } = useSoftDelete();

// //   const handleSetActivePage = (id: ActivePage) => {
// //     setActivePage(id);
// //     localStorage.setItem("activePage", id);
    
// //     if (id === "recommendations") {
// //       navigate("/recruiter/recommendations");
// //     }
// //   };

// //   const handleLogout = () => {
// //     localStorage.removeItem("access_token");
// //     navigate("/login", { replace: true });
// //   };

// //   const mapResumes = (rows: ResumeRecord[]): Person[] =>
// //     rows
// //       .filter((r) => r.name && r.name !== "Candidate")
// //       .map((r) => ({
// //         id: r.id,
// //         name: r.name || "Candidate",
// //         role: "—",
// //         initials: initials(r.name),
// //         score: 0,
// //         years: Number(r.years_experience || 0),
// //         updated: new Date(r.updated_at || r.created_at || Date.now()).toDateString(),
// //         badge: "New",
// //         tags: Array.isArray(r.skills) ? r.skills : [],
// //         education: Number(r.education ?? 0),
// //         raw_text: String(r.raw_text || ""),
// //       }));

// //   // Initial load
// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         const list = await JobsAPI.list<JobRequirements[]>();
// //         setJobs(list);
// //         setSelectedJob(null);
// //       } catch (e: any) {
// //         console.error("Jobs load failed", e);
// //         setJobs([]);
// //         setSelectedJob(null);
// //       }
// //     })();
// //     (async () => {
// //       try {
// //         const list = await ResumesAPI.list<ResumeRecord[]>();
// //         const byId = new Map<string, ResumeRecord>();
// //         list.forEach((r) => byId.set(r.id, r));
// //         setPeople(mapResumes(Array.from(byId.values())));
// //       } catch (e: any) {
// //         console.error("Resumes load failed", e);
// //         setPeople([]);
// //       }
// //     })();
// //   }, []);

// //   // Live refresh on resumes:changed
// //   useEffect(() => {
// //     const h = () => {
// //       (async () => {
// //         try {
// //           const list = await ResumesAPI.list<ResumeRecord[]>();
// //           const byId = new Map<string, ResumeRecord>();
// //           list.forEach((r) => byId.set(r.id, r));
// //           setPeople(mapResumes(Array.from(byId.values())));
// //         } catch (e: any) {
// //           console.error("Resumes refresh failed", e);
// //           setPeople([]);
// //         }
// //       })();
// //     };
// //     window.addEventListener("resumes:changed", h as EventListener);
// //     return () => window.removeEventListener("resumes:changed", h as EventListener);
// //   }, []);

// //   const resumesForAPI = useMemo(
// //     () =>
// //       people.map((p) => ({
// //         skills: p.tags,
// //         years_experience: p.years,
// //         education: p.education,
// //         raw_text: p.raw_text,
// //       })),
// //     [people]
// //   );

// //   useEffect(() => {
// //     (async () => {
// //       if (people.length === 0) return;
// //       setMatchErr(null);

// //       if (selectedJob?.id) {
// //         try {
// //           const results = await MatchAPI.scoreBatch({ resumes: resumesForAPI, job: selectedJob });
// //           setPeople((prev) =>
// //             prev.map((p, i) => ({
// //               ...p,
// //               score: toPercent(results?.[i]?.score),
// //               bestRoleTitle: selectedJob.title,
// //               breakdown: results?.[i]?.breakdown || null,
// //               details: results?.[i]?.details || null,
// //             }))
// //           );
// //           return;
// //         } catch (e: any) {
// //           setMatchErr(`Match (batch) failed: ${e?.message || e}`);
// //           console.error("Match batch error", e);
// //         }
// //       }

// //       try {
// //         const perCandidate = await Promise.all(resumesForAPI.map((r) => MatchAPI.scoreAgainstAllJobs(r)));
// //         setPeople((prev) =>
// //           prev.map((p, i) => {
// //             const top = perCandidate[i]?.[0];
// //             return {
// //               ...p,
// //               score: toPercent(top?.score),
// //               bestRoleTitle: top?.title ?? null,
// //               breakdown: top?.breakdown || null,
// //               details: top?.details || null,
// //             };
// //           })
// //         );
// //       } catch (e: any) {
// //         setMatchErr(`Match (best-role) failed: ${e?.message || e}`);
// //         console.error("Match best-role error", e);
// //       }
// //     })();
// //   }, [selectedJob?.id, resumesForAPI, people.length]);

// //   const visiblePeople = useMemo(() => {
// //     const q = query.trim().toLowerCase();
// //     const filtered = q
// //       ? people.filter((p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)))
// //       : people.slice();

// //     const activeFiltered = filtered.filter((p) => !isDeleted(p.id));

// //     switch (sort) {
// //       case "exp_desc":
// //         activeFiltered.sort((a, b) => (b.years || 0) - (a.years || 0));
// //         break;
// //       case "exp_asc":
// //         activeFiltered.sort((a, b) => (a.years || 0) - (b.years || 0));
// //         break;
// //       default:
// //         activeFiltered.sort((a, b) => (b.score || 0) - (a.score || 0));
// //     }
// //     return activeFiltered;
// //   }, [people, query, sort, isDeleted]);

// //   const createRole = async (payload: Omit<JobRequirements, "id">): Promise<JobRequirements> => {
// //     const BASE = apiBase();
// //     const res = await fetch(`${BASE}/api/v1/jobs`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(payload),
// //     });
// //     if (!res.ok) {
// //       const text = await res.text();
// //       throw new Error(text || `HTTP ${res.status}`);
// //     }
// //     const job = (await res.json()) as JobRequirements;
// //     setJobs((prev) => [job, ...prev]);
// //     setSelectedJob(job);
// //     return job;
// //   };

// //   const renderMainContent = () => {
// //     if (activePage === "resumes") return <ResumesPage />;
// //     if (activePage === "bin") return <BinPage />;
// //     if (activePage === "recommendations") {
// //       return null;
// //     }
// //     if (activePage !== "dashboard")
// //       return (
// //         <div className={`p-8 ${TEXT_COLOR} animate-fadeIn`}>
// //           <h2 className="text-2xl">{activePage.charAt(0).toUpperCase() + activePage.slice(1)} Page</h2>
// //           <p className={MUTED_COLOR}>Content goes here.</p>
// //         </div>
// //       );

// //     return (
// //       <div className="animate-fadeIn">
// //         <header className="mb-6 flex items-start justify-between gap-3">
// //           <div>
// //             <h1 className="text-4xl font-extrabold tracking-tight text-white">Dashboard</h1>
// //             <p className="text-base text-gray-400">Welcome back! Here's your recruitment overview.</p>
// //           </div>
// //           <div className="flex gap-2">
// //             <select
// //               className={`glass-input border border-white/10 rounded-xl shadow-sm focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/30 transition-all duration-300 ${TEXT_COLOR} appearance-none px-4 py-2`}
// //               value={selectedJob?.id ?? ""}
// //               onChange={(e) => setSelectedJob(jobs.find((j) => j.id === e.target.value) || null)}
// //             >
// //               <option value="">All Roles (best match)</option>
// //               {jobs.map((j) => (
// //                 <option key={j.id} value={j.id}>
// //                   {j.title}
// //                 </option>
// //               ))}
// //             </select>

// //             <button
// //               className={`font-semibold py-2 px-4 rounded-xl shadow-sm border border-[#4361EE]/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:bg-[#4361EE]/10 hover:border-[#4361EE] ${TEXT_COLOR}`}
// //               style={{ color: PRIMARY_ACCENT, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(8px)' }}
// //               onClick={() => setOpenCreateRole(true)}
// //             >
// //               + New Role
// //             </button>

// //             <button
// //               className="text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-all duration-500 hover:scale-[1.03] active:scale-[0.98] hover:shadow-lg hover:shadow-[#4361EE]/50"
// //               style={{ background: `linear-gradient(135deg, ${HOVER_ACCENT}, ${PRIMARY_ACCENT})` }}
// //               onClick={() => setOpenUpload(true)}
// //             >
// //               ⬆ Upload Resume
// //             </button>
// //           </div>
// //         </header>

// //         {matchErr && (
// //           <div className="mb-6 rounded-xl border border-[#FFA726] px-4 py-3 text-sm text-[#FFA726] shadow-sm animate-slideUp glass-card">
// //             {matchErr}. Check API base & CORS. (Open console for details.)
// //           </div>
// //         )}

// //         <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
// //           {[
// //             { label: "Total Applications", value: visiblePeople.length, sub: "in system", delay: 0 },
// //             { label: "Pending Reviews", value: "—", sub: "auto", delay: 100 },
// //             { label: "Scheduled Interviews", value: "—", sub: "this week", delay: 200 },
// //             { label: "Top Matches", value: visiblePeople.filter((p) => (p.score || 0) >= 90).length, sub: "90%+ match", highlight: true, delay: 300 }
// //           ].map((stat, i) => (
// //             <div
// //               key={i}
// //               className={`glass-card rounded-xl shadow-md border p-5 transition-all duration-500 hover:scale-[1.02] animate-slideUp ${
// //                 stat.highlight ? 'border-[#4361EE]/50 hover:border-[#4361EE] hover:shadow-lg hover:shadow-[#4361EE]/30' : 'border-white/10 hover:border-white/20'
// //               } ${TEXT_COLOR}`}
// //               style={{ animationDelay: `${stat.delay}ms` }}
// //             >
// //               <div className="text-sm text-gray-400">{stat.label}</div>
// //               <div className={`text-3xl font-extrabold ${stat.highlight ? 'text-[#4361EE]' : 'text-white'}`}>
// //                 {stat.value}
// //               </div>
// //               <div className="text-xs text-gray-500">{stat.sub}</div>
// //             </div>
// //           ))}
// //         </section>

// //         <div className="mb-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
// //           <div>
// //             <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
// //               <input
// //                 className={`glass-input w-full max-w-sm rounded-xl border border-white/10 shadow-sm px-4 py-2.5 focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/30 transition-all duration-300 ${TEXT_COLOR} placeholder-gray-500`}
// //                 placeholder="Search candidates..."
// //                 value={query}
// //                 onChange={(e) => setQuery(e.target.value)}
// //               />
// //               <div className="flex gap-2">
// //                 <select
// //                   className={`glass-input rounded-xl border border-white/10 shadow-sm px-4 py-2 focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/30 transition-all duration-300 ${TEXT_COLOR} appearance-none`}
// //                   value={sort}
// //                   onChange={(e) => setSort(e.target.value as SortKey)}
// //                 >
// //                   <option value="score_desc">Best Match</option>
// //                   <option value="exp_desc">Experience: High → Low</option>
// //                   <option value="exp_asc">Experience: Low → High</option>
// //                 </select>
// //                 <select className={`glass-input rounded-xl border border-white/10 shadow-sm px-4 py-2 focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/30 transition-all duration-300 ${TEXT_COLOR} appearance-none`}>
// //                   <option>Status</option>
// //                 </select>
// //               </div>
// //             </div>
// //             {visiblePeople.length > 0 ? (
// //               <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
// //                 {visiblePeople.map((p) => (
// //                   <CandidateCard key={p.id} person={p} />
// //                 ))}
// //               </section>
// //             ) : (
// //               <div className="glass-card rounded-xl border border-white/10 p-12 text-center">
// //                 <div className="text-gray-400 text-lg mb-2">No candidates found</div>
// //                 <p className="text-gray-500 text-sm">Upload resumes to get started</p>
// //               </div>
// //             )}
// //           </div>
// //           <div className={`glass-card rounded-xl shadow-sm border border-white/10 p-5 h-fit ${TEXT_COLOR} animate-slideLeft`}>
// //             <div className="text-lg font-bold mb-3 text-white">Generated Questions</div>
// //             <QuestionsPanel />
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className={`min-h-screen grid grid-cols-1 md:grid-cols-[280px_1fr] ${MAIN_BG}`}>
// //       <style>{`
// //         @keyframes fadeIn {
// //           from { opacity: 0; }
// //           to { opacity: 1; }
// //         }
// //         @keyframes slideUp {
// //           from { opacity: 0; transform: translateY(20px); }
// //           to { opacity: 1; transform: translateY(0); }
// //         }
// //         @keyframes slideLeft {
// //           from { opacity: 0; transform: translateX(20px); }
// //           to { opacity: 1; transform: translateX(0); }
// //         }
// //         .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
// //         .animate-slideUp { animation: slideUp 0.6s ease-out backwards; }
// //         .animate-slideLeft { animation: slideLeft 0.6s ease-out; }
        
// //         .glass-card {
// //           background: rgba(28, 42, 74, 0.4);
// //           backdrop-filter: blur(12px);
// //           -webkit-backdrop-filter: blur(12px);
// //         }
// //         .glass-sidebar {
// //           background: rgba(28, 42, 74, 0.5);
// //           backdrop-filter: blur(16px);
// //           -webkit-backdrop-filter: blur(16px);
// //         }
// //         .glass-input, .glass-select {
// //           background: rgba(255, 255, 255, 0.05);
// //           backdrop-filter: blur(8px);
// //           -webkit-backdrop-filter: blur(8px);
// //         }
// //         .glass-nav-item {
// //           backdrop-filter: blur(10px);
// //           -webkit-backdrop-filter: blur(10px);
// //           position: relative;
// //           overflow: hidden;
// //         }
// //         .glass-nav-item::before {
// //           content: '';
// //           position: absolute;
// //           inset: 0;
// //           background: linear-gradient(135deg, rgba(89, 69, 255, 0.1), rgba(67, 97, 238, 0.1));
// //           opacity: 0;
// //           transition: opacity 0.3s ease;
// //         }
// //         .glass-nav-item.active::before {
// //           opacity: 1;
// //         }
// //         .glass-nav-item:hover::before {
// //           opacity: 0.5;
// //         }
// //       `}</style>

// //       <aside className={`hidden md:block shadow-2xl z-10 glass-sidebar`}>
// //         <div className="p-6 text-2xl font-extrabold text-white tracking-wider">S2 Integrators</div>
// //         <nav className="px-4 space-y-2 pt-6">
// //           {[
// //             { id: "dashboard", label: "Dashboard" },
// //             { id: "resumes", label: "Resumes" },
// //             { id: "interviews", label: "Interviews" },
// //             { id: "recommendations", label: "Recommendations" },
// //             { id: "settings", label: "Settings" },
// //             { id: "bin", label: "Bin" },
// //           ].map(({ id, label }) => (
// //             <a
// //               key={id}
// //               className={`glass-nav-item block rounded-xl pl-5 pr-3 py-2.5 font-medium transition-all duration-300 cursor-pointer ${
// //                 activePage === id 
// //                   ? "active font-bold text-white shadow-lg border border-[#4361EE]/50" 
// //                   : "text-gray-400 hover:text-white border border-transparent hover:border-white/10"
// //               }`}
// //               style={{
// //                 background: activePage === id ? 'linear-gradient(135deg, rgba(89, 69, 255, 0.3), rgba(67, 97, 238, 0.3))' : 'transparent',
// //               }}
// //               onClick={() => handleSetActivePage(id as ActivePage)}
// //             >
// //               {label}
// //             </a>
// //           ))}
          
// //           <button
// //             onClick={handleLogout}
// //             className="w-full text-left block rounded-xl pl-5 pr-3 py-2.5 font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-300 cursor-pointer mt-4 border border-transparent hover:border-red-500/30"
// //           >
// //             Logout
// //           </button>
// //         </nav>
// //       </aside>

// //       <main className="p-8">{renderMainContent()}</main>

// //       <UploadModal open={openUpload} onClose={() => setOpenUpload(false)}>
// //         <ResumeUpload />
// //       </UploadModal>

// //       <CreateRoleModal open={openCreateRole} onClose={() => setOpenCreateRole(false)} onCreate={createRole} />
// //     </div>
// //   );
// // }



// // // FILE: src/pages/Dashboard.tsx
// // import React, { useEffect, useMemo, useState, useRef } from "react";
// // import { useNavigate } from "react-router-dom";
// // import CandidateCard from "../components/CandidateCard";
// // import UploadModal from "../components/UploadModal";
// // import ResumeUpload from "../components/ResumeUpload";
// // import QuestionsPanel from "../components/QuestionsPanel";
// // import { JobsAPI, ResumesAPI } from "../services/http";
// // import type { JobRequirements, ResumeRecord } from "../services/http";
// // import MatchAPI, { toPercent } from "../services/match";
// // import { apiBase } from "../services/env";
// // import CreateRoleModal from "../components/CreateRoleModal";
// // import ResumesPage from "./Resumes";
// // import BinPage from "./Bin";
// // import useSoftDelete from "../hooks/useSoftDelete";

// // // Theme constants
// // const PRIMARY_ACCENT = "#4361EE";
// // const HOVER_ACCENT = "#5945FF";
// // const MAIN_BG = "bg-[#0A1930]";
// // const TEXT_COLOR = "text-gray-200";
// // const MUTED_COLOR = "text-gray-400";
// // const WAITING_ACCENT = "#FFA726";

// // type ActivePage = "dashboard" | "resumes" | "interviews" | "recommendations" | "settings" | "bin";

// // type Person = {
// //   id: string;
// //   name: string;
// //   role: string;
// //   initials: string;
// //   score: number;
// //   years: number;
// //   updated: string;
// //   badge: string;
// //   tags: string[];
// //   education: number;
// //   raw_text: string;
// //   bestRoleTitle?: string | null;
// //   breakdown?: import("../services/match").MatchBreakdown | null;
// //   details?: Record<string, number> | null;
// // };

// // const initials = (n?: string) =>
// //   (n || "??")
// //     .split(" ")
// //     .filter(Boolean)
// //     .map((s) => s[0])
// //     .slice(0, 2)
// //     .join("")
// //     .toUpperCase();

// // type SortKey = "score_desc" | "exp_desc" | "exp_asc";

// // // Backend waiting-room shape (matches your backend)
// // type WaitRoom = {
// //   room_name: string;
// //   hr_accepted: boolean;
// //   ai_accepted: boolean;
// //   meeting_active: boolean;
// //   meeting_url?: string | null;
// //   created_at: string;
// //   updated_at: string;
// // };

// // export default function Dashboard() {
// //   const navigate = useNavigate();
// //   const [activePage, setActivePage] = useState<ActivePage>(
// //     (localStorage.getItem("activePage") as ActivePage) || "dashboard"
// //   );
// //   const [openUpload, setOpenUpload] = useState(false);
// //   const [openCreateRole, setOpenCreateRole] = useState(false);
// //   const [jobs, setJobs] = useState<JobRequirements[]>([]);
// //   const [selectedJob, setSelectedJob] = useState<JobRequirements | null>(null);
// //   const [people, setPeople] = useState<Person[]>([]);
// //   const [query, setQuery] = useState("");
// //   const [sort, setSort] = useState<SortKey>("score_desc");
// //   const [matchErr, setMatchErr] = useState<string | null>(null);

// //   // NEW: waiting rooms list (full objects)
// //   const [waitRooms, setWaitRooms] = useState<WaitRoom[]>([]);
// //   const pollRef = useRef<number | null>(null);
// //   const backoffRef = useRef(1);

// //   const { isDeleted } = useSoftDelete();

// //   const handleSetActivePage = (id: ActivePage) => {
// //     setActivePage(id);
// //     localStorage.setItem("activePage", id);
// //     if (id === "recommendations") {
// //       navigate("/recruiter/recommendations");
// //     }
// //   };

// //   const handleLogout = () => {
// //     localStorage.removeItem("access_token");
// //     navigate("/login", { replace: true });
// //   };

// //   const mapResumes = (rows: ResumeRecord[]): Person[] =>
// //     rows
// //       .filter((r) => r.name && r.name !== "Candidate")
// //       .map((r) => ({
// //         id: r.id,
// //         name: r.name || "Candidate",
// //         role: "—",
// //         initials: initials(r.name),
// //         score: 0,
// //         years: Number(r.years_experience || 0),
// //         updated: new Date(r.updated_at || r.created_at || Date.now()).toDateString(),
// //         badge: "New",
// //         tags: Array.isArray(r.skills) ? r.skills : [],
// //         education: Number(r.education ?? 0),
// //         raw_text: String(r.raw_text || ""),
// //       }));

// //   // Initial load: jobs + resumes
// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         const list = await JobsAPI.list<JobRequirements[]>();
// //         setJobs(list);
// //         setSelectedJob(null);
// //       } catch (e: any) {
// //         console.error("Jobs load failed", e);
// //         setJobs([]);
// //         setSelectedJob(null);
// //       }
// //     })();

// //     (async () => {
// //       try {
// //         const list = await ResumesAPI.list<ResumeRecord[]>();
// //         const byId = new Map<string, ResumeRecord>();
// //         list.forEach((r) => byId.set(r.id, r));
// //         setPeople(mapResumes(Array.from(byId.values())));
// //       } catch (e: any) {
// //         console.error("Resumes load failed", e);
// //         setPeople([]);
// //       }
// //     })();
// //   }, []);

// //   // Live refresh on resumes:changed
// //   useEffect(() => {
// //     const h = () => {
// //       (async () => {
// //         try {
// //           const list = await ResumesAPI.list<ResumeRecord[]>();
// //           const byId = new Map<string, ResumeRecord>();
// //           list.forEach((r) => byId.set(r.id, r));
// //           setPeople(mapResumes(Array.from(byId.values())));
// //         } catch (e: any) {
// //           console.error("Resumes refresh failed", e);
// //           setPeople([]);
// //         }
// //       })();
// //     };
// //     window.addEventListener("resumes:changed", h as EventListener);
// //     return () => window.removeEventListener("resumes:changed", h as EventListener);
// //   }, []);

// //   const resumesForAPI = useMemo(
// //     () =>
// //       people.map((p) => ({
// //         skills: p.tags,
// //         years_experience: p.years,
// //         education: p.education,
// //         raw_text: p.raw_text,
// //       })),
// //     [people]
// //   );

// //   // Matching logic (unchanged)
// //   useEffect(() => {
// //     (async () => {
// //       if (people.length === 0) return;
// //       setMatchErr(null);

// //       if (selectedJob?.id) {
// //         try {
// //           const results = await MatchAPI.scoreBatch({ resumes: resumesForAPI, job: selectedJob });
// //           setPeople((prev) =>
// //             prev.map((p, i) => ({
// //               ...p,
// //               score: toPercent(results?.[i]?.score),
// //               bestRoleTitle: selectedJob.title,
// //               breakdown: results?.[i]?.breakdown || null,
// //               details: results?.[i]?.details || null,
// //             }))
// //           );
// //           return;
// //         } catch (e: any) {
// //           setMatchErr(`Match (batch) failed: ${e?.message || e}`);
// //           console.error("Match batch error", e);
// //         }
// //       }

// //       try {
// //         const perCandidate = await Promise.all(resumesForAPI.map((r) => MatchAPI.scoreAgainstAllJobs(r)));
// //         setPeople((prev) =>
// //           prev.map((p, i) => {
// //             const top = perCandidate[i]?.[0];
// //             return {
// //               ...p,
// //               score: toPercent(top?.score),
// //               bestRoleTitle: top?.title ?? null,
// //               breakdown: top?.breakdown || null,
// //               details: top?.details || null,
// //             };
// //           })
// //         );
// //       } catch (e: any) {
// //         setMatchErr(`Match (best-role) failed: ${e?.message || e}`);
// //         console.error("Match best-role error", e);
// //       }
// //     })();
// //   }, [selectedJob?.id, resumesForAPI, people.length]);

// //   const visiblePeople = useMemo(() => {
// //     const q = query.trim().toLowerCase();
// //     const filtered = q
// //       ? people.filter((p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)))
// //       : people.slice();

// //     const activeFiltered = filtered.filter((p) => !isDeleted(p.id));

// //     switch (sort) {
// //       case "exp_desc":
// //         activeFiltered.sort((a, b) => (b.years || 0) - (a.years || 0));
// //         break;
// //       case "exp_asc":
// //         activeFiltered.sort((a, b) => (a.years || 0) - (b.years || 0));
// //         break;
// //       default:
// //         activeFiltered.sort((a, b) => (b.score || 0) - (a.score || 0));
// //     }
// //     return activeFiltered;
// //   }, [people, query, sort, isDeleted]);

// //   const createRole = async (payload: Omit<JobRequirements, "id">): Promise<JobRequirements> => {
// //     const BASE = apiBase();
// //     const res = await fetch(`${BASE}/api/v1/jobs`, {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(payload),
// //     });
// //     if (!res.ok) {
// //       const text = await res.text();
// //       throw new Error(text || `HTTP ${res.status}`);
// //     }
// //     const job = (await res.json()) as JobRequirements;
// //     setJobs((prev) => [job, ...prev]);
// //     setSelectedJob(job);
// //     return job;
// //   };

// //   // -------------------------
// //   // Waiting Rooms: fetch + poll + accept
// //   // -------------------------
// //   async function fetchWaitingRooms() {
// //     const BASE = (apiBase && typeof apiBase === "function" ? apiBase() : "") || "";
// //     const primary = `${BASE}/api/interview-access/waiting`;
// //     const fallback = `${BASE}/interview-access/waiting`;

// //     try {
// //       // try primary, then fallback
// //       let res: Response | null = null;
// //       try {
// //         res = await fetch(primary);
// //         if (res.status === 404) {
// //           res = await fetch(fallback);
// //         }
// //       } catch {
// //         res = await fetch(fallback).catch(() => null);
// //       }
// //       if (!res || !res.ok) {
// //         // set empty and increase backoff
// //         backoffRef.current = Math.min(backoffRef.current * 2, 60);
// //         setWaitRooms([]);
// //         return;
// //       }
// //       const data = (await res.json()) as WaitRoom[];
// //       if (!Array.isArray(data)) {
// //         setWaitRooms([]);
// //         return;
// //       }
// //       setWaitRooms(data);
// //       backoffRef.current = 1;
// //     } catch (err) {
// //       console.error("fetchWaitingRooms error", err);
// //       setWaitRooms([]);
// //     }
// //   }

// //   useEffect(() => {
// //     // initial + poll
// //     fetchWaitingRooms();
// //     // poll every 7s (respects backoff by clearing and re-instating interval dynamically)
// //     if (pollRef.current) {
// //       clearInterval(pollRef.current);
// //       pollRef.current = null;
// //     }
// //     pollRef.current = window.setInterval(() => {
// //       fetchWaitingRooms();
// //     }, 7000);
// //     return () => {
// //       if (pollRef.current) {
// //         clearInterval(pollRef.current);
// //         pollRef.current = null;
// //       }
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   // Accept endpoint (HR action)
// //   async function acceptRoom(roomName: string) {
// //     const BASE = (apiBase && typeof apiBase === "function" ? apiBase() : "") || "";
// //     const primary = `${BASE}/api/interview-access/accept/${encodeURIComponent(roomName)}`;
// //     const fallback = `${BASE}/interview-access/accept/${encodeURIComponent(roomName)}`;
// //     try {
// //       // prefer POST
// //       let res = await fetch(primary, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ by: "hr", accept: true }),
// //       }).catch(() => null);

// //       if (!res || !res.ok) {
// //         res = await fetch(fallback, {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ by: "hr", accept: true }),
// //         }).catch(() => null);
// //       }
// //       if (!res || !res.ok) {
// //         const txt = res ? await res.text().catch(() => "") : "no response";
// //         throw new Error(`Accept failed: ${res?.status ?? "ERR"} ${txt}`);
// //       }
// //       await fetchWaitingRooms();
// //     } catch (err) {
// //       console.error("acceptRoom error", err);
// //       alert("Failed to accept room — check backend logs.");
// //     }
// //   }

// //   // Helper to resolve a candidate from a waitRoom (best-effort)
// //   function resolveCandidateFromRoom(room: WaitRoom) {
// //     // your backend stores only `room_name`. If your room naming contains candidate id, match that.
// //     // Try: 1) id === room_name, 2) name === room_name, 3) name includes room_name (rare)
// //     const byId = people.find((p) => p.id === room.room_name);
// //     if (byId) return byId;
// //     const byNameExact = people.find((p) => p.name === room.room_name);
// //     if (byNameExact) return byNameExact;
// //     const byNameIncludes = people.find((p) => room.room_name.includes(p.name || ""));
// //     if (byNameIncludes) return byNameIncludes;
// //     return null;
// //   }

// //   // -------------------------
// //   // Render Main Content
// //   // -------------------------
// //   const renderMainContent = () => {
// //     if (activePage === "resumes") return <ResumesPage />;
// //     if (activePage === "bin") return <BinPage />;
// //     if (activePage === "recommendations") {
// //       return null;
// //     }
// //     if (activePage !== "dashboard")
// //       return (
// //         <div className={`p-8 ${TEXT_COLOR} animate-fadeIn`}>
// //           <h2 className="text-2xl">{activePage.charAt(0).toUpperCase() + activePage.slice(1)} Page</h2>
// //           <p className={MUTED_COLOR}>Content goes here.</p>
// //         </div>
// //       );

// //     return (
// //       <div className="animate-fadeIn">
// //         <header className="mb-6 flex items-start justify-between gap-3">
// //           <div>
// //             <h1 className="text-4xl font-extrabold tracking-tight text-white">Dashboard</h1>
// //             <p className="text-base text-gray-400">Welcome back! Here's your recruitment overview.</p>
// //           </div>
// //           <div className="flex gap-2">
// //             <select
// //               className={`glass-input border border-white/10 rounded-xl shadow-sm focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/30 transition-all duration-300 ${TEXT_COLOR} appearance-none px-4 py-2`}
// //               value={selectedJob?.id ?? ""}
// //               onChange={(e) => setSelectedJob(jobs.find((j) => j.id === e.target.value) || null)}
// //             >
// //               <option value="">All Roles (best match)</option>
// //               {jobs.map((j) => (
// //                 <option key={j.id} value={j.id}>
// //                   {j.title}
// //                 </option>
// //               ))}
// //             </select>

// //             <button
// //               className={`font-semibold py-2 px-4 rounded-xl shadow-sm border border-[#4361EE]/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:bg-[#4361EE]/10 hover:border-[#4361EE] ${TEXT_COLOR}`}
// //               style={{ color: PRIMARY_ACCENT, background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(8px)" }}
// //               onClick={() => setOpenCreateRole(true)}
// //             >
// //               + New Role
// //             </button>

// //             <button
// //               className="text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-all duration-500 hover:scale-[1.03] active:scale-[0.98] hover:shadow-lg hover:shadow-[#4361EE]/50"
// //               style={{ background: `linear-gradient(135deg, ${HOVER_ACCENT}, ${PRIMARY_ACCENT})` }}
// //               onClick={() => setOpenUpload(true)}
// //             >
// //               ⬆ Upload Resume
// //             </button>
// //           </div>
// //         </header>

// //         {matchErr && (
// //           <div className="mb-6 rounded-xl border border-[#FFA726] px-4 py-3 text-sm text-[#FFA726] shadow-sm animate-slideUp glass-card">
// //             {matchErr}. Check API base & CORS. (Open console for details.)
// //           </div>
// //         )}

// //         <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
// //           {[
// //             { label: "Total Applications", value: visiblePeople.length, sub: "in system", delay: 0 },
// //             { label: "Pending Reviews", value: "—", sub: "auto", delay: 100 },
// //             { label: "Scheduled Interviews", value: "—", sub: "this week", delay: 200 },
// //             { label: "Top Matches", value: visiblePeople.filter((p) => (p.score || 0) >= 90).length, sub: "90%+ match", highlight: true, delay: 300 },
// //           ].map((stat, i) => (
// //             <div
// //               key={i}
// //               className={`glass-card rounded-xl shadow-md border p-5 transition-all duration-500 hover:scale-[1.02] animate-slideUp ${
// //                 stat.highlight ? "border-[#4361EE]/50 hover:border-[#4361EE] hover:shadow-lg hover:shadow-[#4361EE]/30" : "border-white/10 hover:border-white/20"
// //               } ${TEXT_COLOR}`}
// //               style={{ animationDelay: `${stat.delay}ms` }}
// //             >
// //               <div className="text-sm text-gray-400">{stat.label}</div>
// //               <div className={`text-3xl font-extrabold ${stat.highlight ? "text-[#4361EE]" : "text-white"}`}>{stat.value}</div>
// //               <div className="text-xs text-gray-500">{stat.sub}</div>
// //             </div>
// //           ))}
// //         </section>

// //         <div className="mb-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
// //           <div>
// //             <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
// //               <input
// //                 className={`glass-input w-full max-w-sm rounded-xl border border-white/10 shadow-sm px-4 py-2.5 focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/30 transition-all duration-300 ${TEXT_COLOR} placeholder-gray-500`}
// //                 placeholder="Search candidates..."
// //                 value={query}
// //                 onChange={(e) => setQuery(e.target.value)}
// //               />
// //               <div className="flex gap-2">
// //                 <select
// //                   className={`glass-input rounded-xl border border-white/10 shadow-sm px-4 py-2 focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/30 transition-all duration-300 ${TEXT_COLOR} appearance-none`}
// //                   value={sort}
// //                   onChange={(e) => setSort(e.target.value as SortKey)}
// //                 >
// //                   <option value="score_desc">Best Match</option>
// //                   <option value="exp_desc">Experience: High → Low</option>
// //                   <option value="exp_asc">Experience: Low → High</option>
// //                 </select>
// //                 <select className={`glass-input rounded-xl border border-white/10 shadow-sm px-4 py-2 focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/30 transition-all duration-300 ${TEXT_COLOR} appearance-none`}>
// //                   <option>Status</option>
// //                 </select>
// //               </div>
// //             </div>

// //             {visiblePeople.length > 0 ? (
// //               <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
// //                 {visiblePeople.map((p) => (
// //                   <CandidateCard key={p.id} person={p} />
// //                 ))}
// //               </section>
// //             ) : (
// //               <div className="glass-card rounded-xl border border-white/10 p-12 text-center">
// //                 <div className="text-gray-400 text-lg mb-2">No candidates found</div>
// //                 <p className="text-gray-500 text-sm">Upload resumes to get started</p>
// //               </div>
// //             )}
// //           </div>

// //           {/* Right column: Waiting Room + Questions */}
// //           <div className="space-y-6">
// //             <div className={`glass-card rounded-xl shadow-sm border border-white/10 p-5 ${TEXT_COLOR} animate-slideLeft`}>
// //               <div className="text-lg font-bold mb-3 text-white">Waiting Room</div>

// //               {waitRooms.length === 0 ? (
// //                 <div className="text-sm text-gray-400 italic">No candidates waiting.</div>
// //               ) : (
// //                 <div className="space-y-3">
// //                   {waitRooms.map((r) => {
// //                     const candidate = resolveCandidateFromRoom(r);
// //                     return (
// //                       <div
// //                         key={r.room_name}
// //                         className="flex items-center gap-3 p-3 rounded-lg"
// //                         style={{
// //                           background: "rgba(255, 167, 38, 0.06)",
// //                           border: `1px solid rgba(255,167,38,0.14)`,
// //                         }}
// //                       >
// //                         <div
// //                           className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0"
// //                           style={{ background: WAITING_ACCENT }}
// //                         >
// //                           {candidate ? candidate.initials : (r.room_name || "").slice(0, 2).toUpperCase()}
// //                         </div>

// //                         <div className="flex-1 min-w-0">
// //                           <div className="font-bold text-sm text-white truncate">
// //                             {candidate ? candidate.name : r.room_name}
// //                           </div>
// //                           <div className="text-xs text-gray-400">
// //                             {candidate?.bestRoleTitle ?? "—"} · AI: {r.ai_accepted ? "Accepted" : "Waiting"} · HR: {r.hr_accepted ? "Accepted" : "Waiting"}
// //                           </div>

// //                           <div className="mt-2 flex gap-2">
// //                             <a
// //                               href={`${window.location.origin}/interview-room/${encodeURIComponent(r.room_name)}`}
// //                               target="_blank"
// //                               rel="noreferrer"
// //                               className="text-xs px-2 py-1 rounded bg-gray-700 text-white"
// //                             >
// //                               Open waiting page
// //                             </a>
// //                             <a
// //                               href={`https://meet.jit.si/${encodeURIComponent(r.room_name)}`}
// //                               target="_blank"
// //                               rel="noreferrer"
// //                               className="text-xs px-2 py-1 rounded bg-gray-700 text-white"
// //                             >
// //                               Open Jitsi
// //                             </a>
// //                           </div>
// //                         </div>

// //                         <div className="flex flex-col gap-2 items-end">
// //                           <button
// //                             onClick={() => acceptRoom(r.room_name)}
// //                             disabled={r.hr_accepted}
// //                             className={`text-sm px-3 py-1 rounded-md ${r.hr_accepted ? "bg-gray-700 text-gray-300" : "bg-blue-600 text-white"}`}
// //                           >
// //                             {r.hr_accepted ? "Accepted" : "Accept"}
// //                           </button>
// //                         </div>
// //                       </div>
// //                     );
// //                   })}
// //                 </div>
// //               )}
// //             </div>

// //             <div className={`glass-card rounded-xl shadow-sm border border-white/10 p-5 ${TEXT_COLOR} animate-slideLeft`}>
// //               <div className="text-lg font-bold mb-3 text-white">Generated Questions</div>
// //               <QuestionsPanel />
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className={`min-h-screen grid grid-cols-1 md:grid-cols-[280px_1fr] ${MAIN_BG}`}>
// //       <style>{`
// //         @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// //         @keyframes slideUp { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
// //         @keyframes slideLeft { from { opacity: 0; transform: translateX(20px);} to { opacity: 1; transform: translateX(0);} }
// //         .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
// //         .animate-slideUp { animation: slideUp 0.6s ease-out backwards; }
// //         .animate-slideLeft { animation: slideLeft 0.6s ease-out; }
// //         .glass-card { background: rgba(28, 42, 74, 0.4); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
// //         .glass-sidebar { background: rgba(28, 42, 74, 0.5); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
// //         .glass-input, .glass-select { background: rgba(255,255,255,0.05); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
// //         .glass-nav-item { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); position: relative; overflow: hidden; }
// //         .glass-nav-item::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(89,69,255,0.1), rgba(67,97,238,0.1)); opacity: 0; transition: opacity 0.3s ease; }
// //         .glass-nav-item.active::before { opacity: 1; }
// //         .glass-nav-item:hover::before { opacity: 0.5; }
// //       `}</style>

// //       <aside className={`hidden md:block shadow-2xl z-10 glass-sidebar`}>
// //         <div className="p-6 text-2xl font-extrabold text-white tracking-wider">S2 Integrators</div>
// //         <nav className="px-4 space-y-2 pt-6">
// //           {[
// //             { id: "dashboard", label: "Dashboard" },
// //             { id: "resumes", label: "Resumes" },
// //             { id: "interviews", label: "Interviews" },
// //             { id: "recommendations", label: "Recommendations" },
// //             { id: "settings", label: "Settings" },
// //             { id: "bin", label: "Bin" },
// //           ].map(({ id, label }) => (
// //             <a
// //               key={id}
// //               className={`glass-nav-item block rounded-xl pl-5 pr-3 py-2.5 font-medium transition-all duration-300 cursor-pointer ${
// //                 activePage === id ? "active font-bold text-white shadow-lg border border-[#4361EE]/50" : "text-gray-400 hover:text-white border border-transparent hover:border-white/10"
// //               }`}
// //               style={{
// //                 background: activePage === id ? "linear-gradient(135deg, rgba(89, 69, 255, 0.3), rgba(67, 97, 238, 0.3))" : "transparent",
// //               }}
// //               onClick={() => handleSetActivePage(id as ActivePage)}
// //             >
// //               {label}
// //             </a>
// //           ))}

// //           {/* Sidebar quick Waiting summary */}
// //           <div className="mt-4 px-4">
// //             <div className="text-xs text-gray-400">Waiting</div>
// //             <div className="mt-1 font-semibold text-white">{waitRooms.length} waiting</div>
// //             <button onClick={() => handleSetActivePage("dashboard")} className="mt-2 text-xs text-gray-300 underline">Open Dashboard</button>
// //           </div>

// //           <button
// //             onClick={handleLogout}
// //             className="w-full text-left block rounded-xl pl-5 pr-3 py-2.5 font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-300 cursor-pointer mt-4 border border-transparent hover:border-red-500/30"
// //           >
// //             Logout
// //           </button>
// //         </nav>
// //       </aside>

// //       <main className="p-8">{renderMainContent()}</main>

// //       <UploadModal open={openUpload} onClose={() => setOpenUpload(false)}>
// //         <ResumeUpload />
// //       </UploadModal>

// //       <CreateRoleModal open={openCreateRole} onClose={() => setOpenCreateRole(false)} onCreate={createRole} />
// //     </div>
// //   );
// // }




// // src/pages/Dashboard.tsx
// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import CandidateCard from "../components/CandidateCard";
// import UploadModal from "../components/UploadModal";
// import ResumeUpload from "../components/ResumeUpload";
// import QuestionsPanel from "../components/QuestionsPanel";
// import WaitingRoomPanel from "../components/WaitingRoomPanel";
// import { JobsAPI, ResumesAPI } from "../services/http";
// import type { JobRequirements, ResumeRecord } from "../services/http";
// import MatchAPI, { toPercent } from "../services/match";
// import { apiBase } from "../services/env";
// import CreateRoleModal from "../components/CreateRoleModal";
// import ResumesPage from "./Resumes";
// import BinPage from "./Bin";
// import useSoftDelete from "../hooks/useSoftDelete";

// // Theme constants
// const PRIMARY_ACCENT = "#4361EE";
// const HOVER_ACCENT = "#5945FF";
// const MAIN_BG = "bg-[#0A1930]";
// const TEXT_COLOR = "text-gray-200";
// const MUTED_COLOR = "text-gray-400";
// const WAITING_ACCENT = "#FFA726";

// type ActivePage = "dashboard" | "resumes" | "interviews" | "recommendations" | "settings" | "bin" | "waiting";

// type Person = {
//   id: string;
//   name: string;
//   role: string;
//   initials: string;
//   score: number;
//   years: number;
//   updated: string;
//   badge: string;
//   tags: string[];
//   education: number;
//   raw_text: string;
//   bestRoleTitle?: string | null;
//   breakdown?: import("../services/match").MatchBreakdown | null;
//   details?: Record<string, number> | null;
// };

// const initials = (n?: string) =>
//   (n || "??")
//     .split(" ")
//     .filter(Boolean)
//     .map((s) => s[0])
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();

// type SortKey = "score_desc" | "exp_desc" | "exp_asc";

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [activePage, setActivePage] = useState<ActivePage>(
//     (localStorage.getItem("activePage") as ActivePage) || "dashboard"
//   );
//   const [openUpload, setOpenUpload] = useState(false);
//   const [openCreateRole, setOpenCreateRole] = useState(false);
//   const [jobs, setJobs] = useState<JobRequirements[]>([]);
//   const [selectedJob, setSelectedJob] = useState<JobRequirements | null>(null);
//   const [people, setPeople] = useState<Person[]>([]);
//   const [query, setQuery] = useState("");
//   const [sort, setSort] = useState<SortKey>("score_desc");
//   const [matchErr, setMatchErr] = useState<string | null>(null);

//   // Waiting room count for sidebar badge
//   const [waitingCount, setWaitingCount] = useState<number>(0);

//   const { isDeleted } = useSoftDelete();

//   const handleSetActivePage = (id: ActivePage) => {
//     setActivePage(id);
//     localStorage.setItem("activePage", id);
//     if (id === "recommendations") {
//       navigate("/recruiter/recommendations");
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("access_token");
//     navigate("/login", { replace: true });
//   };

//   const mapResumes = (rows: ResumeRecord[]): Person[] =>
//     rows
//       .filter((r) => r.name && r.name !== "Candidate")
//       .map((r) => ({
//         id: r.id,
//         name: r.name || "Candidate",
//         role: "—",
//         initials: initials(r.name),
//         score: 0,
//         years: Number(r.years_experience || 0),
//         updated: new Date(r.updated_at || r.created_at || Date.now()).toDateString(),
//         badge: "New",
//         tags: Array.isArray(r.skills) ? r.skills : [],
//         education: Number(r.education ?? 0),
//         raw_text: String(r.raw_text || ""),
//       }));

//   // Initial load
//   useEffect(() => {
//     (async () => {
//       try {
//         const list = await JobsAPI.list<JobRequirements[]>();
//         setJobs(list);
//         setSelectedJob(null);
//       } catch (e: any) {
//         console.error("Jobs load failed", e);
//         setJobs([]);
//         setSelectedJob(null);
//       }
//     })();
//     (async () => {
//       try {
//         const list = await ResumesAPI.list<ResumeRecord[]>();
//         const byId = new Map<string, ResumeRecord>();
//         list.forEach((r) => byId.set(r.id, r));
//         setPeople(mapResumes(Array.from(byId.values())));
//       } catch (e: any) {
//         console.error("Resumes load failed", e);
//         setPeople([]);
//       }
//     })();
//     // fetch waiting count for sidebar badge
//     (async function loadWaitingCount() {
//       const BASE = (apiBase && typeof apiBase === "function" ? apiBase() : "") || "";
//       const primary = `${BASE}/api/interview-access/waiting`;
//       const fallback = `${BASE}/interview-access/waiting`;
//       try {
//         let res = await fetch(primary).catch(() => null);
//         if (!res || res.status === 404) res = await fetch(fallback).catch(() => null);
//         if (res && res.ok) {
//           const data = await res.json();
//           if (Array.isArray(data)) setWaitingCount(data.length);
//         }
//       } catch (err) {
//         // ignore
//       }
//     })();
//   }, []);

//   // update waitingCount periodically to keep sidebar badge live
//   useEffect(() => {
//     const id = setInterval(async () => {
//       const BASE = (apiBase && typeof apiBase === "function" ? apiBase() : "") || "";
//       const primary = `${BASE}/api/interview-access/waiting`;
//       const fallback = `${BASE}/interview-access/waiting`;
//       try {
//         let res = await fetch(primary).catch(() => null);
//         if (!res || res.status === 404) res = await fetch(fallback).catch(() => null);
//         if (res && res.ok) {
//           const data = await res.json();
//           if (Array.isArray(data)) setWaitingCount(data.length);
//         } else {
//           setWaitingCount((c) => c);
//         }
//       } catch {
//         // ignore
//       }
//     }, 9000);
//     return () => clearInterval(id);
//   }, []);

//   // Live refresh on resumes:changed
//   useEffect(() => {
//     const h = () => {
//       (async () => {
//         try {
//           const list = await ResumesAPI.list<ResumeRecord[]>();
//           const byId = new Map<string, ResumeRecord>();
//           list.forEach((r) => byId.set(r.id, r));
//           setPeople(mapResumes(Array.from(byId.values())));
//         } catch (e: any) {
//           console.error("Resumes refresh failed", e);
//           setPeople([]);
//         }
//       })();
//     };
//     window.addEventListener("resumes:changed", h as EventListener);
//     return () => window.removeEventListener("resumes:changed", h as EventListener);
//   }, []);

//   const resumesForAPI = useMemo(
//     () =>
//       people.map((p) => ({
//         skills: p.tags,
//         years_experience: p.years,
//         education: p.education,
//         raw_text: p.raw_text,
//       })),
//     [people]
//   );

//   useEffect(() => {
//     (async () => {
//       if (people.length === 0) return;
//       setMatchErr(null);

//       if (selectedJob?.id) {
//         try {
//           const results = await MatchAPI.scoreBatch({ resumes: resumesForAPI, job: selectedJob });
//           setPeople((prev) =>
//             prev.map((p, i) => ({
//               ...p,
//               score: toPercent(results?.[i]?.score),
//               bestRoleTitle: selectedJob.title,
//               breakdown: results?.[i]?.breakdown || null,
//               details: results?.[i]?.details || null,
//             }))
//           );
//           return;
//         } catch (e: any) {
//           setMatchErr(`Match (batch) failed: ${e?.message || e}`);
//           console.error("Match batch error", e);
//         }
//       }

//       try {
//         const perCandidate = await Promise.all(resumesForAPI.map((r) => MatchAPI.scoreAgainstAllJobs(r)));
//         setPeople((prev) =>
//           prev.map((p, i) => {
//             const top = perCandidate[i]?.[0];
//             return {
//               ...p,
//               score: toPercent(top?.score),
//               bestRoleTitle: top?.title ?? null,
//               breakdown: top?.breakdown || null,
//               details: top?.details || null,
//             };
//           })
//         );
//       } catch (e: any) {
//         setMatchErr(`Match (best-role) failed: ${e?.message || e}`);
//         console.error("Match best-role error", e);
//       }
//     })();
//   }, [selectedJob?.id, resumesForAPI, people.length]);

//   const visiblePeople = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     const filtered = q
//       ? people.filter((p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)))
//       : people.slice();

//     const activeFiltered = filtered.filter((p) => !isDeleted(p.id));

//     switch (sort) {
//       case "exp_desc":
//         activeFiltered.sort((a, b) => (b.years || 0) - (a.years || 0));
//         break;
//       case "exp_asc":
//         activeFiltered.sort((a, b) => (a.years || 0) - (b.years || 0));
//         break;
//       default:
//         activeFiltered.sort((a, b) => (b.score || 0) - (a.score || 0));
//     }
//     return activeFiltered;
//   }, [people, query, sort, isDeleted]);

//   const createRole = async (payload: Omit<JobRequirements, "id">): Promise<JobRequirements> => {
//     const BASE = apiBase();
//     const res = await fetch(`${BASE}/api/v1/jobs`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });
//     if (!res.ok) {
//       const text = await res.text();
//       throw new Error(text || `HTTP ${res.status}`);
//     }
//     const job = (await res.json()) as JobRequirements;
//     setJobs((prev) => [job, ...prev]);
//     setSelectedJob(job);
//     return job;
//   };

//   const renderMainContent = () => {
//     if (activePage === "resumes") return <ResumesPage />;
//     if (activePage === "bin") return <BinPage />;
//     if (activePage === "waiting") {
//       // show full waiting-room UI
//       return (
//         <div className="animate-fadeIn p-4">
//           <WaitingRoomPanel />
//         </div>
//       );
//     }
//     if (activePage === "recommendations") {
//       return null;
//     }
//     if (activePage !== "dashboard")
//       return (
//         <div className={`p-8 ${TEXT_COLOR} animate-fadeIn`}>
//           <h2 className="text-2xl">{activePage.charAt(0).toUpperCase() + activePage.slice(1)} Page</h2>
//           <p className={MUTED_COLOR}>Content goes here.</p>
//         </div>
//       );

//     // Dashboard (default)
//     return (
//       <div className="animate-fadeIn">
//         <header className="mb-6 flex items-start justify-between gap-3">
//           <div>
//             <h1 className="text-4xl font-extrabold tracking-tight text-white">Dashboard</h1>
//             <p className="text-base text-gray-400">Welcome back! Here's your recruitment overview.</p>
//           </div>
//           <div className="flex gap-2">
//             <select
//               className={`glass-input border border-white/10 rounded-xl shadow-sm focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/30 transition-all duration-300 ${TEXT_COLOR} appearance-none px-4 py-2`}
//               value={selectedJob?.id ?? ""}
//               onChange={(e) => setSelectedJob(jobs.find((j) => j.id === e.target.value) || null)}
//             >
//               <option value="">All Roles (best match)</option>
//               {jobs.map((j) => (
//                 <option key={j.id} value={j.id}>
//                   {j.title}
//                 </option>
//               ))}
//             </select>

//             <button
//               className={`font-semibold py-2 px-4 rounded-xl shadow-sm border border-[#4361EE]/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:bg-[#4361EE]/10 hover:border-[#4361EE] ${TEXT_COLOR}`}
//               style={{ color: PRIMARY_ACCENT, background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(8px)" }}
//               onClick={() => setOpenCreateRole(true)}
//             >
//               + New Role
//             </button>

//             <button
//               className="text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-all duration-500 hover:scale-[1.03] active:scale-[0.98] hover:shadow-lg hover:shadow-[#4361EE]/50"
//               style={{ background: `linear-gradient(135deg, ${HOVER_ACCENT}, ${PRIMARY_ACCENT})` }}
//               onClick={() => setOpenUpload(true)}
//             >
//               ⬆ Upload Resume
//             </button>
//           </div>
//         </header>

//         {matchErr && (
//           <div className="mb-6 rounded-xl border border-[#FFA726] px-4 py-3 text-sm text-[#FFA726] shadow-sm animate-slideUp glass-card">
//             {matchErr}. Check API base & CORS. (Open console for details.)
//           </div>
//         )}

//         <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
//           {[
//             { label: "Total Applications", value: visiblePeople.length, sub: "in system", delay: 0 },
//             { label: "Pending Reviews", value: "—", sub: "auto", delay: 100 },
//             { label: "Scheduled Interviews", value: "—", sub: "this week", delay: 200 },
//             { label: "Top Matches", value: visiblePeople.filter((p) => (p.score || 0) >= 90).length, sub: "90%+ match", highlight: true, delay: 300 }
//           ].map((stat, i) => (
//             <div
//               key={i}
//               className={`glass-card rounded-xl shadow-md border p-5 transition-all duration-500 hover:scale-[1.02] animate-slideUp ${
//                 stat.highlight ? 'border-[#4361EE]/50 hover:border-[#4361EE] hover:shadow-lg hover:shadow-[#4361EE]/30' : 'border-white/10 hover:border-white/20'
//               } ${TEXT_COLOR}`}
//               style={{ animationDelay: `${stat.delay}ms` }}
//             >
//               <div className="text-sm text-gray-400">{stat.label}</div>
//               <div className={`text-3xl font-extrabold ${stat.highlight ? 'text-[#4361EE]' : 'text-white'}`}>
//                 {stat.value}
//               </div>
//               <div className="text-xs text-gray-500">{stat.sub}</div>
//             </div>
//           ))}
//         </section>

//         <div className="mb-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
//           <div>
//             <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
//               <input
//                 className={`glass-input w-full max-w-sm rounded-xl border border-white/10 shadow-sm px-4 py-2.5 focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/30 transition-all duration-300 ${TEXT_COLOR} placeholder-gray-500`}
//                 placeholder="Search candidates..."
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//               />
//               <div className="flex gap-2">
//                 <select
//                   className={`glass-input rounded-xl border border-white/10 shadow-sm px-4 py-2 focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/30 transition-all duration-300 ${TEXT_COLOR} appearance-none`}
//                   value={sort}
//                   onChange={(e) => setSort(e.target.value as SortKey)}
//                 >
//                   <option value="score_desc">Best Match</option>
//                   <option value="exp_desc">Experience: High → Low</option>
//                   <option value="exp_asc">Experience: Low → High</option>
//                 </select>
//                 <select className={`glass-input rounded-xl border border-white/10 shadow-sm px-4 py-2 focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/30 transition-all duration-300 ${TEXT_COLOR} appearance-none`}>
//                   <option>Status</option>
//                 </select>
//               </div>
//             </div>
//             {visiblePeople.length > 0 ? (
//               <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
//                 {visiblePeople.map((p) => (
//                   <CandidateCard key={p.id} person={p} />
//                 ))}
//               </section>
//             ) : (
//               <div className="glass-card rounded-xl border border-white/10 p-12 text-center">
//                 <div className="text-gray-400 text-lg mb-2">No candidates found</div>
//                 <p className="text-gray-500 text-sm">Upload resumes to get started</p>
//               </div>
//             )}
//           </div>

//           <div className="space-y-6">
//             {/* Compact waiting room card (keeps Dashboard tidy) */}
//             <div className={`glass-card rounded-xl shadow-sm border border-white/10 p-5 ${TEXT_COLOR} animate-slideLeft`}>
//               <div className="text-lg font-bold mb-3 text-white">Waiting Room</div>
//               <WaitingRoomPanel compact />
//               <div className="mt-3">
//                 <button onClick={() => handleSetActivePage("waiting")} className="text-sm px-3 py-1 rounded bg-gray-700 text-white">Open full waiting room</button>
//               </div>
//             </div>

//             <div className={`glass-card rounded-xl shadow-sm border border-white/10 p-5 ${TEXT_COLOR} animate-slideLeft`}>
//               <div className="text-lg font-bold mb-3 text-white">Generated Questions</div>
//               <QuestionsPanel />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className={`min-h-screen grid grid-cols-1 md:grid-cols-[280px_1fr] ${MAIN_BG}`}>
//       <style>{`
//         @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//         @keyframes slideUp { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
//         @keyframes slideLeft { from { opacity: 0; transform: translateX(20px);} to { opacity: 1; transform: translateX(0);} }
//         .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
//         .animate-slideUp { animation: slideUp 0.6s ease-out backwards; }
//         .animate-slideLeft { animation: slideLeft 0.6s ease-out; }
//         .glass-card { background: rgba(28, 42, 74, 0.4); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
//         .glass-sidebar { background: rgba(28, 42, 74, 0.5); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
//         .glass-input, .glass-select { background: rgba(255,255,255,0.05); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
//         .glass-nav-item { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); position: relative; overflow: hidden; }
//         .glass-nav-item::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(89,69,255,0.1), rgba(67,97,238,0.1)); opacity: 0; transition: opacity 0.3s ease; }
//         .glass-nav-item.active::before { opacity: 1; }
//         .glass-nav-item:hover::before { opacity: 0.5; }
//       `}</style>

//       <aside className={`hidden md:block shadow-2xl z-10 glass-sidebar`}>
//         <div className="p-6 text-2xl font-extrabold text-white tracking-wider">S2 Integrators</div>
//         <nav className="px-4 space-y-2 pt-6">
//           {[
//             { id: "dashboard", label: "Dashboard" },
//             { id: "resumes", label: "Resumes" },
//             { id: "interviews", label: "Interviews" },
//             { id: "recommendations", label: "Recommendations" },
//             { id: "settings", label: "Settings" },
//             { id: "bin", label: "Bin" },
//           ].map(({ id, label }) => (
//             <a
//               key={id}
//               className={`glass-nav-item block rounded-xl pl-5 pr-3 py-2.5 font-medium transition-all duration-300 cursor-pointer ${activePage === id ? "active font-bold text-white shadow-lg border border-[#4361EE]/50" : "text-gray-400 hover:text-white border border-transparent hover:border-white/10"}`}
//               style={{
//                 background: activePage === id ? "linear-gradient(135deg, rgba(89, 69, 255, 0.3), rgba(67, 97, 238, 0.3))" : "transparent",
//               }}
//               onClick={() => handleSetActivePage(id as ActivePage)}
//             >
//               {label}
//             </a>
//           ))}

//           {/* Waiting quick link with badge */}
//           <div className="mt-4 px-4">
//             <button onClick={() => handleSetActivePage("waiting")} className="w-full text-left rounded-xl pl-3 pr-3 py-2.5 font-medium bg-transparent border border-white/6 hover:bg-white/2 flex items-center justify-between">
//               <div className="text-sm font-medium text-gray-200">Waiting</div>
//               <div className="text-xs font-semibold bg-[#0b2b4a] px-3 py-1 rounded">{waitingCount}</div>
//             </button>
//           </div>

//           <button
//             onClick={handleLogout}
//             className="w-full text-left block rounded-xl pl-5 pr-3 py-2.5 font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-300 cursor-pointer mt-4 border border-transparent hover:border-red-500/30"
//           >
//             Logout
//           </button>
//         </nav>
//       </aside>

//       <main className="p-8">{renderMainContent()}</main>

//       <UploadModal open={openUpload} onClose={() => setOpenUpload(false)}>
//         <ResumeUpload />
//       </UploadModal>

//       <CreateRoleModal open={openCreateRole} onClose={() => setOpenCreateRole(false)} onCreate={createRole} />
//     </div>
//   );
// }




// FILE: src/pages/Dashboard.tsx
// Replace your existing Dashboard.tsx with this file.

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CandidateCard from "../components/CandidateCard";
import UploadModal from "../components/UploadModal";
import ResumeUpload from "../components/ResumeUpload";
import QuestionsPanel from "../components/QuestionsPanel";
import WaitingRoomPanel from "../components/WaitingRoomPanel";
import { JobsAPI, ResumesAPI } from "../services/http";
import type { JobRequirements, ResumeRecord } from "../services/http";
import MatchAPI, { toPercent } from "../services/match";
import { apiBase } from "../services/env";
import CreateRoleModal from "../components/CreateRoleModal";
import ResumesPage from "./Resumes";
import BinPage from "./Bin";
import useSoftDelete from "../hooks/useSoftDelete";

// Theme constants
const PRIMARY_ACCENT = "#4361EE";
const HOVER_ACCENT = "#5945FF";
const MAIN_BG = "bg-[#0A1930]";
const TEXT_COLOR = "text-gray-200";
const MUTED_COLOR = "text-gray-400";
const WAITING_ACCENT = "#FFA726";

type ActivePage = "dashboard" | "resumes" | "interviews" | "recommendations" | "settings" | "bin" | "waiting";

type Person = {
  id: string;
  name: string;
  role: string;
  initials: string;
  score: number;
  years: number;
  updated: string;
  badge: string;
  tags: string[];
  education: number;
  raw_text: string;
  bestRoleTitle?: string | null;
  breakdown?: import("../services/match").MatchBreakdown | null;
  details?: Record<string, number> | null;
};

const initials = (n?: string) =>
  (n || "??")
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

type SortKey = "score_desc" | "exp_desc" | "exp_asc";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<ActivePage>(
    (localStorage.getItem("activePage") as ActivePage) || "dashboard"
  );
  const [openUpload, setOpenUpload] = useState(false);
  const [openCreateRole, setOpenCreateRole] = useState(false);
  const [jobs, setJobs] = useState<JobRequirements[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobRequirements | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("score_desc");
  const [matchErr, setMatchErr] = useState<string | null>(null);

  // Waiting room count for sidebar badge
  const [waitingCount, setWaitingCount] = useState<number>(0);

  const { isDeleted } = useSoftDelete();

  const handleSetActivePage = (id: ActivePage) => {
    setActivePage(id);
    localStorage.setItem("activePage", id);
    if (id === "recommendations") {
      navigate("/recruiter/recommendations");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login", { replace: true });
  };

  const mapResumes = (rows: ResumeRecord[]): Person[] =>
    rows
      .filter((r) => r.name && r.name !== "Candidate")
      .map((r) => ({
        id: r.id,
        name: r.name || "Candidate",
        role: "—",
        initials: initials(r.name),
        score: 0,
        years: Number(r.years_experience || 0),
        updated: new Date(r.updated_at || r.created_at || Date.now()).toDateString(),
        badge: "New",
        tags: Array.isArray(r.skills) ? r.skills : [],
        education: Number(r.education ?? 0),
        raw_text: String(r.raw_text || ""),
      }));

  // Initial load
  useEffect(() => {
    (async () => {
      try {
        const list = await JobsAPI.list<JobRequirements[]>();
        setJobs(list);
        setSelectedJob(null);
      } catch (e: any) {
        console.error("Jobs load failed", e);
        setJobs([]);
        setSelectedJob(null);
      }
    })();
    (async () => {
      try {
        const list = await ResumesAPI.list<ResumeRecord[]>();
        const byId = new Map<string, ResumeRecord>();
        list.forEach((r) => byId.set(r.id, r));
        setPeople(mapResumes(Array.from(byId.values())));
      } catch (e: any) {
        console.error("Resumes load failed", e);
        setPeople([]);
      }
    })();
    // fetch waiting count for sidebar badge
    (async function loadWaitingCount() {
      const BASE = (apiBase && typeof apiBase === "function" ? apiBase() : "") || "";
      const primary = `${BASE}/api/interview-access/waiting`;
      const fallback = `${BASE}/interview-access/waiting`;
      try {
        let res = await fetch(primary).catch(() => null);
        if (!res || res.status === 404) res = await fetch(fallback).catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setWaitingCount(data.length);
        }
      } catch (err) {
        // ignore
      }
    })();
  }, []);

  // update waitingCount periodically to keep sidebar badge live
  useEffect(() => {
    const id = setInterval(async () => {
      const BASE = (apiBase && typeof apiBase === "function" ? apiBase() : "") || "";
      const primary = `${BASE}/api/interview-access/waiting`;
      const fallback = `${BASE}/interview-access/waiting`;
      try {
        let res = await fetch(primary).catch(() => null);
        if (!res || res.status === 404) res = await fetch(fallback).catch(() => null);
        if (res && res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setWaitingCount(data.length);
        }
      } catch {
        // ignore
      }
    }, 9000);
    return () => clearInterval(id);
  }, []);

  // Live refresh on resumes:changed
  useEffect(() => {
    const h = () => {
      (async () => {
        try {
          const list = await ResumesAPI.list<ResumeRecord[]>();
          const byId = new Map<string, ResumeRecord>();
          list.forEach((r) => byId.set(r.id, r));
          setPeople(mapResumes(Array.from(byId.values())));
        } catch (e: any) {
          console.error("Resumes refresh failed", e);
          setPeople([]);
        }
      })();
    };
    window.addEventListener("resumes:changed", h as EventListener);
    return () => window.removeEventListener("resumes:changed", h as EventListener);
  }, []);

  const resumesForAPI = useMemo(
    () =>
      people.map((p) => ({
        skills: p.tags,
        years_experience: p.years,
        education: p.education,
        raw_text: p.raw_text,
      })),
    [people]
  );

  useEffect(() => {
    (async () => {
      if (people.length === 0) return;
      setMatchErr(null);

      if (selectedJob?.id) {
        try {
          const results = await MatchAPI.scoreBatch({ resumes: resumesForAPI, job: selectedJob });
          setPeople((prev) =>
            prev.map((p, i) => ({
              ...p,
              score: toPercent(results?.[i]?.score),
              bestRoleTitle: selectedJob.title,
              breakdown: results?.[i]?.breakdown || null,
              details: results?.[i]?.details || null,
            }))
          );
          return;
        } catch (e: any) {
          setMatchErr(`Match (batch) failed: ${e?.message || e}`);
          console.error("Match batch error", e);
        }
      }

      try {
        const perCandidate = await Promise.all(resumesForAPI.map((r) => MatchAPI.scoreAgainstAllJobs(r)));
        setPeople((prev) =>
          prev.map((p, i) => {
            const top = perCandidate[i]?.[0];
            return {
              ...p,
              score: toPercent(top?.score),
              bestRoleTitle: top?.title ?? null,
              breakdown: top?.breakdown || null,
              details: top?.details || null,
            };
          })
        );
      } catch (e: any) {
        setMatchErr(`Match (best-role) failed: ${e?.message || e}`);
        console.error("Match best-role error", e);
      }
    })();
  }, [selectedJob?.id, resumesForAPI, people.length]);

  const visiblePeople = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? people.filter((p) => p.name.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)))
      : people.slice();

    const activeFiltered = filtered.filter((p) => !isDeleted(p.id));

    switch (sort) {
      case "exp_desc":
        activeFiltered.sort((a, b) => (b.years || 0) - (a.years || 0));
        break;
      case "exp_asc":
        activeFiltered.sort((a, b) => (a.years || 0) - (b.years || 0));
        break;
      default:
        activeFiltered.sort((a, b) => (b.score || 0) - (a.score || 0));
    }
    return activeFiltered;
  }, [people, query, sort, isDeleted]);

  const createRole = async (payload: Omit<JobRequirements, "id">): Promise<JobRequirements> => {
    const BASE = apiBase();
    const res = await fetch(`${BASE}/api/v1/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }
    const job = (await res.json()) as JobRequirements;
    setJobs((prev) => [job, ...prev]);
    setSelectedJob(job);
    return job;
  };

  const renderMainContent = () => {
    if (activePage === "resumes") return <ResumesPage />;
    if (activePage === "bin") return <BinPage />;
    if (activePage === "waiting") {
      return (
        <div className="animate-fadeIn p-4">
          <WaitingRoomPanel />
        </div>
      );
    }
    if (activePage === "recommendations") {
      return null;
    }
    if (activePage !== "dashboard")
      return (
        <div className={`p-8 ${TEXT_COLOR} animate-fadeIn`}>
          <h2 className="text-2xl">{activePage.charAt(0).toUpperCase() + activePage.slice(1)} Page</h2>
          <p className={MUTED_COLOR}>Content goes here.</p>
        </div>
      );

    // Dashboard default (NO compact waiting card)
    return (
      <div className="animate-fadeIn">
        <header className="mb-6 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">Dashboard</h1>
            <p className="text-base text-gray-400">Welcome back! Here's your recruitment overview.</p>
          </div>
          <div className="flex gap-2">
            <select
              className={`glass-input border border-white/10 rounded-xl shadow-sm focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/30 transition-all duration-300 ${TEXT_COLOR} appearance-none px-4 py-2`}
              value={selectedJob?.id ?? ""}
              onChange={(e) => setSelectedJob(jobs.find((j) => j.id === e.target.value) || null)}
            >
              <option value="">All Roles (best match)</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>

            <button
              className={`font-semibold py-2 px-4 rounded-xl shadow-sm border border-[#4361EE]/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:bg-[#4361EE]/10 hover:border-[#4361EE] ${TEXT_COLOR}`}
              style={{ color: PRIMARY_ACCENT, background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(8px)" }}
              onClick={() => setOpenCreateRole(true)}
            >
              + New Role
            </button>

            <button
              className="text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-all duration-500 hover:scale-[1.03] active:scale-[0.98] hover:shadow-lg hover:shadow-[#4361EE]/50"
              style={{ background: `linear-gradient(135deg, ${HOVER_ACCENT}, ${PRIMARY_ACCENT})` }}
              onClick={() => setOpenUpload(true)}
            >
              ⬆ Upload Resume
            </button>
          </div>
        </header>

        {matchErr && (
          <div className="mb-6 rounded-xl border border-[#FFA726] px-4 py-3 text-sm text-[#FFA726] shadow-sm animate-slideUp glass-card">
            {matchErr}. Check API base & CORS. (Open console for details.)
          </div>
        )}

        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Applications", value: visiblePeople.length, sub: "in system", delay: 0 },
            { label: "Pending Reviews", value: "—", sub: "auto", delay: 100 },
            { label: "Scheduled Interviews", value: "—", sub: "this week", delay: 200 },
            { label: "Top Matches", value: visiblePeople.filter((p) => (p.score || 0) >= 90).length, sub: "90%+ match", highlight: true, delay: 300 }
          ].map((stat, i) => (
            <div
              key={i}
              className={`glass-card rounded-xl shadow-md border p-5 transition-all duration-500 hover:scale-[1.02] animate-slideUp ${
                stat.highlight ? 'border-[#4361EE]/50 hover:border-[#4361EE] hover:shadow-lg hover:shadow-[#4361EE]/30' : 'border-white/10 hover:border-white/20'
              } ${TEXT_COLOR}`}
              style={{ animationDelay: `${stat.delay}ms` }}
            >
              <div className="text-sm text-gray-400">{stat.label}</div>
              <div className={`text-3xl font-extrabold ${stat.highlight ? 'text-[#4361EE]' : 'text-white'}`}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-500">{stat.sub}</div>
            </div>
          ))}
        </section>

        <div className="mb-4 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <input
                className={`glass-input w-full max-w-sm rounded-xl border border-white/10 shadow-sm px-4 py-2.5 focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/30 transition-all duration-300 ${TEXT_COLOR} placeholder-gray-500`}
                placeholder="Search candidates..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="flex gap-2">
                <select
                  className={`glass-input rounded-xl border border-white/10 shadow-sm px-4 py-2 focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/30 transition-all duration-300 ${TEXT_COLOR} appearance-none`}
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                >
                  <option value="score_desc">Best Match</option>
                  <option value="exp_desc">Experience: High → Low</option>
                  <option value="exp_asc">Experience: Low → High</option>
                </select>
                <select className={`glass-input rounded-xl border border-white/10 shadow-sm px-4 py-2 focus:border-[#4361EE] focus:ring-2 focus:ring-[#4361EE]/30 transition-all duration-300 ${TEXT_COLOR} appearance-none`}>
                  <option>Status</option>
                </select>
              </div>
            </div>
            {visiblePeople.length > 0 ? (
              <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {visiblePeople.map((p) => (
                  <CandidateCard key={p.id} person={p} />
                ))}
              </section>
            ) : (
              <div className="glass-card rounded-xl border border-white/10 p-12 text-center">
                <div className="text-gray-400 text-lg mb-2">No candidates found</div>
                <p className="text-gray-500 text-sm">Upload resumes to get started</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className={`glass-card rounded-xl shadow-sm border border-white/10 p-5 ${TEXT_COLOR} animate-slideLeft`}>
              <div className="text-lg font-bold mb-3 text-white">Generated Questions</div>
              <QuestionsPanel />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Nav entries (waiting included to match UI)
  const navItems: { id: ActivePage; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "resumes", label: "Resumes" },
    { id: "interviews", label: "Interviews" },
    { id: "recommendations", label: "Recommendations" },
    { id: "settings", label: "Settings" },
    { id: "bin", label: "Bin" },
    // waiting will appear visually like other nav items
    { id: "waiting", label: "Waiting" },
  ];

  return (
    <div className={`min-h-screen grid grid-cols-1 md:grid-cols-[280px_1fr] ${MAIN_BG}`}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: translateY(0);} }
        @keyframes slideLeft { from { opacity: 0; transform: translateX(20px);} to { opacity: 1; transform: translateX(0);} }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideUp { animation: slideUp 0.6s ease-out backwards; }
        .animate-slideLeft { animation: slideLeft 0.6s ease-out; }
        .glass-card { background: rgba(28, 42, 74, 0.4); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
        .glass-sidebar { background: rgba(28, 42, 74, 0.5); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
        .glass-input, .glass-select { background: rgba(255,255,255,0.05); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
        .glass-nav-item { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); position: relative; overflow: hidden; display:flex; align-items:center; justify-content:space-between; }
        .glass-nav-item::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(89,69,255,0.1), rgba(67,97,238,0.1)); opacity: 0; transition: opacity 0.25s ease; border-radius: 12px; }
        .glass-nav-item.active::before { opacity: 1; }
        .glass-nav-item:hover::before { opacity: 0.5; }
      `}</style>

      <aside className={`hidden md:block shadow-2xl z-10 glass-sidebar`}>
        <div className="p-6 text-2xl font-extrabold text-white tracking-wider">S2 Integrators</div>
        <nav className="px-4 space-y-3 pt-4">
          {navItems.map(({ id, label }) => {
            // For waiting, show the count badge on right
            const isWaiting = id === "waiting";
            const active = activePage === id;
            return (
              <div
                key={id}
                onClick={() => handleSetActivePage(id)}
                role="button"
                tabIndex={0}
                className={`glass-nav-item block rounded-xl px-4 py-3 font-medium transition-all duration-300 cursor-pointer ${active ? "active font-bold text-white shadow-lg border border-[#4361EE]/50" : "text-gray-400 hover:text-white border border-transparent hover:border-white/10"}`}
                style={{
                  background: active ? "linear-gradient(135deg, rgba(89, 69, 255, 0.18), rgba(67, 97, 238, 0.18))" : "transparent",
                }}
              >
                <div className="truncate">{label}</div>
                {isWaiting ? (
                  <div className={`ml-3 inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold ${waitingCount > 0 ? "bg-[#08304f] text-white" : "bg-[#061a2a] text-gray-300"}`}>
                    {waitingCount}
                  </div>
                ) : null}
              </div>
            );
          })}

          <div className="mt-4 px-4">
            <button
              onClick={handleLogout}
              className="w-full text-left block rounded-xl pl-5 pr-3 py-2.5 font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-300 cursor-pointer mt-2 border border-transparent hover:border-red-500/30"
            >
              Logout
            </button>
          </div>
        </nav>
      </aside>

      <main className="p-8">{renderMainContent()}</main>

      <UploadModal open={openUpload} onClose={() => setOpenUpload(false)}>
        <ResumeUpload />
      </UploadModal>

      <CreateRoleModal open={openCreateRole} onClose={() => setOpenCreateRole(false)} onCreate={createRole} />
    </div>
  );
}
