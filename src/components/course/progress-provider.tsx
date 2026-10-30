"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { MaterialKind } from "@/lib/course-types";

type ProgressState = {
  completedLectures: string[];
  completedLabs: string[];
  lastLecture: string | null;
};

type ProgressContextValue = ProgressState & {
  hydrated: boolean;
  isComplete: (kind: MaterialKind, id: string) => boolean;
  toggleComplete: (kind: MaterialKind, id: string) => void;
  setLastLecture: (href: string) => void;
};

const STORAGE_KEY = "react-course-progress-v1";
const initialState: ProgressState = {
  completedLectures: [],
  completedLabs: [],
  lastLecture: null,
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Partial<ProgressState>;
          setState({
            completedLectures: Array.isArray(parsed.completedLectures) ? parsed.completedLectures : [],
            completedLabs: Array.isArray(parsed.completedLabs) ? parsed.completedLabs : [],
            lastLecture: typeof parsed.lastLecture === "string" ? parsed.lastLecture : null,
          });
        }
      } catch {
        // The course stays readable when storage is unavailable or malformed.
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Private browsing and restrictive browser settings can disable storage.
    }
  }, [hydrated, state]);

  const toggleComplete = useCallback((kind: MaterialKind, id: string) => {
    const key = kind === "lecture" ? "completedLectures" : "completedLabs";
    setState((current) => {
      const values = current[key];
      return {
        ...current,
        [key]: values.includes(id) ? values.filter((value) => value !== id) : [...values, id],
      };
    });
  }, []);

  const setLastLecture = useCallback((href: string) => {
    setState((current) => (current.lastLecture === href ? current : { ...current, lastLecture: href }));
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      ...state,
      hydrated,
      isComplete: (kind, id) =>
        (kind === "lecture" ? state.completedLectures : state.completedLabs).includes(id),
      toggleComplete,
      setLastLecture,
    }),
    [hydrated, setLastLecture, state, toggleComplete],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("useProgress must be used inside ProgressProvider");
  return context;
}
