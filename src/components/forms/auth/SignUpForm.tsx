"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { toApiError, useRegisterMutation } from "@/features/auth/auth.hooks";
import { useToast } from "@/hooks/use-toast";
import { CircleAlertIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const SignUpForm = () => {
  const router = useRouter();
  const registerMutation = useRegisterMutation();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      toast({
        title: "Incomplete form",
        description: "Please complete all required fields.",
        variant: "warning",
      });
      return;
    }

    try {
      const response = await registerMutation.mutateAsync({
        name: `${firstName} ${lastName}`.replace(/\s+/g, " ").trim(),
        email,
        password,
        role: "MEMBER",
      });

      toast({
        title: "Account created",
        description: response.message || "Account created successfully.",
        variant: "success",
      });
      setShowSuccessDialog(true);
    } catch (error: unknown) {
      const apiError = toApiError(error);
      toast({
        title: "Sign up failed",
        description: apiError.message ?? "Sign up failed.",
        variant: "error",
      });
    }
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
            <div
              onClick={() => router.push("/")}
              className="flex flex-col bg-[#032a0d] rounded-t-[calc(var(--radius)+.125rem)] items-center border-b pb-5 px-6 py-5 cursor-pointer text-center transition-all text-white duration-300 max-w-full"
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

            <div className="space-y-5 px-6 py-5 overflow-y-auto max-h-130">
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

            <div className="border-t px-6 py-3 text-right">
              <Link href="#" className="text-sm text-[#032a0d] hover:underline">
                See more →
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
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
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending && <Spinner className="size-4" />}
                  {registerMutation.isPending ? "Signing up..." : "Sign Up"}
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

          <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Account created successfully</DialogTitle>
                <DialogDescription>
                  We sent a verification link to <b>{maskEmail(email)}</b>. Please verify your email before signing in.
                </DialogDescription>
              </DialogHeader>
              <Button
                className="w-full bg-[#032a0d] hover:bg-[#032a0d]/90"
                onClick={() => router.push("/sign-in")}
              >
                Go to sign in
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};
