"use client";

import { type ReactNode, useEffect, useRef } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUserQuery } from "@/features/auth/auth.hooks";
import { useToast } from "@/hooks/use-toast";
import { Loader2Icon } from "lucide-react";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const hasRedirectedRef = useRef(false);
  const { isLoading, isError, error } = useCurrentUserQuery();

  useEffect(() => {
    if (!isError || hasRedirectedRef.current) return;

    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    if (status !== 401 && status !== 403) return;

    hasRedirectedRef.current = true;
    toast({
      title: "Sign in required",
      description: "Please sign in to continue.",
      variant: "warning",
    });
    router.replace(`/sign-in?redirect=${encodeURIComponent(pathname || "/")}`);
  }, [error, isError, pathname, router, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-sm text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin mr-2" /> Checking your session...
      </div>
    );
  }

  if (isError) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    if (status === 401 || status === 403) {
      return null;
    }
  }

  return <>{children}</>;
}
