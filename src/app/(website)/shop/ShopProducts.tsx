"use client";

import React from "react";
import {
  Banknote,
  Check,
  CreditCard,
  Info,
  Mail,
  Minus,
  Plus,
  Store,
  Truck,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useOptionalCurrentUserQuery } from "@/features/auth/auth.hooks";
import { api, toApiError } from "@/lib/http-client";
import { cn } from "@/lib/utils";
import type {
  CreateShopOrderPayload,
  CreateShopOrderResponse,
  PaymentFeePolicies,
  ShopProduct,
} from "./products";
import { PayPalButton } from "./PayPalButton";

const xenditPaymentLogos = [
  ["Visa", "https://onemarketphilippines.com/icons/payments/visa-logo.svg"],
  [
    "Mastercard",
    "https://onemarketphilippines.com/icons/payments/mastercard-logo.svg",
  ],
  ["GCash", "https://onemarketphilippines.com/icons/payments/gcash-logo.svg"],
  [
    "GrabPay",
    "https://onemarketphilippines.com/icons/payments/grabpay-logo.svg",
  ],
  [
    "QR Ph",
    "https://onemarketphilippines.com/icons/payments/qrph-c567ff0f-ab6d-4662-86bf-24c6c731d8a8-logo.svg",
  ],
  [
    "ShopeePay",
    "https://onemarketphilippines.com/icons/payments/shopeepay-logo.svg",
  ],
  ["Maya", "https://onemarketphilippines.com/icons/payments/paymaya-logo.svg"],
] as const;

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

const OptionCard = ({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "relative flex min-h-28 flex-1 flex-col items-center justify-center rounded-md border p-4 text-center transition",
      active
        ? "border-[#032a0d] bg-[#f7faf8]"
        : "border-zinc-200 bg-white hover:border-zinc-300",
    )}
  >
    {active && (
      <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-[#032a0d] text-white">
        <Check className="size-3.5" aria-hidden="true" />
      </span>
    )}
    {children}
  </button>
);

const stockLabels: Record<ShopProduct["stockStatus"], string> = {
  IN_STOCK: "In stock",
  LOW_STOCK: "Low stock",
  OUT_OF_STOCK: "Out of stock",
};

const ShopProducts = ({
  products,
  paymentFeePolicies,
  paypalClientId,
}: {
  products: ShopProduct[];
  paymentFeePolicies: PaymentFeePolicies;
  paypalClientId: string | null;
}) => {
  const { toast } = useToast();
  const { data: currentUser } = useOptionalCurrentUserQuery();
  const [selectedProduct, setSelectedProduct] =
    React.useState<ShopProduct | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const [paymentMethod, setPaymentMethod] = React.useState<"cash" | "online">(
    "cash",
  );
  const [paymentGateway, setPaymentGateway] = React.useState<
    "XENDIT" | "PAYPAL"
  >("XENDIT");
  const [fulfillment, setFulfillment] = React.useState<"deliver" | "pickup">(
    "deliver",
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [customerName, setCustomerName] = React.useState("");
  const [customerEmail, setCustomerEmail] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [deliveryAddress, setDeliveryAddress] = React.useState("");
  const [customerNotes, setCustomerNotes] = React.useState("");
  const paypalCheckoutRef = React.useRef<{
    reference: string;
    checkoutToken: string;
    gatewayReference: string;
  } | null>(null);

  const subtotal = selectedProduct ? selectedProduct.price * quantity : 0;
  const tax = subtotal * 0.12;
  const feePolicy = paymentFeePolicies[paymentGateway];
  const platformFee =
    paymentMethod === "online"
      ? Number(
          (
            (subtotal + tax) * (feePolicy.percent / 100) +
            feePolicy.fixed
          ).toFixed(2),
        )
      : 0;
  const total = subtotal + tax + platformFee;

  const handleOpenOrder = (product: ShopProduct) => {
    if (!product.isAvailable) return;
    setSelectedProduct(product);
    setQuantity(1);
    setPaymentMethod("cash");
    setPaymentGateway("XENDIT");
    setFulfillment("deliver");
    setCustomerName(currentUser?.name ?? "");
    setCustomerEmail(currentUser?.email ?? "");
    setCustomerPhone("");
    setDeliveryAddress("");
    setCustomerNotes("");
    paypalCheckoutRef.current = null;
  };

  const validateCustomerDetails = React.useCallback(() => {
    if (!selectedProduct) return false;
    if (
      !customerName.trim() ||
      !customerEmail.trim() ||
      !customerPhone.trim()
    ) {
      toast({
        title: "Customer details required",
        description: "Enter your name, email address, and contact number.",
        variant: "error",
      });
      return false;
    }
    if (fulfillment === "deliver" && !deliveryAddress.trim()) {
      toast({
        title: "Delivery address required",
        description: "Enter the address where the order should be delivered.",
        variant: "error",
      });
      return false;
    }
    return true;
  }, [
    customerEmail,
    customerName,
    customerPhone,
    deliveryAddress,
    fulfillment,
    selectedProduct,
    toast,
  ]);

  const createPayPalOrder = React.useCallback(async () => {
    if (paypalCheckoutRef.current)
      return paypalCheckoutRef.current.gatewayReference;
    if (!selectedProduct || !validateCustomerDetails())
      throw new Error("Complete the required checkout details first");
    setIsSubmitting(true);
    try {
      const payload: CreateShopOrderPayload = {
        productId: selectedProduct.id,
        quantity,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        fulfillmentMethod: fulfillment === "deliver" ? "DELIVERY" : "PICKUP",
        deliveryAddress:
          fulfillment === "deliver" ? deliveryAddress.trim() : null,
        customerNotes: customerNotes.trim() || null,
        paymentMethod: "ONLINE",
        paymentGateway: "PAYPAL",
      };
      const { data: orderResponse } = await api.post<CreateShopOrderResponse>(
        "/chaplain-product-orders/public",
        payload,
      );
      const order = orderResponse.data;
      const { data: checkoutResponse } = await api.post<{
        data: { reference: string; gatewayReference: string };
      }>(
        `/payments/public/chaplain-orders/${encodeURIComponent(order.id)}/checkout`,
        { orderId: order.id, checkoutToken: order.checkoutToken },
      );
      paypalCheckoutRef.current = {
        reference: checkoutResponse.data.reference,
        gatewayReference: checkoutResponse.data.gatewayReference,
        checkoutToken: order.checkoutToken,
      };
      return checkoutResponse.data.gatewayReference;
    } catch (error) {
      const apiError = toApiError(error);
      toast({
        title: "PayPal checkout could not start",
        description: apiError.message,
        variant: "error",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    customerEmail,
    customerName,
    customerNotes,
    customerPhone,
    deliveryAddress,
    fulfillment,
    quantity,
    selectedProduct,
    toast,
    validateCustomerDetails,
  ]);

  const capturePayPalOrder = React.useCallback(async (orderId: string) => {
    const checkout = paypalCheckoutRef.current;
    if (!checkout) throw new Error("PayPal checkout details are missing");
    setIsSubmitting(true);
    try {
      await api.post(
        `/payments/public/paypal/${encodeURIComponent(orderId)}/capture`,
        { checkoutToken: checkout.checkoutToken },
      );
      window.location.assign(
        `/payment/success?reference=${encodeURIComponent(checkout.reference)}`,
      );
    } catch (error) {
      window.location.assign(
        `/payment/error?reason=capture_failed&reference=${encodeURIComponent(checkout.reference)}`,
      );
      throw error;
    }
  }, []);

  const handlePayPalCancel = React.useCallback(() => {
    const reference = paypalCheckoutRef.current?.reference;
    window.location.assign(
      `/payment/error?reason=cancelled${reference ? `&reference=${encodeURIComponent(reference)}` : ""}`,
    );
  }, []);

  const handlePayPalError = React.useCallback(
    (error: unknown) => {
      const reference = paypalCheckoutRef.current?.reference;
      if (reference) {
        window.location.assign(
          `/payment/error?reason=provider_error&reference=${encodeURIComponent(reference)}`,
        );
        return;
      }
      toast({
        title: "PayPal unavailable",
        description:
          error instanceof Error
            ? error.message
            : "Unable to load PayPal checkout.",
        variant: "error",
      });
    },
    [toast],
  );

  const handleSubmitOrder = async () => {
    if (!selectedProduct || isSubmitting) return;

    if (
      !customerName.trim() ||
      !customerEmail.trim() ||
      !customerPhone.trim()
    ) {
      toast({
        title: "Customer details required",
        description: "Enter your name, email address, and contact number.",
        variant: "error",
      });
      return;
    }

    if (fulfillment === "deliver" && !deliveryAddress.trim()) {
      toast({
        title: "Delivery address required",
        description: "Enter the address where the order should be delivered.",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: CreateShopOrderPayload = {
        productId: selectedProduct.id,
        quantity,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        fulfillmentMethod: fulfillment === "deliver" ? "DELIVERY" : "PICKUP",
        deliveryAddress:
          fulfillment === "deliver" ? deliveryAddress.trim() : null,
        customerNotes: customerNotes.trim() || null,
        paymentMethod: paymentMethod === "online" ? "ONLINE" : "CASH",
        paymentGateway: paymentMethod === "online" ? paymentGateway : null,
      };
      const { data: orderResponse } = await api.post<CreateShopOrderResponse>(
        "/chaplain-product-orders/public",
        payload,
      );
      const order = orderResponse.data;

      if (paymentMethod === "cash") {
        toast({
          title: "Order request submitted",
          description: `${order.orderNumber} was recorded. Our team will contact you after review.`,
          variant: "success",
        });
        setSelectedProduct(null);
        return;
      }

      const { data: checkoutResponse } = await api.post<{
        data: { checkoutUrl: string; reference: string };
      }>(
        `/payments/public/chaplain-orders/${encodeURIComponent(order.id)}/checkout`,
        {
          orderId: order.id,
          checkoutToken: order.checkoutToken,
        },
      );
      window.location.href = checkoutResponse.data.checkoutUrl;
    } catch (error) {
      const apiError = toApiError(error);
      const message =
        apiError.code !== "UNKNOWN_ERROR"
          ? apiError.message
          : error instanceof Error
            ? error.message
            : undefined;
      toast({
        title: "Order could not be submitted",
        description: message ?? "Please try again or contact the admin team.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-5">
            <div className="hidden h-px flex-1 bg-zinc-200 sm:block" />
            <div className="text-center">
              <h2 className="font-serif text-3xl font-semibold text-[#032a0d]">
                Our Products
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-700">
                Explore our collection of chaplain pins, patches, accessories,
                and apparel. Each item represents our commitment to service,
                faith, and excellence.
              </p>
            </div>
            <div className="hidden h-px flex-1 bg-zinc-200 sm:block" />
          </div>

          {products.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="rounded-md border border-zinc-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative mx-auto mb-4 aspect-square w-full max-w-28 overflow-hidden">
                    {/* Administrator-provided images may use any HTTPS host. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <h3 className="min-h-10 text-sm font-semibold leading-tight text-zinc-900">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-zinc-700">
                    {formatPrice(product.price)}
                  </p>
                  <p
                    className={cn(
                      "mt-2 text-xs font-semibold",
                      product.stockStatus === "IN_STOCK" && "text-emerald-700",
                      product.stockStatus === "LOW_STOCK" && "text-amber-700",
                      product.stockStatus === "OUT_OF_STOCK" && "text-red-700",
                    )}
                  >
                    {stockLabels[product.stockStatus]}
                    {product.stockStatus !== "OUT_OF_STOCK"
                      ? ` · ${product.stockQuantity} available`
                      : ""}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOpenOrder(product)}
                    disabled={!product.isAvailable}
                    className="mt-3 inline-flex h-8 w-full items-center justify-center rounded bg-[#032a0d] px-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#064016] disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-600"
                  >
                    {product.isAvailable ? "Request Order" : "Unavailable"}
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-6 py-16 text-center">
              <p className="font-serif text-2xl text-[#032a0d]">
                No products available
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                Active chaplain products will appear here once added by an
                administrator.
              </p>
            </div>
          )}

          <div className="mx-auto mt-8 flex max-w-2xl items-start gap-4 rounded-md border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#032a0d] text-white">
              <Mail className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase text-[#032a0d]">
                Request an Order
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-700">
                To request an order or inquire about any item, click the
                <span className="font-semibold"> Request Order </span>
                button on your selected product. Our team will get back to you
                as soon as possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Sheet
        open={Boolean(selectedProduct)}
        onOpenChange={(open) => {
          if (!open) setSelectedProduct(null);
          if (!open) setIsSubmitting(false);
        }}
      >
        <SheetContent className="w-full overflow-y-auto z-999 p-0 max-w-xl!">
          {selectedProduct && (
            <>
              <SheetHeader className="border-b px-5 py-5">
                <SheetTitle className="font-serif text-xl">
                  Request an Order
                </SheetTitle>
              </SheetHeader>

              <div className="space-y-6 px-5 py-5">
                <section>
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-zinc-800">
                    1. Selected Item
                  </h3>
                  <div className="flex items-center gap-4 border-b border-zinc-200 pb-5">
                    <div className="relative size-20 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedProduct.imageUrl}
                        alt={selectedProduct.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-950">
                        {selectedProduct.name}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-zinc-900">
                        {formatPrice(selectedProduct.price)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="mb-2 text-sm text-zinc-600">Quantity</p>
                      <div className="grid h-9 w-44 grid-cols-3 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50">
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity((current) => Math.max(1, current - 1))
                          }
                          className="flex items-center justify-center border-r border-zinc-200 hover:bg-zinc-100"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-4" aria-hidden="true" />
                        </button>
                        <span className="flex items-center justify-center bg-white text-sm font-semibold">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity((current) =>
                              Math.min(
                                selectedProduct.stockQuantity,
                                current + 1,
                              ),
                            )
                          }
                          disabled={quantity >= selectedProduct.stockQuantity}
                          className="flex items-center justify-center border-l border-zinc-200 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="mb-2 text-sm text-zinc-600">Subtotal</p>
                      <p className="font-semibold text-zinc-950">
                        {formatPrice(subtotal)}
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-zinc-800">
                    2. Customer Details
                  </h3>
                  <div className="space-y-3">
                    <Input
                      value={customerName}
                      onChange={(event) => setCustomerName(event.target.value)}
                      placeholder="Full name"
                      autoComplete="name"
                    />
                    <Input
                      type="email"
                      value={customerEmail}
                      onChange={(event) => setCustomerEmail(event.target.value)}
                      placeholder="Email address"
                      autoComplete="email"
                    />
                    <Input
                      value={customerPhone}
                      onChange={(event) => setCustomerPhone(event.target.value)}
                      placeholder="Contact number"
                      autoComplete="tel"
                    />
                  </div>
                </section>

                <section>
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-zinc-800">
                    3. Payment Method
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <OptionCard
                      active={paymentMethod === "cash"}
                      onClick={() => setPaymentMethod("cash")}
                    >
                      <Banknote className="mb-3 size-10 rounded-full bg-zinc-100 p-2 text-zinc-700" />
                      <span className="font-semibold text-zinc-950">
                        Pay Cash
                      </span>
                      <span className="mt-1 text-xs leading-relaxed text-zinc-600">
                        Pay in cash upon delivery or when picking up your order.
                      </span>
                    </OptionCard>
                    <OptionCard
                      active={paymentMethod === "online"}
                      onClick={() => setPaymentMethod("online")}
                    >
                      <CreditCard className="mb-3 size-10 rounded-full bg-zinc-100 p-2 text-zinc-700" />
                      <span className="font-semibold text-zinc-950">
                        Pay Online
                      </span>
                      <span className="mt-1 text-xs leading-relaxed text-zinc-600">
                        Secure online payment through GCash, Maya or Bank
                        Transfer.
                      </span>
                    </OptionCard>
                  </div>
                  {paymentMethod === "online" && (
                    <div
                      className="mt-3 space-y-3"
                      role="radiogroup"
                      aria-label="Payment provider"
                    >
                      <button
                        type="button"
                        role="radio"
                        aria-checked={paymentGateway === "XENDIT"}
                        onClick={() => setPaymentGateway("XENDIT")}
                        className={cn(
                          "relative w-full rounded-lg border p-4 text-left transition",
                          paymentGateway === "XENDIT"
                            ? "border-[#032a0d] bg-[#f7faf8] ring-1 ring-[#032a0d]"
                            : "border-zinc-200 bg-white hover:border-zinc-300",
                        )}
                      >
                        {paymentGateway === "XENDIT" && (
                          <Check className="absolute right-3 top-3 size-5 rounded-full bg-[#032a0d] p-1 text-white" />
                        )}
                        <p className="font-semibold text-zinc-950">
                          Xendit{" "}
                          <span className="font-normal text-zinc-500">
                            — Local payment methods
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          Cards, e-wallets, and QR Ph through secure hosted
                          checkout.
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {xenditPaymentLogos.map(([name, src]) => (
                            <span key={name}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={src}
                                alt={name}
                                className="max-h-5 max-w-12"
                              />
                            </span>
                          ))}
                        </div>
                      </button>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={paymentGateway === "PAYPAL"}
                        onClick={() => setPaymentGateway("PAYPAL")}
                        className={cn(
                          "relative flex w-full items-center gap-4 rounded-lg border p-4 text-left transition",
                          paymentGateway === "PAYPAL"
                            ? "border-[#032a0d] bg-[#f7faf8] ring-1 ring-[#032a0d]"
                            : "border-zinc-200 bg-white hover:border-zinc-300",
                        )}
                      >
                        {paymentGateway === "PAYPAL" && (
                          <Check className="absolute right-3 top-3 size-5 rounded-full bg-[#032a0d] p-1 text-white" />
                        )}
                        <span className="text-xl font-black italic tracking-tight text-[#003087]">
                          Pay<span className="text-[#0070e0]">Pal</span>
                        </span>
                        <span>
                          <span className="block font-semibold text-zinc-950">
                            International payment
                          </span>
                          <span className="block text-xs text-zinc-500">
                            Pay securely with your PayPal Sandbox account.
                          </span>
                        </span>
                      </button>
                      <p className="text-xs text-zinc-500">
                        Test checkout. Payment is confirmed only after a
                        verified provider response or webhook.
                      </p>
                    </div>
                  )}
                </section>

                <section>
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-zinc-800">
                    4. Fulfillment Option
                  </h3>
                  <div className="space-y-3">
                    <Select
                      value={fulfillment}
                      onValueChange={(value) =>
                        setFulfillment(value as "deliver" | "pickup")
                      }
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Select fulfillment option" />
                      </SelectTrigger>
                      <SelectContent className="z-999">
                        <SelectItem value="deliver">Deliver</SelectItem>
                        <SelectItem value="pickup">Pick Up</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="rounded-md border border-zinc-200 bg-white p-4">
                      {fulfillment === "deliver" ? (
                        <div className="flex gap-3">
                          <Truck className="size-10 shrink-0 rounded-full bg-zinc-100 p-2 text-zinc-700" />
                          <div>
                            <p className="font-semibold text-zinc-950">
                              Deliver
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                              We will coordinate delivery to your specified
                              address after your order is reviewed.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <Store className="size-10 shrink-0 rounded-full bg-zinc-100 p-2 text-zinc-700" />
                          <div>
                            <p className="font-semibold text-zinc-950">
                              Pick Up
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                              You will pick up your order at our office
                              location.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    {fulfillment === "deliver" && (
                      <Textarea
                        value={deliveryAddress}
                        onChange={(event) =>
                          setDeliveryAddress(event.target.value)
                        }
                        placeholder="Complete delivery address"
                        rows={3}
                      />
                    )}
                    <Textarea
                      value={customerNotes}
                      onChange={(event) => setCustomerNotes(event.target.value)}
                      placeholder="Order notes (optional)"
                      rows={3}
                    />
                  </div>
                </section>

                <section className="border-t border-zinc-200 pt-5">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-zinc-800">
                    5. Price Summary
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <span>Subtotal ({quantity} item)</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    {fulfillment === "deliver" && (
                      <>
                        <div className="flex justify-between gap-4">
                          <span className="flex items-center gap-1.5 text-zinc-700">
                            Delivery Fee
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  className="rounded-full text-zinc-500 transition hover:text-[#032a0d] focus:outline-none focus:ring-2 focus:ring-[#032a0d]/20"
                                  aria-label="Delivery fee explanation"
                                >
                                  <Info
                                    className="size-3.5"
                                    aria-hidden="true"
                                  />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-64 z-999 bg-zinc-950 text-white">
                                Delivery fee is N/A because the final fee
                                depends on the provider, such as Lalamove or
                                LBC, and the distance from pickup to drop-off.
                              </TooltipContent>
                            </Tooltip>
                          </span>
                          <span className="text-zinc-600">N/A</span>
                        </div>
                        <p className="-mt-2 text-xs text-zinc-500">
                          Based on provider and location
                        </p>
                      </>
                    )}
                    <div className="flex justify-between gap-4">
                      <span>Tax (12%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    {paymentMethod === "online" && (
                      <div className="flex justify-between gap-4">
                        <span className="flex items-center gap-1.5">
                          Platform fee (
                          {paymentGateway === "XENDIT" ? "Xendit" : "PayPal"})
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                aria-label="Platform fee explanation"
                              >
                                <Info className="size-3.5 text-zinc-500" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="z-999 max-w-72 bg-zinc-950 text-white">
                              {feePolicy.percent}% +{" "}
                              {formatPrice(feePolicy.fixed)}. The configured fee
                              can be updated to match your approved merchant
                              pricing.
                            </TooltipContent>
                          </Tooltip>
                        </span>
                        <span>{formatPrice(platformFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between gap-4 border-t border-zinc-200 pt-3 font-bold text-zinc-950">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </section>

                <div className="flex gap-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-xs leading-relaxed text-zinc-700">
                  <Info className="mt-0.5 size-4 shrink-0 text-amber-700" />
                  <p>
                    <span className="font-semibold">Important:</span> Your order
                    will be reviewed and approved by our admin team before it is
                    confirmed. You will be notified once your order is approved.
                  </p>
                </div>

                {paymentMethod === "online" && paymentGateway === "PAYPAL" ? (
                  <PayPalButton
                    clientId={paypalClientId}
                    createOrder={createPayPalOrder}
                    captureOrder={capturePayPalOrder}
                    onCancel={handlePayPalCancel}
                    onError={handlePayPalError}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitOrder}
                    disabled={isSubmitting}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded bg-[#032a0d] px-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#064016] disabled:opacity-60"
                  >
                    <Mail className="size-4" aria-hidden="true" />
                    {isSubmitting
                      ? "Preparing Checkout..."
                      : paymentMethod === "online"
                        ? "Continue to Xendit"
                        : "Submit Order Request"}
                  </button>
                )}
                <p className="text-center text-xs text-zinc-500">
                  By submitting, you agree to our terms and conditions.
                </p>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ShopProducts;
