"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FileUpload } from "@/components/magic-ui/FileUpload";
import {
  toApiError,
  useCurrentMemberPaymentCheckoutQuery,
  useUpsertCurrentMemberPaymentCheckoutMutation,
  useUploadMemberPaymentDocumentMutation,
} from "@/features/member/member.hooks";
import { useToast } from "@/hooks/use-toast";
import type { MemberPaymentMethod } from "@/features/member/member.types";

type Props = {
  onContinueAction: () => Promise<void> | void;
};

type PaymentMethod = "e_wallet" | "direct_debit" | "over_the_counter" | "cash";

type PaymentBrand = {
  name: string;
  logoSrc: string;
  width: number;
};

type StoredPaymentDraft = {
  method: PaymentMethod | "";
  proofDataUrl: string;
  promissoryChecked: boolean;
  promissoryDataUrl: string;
};

const PAYMENT_FEE_PHP = 500;

const PAYMENT_METHOD_OPTIONS: { id: PaymentMethod; label: string }[] = [
  { id: "e_wallet", label: "E-wallets" },
  { id: "direct_debit", label: "Direct debit" },
  { id: "over_the_counter", label: "Over the counter" },
  { id: "cash", label: "Cash" },
];

const PAYMENT_METHOD_ICON_SRC: Record<PaymentMethod, string> = {
  e_wallet: "/icons/payment-methods/e-wallets.svg",
  direct_debit: "/icons/payment-methods/card.svg",
  over_the_counter: "/icons/payment-methods/bank.svg",
  cash: "/icons/payment-methods/cash.svg",
};

const PAYMENT_METHOD_BRANDS: Record<PaymentMethod, PaymentBrand[]> = {
  e_wallet: [
    {
      name: "GCash",
      logoSrc: "https://assets.xendit.co/payment-channels/logos/gcash-logo.svg",
      width: 45,
    },
  ],
  direct_debit: [
    {
      name: "BDO",
      logoSrc: "https://assets.xendit.co/payment-channels/logos/bdo-logo.svg",
      width: 40,
    },
  ],
  over_the_counter: [
    {
      name: "Palawan Express",
      logoSrc:
        "https://assets.xendit.co/payment-channels/logos/palawan-logo.svg",
      width: 40,
    },
  ],
  cash: [],
};

type PaymentAccountInfo = {
  title: string;
  note: string;
  accountName: string;
  accountNumber: string;
  contactNumber: string;
  qrImageSrc?: string;
};

const PAYMENT_ACCOUNT_INFO: Record<PaymentMethod, PaymentAccountInfo> = {
  e_wallet: {
    title: "E-wallet Accounts",
    note: "Use GCash or Maya. You can scan QR or send to account number.",
    accountName: "RODEL R. MANZO",
    accountNumber: "0919 458 9099",
    contactNumber: "+63 919 458 9099",
    qrImageSrc: "/gcash-qr.jpg",
  },
  direct_debit: {
    title: "Direct Debit / Bank Transfer",
    note: "Send from your banking app to the account below.",
    accountName: "RODEL R. MANZO",
    accountNumber: "010410140228",
    contactNumber: "+63 919 458 9099",
  },
  over_the_counter: {
    title: "Over the Counter Payment",
    note: "Use Bayad Center/Cebuana and send proof after payment.",
    accountName: "RODEL R. MANZO",
    accountNumber: "010410140228",
    contactNumber: "+63 919 458 9099",
  },
  cash: {
    title: "Cash Payment",
    note: "Coordinate with admin for onsite cash remittance and acknowledgment.",
    accountName: "RODEL R. MANZO",
    accountNumber: "N/A (onsite cash)",
    contactNumber: "+63 919 458 9099",
  },
};

const PAYMENT_METHOD_TO_BACKEND: Record<PaymentMethod, MemberPaymentMethod> = {
  e_wallet: "E_WALLET",
  direct_debit: "DIRECT_DEBIT",
  over_the_counter: "OVER_THE_COUNTER",
  cash: "CASH",
};

const PAYMENT_METHOD_FROM_BACKEND: Record<MemberPaymentMethod, PaymentMethod> = {
  E_WALLET: "e_wallet",
  DIRECT_DEBIT: "direct_debit",
  OVER_THE_COUNTER: "over_the_counter",
  CASH: "cash",
};

export function OnboardingStepPaymentCheckout({
  onContinueAction,
}: Props) {
  const { toast } = useToast();
  const { data: paymentCheckout } = useCurrentMemberPaymentCheckoutQuery();
  const upsertPaymentCheckoutMutation = useUpsertCurrentMemberPaymentCheckoutMutation();
  const uploadPaymentDocumentMutation = useUploadMemberPaymentDocumentMutation();
  const [draft, setDraft] = useState<StoredPaymentDraft>({
    method: "",
    proofDataUrl: "",
    promissoryChecked: false,
    promissoryDataUrl: "",
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [isMethodDialogOpen, setIsMethodDialogOpen] = useState(false);
  const [uploading, setUploading] = useState<"proof" | "promissory" | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCashSelected = draft.method === "cash";
  const hasPaymentProof = Boolean(draft.proofDataUrl);
  const hasPromissory =
    draft.promissoryChecked && Boolean(draft.promissoryDataUrl);
  const canContinue = Boolean(draft.method) && (
    isCashSelected
      ? (!draft.promissoryChecked || hasPromissory)
      : (draft.promissoryChecked ? hasPromissory : hasPaymentProof)
  );

  useEffect(() => {
    const existing = paymentCheckout?.data;
    if (!existing) return;

    setDraft({
      method: PAYMENT_METHOD_FROM_BACKEND[existing.paymentMethod],
      proofDataUrl: existing.proofOfPaymentUrl ?? "",
      promissoryChecked: existing.isPromissoryNote ?? false,
      promissoryDataUrl: existing.promissoryNoteUrl ?? "",
    });
  }, [paymentCheckout]);

  const updateDraft = (next: Partial<StoredPaymentDraft>) =>
    setDraft((prev) => ({ ...prev, ...next }));

  const handleFileUpload = async (
    kind: "proof" | "promissory",
    file: File | null,
  ) => {
    if (!file) return;
    setError(null);
    setUploading(kind);
    try {
      const uploaded = await uploadPaymentDocumentMutation.mutateAsync(file);
      const dataUrl = uploaded?.ufsUrl || uploaded?.url;

      if (!dataUrl) {
        throw new Error("Upload did not return a file URL.");
      }

      if (kind === "proof") {
        updateDraft({ proofDataUrl: dataUrl });
      } else {
        updateDraft({ promissoryDataUrl: dataUrl, promissoryChecked: true });
      }
      toast({
        title: "File uploaded",
        description: "Payment document uploaded successfully.",
        variant: "success",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to upload file.");
    } finally {
      setUploading(null);
    }
  };

  const handleContinue = async () => {
    if (!canContinue) return;
    setError(null);
    setLoading(true);
    try {
      const method = draft.method;
      if (!method) {
        throw new Error("Please select a payment method.");
      }

      if (method !== "cash" && !draft.promissoryChecked && !draft.proofDataUrl) {
        throw new Error("Attach proof of payment for non-cash payment method.");
      }

      if (draft.promissoryChecked && !draft.promissoryDataUrl) {
        throw new Error("Attach signed promissory note before continuing.");
      }

      await upsertPaymentCheckoutMutation.mutateAsync({
        paymentMethod: PAYMENT_METHOD_TO_BACKEND[method],
        proofOfPaymentUrl: draft.proofDataUrl || undefined,
        isPromissoryNote: draft.promissoryChecked,
        promissoryNoteUrl: draft.promissoryDataUrl || undefined,
      });

      await Promise.resolve(onContinueAction());
    } catch (e) {
      const apiError = toApiError(e);
      setError(apiError.message ?? (e instanceof Error ? e.message : "Failed to continue"));
    } finally {
      setLoading(false);
    }
  };

  const accountInfo =
    selectedPaymentMethod !== null
      ? PAYMENT_ACCOUNT_INFO[selectedPaymentMethod]
      : null;

  return (
    <>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
        <div className="overflow-hidden border border-black/10 bg-white">
          <div className="bg-[#032a0d] px-5 py-4 text-white">
            <h2 className="text-lg">Payment / Checkout</h2>
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            <section className="rounded border border-black/10 bg-neutral-50 px-4 py-4">
              <h3 className="font-serif text-xl text-[#032a0d]">
                Training Fee
              </h3>
              <p className="mt-1 text-sm text-[#032a0d]/80">
                Amount due:{" "}
                <span className="font-semibold">PHP {PAYMENT_FEE_PHP}.00</span>
              </p>
              <p className="mt-1 text-xs text-[#032a0d]/70">
                Accepted: E-wallets, Direct debit, Over the counter, and Cash.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-serif text-xl text-[#032a0d]">
                Payment Method
              </h3>
              <div className="h-px bg-black/10" />
              <div className="grid gap-2 sm:grid-cols-2">
                {PAYMENT_METHOD_OPTIONS.map((option) => {
                  const selected = draft.method === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        const cashSelected = option.id === "cash";
                        updateDraft({
                          method: option.id,
                          ...(cashSelected
                            ? {
                                proofDataUrl: "",
                                promissoryChecked: false,
                                promissoryDataUrl: "",
                              }
                            : {}),
                        });
                        setSelectedPaymentMethod(cashSelected ? null : option.id);
                        setIsMethodDialogOpen(!cashSelected);
                      }}
                      className={[
                        "rounded border px-3 py-3 text-left text-sm transition-colors",
                        selected
                          ? "border-[#032a0d]/40 bg-[#032a0d]/5 text-[#032a0d]"
                          : "border-black/10 bg-white text-[#032a0d]/80 hover:bg-[#032a0d]/3",
                      ].join(" ")}
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src={PAYMENT_METHOD_ICON_SRC[option.id]}
                          alt={`${option.label} icon`}
                          width={18}
                          height={18}
                          className="size-4.5"
                        />
                        {option.label}
                        {PAYMENT_METHOD_BRANDS[option.id].map((brand) => (
                          <div
                            key={brand.name}
                            className={`mt-2 relative flex ml-auto flex-wrap justify-center gap-1.5`}
                            style={{ width: brand.width, height: 20 }}
                          >
                            <Image
                              src={brand.logoSrc}
                              alt={`${brand.name} logo`}
                              fill
                              className="size-full"
                            />
                          </div>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {!isCashSelected && (
              <section className="space-y-3">
                <h3 className="font-serif text-xl text-[#032a0d]">
                  Submit Proof of Payment
                </h3>
                <div className="h-px bg-black/10" />
                <div className="w-full mt-2 max-w-4xl mx-auto min-h-50 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
                  <FileUpload
                    onChange={(files) =>
                      handleFileUpload("proof", files[0] ?? null)
                    }
                  />
                  {uploading === "proof" && (
                    <span className="text-xs text-[#032a0d]/70">
                      Uploading...
                    </span>
                  )}
                </div>
              </section>
            )}

            <section className="space-y-3">
              <h3 className="font-serif text-xl text-[#032a0d]">
                Promissory Note (Alternative)
              </h3>
              <div className="h-px bg-black/10" />
              <label className="flex items-center gap-2 text-sm text-[#032a0d]">
                <Checkbox
                  checked={draft.promissoryChecked}
                  onCheckedChange={(checked) =>
                    updateDraft({
                      promissoryChecked: checked === true,
                      promissoryDataUrl: checked === true
                        ? draft.promissoryDataUrl
                        : "",
                    })
                  }
                />
                I will submit a promissory note instead of immediate payment.
              </label>

              {draft.promissoryChecked && (
                <div className="rounded border border-black/10 bg-white px-3 py-3">
                  <p className="text-sm text-[#032a0d]">
                    Upload signed promissory note
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleFileUpload(
                          "promissory",
                          e.target.files?.[0] ?? null,
                        )
                      }
                      className="text-xs sm:text-sm"
                    />
                    {uploading === "promissory" && (
                      <span className="text-xs text-[#032a0d]/70">
                        Uploading...
                      </span>
                    )}
                    {draft.promissoryDataUrl && (
                      <a
                        href={draft.promissoryDataUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#032a0d] underline"
                      >
                        View file
                      </a>
                    )}
                  </div>
                </div>
              )}
            </section>

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-neutral-500 sm:text-sm">
                Continue to Online Interview after submitting payment proof or
                promissory note.
              </p>
              <Button
                type="button"
                onClick={handleContinue}
                disabled={!canContinue || loading}
                className="bg-[#032a0d] hover:bg-[#032a0d]/90"
              >
                {loading ? "Saving..." : "Continue to Online Interview"}
              </Button>
            </div>
          </div>
        </div>

        <aside className="self-start lg:sticky lg:top-6">
          <div className="overflow-hidden border border-black/10 bg-white">
            <div className="bg-[#032a0d] px-5 py-4 text-white">
              <h2 className="text-lg">Payment Checklist</h2>
            </div>
            <div className="space-y-3 p-5 text-sm text-neutral-700">
              <StatusCard
                title="Payment Method"
                complete={Boolean(draft.method)}
                pendingLabel="Pending"
                completeLabel="Selected"
              />
              <StatusCard
                title="Proof / Promissory"
                complete={isCashSelected || hasPaymentProof || hasPromissory}
                pendingLabel={isCashSelected ? "Not required for cash" : "Pending"}
                completeLabel={isCashSelected ? "Not required for cash" : "Submitted"}
              />
              <div className="flex gap-2 rounded border border-dashed border-[#032a0d]/25 bg-[#032a0d]/5 px-3 py-3 text-xs text-[#032a0d]/80">
                <Info className="mt-0.5 size-4 shrink-0 text-[#032a0d]" />
                <p>
                  If you cannot pay immediately, submit a signed promissory note
                  to continue.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <Dialog open={isMethodDialogOpen} onOpenChange={setIsMethodDialogOpen}>
        <DialogContent className="max-w-2xl! border-[#032a0d]/20">
          {accountInfo && (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#032a0d]">
                  {accountInfo.title}
                </DialogTitle>
                <DialogDescription className="text-[#032a0d]/70">
                  {accountInfo.note}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <div className="rounded border border-black/10 bg-neutral-50 px-3 py-3">
                  <p className="text-xs uppercase tracking-wide text-[#032a0d]/70">
                    Account Name
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-[#032a0d]">
                    {accountInfo.accountName}
                  </p>
                </div>
                <div className="rounded border border-black/10 bg-neutral-50 px-3 py-3">
                  <p className="text-xs uppercase tracking-wide text-[#032a0d]/70">
                    Account Number
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-[#032a0d]">
                    {accountInfo.accountNumber}
                  </p>
                </div>
                <div className="rounded border border-black/10 bg-neutral-50 px-3 py-3">
                  <p className="text-xs uppercase tracking-wide text-[#032a0d]/70">
                    Contact Number
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-[#032a0d]">
                    {accountInfo.contactNumber}
                  </p>
                </div>
                {selectedPaymentMethod === "e_wallet" && (
                  <div className="rounded border border-dashed border-[#032a0d]/25 bg-[#032a0d]/5 px-3 py-3">
                    {accountInfo.qrImageSrc ? (
                      <div className="h-105 overflow-hidden rounded border border-[#032a0d]/15 bg-white p-2">
                        <Image
                          src={accountInfo.qrImageSrc}
                          alt="GCash QR code"
                          width={380}
                          height={680}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ) : (
                      <p className="text-xs text-[#032a0d]/80">
                        QR image can be placed here once available.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function StatusCard({
  title,
  complete,
  pendingLabel,
  completeLabel,
}: {
  title: string;
  complete: boolean;
  pendingLabel: string;
  completeLabel: string;
}) {
  return (
    <div
      className={[
        "rounded border px-3 py-3",
        complete
          ? "border-emerald-300 bg-emerald-50"
          : "border-black/10 bg-neutral-50",
      ].join(" ")}
    >
      <p className="font-semibold text-[#032a0d]">{title}</p>
      <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-[#032a0d]/75">
        <span
          className={[
            "size-2 rounded-full",
            complete ? "bg-emerald-600" : "bg-neutral-500",
          ].join(" ")}
        />
        {complete ? completeLabel : pendingLabel}
      </p>
    </div>
  );
}
