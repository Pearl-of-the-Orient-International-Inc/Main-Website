"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toApiError, useVerifyEmailMutation } from "@/features/auth/auth.hooks";
import { useToast } from "@/hooks/use-toast";

type VerifyStatus = "idle" | "verifying" | "success" | "error";

export const ConfirmAccountForm = () => {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const verifyMutation = useVerifyEmailMutation();

  const token = searchParams.get("token")?.trim() ?? "";
  const hasToken = token.length > 0;

  const [status, setStatus] = useState<VerifyStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const statusText = useMemo(() => {
    if (status === "verifying") return "Verifying your account...";
    if (status === "success") return "Your account has been verified successfully.";
    if (status === "error") return errorMessage ?? "Unable to verify account.";
    return "Ready to verify your account.";
  }, [errorMessage, status]);

  const verifyAccount = useCallback(async () => {
    if (!hasToken) {
      setStatus("error");
      setErrorMessage("Missing verification token.");
      return;
    }

    try {
      setStatus("verifying");
      setErrorMessage(null);
      await verifyMutation.mutateAsync({ code: token });
      setStatus("success");
      toast({
        title: "Account verified",
        description: "You can now sign in using your account.",
        variant: "success",
      });
    } catch (error: unknown) {
      const apiError = toApiError(error);
      setStatus("error");
      setErrorMessage(apiError.message ?? "Verification failed.");
      toast({
        title: "Verification failed",
        description: apiError.message ?? "Invalid or expired verification link.",
        variant: "error",
      });
    }
  }, [hasToken, token, toast, verifyMutation]);

  useEffect(() => {
    if (!hasToken || status !== "idle") return;
    void verifyAccount();
  }, [hasToken, status, verifyAccount]);

  return (
    <section className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto space-y-8 py-10">
      <div className="mx-auto max-w-xl rounded-[calc(var(--radius)+.125rem)] border bg-card p-8 shadow-md shadow-zinc-950/5">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold">Confirm Account</h2>
          <p className="text-sm text-muted-foreground">{statusText}</p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          {status !== "success" && (
            <Button
              type="button"
              onClick={() => void verifyAccount()}
              disabled={verifyMutation.isPending || !hasToken}
              className="bg-[#032a0d] hover:bg-[#032a0d]/90"
            >
              {verifyMutation.isPending ? "Verifying..." : "Verify account"}
            </Button>
          )}

          <Button asChild variant={status === "success" ? "default" : "outline"}>
            <Link href="/sign-in">Go to sign in</Link>
          </Button>
        </div>

        {!hasToken && (
          <p className="mt-4 text-center text-sm text-red-600">
            This link is missing a token. Please request a new verification email.
          </p>
        )}
      </div>
    </section>
  );
};

