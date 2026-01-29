/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DotIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { getClerkErrorMessage } from "@/lib/utils";

export const ForgotPasswordForm = () => {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showResetDialog, setShowResetDialog] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const isCodeComplete = code.length === 6;

  useEffect(() => {
    if (!showResetDialog || timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, showResetDialog]);

  useEffect(() => {
    if (!isCodeComplete) {
      setPassword("");
      setConfirmPassword("");
      setIsPasswordVisible(false);
      setIsConfirmPasswordVisible(false);
    }
  }, [isCodeComplete]);

  const maskEmail = (value: string) => {
    const [local, domain] = value.split("@");
    if (!domain) return value;
    if (local.length <= 2) return `${local[0] ?? ""}***@${domain}`;
    const start = local.slice(0, 2);
    const end = local.slice(-2);
    const middle = "*".repeat(Math.max(local.length - 4, 3));
    return `${start}${middle}${end}@${domain}`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    setIsSending(true);
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      setShowResetDialog(true);
      setTimeLeft(60);
      toast.success("We sent a reset code to your email.");
    } catch (err: any) {
      const message = getClerkErrorMessage(err);
      console.error(JSON.stringify(err, null, 2));
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;
    if (code.length !== 6) return;

    if (!password || password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsResetting(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (result.status === "complete") {
        await setActive({
          session: result.createdSessionId,
          navigate: async () => {
            toast.success("Password reset successfully.");
            router.push("/sign-in");
          },
        });
        setShowResetDialog(false);
        setCode("");
        setPassword("");
        setConfirmPassword("");
      } else if (result.status === "needs_second_factor") {
        toast.error(
          "Two-factor authentication is required. Please complete sign-in to continue.",
        );
      } else {
        console.warn("Unexpected status during password reset", result.status);
      }
    } catch (err: any) {
      const message = getClerkErrorMessage(err);
      console.error(JSON.stringify(err, null, 2));
      toast.error(message);
    } finally {
      setIsResetting(false);
    }
  };

  const handleResend = async () => {
    if (!isLoaded || !signIn) return;
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setTimeLeft(60);
      toast.success("Verification code resent.");
    } catch (err: any) {
      const message = getClerkErrorMessage(err);
      toast.error(message);
    }
  };

  return (
    <section className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto space-y-8">
      <div className="grid lg:grid-cols-5 grid-cols-1 gap-3 my-10">
        <div className="lg:col-span-3">
          <div className="bg-card border rounded-[calc(var(--radius)+.125rem)] shadow-md shadow-zinc-950/5 h-fit flex flex-col">
            <div className="bg-[#032a0d] rounded-t-[calc(var(--radius)+.125rem)] text-white border-b pb-5 px-6 py-5 text-center">
              <h2 className="mt-1 text-xl sm:text-2xl md:text-3xl font-serif font-semibold">
                Reset your password
              </h2>
              <p className="mt-2 text-sm sm:text-base text-white/80 leading-relaxed">
                Enter your registered email address and we&apos;ll send you a
                verification code to create a new password.
              </p>
            </div>

            <div className="space-y-5 px-6 py-5">
              <Alert className="border-accent-foreground/20 from-accent text-accent-foreground bg-linear-to-b to-transparent to-60%">
                <AlertTitle>Having trouble signing in?</AlertTitle>
                <AlertDescription className="text-accent-foreground/60">
                  Use this form to securely reset your Pearl of the Orient
                  account password.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <form
            onSubmit={handleRequestReset}
            className="bg-muted h-fit w-full overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
          >
            <div className="bg-card rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
              <div className="text-center">
                <h1 className="mb-1 mt-4 text-xl font-semibold">
                  Forgot password
                </h1>
                <p className="text-sm">
                  We&apos;ll email you a verification code to reset your
                  password.
                </p>
              </div>

              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="block text-sm">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                    placeholder="juan.delacruz@gmail.com"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#032a0d] hover:bg-[#032a0d]/90"
                  disabled={isSending}
                >
                  {isSending && <Spinner className="size-4" />}
                  {isSending ? "Sending code..." : "Send reset code"}
                </Button>
              </div>
            </div>

            <p className="text-muted-foreground mt-5 text-sm px-8 pb-4">
              Remembered your password?{" "}
              <a href="/sign-in" className="text-[#032a0d] underline">
                Go back to sign in
              </a>
            </p>
          </form>

          <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <DialogContent>
              <form onSubmit={handleResetPassword} className="space-y-6">
                <DialogHeader>
                  <DialogTitle>Check your email</DialogTitle>
                  <DialogDescription>
                    We sent a 6-digit verification code to
                    <span className="font-semibold"> {maskEmail(email)}</span>.
                    {isCodeComplete
                      ? " Code verified. Choose a new password below."
                      : " Enter the code below to continue."}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="code" className="block text-sm">
                      Verification code
                    </Label>
                    <InputOTP
                      id="code"
                      maxLength={6}
                      value={code}
                      onChange={setCode}
                      pattern={REGEXP_ONLY_DIGITS}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot className="size-15 text-lg" index={0} />
                        <InputOTPSlot className="size-15 text-lg" index={1} />
                        <InputOTPSlot className="size-15 text-lg" index={2} />
                      </InputOTPGroup>
                      <div role="separator" className="text-muted-foreground">
                        <DotIcon />
                      </div>
                      <InputOTPGroup>
                        <InputOTPSlot className="size-15 text-lg" index={3} />
                        <InputOTPSlot className="size-15 text-lg" index={4} />
                        <InputOTPSlot className="size-15 text-lg" index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    <p className="text-muted-foreground text-xs">
                      {timeLeft > 0 ? (
                        <>Resend available in {formatTime(timeLeft)}</>
                      ) : (
                        <>
                          Didn&apos;t receive a code?
                          <button
                            type="button"
                            onClick={handleResend}
                            className="hover:text-primary ml-1 cursor-pointer underline"
                          >
                            Resend code
                          </button>
                        </>
                      )}
                    </p>
                  </div>

                  {isCodeComplete && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="block text-sm">
                          New password
                        </Label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={isPasswordVisible ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setPassword(e.target.value)
                            }
                            className="pr-9"
                            placeholder="********"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() =>
                              setIsPasswordVisible((prevState) => !prevState)
                            }
                            className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                          >
                            {isPasswordVisible ? (
                              <EyeOffIcon />
                            ) : (
                              <EyeIcon />
                            )}
                            <span className="sr-only">
                              {isPasswordVisible
                                ? "Hide password"
                                : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="confirmPassword"
                          className="block text-sm"
                        >
                          Confirm new password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={
                              isConfirmPasswordVisible ? "text" : "password"
                            }
                            required
                            value={confirmPassword}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setConfirmPassword(e.target.value)
                            }
                            className="pr-9"
                            placeholder="********"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() =>
                              setIsConfirmPasswordVisible(
                                (prevState) => !prevState,
                              )
                            }
                            className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                          >
                            {isConfirmPasswordVisible ? (
                              <EyeOffIcon />
                            ) : (
                              <EyeIcon />
                            )}
                            <span className="sr-only">
                              {isConfirmPasswordVisible
                                ? "Hide password"
                                : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {isCodeComplete && (
                  <Button
                    type="submit"
                    className="w-full bg-[#032a0d] hover:bg-[#032a0d]/90"
                    disabled={isResetting}
                  >
                    {isResetting && <Spinner className="size-4" />}
                    {isResetting ? "Resetting..." : "Reset password"}
                  </Button>
                )}
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};
