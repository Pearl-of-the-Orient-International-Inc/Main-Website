"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "cookie_consent";

const subscribe = () => () => {};
const getClientSnapshot = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};
const getServerSnapshot = () => null as string | null;

export function CookieConsent() {
  const storedValue = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );
  const [override, setOverride] = useState<string | null>(null);

  const value = useMemo(() => override ?? storedValue, [override, storedValue]);
  const visible = value == null;

  const setValue = useCallback((next: "accepted" | "rejected") => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
    setOverride(next);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/90 px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-[11px] text-slate-700 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="leading-relaxed">
          <div className="text-[10px] sm:text-[11px]">We use cookies on this site to enhance your user experience</div>
          <div className="text-slate-500 text-[10px] sm:text-[11px]">
            By clicking the Accept button, you agree to the use of cookies on
            this site.{" "}
            <a className="underline underline-offset-2" href="#">
              More info
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setValue("accepted")}
            className="h-7 sm:h-8 rounded-sm bg-white px-3 sm:px-4 text-[10px] sm:text-[11px] font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 whitespace-nowrap"
          >
            ACCEPT
          </button>
          <button
            type="button"
            onClick={() => setValue("rejected")}
            className="h-7 sm:h-8 rounded-sm bg-white px-3 sm:px-4 text-[10px] sm:text-[11px] font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 whitespace-nowrap"
          >
            NO THANKS
          </button>
        </div>
      </div>
    </div>
  );
}

