"use client";

import Image from "next/image";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { products, type ShopProduct } from "./products";

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

const ShopProducts = () => {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] =
    React.useState<ShopProduct | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const [paymentMethod, setPaymentMethod] = React.useState<"cash" | "online">(
    "cash",
  );
  const [fulfillment, setFulfillment] = React.useState<"deliver" | "pickup">(
    "deliver",
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const subtotal = selectedProduct ? selectedProduct.price * quantity : 0;
  const tax = subtotal * 0.12;
  const total = subtotal + tax;

  const handleOpenOrder = (product: ShopProduct) => {
    setSelectedProduct(product);
    setQuantity(1);
    setPaymentMethod("cash");
    setFulfillment("deliver");
  };

  const handleSubmitOrder = async () => {
    if (!selectedProduct || isSubmitting) return;

    if (paymentMethod === "cash") {
      toast({
        title: "Order request submitted",
        description:
          "Your cash order request was recorded for review. Our team will contact you once approved.",
        variant: "success",
      });
      setSelectedProduct(null);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/shop/polar-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          quantity,
          fulfillment,
        }),
      });

      const data = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
      };

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error ?? "Unable to start checkout.");
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      toast({
        title: "Checkout unavailable",
        description:
          error instanceof Error
            ? error.message
            : "Please try again or contact the admin team.",
        variant: "error",
      });
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

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
            {products.map((product) => (
              <article
                key={product.name}
                className="rounded-md border border-zinc-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative mx-auto mb-4 aspect-square w-full max-w-28">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="112px"
                    className="object-contain"
                  />
                </div>
                <h3 className="min-h-10 text-sm font-semibold leading-tight text-zinc-900">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-zinc-700">
                  {formatPrice(product.price)}
                </p>
                <button
                  type="button"
                  onClick={() => handleOpenOrder(product)}
                  className="mt-3 inline-flex h-8 w-full items-center justify-center rounded bg-[#032a0d] px-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#064016]"
                >
                  Request Order
                </button>
              </article>
            ))}
          </div>

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
        <SheetContent className="w-full overflow-y-auto z-999 p-0 sm:max-w-md">
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
                      <Image
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        fill
                        sizes="80px"
                        className="object-contain"
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
                          onClick={() => setQuantity((current) => current + 1)}
                          className="flex items-center justify-center border-l border-zinc-200 hover:bg-zinc-100"
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
                    2. Payment Method
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
                </section>

                <section>
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-zinc-800">
                    3. Fulfillment Option
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
                  </div>
                </section>

                <section className="border-t border-zinc-200 pt-5">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-zinc-800">
                    4. Price Summary
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

                <button
                  type="button"
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded bg-[#032a0d] px-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-[#064016]"
                >
                  <Mail className="size-4" aria-hidden="true" />
                  {isSubmitting
                    ? "Preparing Checkout..."
                    : "Submit Order Request"}
                </button>
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
