
// filepath: src/pages/Bin.tsx
import React, { useEffect, useMemo, useState } from "react";
import useSoftDelete from "../hooks/useSoftDelete";
import { ResumesAPI } from "../services/http";
import type { ResumeRecord } from "../services/http";

// --- THEME CONSTANTS (Dark Blue/Indigo) ---
const PRIMARY_ACCENT = "#4361EE"; // Deep Indigo
const HOVER_ACCENT = "#5945FF"; // Deeper Purple/Blue
const CARD_BG = "#1C2A4A"; // Dark Blue/Gray for Cards & Containers
const TEXT_COLOR = "text-gray-200"; // Light text for dark background
const MUTED_COLOR = "text-gray-400"; // Muted light text
const DELETE_COLOR = "#FF4500"; // Orange-Red for Delete
// -----------------------------------------

export default function Bin() {
  // NOTE: Assuming this hook correctly manages client-side soft deletion data (Bin IDs)
  const { listBinIds, getBinItem, restoreResume, permanentlyRemove } = useSoftDelete();
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch ALL resume metadata to match against local Bin IDs
        // NOTE: This assumes the server provides ALL records, and filtering occurs locally/by API implementation
        const list = await ResumesAPI.list<ResumeRecord[]>();
        if (!mounted) return;
        setResumes(Array.isArray(list) ? list : []);
      } catch (e: any) {
        console.error("Bin: fetch resumes failed", e);
        setError("Failed to load resume metadata.");
        if (!mounted) return;
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    const onChange = () => {
      // re-fetch metadata on resume changes
      (async () => {
        try {
          const list = await ResumesAPI.list<ResumeRecord[]>();
          setResumes(Array.isArray(list) ? list : []);
        } catch (e) {
          /* ignore */
        }
      })();
    };
    window.addEventListener("resumes:changed", onChange);
    return () => {
      mounted = false;
      window.removeEventListener("resumes:changed", onChange);
    };
  }, []);

  const resumeMap = useMemo(() => {
    const m: Record<string, ResumeRecord> = {};
    resumes.forEach((r) => {
      if (r && (r as any).id) m[String((r as any).id)] = r;
    });
    return m;
  }, [resumes]);

  // List of IDs currently marked as deleted in the client-side store
  const binIds = listBinIds();

  return (
    <div className={`p-8 ${TEXT_COLOR}`} style={{ backgroundColor: 'transparent' }}>
      <h1 className="text-4xl font-extrabold tracking-tight text-white" style={{ color: PRIMARY_ACCENT }}>
        🗑️ Bin (Soft Deleted Resumes)
      </h1>
      <p className={`text-base ${MUTED_COLOR} mb-6`}>
        Items here are soft-deleted (frontend-only) and will be automatically purged locally after 2 months. ({binIds.length} items)
      </p>

      {error && (
          <div className="mb-4 p-3 rounded-lg text-red-400 font-medium border border-red-800" style={{backgroundColor: '#332200', borderLeft: `5px solid ${DELETE_COLOR}`}}>
              {error}
          </div>
      )}

      {loading ? (
        <div className={MUTED_COLOR}>Loading bin contents...</div>
      ) : binIds.length === 0 ? (
        <div className={`p-10 text-center rounded-xl shadow-lg border border-gray-700 ${TEXT_COLOR}`} style={{ backgroundColor: CARD_BG }}>
          <p className="text-lg text-white">Bin is empty. No deleted resumes found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {binIds.map((id) => {
            const meta = getBinItem(id);
            const r = resumeMap[id];
            
            // Filter out placeholders
            if (r && (!r.name || r.name === "Candidate")) return null;
            
            const title = r ? r.name || `Resume ${id.substring(0, 8)}...` : `Resume ${id.substring(0, 8)}...`;
            
            return (
              <div key={id} className={`rounded-xl shadow-lg border border-gray-700 p-5 flex flex-col justify-between ${TEXT_COLOR}`} style={{ backgroundColor: CARD_BG }}>
                <div>
                  <div className="font-bold text-lg text-white">{title}</div>
                  <div className={`text-sm ${MUTED_COLOR} mt-1`}>
                    Deleted at: {meta ? new Date(meta.deletedAt).toLocaleString() : "Unknown"}
                  </div>
                  {r && r.created_at && (
                    <div className={`text-xs ${MUTED_COLOR} mt-2`}>Uploaded: {new Date(r.created_at).toLocaleDateString()}</div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => restoreResume(id)}
                    className="flex-1 font-semibold py-2 rounded-xl text-white transition-all duration-300 hover:scale-[1.05] active:scale-[0.95]"
                    style={{ background: `linear-gradient(45deg, ${PRIMARY_ACCENT}, ${HOVER_ACCENT})` }}
                  >
                    Restore
                  </button>

                  <button
                    onClick={() => permanentlyRemove(id)}
                    className="w-12 h-10 flex items-center justify-center rounded-xl border-2 transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] hover:bg-red-800"
                    style={{ borderColor: DELETE_COLOR, color: DELETE_COLOR, backgroundColor: CARD_BG }}
                    title="Permanently remove locally"
                  >
                    ❌
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
