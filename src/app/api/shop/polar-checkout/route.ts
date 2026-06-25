import { NextResponse, type NextRequest } from "next/server"

import { findProduct } from "@/app/(website)/shop/products"

type CheckoutRequest = {
  productId?: unknown
  quantity?: unknown
  fulfillment?: unknown
}

const getBaseUrl = (request: NextRequest) => {
  const configuredUrl = process.env.NEXT_PUBLIC_WEBSITE_URL
  if (configuredUrl) return configuredUrl.replace(/\/$/, "")

  const host = request.headers.get("host")
  const protocol = host?.startsWith("localhost") ? "http" : "https"
  return host ? `${protocol}://${host}` : "http://localhost:3000"
}

export async function POST(request: NextRequest) {
  const accessToken = process.env.POLAR_ACCESS_TOKEN
  const polarProductId = process.env.POLAR_SHOP_PRODUCT_ID

  if (!accessToken || !polarProductId) {
    return NextResponse.json(
      {
        error:
          "Polar checkout is not configured. Add POLAR_ACCESS_TOKEN and POLAR_SHOP_PRODUCT_ID.",
      },
      { status: 500 },
    )
  }

  const body = (await request.json()) as CheckoutRequest
  const productId = typeof body.productId === "string" ? body.productId : ""
  const product = findProduct(productId)
  const quantity = Number(body.quantity)
  const fulfillment = body.fulfillment === "pickup" ? "pickup" : "deliver"

  if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    return NextResponse.json(
      { error: "Invalid checkout request." },
      { status: 400 },
    )
  }

  const baseUrl = getBaseUrl(request)
  const subtotal = product.price * quantity
  const tax = subtotal * 0.12
  const total = subtotal + tax
  const amountInCents = Math.round(total * 100)
  const apiBase =
    process.env.POLAR_ENVIRONMENT === "production"
      ? "https://api.polar.sh"
      : "https://sandbox-api.polar.sh"

  const response = await fetch(`${apiBase}/v1/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      products: [polarProductId],
      amount: amountInCents,
      currency: "php",
      success_url: `${baseUrl}/shop?checkout=success&checkout_id={CHECKOUT_ID}`,
      return_url: `${baseUrl}/shop`,
      metadata: {
        source: "shop",
        product_id: product.id,
        product_name: product.name,
        quantity,
        fulfillment,
        subtotal,
        tax,
        total,
      },
    }),
  })

  const data = (await response.json()) as { url?: string; detail?: string }

  if (!response.ok || !data.url) {
    return NextResponse.json(
      {
        error:
          data.detail ??
          "Polar could not create a checkout session. Check your token and product setup.",
      },
      { status: response.ok ? 500 : response.status },
    )
  }

  return NextResponse.json({ checkoutUrl: data.url })
}
