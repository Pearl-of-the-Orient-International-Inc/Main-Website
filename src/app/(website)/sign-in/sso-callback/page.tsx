"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SSOCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/sign-in");
  }, [router]);

  return <p className="p-6 text-center text-sm">Redirecting to sign in...</p>;
}
