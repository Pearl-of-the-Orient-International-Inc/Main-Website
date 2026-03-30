"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toApiError, useLoginMutation } from "@/features/auth/auth.hooks";
import { useToast } from "@/hooks/use-toast";
import { CircleAlertIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export const SignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLoginMutation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const redirectTarget = searchParams.get("redirect")?.trim() || "/";

  // Handle the submission of the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter your email and password.",
        variant: "warning",
      });
      return;
    }

    try {
      const response = await loginMutation.mutateAsync({
        email,
        password,
        userAgent:
          typeof window !== "undefined"
            ? window.navigator.userAgent
            : undefined,
      });

      if (response.mfaRequired) {
        toast({
          title: "Two-factor required",
          description: "Two-factor authentication is required. Complete MFA flow next.",
          variant: "info",
        });
        return;
      }

      toast({
        title: "Signed in",
        description: "Signed in successfully.",
        variant: "success",
      });
      router.push(redirectTarget.startsWith("/") ? redirectTarget : "/");
    } catch (error: unknown) {
      const apiError = toApiError(error);

      if (apiError.requiresVerification) {
        toast({
          title: "Email verification required",
          description:
            apiError.message ?? "Please verify your email before logging in.",
          variant: "warning",
        });
        return;
      }

      toast({
        title: "Sign in failed",
        description: apiError.message ?? "Sign in failed.",
        variant: "error",
      });
    }
  };

  const signInWith = (providerName: string) => {
    toast({
      title: "Frontend-only",
      description: `${providerName} sign-in is frontend-only for now.`,
      variant: "info",
    });
  };

  const providers = [
    {
      id: "google",
      name: "Continue with Google",
      icon: "/icons/google.png",
    },
    {
      id: "facebook",
      name: "Continue with Facebook",
      icon: "/icons/facebook.png",
    },
  ];
  return (
    <section className="max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto space-y-8">
      {isActive && (
        <Alert className="border-accent-foreground/20 from-accent mt-5 text-accent-foreground flex justify-between bg-linear-to-b to-transparent to-60%">
          <CircleAlertIcon />
          <div className="flex flex-1 flex-col gap-1">
            <AlertTitle>Sign In Notice</AlertTitle>
            <AlertDescription className="text-accent-foreground/60 block">
              Please sign in using your registered email and password to access
              your Pearl of the Orient account. You may also continue using
              Google or Facebook for faster and secure access.
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
          <div className="bg-card border rounded-[calc(var(--radius)+.125rem)] shadow-md shadow-zinc-950/5 h-full flex flex-col">
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
                  Welcome to the official sign-in portal of Pearl of the Orient.
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
                  <li>Use a valid and active email address when signing in.</li>
                  <li>
                    Google and Facebook sign-in options are available for faster
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
          <form
            onSubmit={handleSubmit}
            className="bg-muted h-fit w-full overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
          >
            <div className="bg-card rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
              <div className="text-center">
                <h1 className="mb-1 mt-4 text-xl font-semibold">
                  Sign in your account
                </h1>
                <p className="text-sm">Welcome back! Sign in to continue</p>
              </div>

              <div className="mt-6 space-y-6">
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
                    <Button asChild variant="link" size="sm">
                      <Link
                        href="/forgot-password"
                        className="link intent-info variant-ghost text-sm"
                      >
                        Forgot your Password?
                      </Link>
                    </Button>
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
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </div>

              <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <hr className="border-dashed" />
                <span className="text-muted-foreground text-xs">
                  Or continue With
                </span>
                <hr className="border-dashed" />
              </div>

              <div className="grid lg:grid-cols-1 gap-3">
                {providers.map((provider) => (
                  <Button
                    key={provider.id}
                    onClick={() => signInWith(provider.name)}
                    type="button"
                    variant="outline"
                    className="relative"
                  >
                    <Image
                      src={provider.icon}
                      alt={provider.name}
                      width={20}
                      height={20}
                    />
                    <span>{provider.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="p-3">
              <p className="text-accent-foreground text-center text-sm">
                Don&apos;t have an account ?
                <Button asChild variant="link" className="px-2">
                  <Link href="/sign-up" className="text-[#032a0d]">
                    Become a member
                  </Link>
                </Button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
