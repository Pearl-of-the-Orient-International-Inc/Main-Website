/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { getClerkErrorMessage } from "@/lib/utils";
import { useSignUp } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import {
  CircleAlertIcon,
  DotIcon,
  EyeIcon,
  EyeOffIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export const SignUpForm = () => {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [code, setCode] = useState("");
  const [showEmailCode, setShowEmailCode] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const maskEmail = (value: string) => {
    const [local, domain] = value.split("@");
    if (!domain) return value;
    if (local.length <= 2) {
      return `${local[0] ?? ""}***@${domain}`;
    }
    const start = local.slice(0, 2);
    const end = local.slice(-2);
    const middle = "*".repeat(Math.max(local.length - 4, 3));
    return `${start}${middle}${end}@${domain}`;
  };

  // Handle the submission of the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    setIsCreating(true);
    // Start the sign-up process using the email and password provided
    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
        legalAccepted: true,
      });

      // Send the user an email with the verification code
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      // Open verification dialog and start timer
      setShowEmailCode(true);
      setTimeLeft(60);
    } catch (err: any) {
      const message = getClerkErrorMessage(err);
      console.error(JSON.stringify(err, null, 2));
      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  };

  // Handle the submission of the email verification code
  const handleEmailCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    setIsVerifying(true);
    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({
          session: signUpAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Check for session tasks and navigate to custom UI to help users resolve them
              // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
              console.log(session?.currentTask);
              return;
            }

            router.push("/");
          },
        });
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error("Sign-up attempt not complete:", signUpAttempt);
        console.error("Sign-up attempt status:", signUpAttempt.status);
      }
    } catch (err: any) {
      const message = getClerkErrorMessage(err);
      console.error(JSON.stringify(err, null, 2));
      toast.error(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResend = () => {
    if (!isLoaded) return;
    (async () => {
      try {
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        toast.success("Verification code resent to your email.");
        setTimeLeft(60);
      } catch (err: any) {
        const message = getClerkErrorMessage(err);
        toast.error(message);
      }
    })();
  };
  return (
    <section className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto space-y-8">
      {isActive && (
        <Alert className="border-accent-foreground/20 from-accent mt-5 text-accent-foreground flex justify-between bg-linear-to-b to-transparent to-60%">
          <CircleAlertIcon />
          <div className="flex flex-1 flex-col gap-1">
            <AlertTitle>Sign Up Notice</AlertTitle>
            <AlertDescription className="text-accent-foreground/60 block">
              Please sign up using your registered name, email and password to
              access your Pearl of the Orient account. You may also continue
              using Google or Facebook for faster and secure access.
            </AlertDescription>
          </div>

          <button className="cursor-pointer" onClick={() => setIsActive(false)}>
            <XIcon className="size-5" />
            <span className="sr-only">Close</span>
          </button>
        </Alert>
      )}
      <div className="grid lg:grid-cols-5 grid-cols-1 gap-3 my-10">
        <div className="lg:col-span-3">
          <div className="bg-card border rounded-[calc(var(--radius)+.125rem)] shadow-md shadow-zinc-950/5 h-fit flex flex-col">
            {/* Header */}
            <div
              onClick={() => router.push("/")}
              className={`flex flex-col bg-[#032a0d] rounded-t-[calc(var(--radius)+.125rem)] items-center border-b pb-5 px-6 py-5 cursor-pointer text-center transition-all text-white duration-300 max-w-full `}
            >
              <Image
                src="/main/logo.png"
                alt="Site seal"
                width={100}
                height={100}
                priority
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-25 xl:h-25"
              />
              <div className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-serif">
                PEARL OF THE ORIENT INTERNATIONAL AUXILARY
              </div>
              <div className="font-serif text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg px-2">
                CHAPLAIN VALUES EDUCATORS INC.
              </div>
            </div>

            {/* Content */}
            <div className=" space-y-5 px-6 py-5 overflow-y-auto max-h-130">
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wide">
                  Important Announcement
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Welcome to the official sign-up portal of Pearl of the Orient.
                  Please use this platform to securely access your account and
                  related services.
                </p>
              </div>

              {/* Important Dates */}
              <div>
                <h4 className="font-medium text-sm">Important Dates</h4>
                <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>
                    <span className="font-medium text-foreground">
                      Account Access Opens:
                    </span>{" "}
                    January 29, 2026
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      System Maintenance:
                    </span>{" "}
                    Scheduled announcements will be posted here
                  </li>
                </ul>
              </div>

              {/* Notes */}
              <div>
                <h4 className="font-medium text-sm">Notes</h4>
                <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Use a valid and active email address when signing up.</li>
                  <li>
                    Google and Facebook sign-up options are available for faster
                    access.
                  </li>
                  <li>
                    If you experience issues, please contact the{" "}
                    <Link
                      className="font-medium text-[#032a0d] hover:underline"
                      href="mailto:kylemastercoder14@gmail.com"
                    >
                      system developer
                    </Link>
                    .
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t px-6 py-3 text-right">
              <Link href="#" className="text-sm text-[#032a0d] hover:underline">
                See more →
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {/* Main sign-up form */}
          <form
            onSubmit={handleSubmit}
            className="bg-muted h-fit w-full overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
          >
            <div className="bg-card rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
              <div className="text-center">
                <h1 className="mb-1 mt-4 text-xl font-semibold">
                  Create your account
                </h1>
                <p className="text-sm">
                  Please sign up your email and password to get started
                </p>
              </div>

              <div className="mt-6 space-y-6">
                <div className="grid lg:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="block text-sm">
                      First name
                    </Label>
                    <Input
                      onChange={(e) => setFirstName(e.target.value)}
                      value={firstName}
                      type="text"
                      required
                      placeholder="Juan"
                      name="firstName"
                      id="firstName"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="block text-sm">
                      Last name
                    </Label>
                    <Input
                      onChange={(e) => setLastName(e.target.value)}
                      value={lastName}
                      type="text"
                      required
                      placeholder="Dela Cruz"
                      name="lastName"
                      id="lastName"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="block text-sm">
                    Email address
                  </Label>
                  <Input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    required
                    placeholder="juan.delacruz@gmail.com"
                    name="email"
                    id="email"
                  />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pwd" className="text-sm">
                      Password
                    </Label>
                  </div>
                  <div className="relative">
                    <Input
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      type={isVisible ? "text" : "password"}
                      required
                      name="pwd"
                      id="pwd"
                      className="input sz-md pr-9 variant-mixed"
                      placeholder="********"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => setIsVisible((prevState) => !prevState)}
                      className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                    >
                      {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                      <span className="sr-only">
                        {isVisible ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#032a0d] hover:bg-[#032a0d]/90"
                  disabled={isCreating}
                >
                  {isCreating && <Spinner className="size-4" />}
                  {isCreating ? "Signing up..." : "Sign Up"}
                </Button>
              </div>

              <p className="text-muted-foreground mt-5 text-sm">
                By clicking continue, you agree to our{" "}
                <Link href="#" className="underline font-medium text-[#032a0d]">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline font-medium text-[#032a0d]">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <div className="p-3">
              <p className="text-accent-foreground text-center text-sm">
                Already have an account ?
                <Button asChild variant="link" className="px-2">
                  <Link href="/sign-in" className="text-[#032a0d]">
                    Sign in
                  </Link>
                </Button>
              </p>
            </div>
          </form>

          {/* Email verification dialog */}
          <Dialog open={showEmailCode} onOpenChange={setShowEmailCode}>
            <DialogContent>
              <form onSubmit={handleEmailCode}>
                <DialogHeader>
                  <DialogTitle>Verify your email address</DialogTitle>
                  <DialogDescription>
                    We sent a 6-digit verification code to{" "}
                    <b>{maskEmail(email)}</b>. Enter the code below to verify
                    your account.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 mt-6 mb-3">
                  <Label htmlFor="code" className="block text-sm">
                    Verification code
                  </Label>
                  <InputOTP
                    id="code"
                    maxLength={6}
                    value={code}
                    onChange={(value) => setCode(value)}
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
                      `Resend available in ${formatTime(timeLeft)}`
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
                <Button
                  type="submit"
                  className="w-full bg-[#032a0d] hover:bg-[#032a0d]/90"
                  disabled={isVerifying}
                >
                  {isVerifying && <Spinner className="size-4" />}
                  {isVerifying ? "Verifying..." : "Verify account"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Required for sign-up flows Clerk's bot sign-up protection is enabled by default */}
          <div id="clerk-captcha" />
        </div>
      </div>
    </section>
  );
};
