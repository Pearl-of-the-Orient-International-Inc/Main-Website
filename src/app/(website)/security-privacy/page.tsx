"use client";

import Link from "next/link";
import { FormEvent, useEffect, useId, useMemo, useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  KeyRoundIcon,
  LaptopIcon,
  LockKeyholeIcon,
  LogOutIcon,
  MapPinIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
  UserCheckIcon,
  XIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toApiError, useCurrentUserQuery } from "@/features/auth/auth.hooks";
import {
  useChangePasswordMutation,
  useCurrentUserActivityLogsQuery,
  useDisableTwoFactorMutation,
  useEnableTwoFactorMutation,
  useRevokeOtherUserSessionsMutation,
  useRevokeUserSessionMutation,
  useSetupTwoFactorMutation,
  useUserSessionsQuery,
} from "@/features/auth/security.hooks";
import type { AccountSession } from "@/features/auth/security.types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const formatDateTime = (value?: string | null) => {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const getDeviceLabel = (userAgent?: string | null) => {
  if (!userAgent) return "Unknown device";
  if (/iphone|android|mobile/i.test(userAgent)) return "Mobile browser";
  if (/ipad|tablet/i.test(userAgent)) return "Tablet browser";
  if (/windows|macintosh|linux/i.test(userAgent)) return "Desktop browser";
  return "Browser session";
};

const getBrowserLabel = (userAgent?: string | null) => {
  if (!userAgent) return "Browser not available";
  if (/edg/i.test(userAgent)) return "Microsoft Edge";
  if (/chrome|crios/i.test(userAgent)) return "Google Chrome";
  if (/firefox|fxios/i.test(userAgent)) return "Mozilla Firefox";
  if (/safari/i.test(userAgent)) return "Safari";
  return "Web browser";
};

const getSessionLocation = (session: AccountSession) =>
  session.location?.label || session.ipAddress || "Location not available";

const passwordRequirements = [
  { regex: /.{12,}/, text: "At least 12 characters" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
  { regex: /[0-9]/, text: "At least 1 number" },
  {
    regex: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
    text: "At least 1 special character",
  },
];

const getPasswordStrengthColor = (score: number) => {
  if (score === 0) return "bg-border";
  if (score <= 1) return "bg-destructive";
  if (score <= 2) return "bg-orange-500";
  if (score <= 3) return "bg-amber-500";
  if (score === 4) return "bg-yellow-400";
  return "bg-green-500";
};

const getPasswordStrengthText = (score: number) => {
  if (score === 0) return "Enter a password";
  if (score <= 2) return "Weak password";
  if (score <= 3) return "Medium password";
  if (score === 4) return "Strong password";
  return "Very strong password";
};

const PasswordStrengthInput = ({
  password,
  onPasswordChange,
}: {
  password: string;
  onPasswordChange: (value: string) => void;
}) => {
  const id = useId();
  const [isVisible, setIsVisible] = useState(false);
  const strength = useMemo(
    () =>
      passwordRequirements.map((requirement) => ({
        met: requirement.regex.test(password),
        text: requirement.text,
      })),
    [password],
  );
  const strengthScore = useMemo(
    () => strength.filter((requirement) => requirement.met).length,
    [strength],
  );

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>New password</Label>
      <InputGroup className="relative mb-3">
        <InputGroupInput
          id={id}
          type={isVisible ? "text" : "password"}
          placeholder="Enter a strong password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          required
        />
        <InputGroupAddon align="inline-end">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => setIsVisible((prevState) => !prevState)}
            className="text-muted-foreground hover:bg-transparent"
          >
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
            <span className="sr-only">
              {isVisible ? "Hide password" : "Show password"}
            </span>
          </Button>
        </InputGroupAddon>
      </InputGroup>

      <div className="mb-4 flex h-1 w-full gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "h-full flex-1 rounded-full transition-all duration-500 ease-out",
              index < strengthScore
                ? getPasswordStrengthColor(strengthScore)
                : "bg-border",
            )}
          />
        ))}
      </div>

      <p className="text-sm font-medium text-foreground">
        {getPasswordStrengthText(strengthScore)}. Must contain:
      </p>
      <ul className="mb-4 space-y-1.5">
        {strength.map((requirement) => (
          <li key={requirement.text} className="flex items-center gap-2">
            {requirement.met ? (
              <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
            ) : (
              <XIcon className="size-4 text-muted-foreground" />
            )}
            <span
              className={cn(
                "text-xs",
                requirement.met
                  ? "text-green-600 dark:text-green-400"
                  : "text-muted-foreground",
              )}
            >
              {requirement.text}
              <span className="sr-only">
                {requirement.met
                  ? " - Requirement met"
                  : " - Requirement not met"}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const AccountInfoDialogs = () => {
  const protections = [
    "Passwords are validated for length, lowercase and uppercase letters, numbers, and special characters before changes are accepted.",
    "Active sessions can be reviewed and signed out remotely from this page.",
    "Email verification helps confirm account ownership before sensitive account use.",
    "Two-factor authentication can be enabled with an authenticator app for an extra login check.",
  ];

  const privacyItems = [
    {
      title: "Information used",
      body: "Your name, email address, role, verification status, login sessions, device details, IP address, and activity records are used to operate and secure your account.",
    },
    {
      title: "Why it is used",
      body: "This information supports authentication, account recovery, session management, abuse prevention, audit trails, and member service access.",
    },
    {
      title: "Your controls",
      body: "You can update your password, review signed-in devices, end sessions you do not recognize, enable or disable two-factor authentication, and contact administrators for account or data concerns.",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="rounded-lg border-neutral-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-xl text-[#032a0d]">
            <ShieldCheckIcon className="size-5" />
            Account Protection
          </CardTitle>
          <CardDescription>
            Review the controls protecting your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <InfoIcon className="size-4" />
                View protection details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl!">
              <DialogHeader>
                <DialogTitle>How Your Account Is Protected</DialogTitle>
                <DialogDescription>
                  Security controls connected to your account and login flow.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {protections.map((item) => (
                  <div key={item} className="flex gap-3">
                    <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-[#032a0d]" />
                    <p className="text-sm text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
              <DialogFooter showCloseButton />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card className="rounded-lg border-neutral-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-xl text-[#032a0d]">
            <LockKeyholeIcon className="size-5" />
            Privacy Policy Information
          </CardTitle>
          <CardDescription>
            See how account and security data is handled.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <InfoIcon className="size-4" />
                View privacy details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl!">
              <DialogHeader>
                <DialogTitle>Privacy Policy Information</DialogTitle>
                <DialogDescription>
                  A clear summary of how account and security data is handled.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                {privacyItems.map((item) => (
                  <div key={item.title} className="rounded-lg border p-4">
                    <h3 className="mb-2 font-semibold text-[#032a0d]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.body}</p>
                  </div>
                ))}
              </div>
              <DialogFooter showCloseButton />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

const TwoFactorCard = ({ isEnabled }: { isEnabled: boolean }) => {
  const { toast } = useToast();
  const setupMutation = useSetupTwoFactorMutation();
  const enableMutation = useEnableTwoFactorMutation();
  const disableMutation = useDisableTwoFactorMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isManualKeyOpen, setIsManualKeyOpen] = useState(false);
  const setupData = setupMutation.data?.data;

  useEffect(() => {
    const initializeSetup = async () => {
      if (!isOpen || isEnabled || setupMutation.isPending || setupData) return;

      try {
        await setupMutation.mutateAsync();
      } catch (error: unknown) {
        const apiError = toApiError(error);
        toast({
          title: "Setup failed",
          description:
            apiError.message ??
            "Unable to initialize two-factor authentication.",
          variant: "error",
        });
      }
    };

    void initializeSetup();
  }, [isOpen, isEnabled, setupMutation, setupData, toast]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setOtpCode("");
      setIsManualKeyOpen(false);
      setupMutation.reset();
    }
  };

  const handleEnable = async () => {
    if (!/^\d{6}$/.test(otpCode)) {
      toast({
        title: "Code required",
        description:
          "Please enter the 6-digit code from your authenticator app.",
        variant: "error",
      });
      return;
    }

    try {
      await enableMutation.mutateAsync({ token: otpCode });
      toast({
        title: "Two-factor enabled",
        description: "Your account is now protected with an authenticator app.",
        variant: "success",
      });
      handleOpenChange(false);
    } catch (error: unknown) {
      const apiError = toApiError(error);
      toast({
        title: "Enable failed",
        description:
          apiError.message ?? "Unable to enable two-factor authentication.",
        variant: "error",
      });
    }
  };

  const handleDisable = async () => {
    try {
      await disableMutation.mutateAsync();
      toast({
        title: "Two-factor disabled",
        description: "Authenticator-based verification is now turned off.",
        variant: "success",
      });
      handleOpenChange(false);
    } catch (error: unknown) {
      const apiError = toApiError(error);
      toast({
        title: "Disable failed",
        description:
          apiError.message ?? "Unable to disable two-factor authentication.",
        variant: "error",
      });
    }
  };

  return (
    <Card className="rounded-lg border-neutral-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-2xl text-[#032a0d]">
          <SmartphoneIcon className="size-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add a six-digit authenticator code to your sign-in flow.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-neutral-50/80 p-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#032a0d]/10 text-[#032a0d]">
              <SmartphoneIcon className="size-4" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-[#032a0d]">Authenticator app</p>
                <Badge variant={isEnabled ? "success" : "secondary"}>
                  {isEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Use Google Authenticator, Microsoft Authenticator, Authy, Duo,
                or any TOTP app.
              </p>
            </div>
          </div>

          <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                {isEnabled ? "Manage" : "Configure"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {isEnabled
                    ? "Manage two-factor authentication"
                    : "Set up two-factor authentication"}
                </DialogTitle>
                <DialogDescription>
                  {isEnabled
                    ? "Two-factor authentication is currently enabled for this account."
                    : "Scan the QR code with your authenticator app, then enter the 6-digit code to turn it on."}
                </DialogDescription>
              </DialogHeader>

              {!isEnabled ? (
                <div className="space-y-5">
                  <div className="rounded-lg border p-4">
                    <p className="text-sm font-semibold">
                      1. Set up authenticator app
                    </p>
                    {setupMutation.isPending && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        Generating QR code...
                      </p>
                    )}
                    {setupData && (
                      <div className="mt-3 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Scan this QR code or manually enter the setup key in
                            your authenticator app.
                          </p>
                          <Collapsible
                            className="mt-3"
                            open={isManualKeyOpen}
                            onOpenChange={setIsManualKeyOpen}
                          >
                            <CollapsibleTrigger asChild>
                              <Button
                                type="button"
                                variant="link"
                                size="sm"
                                className="h-auto px-0 text-[#032a0d]"
                              >
                                Can&apos;t scan the QR code?
                                {isManualKeyOpen ? (
                                  <ChevronUpIcon className="size-4" />
                                ) : (
                                  <ChevronDownIcon className="size-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-3 space-y-2">
                              <p className="text-sm text-muted-foreground">
                                Enter this code into your authenticator app:
                              </p>
                              <code className="inline-block break-all rounded bg-accent px-2 py-1 text-sm font-semibold">
                                {setupData.secret}
                              </code>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={setupData.qrCodeDataUrl}
                          alt="Two-factor setup QR code"
                          className="h-36 w-36 rounded border bg-white p-1"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 rounded-lg border p-4">
                    <p className="text-sm font-semibold">2. Enter code</p>
                    <p className="text-xs text-muted-foreground">
                      Enter the 6-digit code generated by your authenticator
                      app.
                    </p>
                    <Input
                      value={otpCode}
                      onChange={(event) => setOtpCode(event.target.value)}
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="000000"
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium">
                    Authenticator app is active
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    You can turn this off if you no longer want to use
                    two-factor authentication.
                  </p>
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancel
                </Button>
                {!isEnabled ? (
                  <Button
                    size="sm"
                    onClick={handleEnable}
                    disabled={
                      setupMutation.isPending || enableMutation.isPending
                    }
                  >
                    {enableMutation.isPending ? "Turning on..." : "Turn on"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDisable}
                    disabled={disableMutation.isPending}
                  >
                    {disableMutation.isPending ? "Turning off..." : "Turn off"}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

const Page = () => {
  const { toast } = useToast();
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUserQuery();
  const {
    data: sessionsData,
    isLoading: areSessionsLoading,
    isError: sessionsError,
  } = useUserSessionsQuery();
  const {
    data: activityLogs,
    isLoading: areActivityLogsLoading,
    isError: activityLogsError,
  } = useCurrentUserActivityLogsQuery();
  const changePasswordMutation = useChangePasswordMutation();
  const revokeSessionMutation = useRevokeUserSessionMutation();
  const revokeOtherSessionsMutation = useRevokeOtherUserSessionsMutation();
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const sessions = sessionsData?.sessions ?? [];
  const currentSession = sessionsData?.currentSession ?? null;
  const otherSessionsCount = sessions.filter(
    (session) => !session.isCurrent,
  ).length;
  const securityScore = useMemo(() => {
    let score = 1;
    if (currentUser?.isEmailVerified) score += 1;
    if (currentUser?.isTwoFactorEnabled) score += 1;
    if (currentSession) score += 1;
    return score;
  }, [currentSession, currentUser]);

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await changePasswordMutation.mutateAsync({
        oldPassword,
        password,
        confirmPassword,
      });
      setOldPassword("");
      setPassword("");
      setConfirmPassword("");
      toast({
        title: "Password changed",
        description: "Your account password has been updated successfully.",
        variant: "success",
      });
    } catch (error: unknown) {
      const apiError = toApiError(error);
      toast({
        title: "Password update failed",
        description: apiError.message ?? "Unable to update your password.",
        variant: "error",
      });
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSessionMutation.mutateAsync(sessionId);
      toast({
        title: "Session ended",
        description: "That device has been signed out.",
        variant: "success",
      });
    } catch (error: unknown) {
      const apiError = toApiError(error);
      toast({
        title: "Unable to end session",
        description: apiError.message ?? "Please try again.",
        variant: "error",
      });
    }
  };

  const handleRevokeOtherSessions = async () => {
    try {
      await revokeOtherSessionsMutation.mutateAsync();
      toast({
        title: "Other sessions ended",
        description: "All other devices have been signed out.",
        variant: "success",
      });
    } catch (error: unknown) {
      const apiError = toApiError(error);
      toast({
        title: "Unable to end sessions",
        description: apiError.message ?? "Please try again.",
        variant: "error",
      });
    }
  };

  return (
    <div>
      <section className="relative bg-[#032a0d] text-white">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[url('https://applyarchershub.dlsu.edu.ph/UpdatedAssets/SCSS/ApplicationLandingPage/images/hero-bg.png')] bg-cover bg-center opacity-40" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 mt-10">
          <p className="text-xs sm:text-sm text-white/70 mb-2">
            <Link href="/">Home</Link>{" "}
            <span className="mx-1 sm:mx-2 text-white/50">/</span>{" "}
            <span className="font-medium text-white">Security and Privacy</span>
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wide">
            Security and Privacy
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-white/80 leading-relaxed">
            Protect and manage your account with confidence. Review active login
            sessions, monitor device activity, update your password, and control
            privacy settings to help keep your personal information secure.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="rounded-lg gap-1! border-neutral-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <ShieldCheckIcon className="size-4 text-[#032a0d]" />
                  Protection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-[#032a0d]">
                  {securityScore}/4
                </p>
                <p className="text-xs text-muted-foreground">
                  Security checks active
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-lg gap-1! border-neutral-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <LaptopIcon className="size-4 text-[#032a0d]" />
                  Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-[#032a0d]">
                  {areSessionsLoading ? "-" : sessions.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  Signed-in devices
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-lg gap-1! border-neutral-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <UserCheckIcon className="size-4 text-[#032a0d]" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant={currentUser?.isEmailVerified ? "success" : "outline"}
                >
                  {currentUser?.isEmailVerified
                    ? "Verified"
                    : "Needs verification"}
                </Badge>
                <p className="mt-2 text-xs text-muted-foreground">
                  {isUserLoading ? "Checking account" : currentUser?.email}
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-lg gap-1! border-neutral-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <LockKeyholeIcon className="size-4 text-[#032a0d]" />
                  Two-factor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant={
                    currentUser?.isTwoFactorEnabled ? "success" : "outline"
                  }
                >
                  {currentUser?.isTwoFactorEnabled ? "Enabled" : "Not enabled"}
                </Badge>
                <p className="mt-2 text-xs text-muted-foreground">
                  Extra sign-in protection
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr]">
            <div className="space-y-8">
              <Card className="rounded-lg h-fit gap-0! border-neutral-200">
                <CardHeader className="gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="font-serif text-2xl text-[#032a0d]">
                      Session Information
                    </CardTitle>
                    <CardDescription>
                      Review devices currently signed in to your account.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-1">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={handleRevokeOtherSessions}
                    disabled={
                      otherSessionsCount === 0 ||
                      revokeOtherSessionsMutation.isPending
                    }
                  >
                    <LogOutIcon className="size-4" />
                    End others
                  </Button>
                  <div className="space-y-4 mt-5">
                    {areSessionsLoading && (
                      <div className="space-y-3">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                      </div>
                    )}
                    {sessionsError && (
                      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                        Session information could not be loaded. Please sign in
                        again.
                      </div>
                    )}
                    {!areSessionsLoading &&
                      !sessionsError &&
                      sessions.map((session) => (
                        <div
                          key={session.id}
                          className="rounded-lg border border-neutral-200 bg-neutral-50/80 p-4"
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                {getDeviceLabel(session.userAgent).includes(
                                  "Mobile",
                                ) ? (
                                  <SmartphoneIcon className="size-4 text-[#032a0d]" />
                                ) : (
                                  <LaptopIcon className="size-4 text-[#032a0d]" />
                                )}
                                <p className="font-medium text-[#032a0d]">
                                  {getDeviceLabel(session.userAgent)}
                                </p>
                                {session.isCurrent && (
                                  <Badge variant="success">Current</Badge>
                                )}
                              </div>
                              <div className="grid gap-1 text-sm text-muted-foreground">
                                <span>
                                  {getBrowserLabel(session.userAgent)}
                                </span>
                                <span className="flex items-center gap-2">
                                  <MapPinIcon className="size-3.5" />
                                  {getSessionLocation(session)}
                                </span>
                                <span className="flex items-center gap-2">
                                  <ClockIcon className="size-3.5" />
                                  Signed in {formatDateTime(session.createdAt)}
                                </span>
                              </div>
                            </div>
                            {!session.isCurrent && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleRevokeSession(session.id)}
                                disabled={revokeSessionMutation.isPending}
                              >
                                End session
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    {!areSessionsLoading &&
                      !sessionsError &&
                      sessions.length === 0 && (
                        <p className="rounded-lg border border-neutral-200 p-4 text-sm text-muted-foreground">
                          No active sessions were found.
                        </p>
                      )}
                  </div>
                </CardContent>
              </Card>
              <TwoFactorCard
                isEnabled={Boolean(currentUser?.isTwoFactorEnabled)}
              />
            </div>

            <Card className="rounded-lg border-neutral-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif text-2xl text-[#032a0d]">
                  <KeyRoundIcon className="size-5" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Use a strong password that is unique to this account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={oldPassword}
                      onChange={(event) => setOldPassword(event.target.value)}
                      required
                    />
                  </div>
                  <PasswordStrengthInput
                    password={password}
                    onPasswordChange={setPassword}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm new password
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      required
                    />
                  </div>
                  <Button
                    className="w-full bg-[#032a0d] hover:bg-[#032a0d]/90"
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending
                      ? "Updating..."
                      : "Update password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <AccountInfoDialogs />

          <Card className="rounded-lg border-neutral-200">
            <CardHeader>
              <div>
                <CardTitle className="font-serif text-2xl text-[#032a0d]">
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Account actions recorded by the system.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {areActivityLogsLoading && (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              )}
              {activityLogsError && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                  Activity could not be loaded right now.
                </div>
              )}
              {!areActivityLogsLoading &&
                !activityLogsError &&
                (activityLogs ?? []).length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-52">Action</TableHead>
                        <TableHead className="min-w-44">Module</TableHead>
                        <TableHead className="min-w-36">Result</TableHead>
                        <TableHead className="min-w-44">Device</TableHead>
                        <TableHead className="min-w-36">IP address</TableHead>
                        <TableHead className="min-w-44">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(activityLogs ?? []).map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium text-[#032a0d]">
                                {log.actionLabel}
                              </p>
                              <p className="max-w-80 truncate text-xs text-muted-foreground">
                                {log.description ||
                                  log.targetLabel ||
                                  "No details"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{log.moduleLabel}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                log.result === "SUCCESS" ? "success" : "outline"
                              }
                            >
                              {log.result}
                            </Badge>
                          </TableCell>
                          <TableCell>{log.deviceLabel}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {log.ipAddress}
                          </TableCell>
                          <TableCell>{formatDateTime(log.timestamp)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              {!areActivityLogsLoading &&
                !activityLogsError &&
                (activityLogs ?? []).length === 0 && (
                  <p className="rounded-lg border border-neutral-200 p-4 text-sm text-muted-foreground">
                    No recent account activity has been recorded yet.
                  </p>
                )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Page;
