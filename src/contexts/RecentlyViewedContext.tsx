import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "recently-viewed";
const MAX_ITEMS = 8;

interface RecentlyViewedItem {
  id: string;
  viewedAt: number;
}

interface RecentlyViewedContextValue {
  items: RecentlyViewedItem[];
  addViewed: (id: string) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(null);

function isSameDay(a: number, b: number) {
  const da = new Date(a);
  const db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
}

function readInitial(): RecentlyViewedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentlyViewedItem[];
    const now = Date.now();
    return parsed.filter((item) => isSameDay(item.viewedAt, now));
  } catch {
    return [];
  }
}

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RecentlyViewedItem[]>(readInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addViewed = (id: string) => {
    setItems((prev) => {
      const now = Date.now();
      const withoutDup = prev.filter((item) => item.id !== id && isSameDay(item.viewedAt, now));
      return [{ id, viewedAt: now }, ...withoutDup].slice(0, MAX_ITEMS);
    });
  };

  return <RecentlyViewedContext.Provider value={{ items, addViewed }}>{children}</RecentlyViewedContext.Provider>;
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) throw new Error("useRecentlyViewed must be used within RecentlyViewedProvider");
  return ctx;
}
