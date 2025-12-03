// // // // // src/pages/Recommendations.tsx
// // // // import React, { useEffect, useState } from "react";

// // // // type Candidate = {
// // // //   id: number;
// // // //   candidate_name: string;
// // // //   resume_link: string;
// // // //   best_role?: string;
// // // //   skills?: string;
// // // //   keywords?: string;
// // // //   years_experience?: number;
// // // //   score?: number;
// // // // };

// // // // export default function Recommendations() {
// // // //   const [role, setRole] = useState("");
// // // //   const [skills, setSkills] = useState("");
// // // //   const [years, setYears] = useState<number | "">("");
// // // //   const [results, setResults] = useState<Candidate[]>([]);
// // // //   const [loading, setLoading] = useState(false);

// // // //   useEffect(() => {
// // // //     // initial top results
// // // //     search({ topN: 12 });
// // // //   }, []);

// // // //   async function search(custom?: any) {
// // // //     setLoading(true);
// // // //     try {
// // // //       const payload = {
// // // //         role: (custom?.role ?? role) || undefined,
// // // //         skills: custom?.skills ?? (skills ? skills.split(",").map(s => s.trim()) : undefined),
// // // //         years: custom?.years ?? (years === "" ? undefined : Number(years)),
// // // //         topN: custom?.topN ?? 50
// // // //       };
// // // //       const res = await fetch("/api/recommendations/search", {
// // // //         method: "POST",
// // // //         headers: { "Content-Type": "application/json" },
// // // //         body: JSON.stringify(payload)
// // // //       });
// // // //       const json = await res.json();
// // // //       if (json.success) setResults(json.results || []);
// // // //       else setResults([]);
// // // //     } catch (err) {
// // // //       console.error(err);
// // // //       setResults([]);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   }

// // // //   async function downloadCSV() {
// // // //     const res = await fetch("/api/recommendations/export");
// // // //     const blob = await res.blob();
// // // //     const url = window.URL.createObjectURL(blob);
// // // //     const a = document.createElement("a");
// // // //     a.href = url;
// // // //     a.download = "resumes_links.csv";
// // // //     a.click();
// // // //     window.URL.revokeObjectURL(url);
// // // //   }

// // // //   return (
// // // //     <div className="p-6">
// // // //       <h2 className="text-xl font-semibold mb-4">Recommendations</h2>

// // // //       <div className="flex gap-2 mb-4">
// // // //         <input className="p-2 border rounded flex-1" value={role} onChange={e => setRole(e.target.value)} placeholder="Role (e.g. Java developer)" />
// // // //         <input className="p-2 border rounded w-64" value={skills} onChange={e => setSkills(e.target.value)} placeholder="Skills (comma separated)" />
// // // //         <input className="p-2 border rounded w-24" value={years} onChange={e => setYears(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Years" />
// // // //         <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => search({})}>Search</button>
// // // //         <button className="px-4 py-2 bg-gray-200 rounded" onClick={downloadCSV}>Export CSV</button>
// // // //       </div>

// // // //       {loading ? <div>Loading...</div> :
// // // //         <div className="grid grid-cols-3 gap-4">
// // // //           {results.map(r => (
// // // //             <div key={r.id} className="p-4 bg-white shadow rounded">
// // // //               <div className="flex items-center gap-3">
// // // //                 <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
// // // //                   { (r.candidate_name || "N/A").split(" ").map(n => n[0]).slice(0,2).join("") }
// // // //                 </div>
// // // //                 <div>
// // // //                   <div className="font-medium">{r.candidate_name}</div>
// // // //                   <div className="text-sm text-gray-500">{r.best_role} • {r.years_experience ?? 0} years</div>
// // // //                 </div>
// // // //               </div>

// // // //               <div className="mt-3 text-sm text-gray-700">
// // // //                 <div>Skills: {r.skills}</div>
// // // //                 <div>Keywords: {r.keywords}</div>
// // // //                 <div className="mt-2 font-semibold">Score: {r.score}</div>
// // // //                 <a className="mt-2 inline-block text-blue-600" href={r.resume_link} target="_blank" rel="noreferrer">Open Resume</a>
// // // //               </div>
// // // //             </div>
// // // //           ))}
// // // //         </div>
// // // //       }
// // // //     </div>
// // // //   );
// // // // }




// // // // src/pages/Recommendations.tsx
// // // import React, { useEffect, useState, JSX } from "react";
// // // import { apiBase } from "../services/env"; // <-- uses same helper as your Dashboard

// // // type Candidate = {
// // //   id: number;
// // //   candidate_name?: string;
// // //   resume_link?: string;
// // //   best_role?: string;
// // //   skills?: string;
// // //   keywords?: string;
// // //   years_experience?: number;
// // //   score?: number;
// // // };

// // // export default function Recommendations(): JSX.Element {
// // //   const [role, setRole] = useState<string>("");
// // //   const [skills, setSkills] = useState<string>("");
// // //   const [years, setYears] = useState<string>("");
// // //   const [results, setResults] = useState<Candidate[]>([]);
// // //   const [loading, setLoading] = useState<boolean>(false);

// // //   // build base url once
// // //   const BASE = apiBase(); // e.g. "http://localhost:8000/api/v1"
// // //   const SEARCH_URL = `${BASE}/recommendations/search`;
// // //   const EXPORT_URL = `${BASE}/recommendations/export`;

// // //   useEffect(() => {
// // //     // initial fetch top results
// // //     search({ topN: 12 });
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, []);

// // //   async function search(custom: any = {}) {
// // //     setLoading(true);
// // //     try {
// // //       const payload = {
// // //         role: (custom?.role ?? role) || undefined,
// // //         skills: custom?.skills ?? (skills ? skills.split(",").map((s) => s.trim()).filter(Boolean) : undefined),
// // //         years: custom?.years ?? (years === "" ? undefined : Number(years)),
// // //         topN: custom?.topN ?? 50,
// // //       };

// // //       console.log("POST ->", SEARCH_URL, payload);
// // //       const res = await fetch(SEARCH_URL, {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify(payload),
// // //       });

// // //       if (!res.ok) {
// // //         const text = await res.text();
// // //         console.error("Search failed:", res.status, text);
// // //         setResults([]);
// // //         return;
// // //       }

// // //       const json = await res.json();
// // //       if (json.success) setResults(json.results || []);
// // //       else setResults([]);
// // //     } catch (err) {
// // //       console.error("Search error:", err);
// // //       setResults([]);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }

// // //   async function downloadCSV() {
// // //     try {
// // //       console.log("GET ->", EXPORT_URL);
// // //       const res = await fetch(EXPORT_URL);
// // //       if (!res.ok) throw new Error(`Export failed ${res.status}`);
// // //       const blob = await res.blob();
// // //       const url = window.URL.createObjectURL(blob);
// // //       const a = document.createElement("a");
// // //       a.href = url;
// // //       a.download = "resumes_links.csv";
// // //       document.body.appendChild(a);
// // //       a.click();
// // //       a.remove();
// // //       window.URL.revokeObjectURL(url);
// // //     } catch (err) {
// // //       console.error("CSV download failed:", err);
// // //       alert("Download failed — check console for details.");
// // //     }
// // //   }

// // //   function CandidateCard({ r }: { r: Candidate }) {
// // //     const initials = (r.candidate_name || "N/A")
// // //       .split(" ")
// // //       .map((n) => (n ? n[0] : ""))
// // //       .slice(0, 2)
// // //       .join("");

// // //     return (
// // //       <div className="p-4 bg-white shadow rounded">
// // //         <div className="flex items-center gap-3">
// // //           <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
// // //             {initials}
// // //           </div>
// // //           <div>
// // //             <div className="font-medium">{r.candidate_name}</div>
// // //             <div className="text-sm text-gray-500">{r.best_role || "—"} • {r.years_experience ?? 0} years</div>
// // //           </div>
// // //         </div>

// // //         <div className="mt-3 text-sm text-gray-700">
// // //           <div className="truncate">Skills: {r.skills || "—"}</div>
// // //           <div className="truncate">Keywords: {r.keywords || "—"}</div>
// // //           <div className="mt-2 font-semibold">Score: {r.score ?? 0}</div>
// // //           {r.resume_link ? (
// // //             <a className="mt-2 inline-block text-blue-600" href={r.resume_link} target="_blank" rel="noreferrer">
// // //               Open Resume
// // //             </a>
// // //           ) : (
// // //             <div className="mt-2 text-xs text-gray-400">No resume link</div>
// // //           )}
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="p-6">
// // //       <h2 className="text-xl font-semibold mb-4">Recommendations</h2>

// // //       <div className="flex gap-2 mb-4">
// // //         <input className="p-2 border rounded flex-1" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role (e.g. Java developer)" />
// // //         <input className="p-2 border rounded w-64" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Skills (comma separated)" />
// // //         <input className="p-2 border rounded w-24" value={years} onChange={(e) => setYears(e.target.value)} placeholder="Years" />
// // //         <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => search({})}>Search</button>
// // //         <button className="px-4 py-2 bg-gray-200 rounded" onClick={downloadCSV}>Export CSV</button>
// // //       </div>

// // //       {loading ? <div>Loading...</div> : (
// // //         <div className="grid grid-cols-3 gap-4">
// // //           {results.length ? results.map((r) => <CandidateCard key={r.id} r={r} />) : <div className="col-span-3 text-gray-500">No results — try a broader query.</div>}
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }


// // // src/pages/Recommendations.tsx
// // import React, { useEffect, useState, JSX } from "react";
// // import { apiBase } from "../services/env";

// // type Candidate = {
// //   id: number;
// //   candidate_name?: string;
// //   resume_link?: string;
// //   best_role?: string;
// //   skills?: string;
// //   keywords?: string;
// //   years_experience?: number;
// //   score?: number;
// // };

// // export default function Recommendations(): JSX.Element {
// //   const [role, setRole] = useState<string>("");
// //   const [skills, setSkills] = useState<string>("");
// //   const [years, setYears] = useState<string>("");
// //   const [results, setResults] = useState<Candidate[]>([]);
// //   const [loading, setLoading] = useState<boolean>(false);

// //   const BASE = apiBase();
// //   const SEARCH_URL = `${BASE}/recommendations/search`;
// //   const EXPORT_URL = `${BASE}/recommendations/export`;

// //   useEffect(() => {
// //     // Initial fetch top results
// //     search({ topN: 12 });
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   async function search(custom: any = {}) {
// //     setLoading(true);
// //     try {
// //       const payload = {
// //         role: (custom?.role ?? role) || undefined,
// //         skills: custom?.skills ?? (skills ? skills.split(",").map((s) => s.trim()).filter(Boolean) : undefined),
// //         years: custom?.years ?? (years === "" ? undefined : Number(years)),
// //         topN: custom?.topN ?? 50,
// //       };

// //       console.log("POST ->", SEARCH_URL, payload);
// //       const res = await fetch(SEARCH_URL, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload),
// //       });

// //       if (!res.ok) {
// //         const text = await res.text();
// //         console.error("Search failed:", res.status, text);
// //         setResults([]);
// //         return;
// //       }

// //       const json = await res.json();
// //       if (json.success) setResults(json.results || []);
// //       else setResults([]);
// //     } catch (err) {
// //       console.error("Search error:", err);
// //       setResults([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   async function downloadCSV() {
// //     try {
// //       console.log("GET ->", EXPORT_URL);
// //       const res = await fetch(EXPORT_URL);
// //       if (!res.ok) throw new Error(`Export failed ${res.status}`);
// //       const blob = await res.blob();
// //       const url = window.URL.createObjectURL(blob);
// //       const a = document.createElement("a");
// //       a.href = url;
// //       a.download = "resumes_links.csv";
// //       document.body.appendChild(a);
// //       a.click();
// //       a.remove();
// //       window.URL.revokeObjectURL(url);
// //     } catch (err) {
// //       console.error("CSV download failed:", err);
// //       alert("Download failed — check console for details.");
// //     }
// //   }

// //   function CandidateCard({ r }: { r: Candidate }) {
// //     const initials = (r.candidate_name || "N/A")
// //       .split(" ")
// //       .map((n) => (n ? n[0] : ""))
// //       .slice(0, 2)
// //       .join("");

// //     // Parse skills string into array
// //     const skillsList = r.skills 
// //       ? r.skills.split(",").map(s => s.trim()).filter(Boolean)
// //       : [];

// //     return (
// //       <div className="p-4 bg-white shadow rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
// //         <div className="flex items-center gap-3 mb-3">
// //           <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-semibold text-white text-lg">
// //             {initials}
// //           </div>
// //           <div className="flex-1 min-w-0">
// //             <div className="font-semibold text-gray-900 truncate">{r.candidate_name}</div>
// //             <div className="text-sm text-gray-500 truncate">
// //               {r.best_role || "—"} • {r.years_experience ?? 0} years
// //             </div>
// //           </div>
// //         </div>

// //         {/* Skills Section */}
// //         {skillsList.length > 0 && (
// //           <div className="mb-3">
// //             <div className="text-xs font-medium text-gray-600 mb-1">Skills:</div>
// //             <div className="flex flex-wrap gap-1">
// //               {skillsList.slice(0, 5).map((skill, idx) => (
// //                 <span 
// //                   key={idx}
// //                   className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
// //                 >
// //                   {skill}
// //                 </span>
// //               ))}
// //               {skillsList.length > 5 && (
// //                 <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
// //                   +{skillsList.length - 5} more
// //                 </span>
// //               )}
// //             </div>
// //           </div>
// //         )}

// //         {/* Keywords - Show only if different from skills */}
// //         {r.keywords && r.keywords !== r.skills && (
// //           <div className="text-xs text-gray-600 mb-2 truncate">
// //             <span className="font-medium">Keywords:</span> {r.keywords}
// //           </div>
// //         )}

// //         {/* Score */}
// //         <div className="flex items-center justify-between mb-3">
// //           <span className="text-sm font-semibold text-gray-700">
// //             Match Score: <span className="text-blue-600">{r.score ?? 0}%</span>
// //           </span>
// //           <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
// //             <div 
// //               className="bg-blue-600 h-2 rounded-full transition-all"
// //               style={{ width: `${r.score ?? 0}%` }}
// //             />
// //           </div>
// //         </div>

// //         {/* Resume Link */}
// //         {r.resume_link ? (
// //           <a 
// //             className="block text-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors" 
// //             href={r.resume_link} 
// //             target="_blank" 
// //             rel="noreferrer"
// //           >
// //             View Resume
// //           </a>
// //         ) : (
// //           <div className="text-center text-xs text-gray-400 py-2">No resume link</div>
// //         )}
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6">
// //       <div className="max-w-7xl mx-auto">
// //         <h2 className="text-3xl font-bold mb-6 text-gray-900">Recommendations</h2>

// //         {/* Search Form */}
// //         <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
// //           <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
// //             <input 
// //               className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
// //               value={role} 
// //               onChange={(e) => setRole(e.target.value)} 
// //               placeholder="Role (e.g. Java developer)" 
// //             />
// //             <input 
// //               className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
// //               value={skills} 
// //               onChange={(e) => setSkills(e.target.value)} 
// //               placeholder="Skills (e.g. Java, Python, SQL)" 
// //             />
// //             <input 
// //               className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
// //               value={years} 
// //               onChange={(e) => setYears(e.target.value)} 
// //               placeholder="Min. Years" 
// //               type="number"
// //             />
// //             <div className="flex gap-2">
// //               <button 
// //                 className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
// //                 onClick={() => search({})}
// //                 disabled={loading}
// //               >
// //                 {loading ? "Searching..." : "Search"}
// //               </button>
// //               <button 
// //                 className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
// //                 onClick={downloadCSV}
// //               >
// //                 Export
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Results */}
// //         {loading ? (
// //           <div className="text-center py-12">
// //             <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
// //             <p className="mt-2 text-gray-600">Loading candidates...</p>
// //           </div>
// //         ) : (
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// //             {results.length ? (
// //               results.map((r) => <CandidateCard key={r.id} r={r} />)
// //             ) : (
// //               <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
// //                 <p className="text-gray-500 text-lg">No results found</p>
// //                 <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</p>
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }




// // // src/pages/Recommendations.tsx
// // import React, { useEffect, useState, JSX } from "react";
// // import { apiBase } from "../services/env";

// // type Candidate = {
// //   id: number;
// //   candidate_name?: string;
// //   resume_link?: string;
// //   best_role?: string;
// //   skills?: string;
// //   keywords?: string;
// //   years_experience?: number;
// //   score?: number;
// // };

// // export default function Recommendations(): JSX.Element {
// //   const [role, setRole] = useState<string>("");
// //   const [skills, setSkills] = useState<string>("");
// //   const [years, setYears] = useState<string>("");
// //   const [results, setResults] = useState<Candidate[]>([]);
// //   const [loading, setLoading] = useState<boolean>(false);
// //   const [hasSearched, setHasSearched] = useState<boolean>(false);

// //   const BASE = apiBase();
// //   const SEARCH_URL = `${BASE}/recommendations/search`;
// //   const EXPORT_URL = `${BASE}/recommendations/export`;

// //   useEffect(() => {
// //     // Initial fetch - load all candidates
// //     search({ topN: 12 }, false);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   async function search(custom: any = {}, isUserSearch: boolean = true) {
// //     setLoading(true);
// //     if (isUserSearch) setHasSearched(true);
    
// //     try {
// //       const payload = {
// //         role: (custom?.role ?? role) || undefined,
// //         skills: custom?.skills ?? (skills ? skills.split(",").map((s) => s.trim()).filter(Boolean) : undefined),
// //         years: custom?.years ?? (years === "" ? undefined : Number(years)),
// //         topN: custom?.topN ?? 50,
// //       };

// //       console.log("POST ->", SEARCH_URL, payload);
// //       const res = await fetch(SEARCH_URL, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload),
// //       });

// //       if (!res.ok) {
// //         const text = await res.text();
// //         console.error("Search failed:", res.status, text);
// //         setResults([]);
// //         return;
// //       }

// //       const json = await res.json();
// //       if (json.success) setResults(json.results || []);
// //       else setResults([]);
// //     } catch (err) {
// //       console.error("Search error:", err);
// //       setResults([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   async function downloadCSV() {
// //     try {
// //       console.log("GET ->", EXPORT_URL);
// //       const res = await fetch(EXPORT_URL);
// //       if (!res.ok) throw new Error(`Export failed ${res.status}`);
// //       const blob = await res.blob();
// //       const url = window.URL.createObjectURL(blob);
// //       const a = document.createElement("a");
// //       a.href = url;
// //       a.download = "resumes_links.csv";
// //       document.body.appendChild(a);
// //       a.click();
// //       a.remove();
// //       window.URL.revokeObjectURL(url);
// //     } catch (err) {
// //       console.error("CSV download failed:", err);
// //       alert("Download failed — check console for details.");
// //     }
// //   }

// //   function handleSearch() {
// //     search({}, true);
// //   }

// //   function handleClear() {
// //     setRole("");
// //     setSkills("");
// //     setYears("");
// //     setHasSearched(false);
// //     search({ topN: 12 }, false);
// //   }

// //   function CandidateCard({ r }: { r: Candidate }) {
// //     const initials = (r.candidate_name || "N/A")
// //       .split(" ")
// //       .map((n) => (n ? n[0] : ""))
// //       .slice(0, 2)
// //       .join("");

// //     // Parse skills string into array
// //     const skillsList = r.skills 
// //       ? r.skills.split(",").map(s => s.trim()).filter(Boolean)
// //       : [];

// //     // Determine if we should show the score
// //     const showScore = hasSearched && (role || skills || years);

// //     return (
// //       <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
// //         {/* Card Header */}
// //         <div className="p-5 border-b border-gray-100">
// //           <div className="flex items-center gap-3">
// //             <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-md">
// //               {initials}
// //             </div>
// //             <div className="flex-1 min-w-0">
// //               <h3 className="font-semibold text-lg text-gray-900 truncate">
// //                 {r.candidate_name}
// //               </h3>
// //               <p className="text-sm text-gray-500 truncate">
// //                 {r.best_role || "Not specified"} • {r.years_experience ?? 0} years
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Card Body */}
// //         <div className="p-5 space-y-4">
// //           {/* Skills Section */}
// //           {skillsList.length > 0 && (
// //             <div>
// //               <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
// //                 Skills
// //               </p>
// //               <div className="flex flex-wrap gap-2">
// //                 {skillsList.slice(0, 6).map((skill, idx) => (
// //                   <span 
// //                     key={idx}
// //                     className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200"
// //                   >
// //                     {skill}
// //                   </span>
// //                 ))}
// //                 {skillsList.length > 6 && (
// //                   <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full border border-gray-200">
// //                     +{skillsList.length - 6} more
// //                   </span>
// //                 )}
// //               </div>
// //             </div>
// //           )}

// //           {/* Match Score - Only show when searched */}
// //           {showScore && (
// //             <div className="pt-3 border-t border-gray-100">
// //               <div className="flex items-center justify-between mb-2">
// //                 <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
// //                   Match Score
// //                 </span>
// //                 <span className="text-sm font-bold text-blue-600">
// //                   {r.score ?? 0}%
// //                 </span>
// //               </div>
// //               <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
// //                 <div 
// //                   className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
// //                   style={{ width: `${r.score ?? 0}%` }}
// //                 />
// //               </div>
// //             </div>
// //           )}

// //           {/* Keywords - Only if different from skills and exists */}
// //           {r.keywords && r.keywords !== r.skills && r.keywords.trim() && (
// //             <div className="pt-3 border-t border-gray-100">
// //               <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
// //                 Key Projects
// //               </p>
// //               <p className="text-sm text-gray-700 line-clamp-2">
// //                 {r.keywords}
// //               </p>
// //             </div>
// //           )}
// //         </div>

// //         {/* Card Footer */}
// //         <div className="px-5 pb-5">
// //           {r.resume_link ? (
// //             <a 
// //               className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm" 
// //               href={`mailto:${r.resume_link}`}
// //               target="_blank" 
// //               rel="noreferrer"
// //             >
// //               Contact Candidate
// //             </a>
// //           ) : (
// //             <div className="text-center text-xs text-gray-400 py-2">No contact available</div>
// //           )}
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
// //       <div className="max-w-7xl mx-auto">
// //         {/* Header */}
// //         <div className="mb-8">
// //           <h1 className="text-4xl font-bold text-gray-900 mb-2">
// //             Candidate Recommendations
// //           </h1>
// //           <p className="text-gray-600">
// //             Search and filter candidates by role, skills, and experience
// //           </p>
// //         </div>

// //         {/* Search Panel */}
// //         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
// //           <div className="space-y-4">
// //             {/* Search Inputs */}
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Role
// //                 </label>
// //                 <input 
// //                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
// //                   value={role} 
// //                   onChange={(e) => setRole(e.target.value)} 
// //                   placeholder="e.g. SAP Developer" 
// //                 />
// //               </div>
              
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Skills (comma separated)
// //                 </label>
// //                 <input 
// //                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
// //                   value={skills} 
// //                   onChange={(e) => setSkills(e.target.value)} 
// //                   placeholder="e.g. ABAP, SAP, Programming" 
// //                 />
// //               </div>
              
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Min. Years
// //                 </label>
// //                 <input 
// //                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
// //                   value={years} 
// //                   onChange={(e) => setYears(e.target.value)} 
// //                   placeholder="e.g. 3" 
// //                   type="number"
// //                   min="0"
// //                 />
// //               </div>
// //             </div>

// //             {/* Action Buttons */}
// //             <div className="flex gap-3">
// //               <button 
// //                 className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
// //                 onClick={handleSearch}
// //                 disabled={loading}
// //               >
// //                 {loading ? (
// //                   <span className="flex items-center justify-center gap-2">
// //                     <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
// //                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
// //                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
// //                     </svg>
// //                     Searching...
// //                   </span>
// //                 ) : (
// //                   "Search Candidates"
// //                 )}
// //               </button>
              
// //               <button 
// //                 className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
// //                 onClick={handleClear}
// //               >
// //                 Clear
// //               </button>
              
// //               <button 
// //                 className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md"
// //                 onClick={downloadCSV}
// //               >
// //                 Export CSV
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Results Count */}
// //         {hasSearched && (
// //           <div className="mb-4 text-sm text-gray-600">
// //             Found <span className="font-semibold text-gray-900">{results.length}</span> matching candidates
// //           </div>
// //         )}

// //         {/* Results Grid */}
// //         {loading ? (
// //           <div className="flex flex-col items-center justify-center py-20">
// //             <div className="relative">
// //               <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
// //               <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
// //             </div>
// //             <p className="mt-4 text-gray-600 font-medium">Loading candidates...</p>
// //           </div>
// //         ) : (
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {results.length ? (
// //               results.map((r) => <CandidateCard key={r.id} r={r} />)
// //             ) : (
// //               <div className="col-span-full">
// //                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
// //                   <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
// //                     <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
// //                     </svg>
// //                   </div>
// //                   <h3 className="text-lg font-semibold text-gray-900 mb-2">No candidates found</h3>
// //                   <p className="text-gray-500">Try adjusting your search criteria or clear filters to see all candidates</p>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }




// // // src/pages/Recommendations.tsx
// // import React, { useEffect, useState, JSX } from "react";
// // import { apiBase } from "../services/env";

// // type Candidate = {
// //   id: number;
// //   candidate_name?: string;
// //   resume_link?: string;
// //   best_role?: string;
// //   skills?: string;
// //   keywords?: string;
// //   years_experience?: number;
// //   score?: number;
// // };

// // export default function Recommendations(): JSX.Element {
// //   const [role, setRole] = useState<string>("");
// //   const [skills, setSkills] = useState<string>("");
// //   const [years, setYears] = useState<string>("");
// //   const [results, setResults] = useState<Candidate[]>([]);
// //   const [loading, setLoading] = useState<boolean>(false);
// //   const [hasSearched, setHasSearched] = useState<boolean>(false);
// //   const [activeFilters, setActiveFilters] = useState<{
// //     role?: string;
// //     skills?: string[];
// //     years?: number;
// //   }>({});

// //   const BASE = apiBase();
// //   const SEARCH_URL = `${BASE}/recommendations/search`;

// //   useEffect(() => {
// //     // Initial fetch - load all candidates
// //     search({ topN: 12 }, false);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   async function search(custom: any = {}, isUserSearch: boolean = true) {
// //     setLoading(true);
// //     if (isUserSearch) setHasSearched(true);
    
// //     try {
// //       const payload = {
// //         role: (custom?.role ?? role) || undefined,
// //         skills: custom?.skills ?? (skills ? skills.split(",").map((s) => s.trim()).filter(Boolean) : undefined),
// //         years: custom?.years ?? (years === "" ? undefined : Number(years)),
// //         topN: custom?.topN ?? 50,
// //       };

// //       // Store active filters
// //       if (isUserSearch) {
// //         setActiveFilters({
// //           role: payload.role,
// //           skills: payload.skills,
// //           years: payload.years,
// //         });
// //       }

// //       console.log("POST ->", SEARCH_URL, payload);
// //       const res = await fetch(SEARCH_URL, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload),
// //       });

// //       if (!res.ok) {
// //         const text = await res.text();
// //         console.error("Search failed:", res.status, text);
// //         setResults([]);
// //         return;
// //       }

// //       const json = await res.json();
// //       if (json.success) setResults(json.results || []);
// //       else setResults([]);
// //     } catch (err) {
// //       console.error("Search error:", err);
// //       setResults([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   function handleSearch() {
// //     search({}, true);
// //   }

// //   function handleClear() {
// //     setRole("");
// //     setSkills("");
// //     setYears("");
// //     setHasSearched(false);
// //     setActiveFilters({});
// //     search({ topN: 12 }, false);
// //   }

// //   function removeFilter(filterType: 'role' | 'skills' | 'years', skillToRemove?: string) {
// //     if (filterType === 'role') {
// //       setRole("");
// //       const newFilters = { ...activeFilters };
// //       delete newFilters.role;
// //       setActiveFilters(newFilters);
// //       search({ role: undefined, skills: activeFilters.skills, years: activeFilters.years }, true);
// //     } else if (filterType === 'skills' && skillToRemove) {
// //       const currentSkills = skills.split(",").map(s => s.trim()).filter(Boolean);
// //       const newSkills = currentSkills.filter(s => s !== skillToRemove);
// //       setSkills(newSkills.join(", "));
// //       const newFilters = { ...activeFilters, skills: newSkills.length > 0 ? newSkills : undefined };
// //       if (newSkills.length === 0) delete newFilters.skills;
// //       setActiveFilters(newFilters);
// //       search({ role: activeFilters.role, skills: newSkills.length > 0 ? newSkills : undefined, years: activeFilters.years }, true);
// //     } else if (filterType === 'years') {
// //       setYears("");
// //       const newFilters = { ...activeFilters };
// //       delete newFilters.years;
// //       setActiveFilters(newFilters);
// //       search({ role: activeFilters.role, skills: activeFilters.skills, years: undefined }, true);
// //     }
// //   }

// //   function CandidateCard({ r }: { r: Candidate }) {
// //     const initials = (r.candidate_name || "N/A")
// //       .split(" ")
// //       .map((n) => (n ? n[0] : ""))
// //       .slice(0, 2)
// //       .join("");

// //     const skillsList = r.skills 
// //       ? r.skills.split(",").map(s => s.trim()).filter(Boolean)
// //       : [];

// //     const showScore = hasSearched && (activeFilters.role || activeFilters.skills || activeFilters.years);

// //     return (
// //       <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
// //         <div className="p-5 border-b border-gray-100">
// //           <div className="flex items-center gap-3">
// //             <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-md">
// //               {initials}
// //             </div>
// //             <div className="flex-1 min-w-0">
// //               <h3 className="font-semibold text-lg text-gray-900 truncate">
// //                 {r.candidate_name}
// //               </h3>
// //               <p className="text-sm text-gray-500 truncate">
// //                 {r.best_role || "Not specified"} • {r.years_experience ?? 0} years
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="p-5 space-y-4">
// //           {skillsList.length > 0 && (
// //             <div>
// //               <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
// //                 Skills
// //               </p>
// //               <div className="flex flex-wrap gap-2">
// //                 {skillsList.slice(0, 6).map((skill, idx) => (
// //                   <span 
// //                     key={idx}
// //                     className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200"
// //                   >
// //                     {skill}
// //                   </span>
// //                 ))}
// //                 {skillsList.length > 6 && (
// //                   <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full border border-gray-200">
// //                     +{skillsList.length - 6} more
// //                   </span>
// //                 )}
// //               </div>
// //             </div>
// //           )}

// //           {showScore && (
// //             <div className="pt-3 border-t border-gray-100">
// //               <div className="flex items-center justify-between mb-2">
// //                 <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
// //                   Match Score
// //                 </span>
// //                 <span className="text-sm font-bold text-blue-600">
// //                   {r.score ?? 0}%
// //                 </span>
// //               </div>
// //               <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
// //                 <div 
// //                   className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
// //                   style={{ width: `${r.score ?? 0}%` }}
// //                 />
// //               </div>
// //             </div>
// //           )}

// //           {r.keywords && r.keywords !== r.skills && r.keywords.trim() && (
// //             <div className="pt-3 border-t border-gray-100">
// //               <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
// //                 Key Projects
// //               </p>
// //               <p className="text-sm text-gray-700 line-clamp-2">
// //                 {r.keywords}
// //               </p>
// //             </div>
// //           )}
// //         </div>

// //         <div className="px-5 pb-5">
// //           {r.resume_link ? (
// //             <a 
// //               className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm" 
// //               href={`mailto:${r.resume_link}`}
// //               target="_blank" 
// //               rel="noreferrer"
// //             >
// //               Contact Candidate
// //             </a>
// //           ) : (
// //             <div className="text-center text-xs text-gray-400 py-2">No contact available</div>
// //           )}
// //         </div>
// //       </div>
// //     );
// //   }

// //   const hasActiveFilters = activeFilters.role || (activeFilters.skills && activeFilters.skills.length > 0) || activeFilters.years;

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
// //       <div className="max-w-7xl mx-auto">
// //         {/* Header */}
// //         <div className="mb-8">
// //           <h1 className="text-4xl font-bold text-gray-900 mb-2">
// //             Candidate Recommendations
// //           </h1>
// //           <p className="text-gray-600">
// //             Search and filter candidates by role, skills, and experience
// //           </p>
// //         </div>

// //         {/* Search Panel */}
// //         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
// //           <div className="space-y-4">
// //             {/* Search Inputs */}
// //             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Role
// //                 </label>
// //                 <input 
// //                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
// //                   value={role} 
// //                   onChange={(e) => setRole(e.target.value)} 
// //                   placeholder="e.g. SAP Developer" 
// //                 />
// //               </div>
              
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Skills (comma separated)
// //                 </label>
// //                 <input 
// //                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
// //                   value={skills} 
// //                   onChange={(e) => setSkills(e.target.value)} 
// //                   placeholder="e.g. ABAP, SAP, Programming" 
// //                 />
// //               </div>
              
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Min. Years
// //                 </label>
// //                 <input 
// //                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
// //                   value={years} 
// //                   onChange={(e) => setYears(e.target.value)} 
// //                   placeholder="e.g. 3" 
// //                   type="number"
// //                   min="0"
// //                 />
// //               </div>
// //             </div>

// //             {/* Action Buttons */}
// //             <div className="flex gap-3">
// //               <button 
// //                 className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
// //                 onClick={handleSearch}
// //                 disabled={loading}
// //               >
// //                 {loading ? (
// //                   <span className="flex items-center justify-center gap-2">
// //                     <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
// //                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
// //                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
// //                     </svg>
// //                     Searching...
// //                   </span>
// //                 ) : (
// //                   "Search Candidates"
// //                 )}
// //               </button>
              
// //               <button 
// //                 className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
// //                 onClick={handleClear}
// //               >
// //                 Clear All
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Active Filters Display */}
// //         {hasSearched && hasActiveFilters && (
// //           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border-2 border-blue-200 p-6 mb-6">
// //             <div className="flex items-start gap-4">
// //               <div className="flex-shrink-0 mt-1">
// //                 <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
// //                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
// //                   </svg>
// //                 </div>
// //               </div>
// //               <div className="flex-1">
// //                 <h3 className="text-lg font-bold text-gray-900 mb-1">Search Results</h3>
// //                 <p className="text-sm text-gray-600 mb-4">Showing candidates matching your criteria</p>
                
// //                 <div className="space-y-3">
// //                   {activeFilters.role && (
// //                     <div className="flex items-start gap-3">
// //                       <div className="flex-shrink-0 w-24 text-sm font-semibold text-gray-700">Role:</div>
// //                       <div className="flex-1">
// //                         <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg border-2 border-blue-300 shadow-sm">
// //                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
// //                           </svg>
// //                           <span className="text-sm font-semibold">{activeFilters.role}</span>
// //                           <button
// //                             onClick={() => removeFilter('role')}
// //                             className="ml-2 hover:bg-blue-100 rounded-full p-1 transition-colors"
// //                             title="Remove this filter"
// //                           >
// //                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                             </svg>
// //                           </button>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   )}
                  
// //                   {activeFilters.skills && activeFilters.skills.length > 0 && (
// //                     <div className="flex items-start gap-3">
// //                       <div className="flex-shrink-0 w-24 text-sm font-semibold text-gray-700">Skills:</div>
// //                       <div className="flex-1">
// //                         <div className="flex flex-wrap gap-2">
// //                           {activeFilters.skills.map((skill, idx) => (
// //                             <div key={idx} className="inline-flex items-center gap-2 px-4 py-2 bg-white text-green-700 rounded-lg border-2 border-green-300 shadow-sm">
// //                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
// //                               </svg>
// //                               <span className="text-sm font-semibold">{skill}</span>
// //                               <button
// //                                 onClick={() => removeFilter('skills', skill)}
// //                                 className="ml-2 hover:bg-green-100 rounded-full p-1 transition-colors"
// //                                 title="Remove this filter"
// //                               >
// //                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                                 </svg>
// //                               </button>
// //                             </div>
// //                           ))}
// //                         </div>
// //                       </div>
// //                     </div>
// //                   )}
                  
// //                   {activeFilters.years !== undefined && (
// //                     <div className="flex items-start gap-3">
// //                       <div className="flex-shrink-0 w-24 text-sm font-semibold text-gray-700">Experience:</div>
// //                       <div className="flex-1">
// //                         <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-purple-700 rounded-lg border-2 border-purple-300 shadow-sm">
// //                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// //                           </svg>
// //                           <span className="text-sm font-semibold">Minimum {activeFilters.years} years</span>
// //                           <button
// //                             onClick={() => removeFilter('years')}
// //                             className="ml-2 hover:bg-purple-100 rounded-full p-1 transition-colors"
// //                             title="Remove this filter"
// //                           >
// //                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                             </svg>
// //                           </button>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         )}

// //         {/* Results Count */}
// //         {hasSearched && (
// //           <div className="mb-4 text-sm text-gray-600">
// //             Found <span className="font-semibold text-gray-900">{results.length}</span> matching candidates
// //           </div>
// //         )}

// //         {/* Results Grid */}
// //         {loading ? (
// //           <div className="flex flex-col items-center justify-center py-20">
// //             <div className="relative">
// //               <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
// //               <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
// //             </div>
// //             <p className="mt-4 text-gray-600 font-medium">Loading candidates...</p>
// //           </div>
// //         ) : (
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {results.length ? (
// //               results.map((r) => <CandidateCard key={r.id} r={r} />)
// //             ) : (
// //               <div className="col-span-full">
// //                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
// //                   <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
// //                     <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
// //                     </svg>
// //                   </div>
// //                   <h3 className="text-lg font-semibold text-gray-900 mb-2">No candidates found</h3>
// //                   <p className="text-gray-500">Try adjusting your search criteria or clear filters to see all candidates</p>
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }



// // src/pages/Recommendations.tsx
// import React, { useEffect, useState, JSX } from "react";
// import { apiBase } from "../services/env";

// type Candidate = {
//   id: number;
//   candidate_name?: string;
//   resume_link?: string;
//   best_role?: string;
//   skills?: string;
//   keywords?: string;
//   years_experience?: number;
//   score?: number;
// };

// export default function Recommendations(): JSX.Element {
//   const [role, setRole] = useState<string>("");
//   const [skills, setSkills] = useState<string>("");
//   const [years, setYears] = useState<string>("");
//   const [results, setResults] = useState<Candidate[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [hasSearched, setHasSearched] = useState<boolean>(false);
//   const [activeFilters, setActiveFilters] = useState<{
//     role?: string;
//     skills?: string[];
//     years?: number;
//   }>({});

//   const BASE = apiBase();
//   // NOTE: kept endpoint as before — your backend compatibility mounts handle it
//   const SEARCH_URL = `${BASE}/recommendations/search`;

//   useEffect(() => {
//     // Initial fetch - load some candidates (not treating this as a user search)
//     search({ topN: 12 }, false);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   /**
//    * Build payload and call the recommendations endpoint.
//    * Important: we only parse skills from the SKILLS input.
//    * The ROLE input is used only as role and won't be interpreted as skills even if it contains commas.
//    */
//   async function search(custom: any = {}, isUserSearch: boolean = true) {
//     setLoading(true);
//     if (isUserSearch) setHasSearched(true);

//     try {
//       // Normalize role: only accept as role if present and does NOT contain commas
//       const rawRole = custom?.role ?? role;
//       const normalizedRole =
//         typeof rawRole === "string" && rawRole.trim() !== "" && !rawRole.includes(",")
//           ? rawRole.trim()
//           : undefined;

//       // Normalize skills: only take from the skills input (or custom)
//       const rawSkills = custom?.skills ?? skills;
//       const normalizedSkills =
//         Array.isArray(rawSkills)
//           ? rawSkills.map((s) => (typeof s === "string" ? s.trim() : s)).filter(Boolean)
//           : typeof rawSkills === "string" && rawSkills.trim() !== ""
//             ? rawSkills.split(",").map((s) => s.trim()).filter(Boolean)
//             : undefined;

//       const payload = {
//         role: normalizedRole,
//         skills: normalizedSkills,
//         years: custom?.years ?? (years === "" ? undefined : Number(years)),
//         topN: custom?.topN ?? 50,
//       };

//       // Store active filters (normalized): role only if valid; skills as array (if any)
//       if (isUserSearch) {
//         setActiveFilters({
//           role: payload.role ?? undefined,
//           skills: payload.skills ?? undefined,
//           years: payload.years ?? undefined,
//         });
//       }

//       console.log("POST ->", SEARCH_URL, payload);
//       const res = await fetch(SEARCH_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const text = await res.text();
//         console.error("Search failed:", res.status, text);
//         setResults([]);
//         return;
//       }

//       const json = await res.json();
//       if (json.success) setResults(json.results || []);
//       else setResults([]);
//     } catch (err) {
//       console.error("Search error:", err);
//       setResults([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   function handleSearch() {
//     // user-initiated search
//     search({}, true);
//   }

//   function handleClear() {
//     setRole("");
//     setSkills("");
//     setYears("");
//     setHasSearched(false);
//     setActiveFilters({});
//     search({ topN: 12 }, false);
//   }

//   function removeFilter(filterType: "role" | "skills" | "years", skillToRemove?: string) {
//     if (filterType === "role") {
//       setRole("");
//       const newFilters = { ...activeFilters };
//       delete newFilters.role;
//       setActiveFilters(newFilters);
//       search({ role: undefined, skills: activeFilters.skills, years: activeFilters.years }, true);
//     } else if (filterType === "skills" && skillToRemove) {
//       const currentSkills = skills.split(",").map((s) => s.trim()).filter(Boolean);
//       const newSkills = currentSkills.filter((s) => s !== skillToRemove);
//       setSkills(newSkills.join(", "));
//       const newFilters = { ...activeFilters, skills: newSkills.length > 0 ? newSkills : undefined };
//       if (newSkills.length === 0) delete newFilters.skills;
//       setActiveFilters(newFilters);
//       search({ role: activeFilters.role, skills: newSkills.length > 0 ? newSkills : undefined, years: activeFilters.years }, true);
//     } else if (filterType === "years") {
//       setYears("");
//       const newFilters = { ...activeFilters };
//       delete newFilters.years;
//       setActiveFilters(newFilters);
//       search({ role: activeFilters.role, skills: activeFilters.skills, years: undefined }, true);
//     }
//   }

//   function CandidateCard({ r }: { r: Candidate }) {
//     const initials = (r.candidate_name || "N/A")
//       .split(" ")
//       .map((n) => (n ? n[0] : ""))
//       .slice(0, 2)
//       .join("");

//     const skillsList = r.skills
//       ? r.skills.split(",").map((s) => s.trim()).filter(Boolean)
//       : [];

//     const showScore = hasSearched && (activeFilters.role || (activeFilters.skills && activeFilters.skills.length > 0) || activeFilters.years);

//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
//         <div className="p-5 border-b border-gray-100">
//           <div className="flex items-center gap-3">
//             <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-md">
//               {initials}
//             </div>
//             <div className="flex-1 min-w-0">
//               <h3 className="font-semibold text-lg text-gray-900 truncate">
//                 {r.candidate_name}
//               </h3>
//               <p className="text-sm text-gray-500 truncate">
//                 {r.best_role || "Not specified"} • {r.years_experience ?? 0} years
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="p-5 space-y-4">
//           {skillsList.length > 0 && (
//             <div>
//               <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
//                 Skills
//               </p>
//               <div className="flex flex-wrap gap-2">
//                 {skillsList.slice(0, 6).map((skill, idx) => (
//                   <span
//                     key={idx}
//                     className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200"
//                   >
//                     {skill}
//                   </span>
//                 ))}
//                 {skillsList.length > 6 && (
//                   <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full border border-gray-200">
//                     +{skillsList.length - 6} more
//                   </span>
//                 )}
//               </div>
//             </div>
//           )}

//           {showScore && (
//             <div className="pt-3 border-t border-gray-100">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
//                   Match Score
//                 </span>
//                 <span className="text-sm font-bold text-blue-600">
//                   {r.score ?? 0}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
//                 <div
//                   className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
//                   style={{ width: `${r.score ?? 0}%` }}
//                 />
//               </div>
//             </div>
//           )}

//           {r.keywords && r.keywords !== r.skills && r.keywords.trim() && (
//             <div className="pt-3 border-t border-gray-100">
//               <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
//                 Key Projects
//               </p>
//               <p className="text-sm text-gray-700 line-clamp-2">
//                 {r.keywords}
//               </p>
//             </div>
//           )}
//         </div>

//         <div className="px-5 pb-5">
//           {r.resume_link ? (
//             <a
//               className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
//               href={`mailto:${r.resume_link}`}
//               target="_blank"
//               rel="noreferrer"
//             >
//               Contact Candidate
//             </a>
//           ) : (
//             <div className="text-center text-xs text-gray-400 py-2">No contact available</div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   const hasActiveFilters = !!(
//     activeFilters.role ||
//     (activeFilters.skills && activeFilters.skills.length > 0) ||
//     activeFilters.years
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">
//             Candidate Recommendations
//           </h1>
//           <p className="text-gray-600">
//             Search and filter candidates by role, skills, and experience
//           </p>
//         </div>

//         {/* Search Panel */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="space-y-4">
//             {/* Search Inputs */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Role
//                 </label>
//                 <input
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   value={role}
//                   onChange={(e) => setRole(e.target.value)}
//                   placeholder="e.g. SAP Developer"
//                 />
//                 <p className="text-xs text-gray-400 mt-1">Role field will be matched against candidate role/title only (do not paste comma-separated skills here).</p>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Skills (comma separated)
//                 </label>
//                 <input
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   value={skills}
//                   onChange={(e) => setSkills(e.target.value)}
//                   placeholder="e.g. ABAP, SAP, Programming"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Min. Years
//                 </label>
//                 <input
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   value={years}
//                   onChange={(e) => setYears(e.target.value)}
//                   placeholder="e.g. 3"
//                   type="number"
//                   min="0"
//                 />
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-3">
//               <button
//                 className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                 onClick={handleSearch}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                     </svg>
//                     Searching...
//                   </span>
//                 ) : (
//                   "Search Candidates"
//                 )}
//               </button>

//               <button
//                 className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
//                 onClick={handleClear}
//               >
//                 Clear All
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Active Filters Display */}
//         {hasSearched && hasActiveFilters && (
//           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border-2 border-blue-200 p-6 mb-6">
//             <div className="flex items-start gap-4">
//               <div className="flex-shrink-0 mt-1">
//                 <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
//                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="flex-1">
//                 <h3 className="text-lg font-bold text-gray-900 mb-1">Search Results</h3>
//                 <p className="text-sm text-gray-600 mb-4">Showing candidates matching your criteria</p>

//                 <div className="space-y-3">
//                   {activeFilters.role && (
//                     <div className="flex items-start gap-3">
//                       <div className="flex-shrink-0 w-24 text-sm font-semibold text-gray-700">Role:</div>
//                       <div className="flex-1">
//                         <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg border-2 border-blue-300 shadow-sm">
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                           </svg>
//                           <span className="text-sm font-semibold">{activeFilters.role}</span>
//                           <button
//                             onClick={() => removeFilter("role")}
//                             className="ml-2 hover:bg-blue-100 rounded-full p-1 transition-colors"
//                             title="Remove this filter"
//                           >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {activeFilters.skills && activeFilters.skills.length > 0 && (
//                     <div className="flex items-start gap-3">
//                       <div className="flex-shrink-0 w-24 text-sm font-semibold text-gray-700">Skills:</div>
//                       <div className="flex-1">
//                         <div className="flex flex-wrap gap-2">
//                           {activeFilters.skills.map((skill, idx) => (
//                             <div key={idx} className="inline-flex items-center gap-2 px-4 py-2 bg-white text-green-700 rounded-lg border-2 border-green-300 shadow-sm">
//                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
//                               </svg>
//                               <span className="text-sm font-semibold">{skill}</span>
//                               <button
//                                 onClick={() => removeFilter("skills", skill)}
//                                 className="ml-2 hover:bg-green-100 rounded-full p-1 transition-colors"
//                                 title="Remove this filter"
//                               >
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                 </svg>
//                               </button>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {activeFilters.years !== undefined && (
//                     <div className="flex items-start gap-3">
//                       <div className="flex-shrink-0 w-24 text-sm font-semibold text-gray-700">Experience:</div>
//                       <div className="flex-1">
//                         <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-purple-700 rounded-lg border-2 border-purple-300 shadow-sm">
//                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                           </svg>
//                           <span className="text-sm font-semibold">Minimum {activeFilters.years} years</span>
//                           <button
//                             onClick={() => removeFilter("years")}
//                             className="ml-2 hover:bg-purple-100 rounded-full p-1 transition-colors"
//                             title="Remove this filter"
//                           >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Results Count */}
//         {hasSearched && (
//           <div className="mb-4 text-sm text-gray-600">
//             Found <span className="font-semibold text-gray-900">{results.length}</span> matching candidates
//           </div>
//         )}

//         {/* Results Grid */}
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="relative">
//               <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
//               <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
//             </div>
//             <p className="mt-4 text-gray-600 font-medium">Loading candidates...</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {results.length ? (
//               results.map((r) => <CandidateCard key={r.id} r={r} />)
//             ) : (
//               <div className="col-span-full">
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
//                   <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
//                     <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                     </svg>
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">No candidates found</h3>
//                   <p className="text-gray-500">Try adjusting your search criteria or clear filters to see all candidates</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




// // src/pages/Recommendations.tsx
// import React, { useEffect, useState, JSX } from "react";
// import { apiBase } from "../services/env";

// type Candidate = {
//   id: number;
//   candidate_name?: string;
//   resume_link?: string;
//   best_role?: string;
//   skills?: string;
//   keywords?: string;
//   years_experience?: number;
//   score?: number;
// };

// export default function Recommendations(): JSX.Element {
//   const [role, setRole] = useState<string>("");
//   const [skills, setSkills] = useState<string>("");
//   const [years, setYears] = useState<string>("");
//   const [results, setResults] = useState<Candidate[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [hasSearched, setHasSearched] = useState<boolean>(false);
//   const [activeFilters, setActiveFilters] = useState<{
//     role?: string;
//     skills?: string[];
//     years?: number;
//   }>({});

//   const BASE = apiBase();
//   const SEARCH_URL = `${BASE}/recommendations/search`;

//   useEffect(() => {
//     // initial load (not user search)
//     search({ topN: 12 }, false);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // utility: parse candidate.skills robustly
//   const parseCandidateSkills = (raw?: string): string[] => {
//     if (!raw) return [];
//     const trimmed = raw.trim();
//     // If looks like JSON array, try to parse
//     if ((trimmed.startsWith("[") && trimmed.endsWith("]")) || trimmed.startsWith('["')) {
//       try {
//         const parsed = JSON.parse(trimmed);
//         if (Array.isArray(parsed)) return parsed.map((s) => String(s).trim()).filter(Boolean);
//       } catch {
//         // fall through to comma split
//       }
//     }
//     // fallback: comma-separated string
//     return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
//   };

//   async function search(custom: any = {}, isUserSearch: boolean = true) {
//     setLoading(true);
//     if (isUserSearch) setHasSearched(true);

//     try {
//       // role: accept only when it's a plain role string (no commas)
//       const rawRole = custom?.role ?? role;
//       const normalizedRole =
//         typeof rawRole === "string" && rawRole.trim() !== "" && !rawRole.includes(",")
//           ? rawRole.trim()
//           : undefined;

//       // skills: only from the skills input (or custom)
//       const rawSkills = custom?.skills ?? skills;
//       const normalizedSkills =
//         Array.isArray(rawSkills)
//           ? rawSkills.map((s) => (typeof s === "string" ? s.trim() : s)).filter(Boolean)
//           : typeof rawSkills === "string" && rawSkills.trim() !== ""
//             ? rawSkills.split(",").map((s) => s.trim()).filter(Boolean)
//             : undefined;

//       const payload = {
//         role: normalizedRole,
//         skills: normalizedSkills,
//         years: custom?.years ?? (years === "" ? undefined : Number(years)),
//         topN: custom?.topN ?? 50,
//       };

//       if (isUserSearch) {
//         setActiveFilters({
//           role: payload.role ?? undefined,
//           skills: payload.skills ?? undefined,
//           years: payload.years ?? undefined,
//         });
//       }

//       console.log("POST ->", SEARCH_URL, payload);
//       const res = await fetch(SEARCH_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const text = await res.text();
//         console.error("Search failed:", res.status, text);
//         setResults([]);
//         return;
//       }

//       const json = await res.json();
//       if (json.success) setResults(json.results || []);
//       else setResults([]);
//     } catch (err) {
//       console.error("Search error:", err);
//       setResults([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   function handleSearch() {
//     search({}, true);
//   }

//   function handleClear() {
//     setRole("");
//     setSkills("");
//     setYears("");
//     setHasSearched(false);
//     setActiveFilters({});
//     search({ topN: 12 }, false);
//   }

//   function removeFilter(filterType: "role" | "skills" | "years", skillToRemove?: string) {
//     if (filterType === "role") {
//       setRole("");
//       const newFilters = { ...activeFilters };
//       delete newFilters.role;
//       setActiveFilters(newFilters);
//       search({ role: undefined, skills: activeFilters.skills, years: activeFilters.years }, true);
//     } else if (filterType === "skills" && skillToRemove) {
//       const currentSkills = skills.split(",").map((s) => s.trim()).filter(Boolean);
//       const newSkills = currentSkills.filter((s) => s !== skillToRemove);
//       setSkills(newSkills.join(", "));
//       const newFilters = { ...activeFilters, skills: newSkills.length > 0 ? newSkills : undefined };
//       if (newSkills.length === 0) delete newFilters.skills;
//       setActiveFilters(newFilters);
//       search({ role: activeFilters.role, skills: newSkills.length > 0 ? newSkills : undefined, years: activeFilters.years }, true);
//     } else if (filterType === "years") {
//       setYears("");
//       const newFilters = { ...activeFilters };
//       delete newFilters.years;
//       setActiveFilters(newFilters);
//       search({ role: activeFilters.role, skills: activeFilters.skills, years: undefined }, true);
//     }
//   }

//   function CandidateCard({ r }: { r: Candidate }) {
//     const initials = (r.candidate_name || "N/A")
//       .split(" ")
//       .map((n) => (n ? n[0] : ""))
//       .slice(0, 2)
//       .join("");

//     // parse candidate skills robustly
//     const skillsList = parseCandidateSkills(r.skills);

//     // Show skills always (cards should display skills regardless of which filter was used)
//     const showSkills = skillsList.length > 0;

//     const showScore = hasSearched && (activeFilters.role || (activeFilters.skills && activeFilters.skills.length > 0) || activeFilters.years);

//     return (
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
//         <div className="p-5 border-b border-gray-100">
//           <div className="flex items-center gap-3">
//             <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-md">
//               {initials}
//             </div>
//             <div className="flex-1 min-w-0">
//               <h3 className="font-semibold text-lg text-gray-900 truncate">
//                 {r.candidate_name}
//               </h3>
//               <p className="text-sm text-gray-500 truncate">
//                 {r.best_role || "Not specified"} • {r.years_experience ?? 0} years
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="p-5 space-y-4">
//           {showSkills && (
//             <div>
//               <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
//                 Skills
//               </p>
//               <div className="flex flex-wrap gap-2">
//                 {skillsList.slice(0, 6).map((skill, idx) => (
//                   <span
//                     key={idx}
//                     className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200"
//                   >
//                     {skill}
//                   </span>
//                 ))}
//                 {skillsList.length > 6 && (
//                   <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full border border-gray-200">
//                     +{skillsList.length - 6} more
//                   </span>
//                 )}
//               </div>
//             </div>
//           )}

//           {showScore && (
//             <div className="pt-3 border-t border-gray-100">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
//                   Match Score
//                 </span>
//                 <span className="text-sm font-bold text-blue-600">
//                   {r.score ?? 0}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
//                 <div
//                   className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
//                   style={{ width: `${r.score ?? 0}%` }}
//                 />
//               </div>
//             </div>
//           )}

//           {r.keywords && r.keywords !== r.skills && r.keywords.trim() && (
//             <div className="pt-3 border-t border-gray-100">
//               <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
//                 Key Projects
//               </p>
//               <p className="text-sm text-gray-700 line-clamp-2">
//                 {r.keywords}
//               </p>
//             </div>
//           )}
//         </div>

//         <div className="px-5 pb-5">
//           {r.resume_link ? (
//             <a
//               className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
//               href={`mailto:${r.resume_link}`}
//               target="_blank"
//               rel="noreferrer"
//             >
//               Contact Candidate
//             </a>
//           ) : (
//             <div className="text-center text-xs text-gray-400 py-2">No contact available</div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   const hasActiveFilters =
//     !!(activeFilters.role || (activeFilters.skills && activeFilters.skills.length > 0) || activeFilters.years);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">Candidate Recommendations</h1>
//           <p className="text-gray-600">Search and filter candidates by role, skills, and experience</p>
//         </div>

//         {/* Search Panel */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
//           <div className="space-y-4">
//             {/* Search Inputs */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
//                 <input
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   value={role}
//                   onChange={(e) => setRole(e.target.value)}
//                   placeholder="e.g. SAP Developer"
//                 />
//                 <p className="text-xs text-gray-400 mt-1">Role field will be matched against candidate role/title only (do not paste comma-separated skills here).</p>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma separated)</label>
//                 <input
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   value={skills}
//                   onChange={(e) => setSkills(e.target.value)}
//                   placeholder="e.g. ABAP, SAP, Programming"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Min. Years</label>
//                 <input
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                   value={years}
//                   onChange={(e) => setYears(e.target.value)}
//                   placeholder="e.g. 3"
//                   type="number"
//                   min="0"
//                 />
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-3">
//               <button
//                 className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                 onClick={handleSearch}
//                 disabled={loading}
//               >
//                 {loading ? "Searching..." : "Search Candidates"}
//               </button>

//               <button
//                 className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
//                 onClick={handleClear}
//               >
//                 Clear All
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Active Filters Display */}
//         {hasSearched && hasActiveFilters && (
//           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm border-2 border-blue-200 p-6 mb-6">
//             <div className="flex items-start gap-4">
//               <div className="flex-shrink-0 mt-1">
//                 <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
//                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="flex-1">
//                 <h3 className="text-lg font-bold text-gray-900 mb-1">Search Results</h3>
//                 <p className="text-sm text-gray-600 mb-4">Showing candidates matching your criteria</p>

//                 <div className="space-y-3">
//                   {activeFilters.role && (
//                     <div className="flex items-start gap-3">
//                       <div className="flex-shrink-0 w-24 text-sm font-semibold text-gray-700">Role:</div>
//                       <div className="flex-1">
//                         <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-blue-700 rounded-lg border-2 border-blue-300 shadow-sm">
//                           <span className="text-sm font-semibold">{activeFilters.role}</span>
//                           <button onClick={() => removeFilter("role")} className="ml-2 hover:bg-blue-100 rounded-full p-1 transition-colors" title="Remove this filter">
//                             ✕
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {activeFilters.skills && activeFilters.skills.length > 0 && (
//                     <div className="flex items-start gap-3">
//                       <div className="flex-shrink-0 w-24 text-sm font-semibold text-gray-700">Skills:</div>
//                       <div className="flex-1">
//                         <div className="flex flex-wrap gap-2">
//                           {activeFilters.skills.map((skill, idx) => (
//                             <div key={idx} className="inline-flex items-center gap-2 px-4 py-2 bg-white text-green-700 rounded-lg border-2 border-green-300 shadow-sm">
//                               <span className="text-sm font-semibold">{skill}</span>
//                               <button onClick={() => removeFilter("skills", skill)} className="ml-2 hover:bg-green-100 rounded-full p-1 transition-colors" title="Remove this filter">✕</button>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {activeFilters.years !== undefined && (
//                     <div className="flex items-start gap-3">
//                       <div className="flex-shrink-0 w-24 text-sm font-semibold text-gray-700">Experience:</div>
//                       <div className="flex-1">
//                         <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-purple-700 rounded-lg border-2 border-purple-300 shadow-sm">
//                           <span className="text-sm font-semibold">Minimum {activeFilters.years} years</span>
//                           <button onClick={() => removeFilter("years")} className="ml-2 hover:bg-purple-100 rounded-full p-1 transition-colors" title="Remove this filter">✕</button>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Results Count */}
//         {hasSearched && (
//           <div className="mb-4 text-sm text-gray-600">
//             Found <span className="font-semibold text-gray-900">{results.length}</span> matching candidates
//           </div>
//         )}

//         {/* Results Grid */}
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="relative">
//               <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
//               <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
//             </div>
//             <p className="mt-4 text-gray-600 font-medium">Loading candidates...</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {results.length ? results.map((r) => <CandidateCard key={r.id} r={r} />) : (
//               <div className="col-span-full">
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2">No candidates found</h3>
//                   <p className="text-gray-500">Try adjusting your search criteria or clear filters to see all candidates</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




// src/pages/Recommendations.tsx
import React, { useEffect, useState, JSX } from "react";
import { apiBase } from "../services/env";

type Candidate = {
  id: number;
  candidate_name?: string;
  resume_link?: string;
  best_role?: string;
  skills?: string;
  keywords?: string;
  years_experience?: number;
  score?: number;
};

export default function Recommendations(): JSX.Element {
  const [role, setRole] = useState<string>("");
  const [skills, setSkills] = useState<string>("");
  const [years, setYears] = useState<string>("");
  const [results, setResults] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<{
    role?: string;
    skills?: string[];
    years?: number;
  }>({});

  const BASE = apiBase();
  const SEARCH_URL = `${BASE}/recommendations/search`;

  useEffect(() => {
    // initial load (not user search)
    search({ topN: 12 }, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // utility: parse candidate.skills robustly
  const parseCandidateSkills = (raw?: string): string[] => {
    if (!raw) return [];
    const trimmed = raw.trim();
    // If looks like JSON array, try to parse
    if ((trimmed.startsWith("[") && trimmed.endsWith("]")) || trimmed.startsWith('["')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.map((s) => String(s).trim()).filter(Boolean);
      } catch {
        // fall through to comma split
      }
    }
    // fallback: comma-separated string
    return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
  };

  async function search(custom: any = {}, isUserSearch: boolean = true) {
    setLoading(true);
    if (isUserSearch) setHasSearched(true);

    try {
      // role: accept only when it's a plain role string (no commas)
      const rawRole = custom?.role ?? role;
      const normalizedRole =
        typeof rawRole === "string" && rawRole.trim() !== "" && !rawRole.includes(",")
          ? rawRole.trim()
          : undefined;

      // skills: only from the skills input (or custom)
      const rawSkills = custom?.skills ?? skills;
      const normalizedSkills =
        Array.isArray(rawSkills)
          ? rawSkills.map((s) => (typeof s === "string" ? s.trim() : s)).filter(Boolean)
          : typeof rawSkills === "string" && rawSkills.trim() !== ""
            ? rawSkills.split(",").map((s) => s.trim()).filter(Boolean)
            : undefined;

      const payload = {
        role: normalizedRole,
        skills: normalizedSkills,
        years: custom?.years ?? (years === "" ? undefined : Number(years)),
        topN: custom?.topN ?? 50,
      };

      if (isUserSearch) {
        setActiveFilters({
          role: payload.role ?? undefined,
          skills: payload.skills ?? undefined,
          years: payload.years ?? undefined,
        });
      }

      console.log("POST ->", SEARCH_URL, payload);
      const res = await fetch(SEARCH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Search failed:", res.status, text);
        setResults([]);
        return;
      }

      const json = await res.json();
      if (json.success) setResults(json.results || []);
      else setResults([]);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    search({}, true);
  }

  function handleClear() {
    setRole("");
    setSkills("");
    setYears("");
    setHasSearched(false);
    setActiveFilters({});
    search({ topN: 12 }, false);
  }

  function removeFilter(filterType: "role" | "skills" | "years", skillToRemove?: string) {
    if (filterType === "role") {
      setRole("");
      const newFilters = { ...activeFilters };
      delete newFilters.role;
      setActiveFilters(newFilters);
      search({ role: undefined, skills: activeFilters.skills, years: activeFilters.years }, true);
    } else if (filterType === "skills" && skillToRemove) {
      const currentSkills = skills.split(",").map((s) => s.trim()).filter(Boolean);
      const newSkills = currentSkills.filter((s) => s !== skillToRemove);
      setSkills(newSkills.join(", "));
      const newFilters = { ...activeFilters, skills: newSkills.length > 0 ? newSkills : undefined };
      if (newSkills.length === 0) delete newFilters.skills;
      setActiveFilters(newFilters);
      search({ role: activeFilters.role, skills: newSkills.length > 0 ? newSkills : undefined, years: activeFilters.years }, true);
    } else if (filterType === "years") {
      setYears("");
      const newFilters = { ...activeFilters };
      delete newFilters.years;
      setActiveFilters(newFilters);
      search({ role: activeFilters.role, skills: activeFilters.skills, years: undefined }, true);
    }
  }

  function CandidateCard({ r }: { r: Candidate }) {
    const initials = (r.candidate_name || "N/A")
      .split(" ")
      .map((n) => (n ? n[0] : ""))
      .slice(0, 2)
      .join("");

    // parse candidate skills robustly
    const skillsList = parseCandidateSkills(r.skills);

    // Show skills always (cards should display skills regardless of which filter was used)
    const showSkills = skillsList.length > 0;

    const showScore = hasSearched && (activeFilters.role || (activeFilters.skills && activeFilters.skills.length > 0) || activeFilters.years);

    return (
      <div className="bg-[#0f1729] rounded-xl shadow-lg border border-gray-700 hover:shadow-xl hover:border-blue-500 transition-all duration-200 overflow-hidden">
        <div className="p-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-md">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-white truncate">
                {r.candidate_name}
              </h3>
              <p className="text-sm text-gray-400 truncate">
                {r.best_role || "Not specified"} • {r.years_experience ?? 0} years
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {showSkills && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {skillsList.slice(0, 6).map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/30"
                  >
                    {skill}
                  </span>
                ))}
                {skillsList.length > 6 && (
                  <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-700/50 text-gray-300 rounded-full border border-gray-600">
                    +{skillsList.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}

          {showScore && (
            <div className="pt-3 border-t border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Match Score
                </span>
                <span className="text-sm font-bold text-blue-400">
                  {r.score ?? 0}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${r.score ?? 0}%` }}
                />
              </div>
            </div>
          )}

          {r.keywords && r.keywords !== r.skills && r.keywords.trim() && (
            <div className="pt-3 border-t border-gray-700">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Key Projects
              </p>
              <p className="text-sm text-gray-300 line-clamp-2">
                {r.keywords}
              </p>
            </div>
          )}
        </div>

        <div className="px-5 pb-5">
          {r.resume_link ? (
            <a
              className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              href={`mailto:${r.resume_link}`}
              target="_blank"
              rel="noreferrer"
            >
              Contact Candidate
            </a>
          ) : (
            <div className="text-center text-xs text-gray-500 py-2">No contact available</div>
          )}
        </div>
      </div>
    );
  }

  const hasActiveFilters =
    !!(activeFilters.role || (activeFilters.skills && activeFilters.skills.length > 0) || activeFilters.years);

  return (
    <div className="min-h-screen bg-[#0a0f1e] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Candidate Recommendations</h1>
          <p className="text-gray-400">Search and filter candidates by role, skills, and experience</p>
        </div>

        {/* Search Panel */}
        <div className="bg-[#0f1729] rounded-xl shadow-lg border border-gray-700 p-6 mb-6">
          <div className="space-y-4">
            {/* Search Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <input
                  className="w-full px-4 py-2.5 bg-[#1a2332] border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-500"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. SAP Developer"
                />
                <p className="text-xs text-gray-500 mt-1">Role field will be matched against candidate role/title only (do not paste comma-separated skills here).</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skills (comma separated)</label>
                <input
                  className="w-full px-4 py-2.5 bg-[#1a2332] border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-500"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. ABAP, SAP, Programming"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Min. Years</label>
                <input
                  className="w-full px-4 py-2.5 bg-[#1a2332] border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-500"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  placeholder="e.g. 3"
                  type="number"
                  min="0"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? "Searching..." : "Search Candidates"}
              </button>

              <button
                className="px-6 py-3 bg-gray-700 text-gray-200 font-semibold rounded-lg hover:bg-gray-600 transition-colors"
                onClick={handleClear}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasSearched && hasActiveFilters && (
          <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-xl shadow-lg border-2 border-blue-500/30 p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">Search Results</h3>
                <p className="text-sm text-gray-400 mb-4">Showing candidates matching your criteria</p>

                <div className="space-y-3">
                  {activeFilters.role && (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-24 text-sm font-semibold text-gray-300">Role:</div>
                      <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg border-2 border-blue-500/40 shadow-sm">
                          <span className="text-sm font-semibold">{activeFilters.role}</span>
                          <button onClick={() => removeFilter("role")} className="ml-2 hover:bg-blue-500/30 rounded-full p-1 transition-colors" title="Remove this filter">
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFilters.skills && activeFilters.skills.length > 0 && (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-24 text-sm font-semibold text-gray-300">Skills:</div>
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2">
                          {activeFilters.skills.map((skill, idx) => (
                            <div key={idx} className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg border-2 border-green-500/40 shadow-sm">
                              <span className="text-sm font-semibold">{skill}</span>
                              <button onClick={() => removeFilter("skills", skill)} className="ml-2 hover:bg-green-500/30 rounded-full p-1 transition-colors" title="Remove this filter">✕</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeFilters.years !== undefined && (
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-24 text-sm font-semibold text-gray-300">Experience:</div>
                      <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg border-2 border-purple-500/40 shadow-sm">
                          <span className="text-sm font-semibold">Minimum {activeFilters.years} years</span>
                          <button onClick={() => removeFilter("years")} className="ml-2 hover:bg-purple-500/30 rounded-full p-1 transition-colors" title="Remove this filter">✕</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        {hasSearched && (
          <div className="mb-4 text-sm text-gray-400">
            Found <span className="font-semibold text-white">{results.length}</span> matching candidates
          </div>
        )}

        {/* Results Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-gray-700"></div>
              <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-400 font-medium">Loading candidates...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.length ? results.map((r) => <CandidateCard key={r.id} r={r} />) : (
              <div className="col-span-full">
                <div className="bg-[#0f1729] rounded-xl shadow-lg border border-gray-700 p-12 text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">No candidates found</h3>
                  <p className="text-gray-400">Try adjusting your search criteria or clear filters to see all candidates</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}