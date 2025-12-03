// FILE: src/pages/MonitorRoom.tsx
// NEW file. HR monitor page that embeds Jitsi iframe and updates via status API.
// Put this file at: src/pages/MonitorRoom.tsx

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

export default function MonitorRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const [status, setStatus] = useState<RoomStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const BASE = (apiBase && typeof apiBase === "function" ? apiBase() : "") || "";

  async function fetchStatus() {
    if (!roomId) return;
    setLoading(true);
    const p = `${BASE}/api/interview-access/status/${encodeURIComponent(roomId)}`;
    const f = `${BASE}/interview-access/status/${encodeURIComponent(roomId)}`;
    try {
      let res = await fetch(p).catch(() => null);
      if (!res || res.status === 404) {
        res = await fetch(f).catch(() => null);
      }
      if (!res || !res.ok) {
        setStatus(null);
        setLoading(false);
        return;
      }
      const data = (await res.json()) as RoomStatus;
      setStatus(data);
    } catch (err) {
      console.error("fetchStatus error", err);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStatus();
    const t = setInterval(fetchStatus, 7000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  const roomName = roomId || "";

  return (
    <div className="min-h-screen p-6 bg-[#071124] text-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Monitor — {roomName}</h1>
            <div className="text-sm text-gray-400">
              {status ? `HR: ${status.hr_accepted ? "Accepted" : "Waiting"} · AI: ${status.ai_accepted ? "Accepted" : "Waiting"} · Live: ${status.meeting_active ? "Yes" : "No"}` : "Status unknown"}
            </div>
          </div>

          <div className="flex gap-2">
            <Link to="/" className="px-3 py-1 bg-gray-700 rounded text-sm">Back</Link>
            <button onClick={fetchStatus} className="px-3 py-1 bg-gray-700 rounded text-sm">Refresh</button>
            <a
              href={status?.meeting_url ?? `https://meet.jit.si/${encodeURIComponent(roomName)}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 bg-blue-600 rounded text-sm text-white"
            >
              Open Jitsi
            </a>
          </div>
        </div>

        {loading && <div className="p-6 bg-[#061022] rounded">Loading status…</div>}

        {!loading && (!status || !status.meeting_active) && (
          <div className="p-6 bg-[#061022] rounded">
            <div className="text-lg font-semibold mb-2">Meeting is not live yet</div>
            <p className="text-sm text-gray-400 mb-4">Start the meeting from the waiting room (HR). You can open the candidate waiting page in another tab.</p>
            <div className="flex gap-2">
              <a href={`${window.location.origin}/interview-room/${encodeURIComponent(roomName)}`} target="_blank" rel="noreferrer" className="px-3 py-2 bg-gray-700 rounded text-sm">Open waiting page</a>
              <a href={`https://meet.jit.si/${encodeURIComponent(roomName)}`} target="_blank" rel="noreferrer" className="px-3 py-2 bg-gray-700 rounded text-sm">Open Jitsi</a>
            </div>
          </div>
        )}

        {!loading && status && status.meeting_active && (
          <div className="rounded overflow-hidden shadow-lg bg-black">
            <div className="text-sm text-gray-300 p-3 border-b border-white/6">
              Embedded Jitsi (monitor). If you need a separate window, use "Open Jitsi".
            </div>

            {/* iframe embed */}
            <div style={{ position: "relative", paddingTop: "56.25%" }}>
              <iframe
                title={`monitor-${roomName}`}
                src={status.meeting_url ?? `https://meet.jit.si/${encodeURIComponent(roomName)}`}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "0",
                }}
                allow="camera; microphone; fullscreen; display-capture; autoplay"
              />
            </div>

            <div className="p-3 bg-[#051021] flex items-center justify-between">
              <div className="text-xs text-gray-400">Meeting URL: <span className="text-white">{status.meeting_url}</span></div>
              <div className="flex gap-2">
                <a href={status.meeting_url ?? `https://meet.jit.si/${encodeURIComponent(roomName)}`} target="_blank" rel="noreferrer" className="px-3 py-1 bg-gray-700 rounded text-xs">Open Jitsi</a>
                <button onClick={fetchStatus} className="px-3 py-1 bg-gray-700 rounded text-xs">Refresh status</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
