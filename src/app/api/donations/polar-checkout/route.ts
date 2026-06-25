import { NextResponse, type NextRequest } from "next/server"

type DonationCheckoutRequest = {
  amount?: unknown
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
  const polarProductId = process.env.POLAR_DONATION_PRODUCT_ID

  if (!accessToken || !polarProductId) {
    return NextResponse.json(
      {
        error:
          "Polar donation checkout is not configured. Add POLAR_ACCESS_TOKEN and POLAR_DONATION_PRODUCT_ID.",
      },
      { status: 500 },
    )
  }

  const body = (await request.json()) as DonationCheckoutRequest
  const amount = Number(body.amount)

  if (!Number.isFinite(amount) || amount < 1 || amount > 1_000_000) {
    return NextResponse.json(
      { error: "Enter a valid donation amount." },
      { status: 400 },
    )
  }

  const baseUrl = getBaseUrl(request)
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
      amount: Math.round(amount * 100),
      currency: "php",
      success_url: `${baseUrl}/?donation=success&checkout_id={CHECKOUT_ID}`,
      return_url: baseUrl,
      metadata: {
        source: "donation",
        amount,
      },
    }),
  })

  const data = (await response.json()) as { url?: string; detail?: string }

  if (!response.ok || !data.url) {
    return NextResponse.json(
      {
        error:
          data.detail ??
          "Polar could not create a donation checkout. Check your token and donation product setup.",
      },
      { status: response.ok ? 500 : response.status },
    )
  }

  return NextResponse.json({ checkoutUrl: data.url })
}
