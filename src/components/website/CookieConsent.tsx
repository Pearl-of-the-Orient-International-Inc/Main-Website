"use client";

import { Button } from "@/components/ui/button";
import { CookieIcon } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger the compact state after scrolling 200px
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const storedValue = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
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

  if (isScrolled) {
    return (
      <div className="fixed bottom-4 left-4 z-50 rounded-sm bg-white px-3 sm:px-4 py-2 sm:py-3 backdrop-blur-md">
        <div className="flex flex-col gap-3">
          <div className="leading-relaxed">
            <div className="text-sm flex items-center gap-1">
              <CookieIcon className="size-4" />
              <p>We use cookies on this site to enhance your user experience</p>
            </div>
            <div className="text-muted-foreground text-xs mt-1">
              By clicking the Accept button, you agree to the use of cookies on
              this site.{" "}
              <a
                className="underline underline-offset-2 font-medium text-[#032a0d]"
                href="#"
              >
                Cookie Policy
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              size="sm"
              onClick={() => setValue("rejected")}
              variant="ghost"
            >
              Decline
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setValue("accepted")}
              className="bg-[#032a0d] hover:bg-[#032a0d]/90"
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
