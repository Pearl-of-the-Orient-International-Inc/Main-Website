"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Clock3, RefreshCw } from "lucide-react";
import { api } from "@/lib/http-client";

type PaymentStatus = {
  reference: string;
  amount: number;
  currency: string;
  gateway: "XENDIT" | "PAYPAL";
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "EXPIRED" | "REFUNDED";
  providerStatus: string | null;
  failureReason: string | null;
  paidAt: string | null;
  orderNumber: string | null;
};

export function PaymentResult({ reference, mode, reason }: { reference?: string; mode: "success" | "error"; reason?: string }) {
  const [payment, setPayment] = React.useState<PaymentStatus | null>(null);
  const [loading, setLoading] = React.useState(Boolean(reference));

  React.useEffect(() => {
    if (!reference) return;
    let cancelled = false;
    let attempts = 0;
    const check = async () => {
      attempts += 1;
      try {
        const { data } = await api.get<{ data: PaymentStatus }>(`/payments/public/status/${encodeURIComponent(reference)}`);
        if (cancelled) return;
        setPayment(data.data);
        setLoading(false);
        if (data.data.status === "PENDING" && attempts < 10) window.setTimeout(check, 2000);
      } catch {
        if (!cancelled) setLoading(false);
      }
    };
    void check();
    return () => { cancelled = true; };
  }, [reference]);

  const paid = payment?.status === "PAID";
  const pending = mode === "success" && (!payment || payment.status === "PENDING");
  const Icon = paid ? CheckCircle2 : pending ? Clock3 : AlertCircle;
  const title = paid ? "Payment successful" : pending ? "Payment is being verified" : reason === "cancelled" ? "Payment cancelled" : "Payment was not completed";
  const description = paid
    ? "Your payment was confirmed securely. The administrator can now process your order."
    : pending
      ? "We received your return from the payment provider and are waiting for the verified payment confirmation. This page updates automatically."
      : "No completed payment was recorded. You can return to the shop and try again.";

  return <main className="min-h-[70vh] bg-[#f7f8f5] px-4 py-20 sm:px-6">
    <div className="mx-auto max-w-xl rounded-2xl border bg-white p-7 text-center shadow-sm sm:p-10">
      <span className={`mx-auto flex size-16 items-center justify-center rounded-full ${paid ? "bg-emerald-100 text-emerald-700" : pending ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
        <Icon className={`size-8 ${loading ? "animate-pulse" : ""}`} />
      </span>
      <h1 className="mt-5 font-serif text-3xl font-semibold text-[#032a0d]">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-600">{description}</p>
      {(reference || payment?.orderNumber) && <dl className="mt-6 divide-y rounded-lg border bg-zinc-50 px-4 text-left text-sm">
        {payment?.orderNumber && <div className="flex justify-between gap-4 py-3"><dt className="text-zinc-500">Order</dt><dd className="font-medium">{payment.orderNumber}</dd></div>}
        {reference && <div className="flex justify-between gap-4 py-3"><dt className="text-zinc-500">Reference</dt><dd className="break-all text-right font-mono text-xs">{reference}</dd></div>}
        {payment && <><div className="flex justify-between gap-4 py-3"><dt className="text-zinc-500">Provider</dt><dd className="font-medium">{payment.gateway === "XENDIT" ? "Xendit" : "PayPal"}</dd></div>
          <div className="flex justify-between gap-4 py-3"><dt className="text-zinc-500">Status</dt><dd className="font-semibold">{payment.status}</dd></div>
          <div className="flex justify-between gap-4 py-3"><dt className="text-zinc-500">Amount</dt><dd className="font-semibold">{new Intl.NumberFormat("en-PH", { style: "currency", currency: payment.currency }).format(payment.amount)}</dd></div></>}
      </dl>}
      {pending && <p className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-500"><RefreshCw className="size-3.5 animate-spin" />Checking the verified provider status…</p>}
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <Link href="/shop" className="rounded-md bg-[#032a0d] px-4 py-3 text-sm font-semibold text-white hover:bg-[#064016]">Return to shop</Link>
        <Link href="/" className="rounded-md border px-4 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50">Go to homepage</Link>
      </div>
    </div>
  </main>;
}
