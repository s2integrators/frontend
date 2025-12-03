// // // FILE: src/components/WaitingRoomPanel.tsx
// // import React, { useEffect, useRef, useState } from "react";
// // import { apiBase } from "../services/env";
// // import { v4 as uuidv4 } from "uuid"; // if not installed, we use simple fallback below

// // type Room = {
// //   room_name: string;
// //   hr_accepted: boolean;
// //   ai_accepted: boolean;
// //   meeting_active: boolean;
// //   meeting_url?: string | null;
// //   created_at: string;
// //   updated_at: string;
// // };

// // const tryUuid = () => {
// //   try {
// //     return uuidv4();
// //   } catch {
// //     return `room-${Math.random().toString(36).slice(2, 9)}`;
// //   }
// // };

// // export default function WaitingRoomPanel() {
// //   const BASE = (apiBase && typeof apiBase === "function" ? apiBase() : "") || "";
// //   const primaryEndpoint = `${BASE}/api/interview-access/waiting`;
// //   const fallbackEndpoint = `${BASE}/interview-access/waiting`;

// //   const [rooms, setRooms] = useState<Room[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [errMsg, setErrMsg] = useState<string | null>(null);
// //   const [creating, setCreating] = useState(false);
// //   const backoffRef = useRef(1);

// //   async function loadRooms() {
// //     setErrMsg(null);
// //     setLoading(true);
// //     try {
// //       // try /api/ first, then fallback
// //       let res = await fetch(primaryEndpoint).catch(() => null);
// //       if (!res || res.status === 404) {
// //         res = await fetch(fallbackEndpoint).catch(() => null);
// //       }
// //       if (!res) {
// //         throw new Error("No response from backend");
// //       }
// //       if (!res.ok) {
// //         setErrMsg(`Server returned ${res.status}`);
// //         setRooms([]);
// //         backoffRef.current = Math.min(backoffRef.current * 2, 60);
// //         setLoading(false);
// //         return;
// //       }
// //       const data = (await res.json()) as Room[];
// //       setRooms(Array.isArray(data) ? data : []);
// //       backoffRef.current = 1;
// //     } catch (err: any) {
// //       console.error("WaitingRoom load error:", err);
// //       setErrMsg("Unable to reach backend.");
// //       setRooms([]);
// //       backoffRef.current = Math.min(backoffRef.current * 2, 60);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   useEffect(() => {
// //     loadRooms();
// //     let mounted = true;
// //     async function pollLoop() {
// //       while (mounted) {
// //         const delay = backoffRef.current * 1000 || 9000;
// //         await new Promise((r) => setTimeout(r, delay));
// //         if (!mounted) break;
// //         await loadRooms();
// //       }
// //     }
// //     pollLoop();
// //     return () => {
// //       mounted = false;
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, []);

// //   // Create a test room by calling the status endpoint (it creates the row)
// //   async function createTestRoom() {
// //     setCreating(true);
// //     const rn = `TestRoom-${tryUuid()}`;
// //     try {
// //       // try both endpoints (with and without /api)
// //       const p = `${BASE}/api/interview-access/status/${encodeURIComponent(rn)}`;
// //       const f = `${BASE}/interview-access/status/${encodeURIComponent(rn)}`;
// //       let res = await fetch(p).catch(() => null);
// //       if (!res || res.status === 404) {
// //         res = await fetch(f).catch(() => null);
// //       }
// //       if (!res || !res.ok) {
// //         throw new Error(`create status failed ${res?.status ?? "no response"}`);
// //       }
// //       await loadRooms();
// //       // open the waiting page in a new tab so you can see the candidate side
// //       const waitingPage = `${window.location.origin}/interview-room/${encodeURIComponent(rn)}`;
// //       window.open(waitingPage, "_blank");
// //     } catch (err) {
// //       console.error("createTestRoom failed", err);
// //       alert("Failed to create test room. Check backend console.");
// //     } finally {
// //       setCreating(false);
// //     }
// //   }

// //   async function acceptRoom(roomName: string) {
// //     try {
// //       const pAccept = `${BASE}/api/interview-access/accept/${encodeURIComponent(roomName)}`;
// //       const fAccept = `${BASE}/interview-access/accept/${encodeURIComponent(roomName)}`;
// //       let res = await fetch(pAccept, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ by: "hr", accept: true }),
// //       }).catch(() => null);

// //       if (!res || res.status === 404 || !res.ok) {
// //         // try fallback path
// //         res = await fetch(fAccept, {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ by: "hr", accept: true }),
// //         }).catch(() => null);
// //       }

// //       if (!res || !res.ok) {
// //         throw new Error(`Accept failed ${res?.status ?? "no response"}`);
// //       }
// //       await loadRooms();
// //     } catch (err) {
// //       console.error("Accept failed:", err);
// //       alert("Accept failed — check backend logs.");
// //     }
// //   }

// //   return (
// //     <div>
// //       <div className="flex items-center justify-between mb-2">
// //         <div className="text-sm text-gray-300 font-medium">Pending Interviews</div>
// //         <div className="flex gap-2">
// //           <button onClick={loadRooms} className="text-xs text-gray-400">Refresh</button>
// //           <button onClick={createTestRoom} disabled={creating} className="text-xs bg-blue-600 px-2 py-1 rounded text-white">
// //             {creating ? "Creating…" : "Create test room"}
// //           </button>
// //         </div>
// //       </div>

// //       {loading && <div className="text-sm text-gray-400">Loading…</div>}
// //       {errMsg && <div className="mt-2 text-sm text-yellow-300">{errMsg}</div>}
// //       {!loading && rooms.length === 0 && !errMsg && <div className="text-sm text-gray-500">No candidates waiting.</div>}

// //       <div className="mt-3 space-y-2">
// //         {rooms.map((r) => (
// //           <div key={r.room_name} className="p-3 rounded-lg bg-[#071124] border border-white/6">
// //             <div className="flex items-start justify-between gap-3">
// //               <div className="flex-1 min-w-0">
// //                 <div className="font-semibold text-white truncate">{r.room_name}</div>
// //                 <div className="text-xs text-gray-400">
// //                   AI: {r.ai_accepted ? "Accepted" : "Waiting"} · HR: {r.hr_accepted ? "Accepted" : "Waiting"} · Active: {r.meeting_active ? "Yes" : "No"}
// //                 </div>
// //                 <div className="text-xs text-gray-500 mt-1">Updated {new Date(r.updated_at).toLocaleString()}</div>

// //                 <div className="mt-2 flex gap-2">
// //                   <a
// //                     href={`${window.location.origin}/interview-room/${encodeURIComponent(r.room_name)}`}
// //                     target="_blank"
// //                     rel="noreferrer"
// //                     className="text-xs px-2 py-1 rounded bg-gray-700 text-white"
// //                   >
// //                     Open waiting page
// //                   </a>
// //                   <a
// //                     href={`https://meet.jit.si/${encodeURIComponent(r.room_name)}`}
// //                     target="_blank"
// //                     rel="noreferrer"
// //                     className="text-xs px-2 py-1 rounded bg-gray-700 text-white"
// //                   >
// //                     Open Jitsi
// //                   </a>
// //                 </div>
// //               </div>

// //               <div className="flex flex-col gap-2 items-end">
// //                 <button
// //                   onClick={() => acceptRoom(r.room_name)}
// //                   disabled={r.hr_accepted}
// //                   className={`text-sm px-3 py-1 rounded-md ${r.hr_accepted ? "bg-gray-700 text-gray-300" : "bg-blue-600 text-white"}`}
// //                 >
// //                   {r.hr_accepted ? "Accepted" : "Accept"}
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }



// // src/components/WaitingRoomPanel.tsx
// import React, { useEffect, useRef, useState } from "react";
// import { apiBase } from "../services/env";

// type Room = {
//   room_name: string;
//   hr_accepted: boolean;
//   ai_accepted: boolean;
//   meeting_active: boolean;
//   meeting_url?: string | null;
//   created_at: string;
//   updated_at: string;
// };

// export default function WaitingRoomPanel({ compact = false }: { compact?: boolean }) {
//   const BASE = (apiBase && typeof apiBase === "function" ? apiBase() : "") || "";
//   const primaryEndpoint = `${BASE}/api/interview-access/waiting`;
//   const fallbackEndpoint = `${BASE}/interview-access/waiting`;

//   const [rooms, setRooms] = useState<Room[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [errMsg, setErrMsg] = useState<string | null>(null);
//   const [creating, setCreating] = useState(false);
//   const backoffRef = useRef(1);

//   async function loadRooms() {
//     setErrMsg(null);
//     setLoading(true);
//     try {
//       let res = await fetch(primaryEndpoint).catch(() => null);
//       if (!res || res.status === 404) {
//         res = await fetch(fallbackEndpoint).catch(() => null);
//       }
//       if (!res) {
//         throw new Error("No response from backend");
//       }
//       if (!res.ok) {
//         setErrMsg(`Server returned ${res.status}`);
//         setRooms([]);
//         backoffRef.current = Math.min(backoffRef.current * 2, 60);
//         setLoading(false);
//         return;
//       }
//       const data = (await res.json()) as Room[];
//       setRooms(Array.isArray(data) ? data : []);
//       backoffRef.current = 1;
//     } catch (err: any) {
//       console.error("WaitingRoom load error:", err);
//       setErrMsg("Unable to reach backend.");
//       setRooms([]);
//       backoffRef.current = Math.min(backoffRef.current * 2, 60);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     let mounted = true;
//     loadRooms();
//     (async function pollLoop() {
//       while (mounted) {
//         const delay = Math.max(7000, backoffRef.current * 1000);
//         await new Promise((r) => setTimeout(r, delay));
//         if (!mounted) break;
//         await loadRooms();
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   async function createTestRoom() {
//     setCreating(true);
//     const rn = `TestRoom-${Math.random().toString(36).slice(2, 9)}`;
//     try {
//       const p = `${BASE}/api/interview-access/status/${encodeURIComponent(rn)}`;
//       const f = `${BASE}/interview-access/status/${encodeURIComponent(rn)}`;
//       let res = await fetch(p).catch(() => null);
//       if (!res || res.status === 404) {
//         res = await fetch(f).catch(() => null);
//       }
//       if (!res || !res.ok) {
//         throw new Error(`create status failed ${res?.status ?? "no response"}`);
//       }
//       await loadRooms();
//       const waitingPage = `${window.location.origin}/interview-room/${encodeURIComponent(rn)}`;
//       window.open(waitingPage, "_blank");
//     } catch (err) {
//       console.error("createTestRoom failed", err);
//       alert("Failed to create test room. Check backend console.");
//     } finally {
//       setCreating(false);
//     }
//   }

//   async function acceptRoom(roomName: string) {
//     try {
//       const pAccept = `${BASE}/api/interview-access/accept/${encodeURIComponent(roomName)}`;
//       const fAccept = `${BASE}/interview-access/accept/${encodeURIComponent(roomName)}`;
//       let res = await fetch(pAccept, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ by: "hr", accept: true }),
//       }).catch(() => null);

//       if (!res || res.status === 404 || !res.ok) {
//         res = await fetch(fAccept, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ by: "hr", accept: true }),
//         }).catch(() => null);
//       }

//       if (!res || !res.ok) {
//         throw new Error(`Accept failed ${res?.status ?? "no response"}`);
//       }
//       await loadRooms();
//     } catch (err) {
//       console.error("Accept failed:", err);
//       alert("Accept failed — check backend logs.");
//     }
//   }

//   // Compact variant (small card) vs full variant
//   if (compact) {
//     return (
//       <div className="glass-card rounded-xl p-4">
//         <div className="flex items-center justify-between mb-2">
//           <div className="text-sm font-bold text-white">Waiting</div>
//           <button onClick={loadRooms} className="text-xs text-gray-400">Refresh</button>
//         </div>
//         {loading && <div className="text-xs text-gray-400">Loading…</div>}
//         {!loading && errMsg && <div className="text-xs text-yellow-300">{errMsg}</div>}
//         {!loading && rooms.length === 0 && !errMsg && <div className="text-xs text-gray-500">No candidates waiting.</div>}
//         <div className="mt-3 space-y-2">
//           {rooms.slice(0, 6).map((r) => (
//             <div key={r.room_name} className="flex items-center gap-3 p-2 rounded bg-[#071124] border border-white/6">
//               <div className="w-9 h-9 rounded-full bg-[#FFA726] flex items-center justify-center text-white font-bold text-sm">
//                 {(r.room_name || "").slice(0, 2).toUpperCase()}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="text-sm text-white truncate">{r.room_name}</div>
//                 <div className="text-[11px] text-gray-400">HR: {r.hr_accepted ? "Accepted" : "Waiting"}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // Full page panel
//   return (
//     <div className="p-4">
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <div className="text-lg font-bold text-white">Waiting Room</div>
//           <div className="text-sm text-gray-400">{rooms.length} candidate(s) waiting</div>
//         </div>
//         <div className="flex gap-2">
//           <button onClick={loadRooms} className="px-3 py-1 text-sm text-gray-200 bg-gray-700 rounded">Refresh</button>
//           <button onClick={createTestRoom} disabled={creating} className="px-3 py-1 text-sm text-white bg-blue-600 rounded">
//             {creating ? "Creating…" : "Create test room"}
//           </button>
//         </div>
//       </div>

//       {loading && <div className="text-sm text-gray-400">Loading…</div>}
//       {errMsg && <div className="mt-2 text-sm text-yellow-300">{errMsg}</div>}
//       {!loading && rooms.length === 0 && !errMsg && <div className="text-sm text-gray-500">No candidates waiting.</div>}

//       <div className="mt-3 grid gap-3">
//         {rooms.map((r) => (
//           <div key={r.room_name} className="p-3 rounded-lg bg-[#071124] border border-white/6">
//             <div className="flex items-start justify-between gap-3">
//               <div className="flex items-start gap-3">
//                 <div className="w-12 h-12 rounded-full bg-[#FFA726] flex items-center justify-center text-white font-bold">
//                   {(r.room_name || "").slice(0, 2).toUpperCase()}
//                 </div>
//                 <div className="min-w-0">
//                   <div className="text-sm font-semibold text-white truncate">{r.room_name}</div>
//                   <div className="text-xs text-gray-400 mt-1">
//                     AI: {r.ai_accepted ? "Accepted" : "Waiting"} · HR: {r.hr_accepted ? "Accepted" : "Waiting"} · Active: {r.meeting_active ? "Yes" : "No"}
//                   </div>
//                   <div className="text-xs text-gray-500 mt-1">Updated {new Date(r.updated_at).toLocaleString()}</div>

//                   <div className="mt-2 flex gap-2">
//                     <a href={`${window.location.origin}/interview-room/${encodeURIComponent(r.room_name)}`} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 rounded bg-gray-700 text-white">
//                       Open waiting page
//                     </a>
//                     <a href={`https://meet.jit.si/${encodeURIComponent(r.room_name)}`} target="_blank" rel="noreferrer" className="text-xs px-2 py-1 rounded bg-gray-700 text-white">
//                       Open Jitsi
//                     </a>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-col gap-2 items-end">
//                 <button onClick={() => acceptRoom(r.room_name)} disabled={r.hr_accepted} className={`text-sm px-3 py-1 rounded-md ${r.hr_accepted ? "bg-gray-700 text-gray-300" : "bg-blue-600 text-white"}`}>
//                   {r.hr_accepted ? "Accepted" : "Accept"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



// FILE: src/components/WaitingRoomPanel.tsx
// Overwrite existing WaitingRoomPanel with this updated version.
// Adds: startMeeting(roomName) and shows "Start Meeting" / "View Meeting" buttons.

import React, { useEffect, useRef, useState } from "react";
import { apiBase } from "../services/env";

type Room = {
  room_name: string;
  hr_accepted: boolean;
  ai_accepted: boolean;
  meeting_active: boolean;
  meeting_url?: string | null;
  created_at: string;
  updated_at: string;
};

export default function WaitingRoomPanel() {
  const BASE = (apiBase && typeof apiBase === "function" ? apiBase() : "") || "";
  const primaryEndpoint = `${BASE}/api/interview-access/waiting`;
  const fallbackEndpoint = `${BASE}/interview-access/waiting`;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const backoffRef = useRef(1);
  const mountedRef = useRef(true);

  async function loadRooms() {
    setErrMsg(null);
    setLoading(true);
    try {
      let res = await fetch(primaryEndpoint).catch(() => null);
      if (!res || res.status === 404) {
        res = await fetch(fallbackEndpoint).catch(() => null);
      }
      if (!res) {
        throw new Error("No response from backend");
      }
      if (!res.ok) {
        setErrMsg(`Server returned ${res.status}`);
        setRooms([]);
        backoffRef.current = Math.min(backoffRef.current * 2, 60);
        setLoading(false);
        return;
      }
      const data = (await res.json()) as Room[];
      setRooms(Array.isArray(data) ? data : []);
      backoffRef.current = 1;
    } catch (err: any) {
      console.error("WaitingRoom load error:", err);
      setErrMsg("Unable to reach backend.");
      setRooms([]);
      backoffRef.current = Math.min(backoffRef.current * 2, 60);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }

  useEffect(() => {
    mountedRef.current = true;
    loadRooms();
    let poll = true;
    async function pollLoop() {
      while (poll && mountedRef.current) {
        const delay = Math.max(7000, backoffRef.current * 1000);
        await new Promise((r) => setTimeout(r, delay));
        if (!mountedRef.current) break;
        await loadRooms();
      }
    }
    pollLoop();
    return () => {
      mountedRef.current = false;
      poll = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create a test room by calling the status endpoint (it creates the row)
  async function createTestRoom() {
    setCreating(true);
    const rn = `TestRoom-${Math.random().toString(36).slice(2, 8)}`;
    try {
      const p = `${BASE}/api/interview-access/status/${encodeURIComponent(rn)}`;
      const f = `${BASE}/interview-access/status/${encodeURIComponent(rn)}`;
      let res = await fetch(p).catch(() => null);
      if (!res || res.status === 404) {
        res = await fetch(f).catch(() => null);
      }
      if (!res || !res.ok) {
        throw new Error(`create status failed ${res?.status ?? "no response"}`);
      }
      await loadRooms();
      const waitingPage = `${window.location.origin}/interview-room/${encodeURIComponent(rn)}`;
      window.open(waitingPage, "_blank");
    } catch (err) {
      console.error("createTestRoom failed", err);
      alert("Failed to create test room. Check backend console.");
    } finally {
      setCreating(false);
    }
  }

  // Accept endpoint (HR action) - kept for compatibility
  async function acceptRoom(roomName: string) {
    const p = `${BASE}/api/interview-access/accept/${encodeURIComponent(roomName)}`;
    const f = `${BASE}/interview-access/accept/${encodeURIComponent(roomName)}`;
    try {
      let res = await fetch(p, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ by: "hr", accept: true }),
      }).catch(() => null);

      if (!res || res.status === 404 || !res.ok) {
        res = await fetch(f, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ by: "hr", accept: true }),
        }).catch(() => null);
      }

      if (!res || !res.ok) {
        const txt = res ? await res.text().catch(() => "") : "no response";
        throw new Error(`Accept failed ${res?.status ?? "ERR"} ${txt}`);
      }
      await loadRooms();
    } catch (err) {
      console.error("acceptRoom error", err);
      alert("Failed to accept room — check backend logs.");
    }
  }

  // Start meeting (HR action) -> sets meeting_active = true and meeting_url (Jitsi room)
  async function startMeeting(roomName: string) {
    const desiredUrl = `https://meet.jit.si/${encodeURIComponent(roomName)}`;
    const p = `${BASE}/api/interview-access/start/${encodeURIComponent(roomName)}`;
    const f = `${BASE}/interview-access/start/${encodeURIComponent(roomName)}`;

    try {
      let res = await fetch(p, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meeting_active: true, meeting_url: desiredUrl }),
      }).catch(() => null);

      if (!res || res.status === 404 || !res.ok) {
        res = await fetch(f, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ meeting_active: true, meeting_url: desiredUrl }),
        }).catch(() => null);
      }

      if (!res || !res.ok) {
        const txt = res ? await res.text().catch(() => "") : "no response";
        throw new Error(`Start failed ${res?.status ?? "ERR"} ${txt}`);
      }
      // refresh list
      await loadRooms();
      // open monitor page automatically so HR can view candidate meeting when it's live
      window.open(`${window.location.origin}/monitor/${encodeURIComponent(roomName)}`, "_blank");
    } catch (err) {
      console.error("startMeeting error", err);
      alert("Failed to start meeting — check backend logs.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-300 font-medium">Pending Interviews</div>
        <div className="flex gap-2">
          <button onClick={loadRooms} className="text-xs text-gray-400">Refresh</button>
          <button onClick={createTestRoom} disabled={creating} className="text-xs bg-blue-600 px-2 py-1 rounded text-white">
            {creating ? "Creating…" : "Create test room"}
          </button>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-400">Loading…</div>}
      {errMsg && <div className="mt-2 text-sm text-yellow-300">{errMsg}</div>}
      {!loading && rooms.length === 0 && !errMsg && <div className="text-sm text-gray-500">No candidates waiting.</div>}

      <div className="mt-3 space-y-4">
        {rooms.map((r) => (
          <div key={r.room_name} className="p-4 rounded-lg bg-[#071124] border border-white/6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white truncate">{r.room_name}</div>
                <div className="text-xs text-gray-400 mt-1">
                  AI: {r.ai_accepted ? "Accepted" : "Waiting"} · HR: {r.hr_accepted ? "Accepted" : "Waiting"} · Active: {r.meeting_active ? "Yes" : "No"}
                </div>
                <div className="text-xs text-gray-500 mt-1">Updated {new Date(r.updated_at).toLocaleString()}</div>

                <div className="mt-3 flex gap-2">
                  <a
                    href={`${window.location.origin}/interview-room/${encodeURIComponent(r.room_name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs px-2 py-1 rounded bg-gray-700 text-white"
                  >
                    Open waiting page
                  </a>

                  <a
                    href={r.meeting_url ? r.meeting_url : `https://meet.jit.si/${encodeURIComponent(r.room_name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs px-2 py-1 rounded bg-gray-700 text-white"
                  >
                    Open Jitsi
                  </a>

                  {r.meeting_active && (
                    <a
                      href={`${window.location.origin}/monitor/${encodeURIComponent(r.room_name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs px-2 py-1 rounded bg-indigo-600 text-white"
                    >
                      View Meeting
                    </a>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 items-end">
                {!r.hr_accepted ? (
                  <button
                    onClick={() => acceptRoom(r.room_name)}
                    className="text-sm px-3 py-1 rounded-md bg-blue-600 text-white"
                  >
                    Accept
                  </button>
                ) : (
                  <>
                    {/* If HR accepted but meeting not active -> show Start Meeting */}
                    {!r.meeting_active ? (
                      <button
                        onClick={() => startMeeting(r.room_name)}
                        className="text-sm px-3 py-1 rounded-md bg-purple-600 text-white"
                      >
                        Start Meeting
                      </button>
                    ) : (
                      <div className="text-sm px-3 py-1 rounded-md bg-gray-700 text-gray-200">Accepted</div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
