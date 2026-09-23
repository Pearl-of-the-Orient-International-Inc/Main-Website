"use client";

import React from "react";

type PayPalNamespace = {
  Buttons: (options: {
    style: { layout: string; color: string; shape: string; label: string; height: number };
    createOrder: () => Promise<string>;
    onApprove: (data: { orderID: string }) => Promise<void>;
    onCancel: () => void;
    onError: (error: unknown) => void;
  }) => { render: (element: HTMLElement) => Promise<void>; close?: () => void };
};

declare global {
  interface Window { paypal?: PayPalNamespace }
}

let paypalScriptPromise: Promise<void> | null = null;

function loadPayPal(clientId: string) {
  if (window.paypal) return Promise.resolve();
  if (paypalScriptPromise) return paypalScriptPromise;
  paypalScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=PHP&intent=capture&components=buttons`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Unable to load PayPal checkout"));
    document.head.appendChild(script);
  });
  return paypalScriptPromise;
}

export function PayPalButton({
  clientId,
  createOrder,
  captureOrder,
  onCancel,
  onError,
}: {
  clientId: string | null;
  createOrder: () => Promise<string>;
  captureOrder: (orderId: string) => Promise<void>;
  onCancel: () => void;
  onError: (error: unknown) => void;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!clientId || !containerRef.current) return;
    let disposed = false;
    let buttons: ReturnType<PayPalNamespace["Buttons"]> | undefined;
    const container = containerRef.current;
    container.replaceChildren();

    void loadPayPal(clientId)
      .then(async () => {
        if (disposed || !window.paypal) return;
        buttons = window.paypal.Buttons({
          style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal", height: 44 },
          createOrder,
          onApprove: async ({ orderID }) => captureOrder(orderID),
          onCancel,
          onError,
        });
        await buttons.render(container);
      })
      .catch(onError);

    return () => {
      disposed = true;
      buttons?.close?.();
      container.replaceChildren();
    };
  }, [captureOrder, clientId, createOrder, onCancel, onError]);

  if (!clientId) {
    return <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-center text-xs text-amber-900">PayPal Sandbox is not configured yet.</p>;
  }
  return <div ref={containerRef} className="min-h-11" aria-label="Pay with PayPal" />;
}
