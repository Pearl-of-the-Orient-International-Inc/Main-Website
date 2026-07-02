"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import { Heart, ShieldCheck } from "lucide-react"
import { IconHeartFilled } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const amounts = [500, 1000, 2500, 5000, 10000]

type DonateDialogProps = {
  trigger?: ReactNode
}

export function DonateDialog({ trigger }: DonateDialogProps) {
  const { toast } = useToast()
  const [selectedAmount, setSelectedAmount] = useState<number | "custom">(500)
  const [customAmount, setCustomAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const displayAmount =
    selectedAmount === "custom" ? Number(customAmount || 0) : selectedAmount

  const handleDonate = async () => {
    if (isSubmitting) return

    if (!Number.isFinite(displayAmount) || displayAmount < 1) {
      toast({
        title: "Enter a donation amount",
        description: "Please choose or enter a valid amount before continuing.",
        variant: "error",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/donations/polar-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: displayAmount }),
      })

      const data = (await response.json()) as {
        checkoutUrl?: string
        error?: string
      }

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error ?? "Unable to start donation checkout.")
      }

      window.location.href = data.checkoutUrl
    } catch (error) {
      toast({
        title: "Donation checkout unavailable",
        description:
          error instanceof Error
            ? error.message
            : "Please try again or contact the admin team.",
        variant: "error",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            className="fixed bottom-4 right-4 z-40 h-11 rounded-full border border-emerald-900/20 bg-white px-4 text-[#032a0d] shadow-lg shadow-black/10 hover:bg-emerald-50"
            variant="outline"
          >
            <IconHeartFilled className="size-4 text-rose-600" />
            Donate Now
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[89vh]! max-w-lg! mt-8 overflow-y-auto p-0">
        <DialogHeader className="border-b px-5 py-4">
          <DialogTitle className="font-serif text-xl">
            Support Our Mission
          </DialogTitle>
          <p className="text-sm text-zinc-600">Choose a donation amount</p>
        </DialogHeader>

        <div className="space-y-5 px-5 py-5">
          <div className="grid grid-cols-3 gap-3">
            {amounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setSelectedAmount(amount)}
                className={cn(
                  "h-10 rounded-md border text-sm font-bold transition",
                  selectedAmount === amount
                    ? "border-[#032a0d] bg-[#032a0d] text-white"
                    : "border-zinc-200 bg-white text-zinc-950 hover:border-[#032a0d]/40",
                )}
              >
                ₱{amount.toLocaleString("en-PH")}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSelectedAmount("custom")}
              className={cn(
                "h-10 rounded-md border text-sm font-bold transition",
                selectedAmount === "custom"
                  ? "border-[#032a0d] bg-[#032a0d] text-white"
                  : "border-zinc-200 bg-white text-zinc-950 hover:border-[#032a0d]/40",
              )}
            >
              Any Amount
            </button>
          </div>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide">
              Enter Amount (₱)
            </span>
            <div className="mt-2 flex h-11 items-center rounded-md border border-zinc-200 bg-white px-3">
              <span className="text-sm font-semibold text-zinc-500">₱</span>
              <Input
                value={customAmount}
                onChange={(event) => {
                  setSelectedAmount("custom")
                  setCustomAmount(event.target.value.replace(/[^\d]/g, ""))
                }}
                placeholder="0.00"
                inputMode="numeric"
                className="border-0 shadow-none focus-visible:ring-0"
              />
            </div>
          </label>

          <div className="rounded-md bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-[#032a0d]">
            Every act of giving, no matter the size, makes a lasting impact.
          </div>

          <Button
            type="button"
            onClick={handleDonate}
            disabled={isSubmitting}
            className="h-11 w-full bg-[#032a0d] text-white hover:bg-[#064016]"
          >
            <Heart className="size-4" />
            {isSubmitting ? "Preparing Checkout..." : "Donate Now"}
          </Button>

          <p className="flex items-center justify-center gap-2 text-xs text-zinc-500">
            <ShieldCheck className="size-3.5" />
            Your donation is secure and encrypted
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
