import { useEffect, useState, useCallback } from "react";

export type ResumeItem = {
  id: number;
  name: string;
  score: number | null;
  tags: string[];
  bestRoleTitle: string | null;
  years: number | null;
};

const STORAGE_KEY = "all_resumes_v1";

function loadResumes(): ResumeItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(resumes: ResumeItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
  } catch {}
}

export default function useResumes() {
  const [resumes, setResumes] = useState<ResumeItem[]>(() => loadResumes());

  useEffect(() => {
    save(resumes);
  }, [resumes]);

  const addResume = useCallback((resume: ResumeItem) => {
    setResumes((prev) => [...prev, resume]);
  }, []);

  return { resumes, addResume };
}
