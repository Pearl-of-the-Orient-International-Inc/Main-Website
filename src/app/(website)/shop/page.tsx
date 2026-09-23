import Link from "next/link";

import ShopProducts from "./ShopProducts";
import type {
  PaymentFeePolicies,
  PaymentFeePoliciesResponse,
  PublicShopProductsResponse,
  PublicPaymentConfigurationResponse,
  ShopProduct,
} from "./products";

const apiBaseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_API_BASE_URL_DEV
    : process.env.NEXT_PUBLIC_API_BASE_URL_PROD;

async function getPublicProducts(): Promise<ShopProduct[]> {
  if (!apiBaseUrl) return [];

  try {
    const response = await fetch(`${apiBaseUrl}/chaplain-products/public`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return [];
    const payload = (await response.json()) as PublicShopProductsResponse;
    return payload.data;
  } catch {
    return [];
  }
}

async function getPaymentConfiguration() {
  if (!apiBaseUrl) return { paypalClientId: null };
  try {
    const response = await fetch(`${apiBaseUrl}/payments/public/config`, { next: { revalidate: 300 } });
    if (!response.ok) return { paypalClientId: null };
    const payload = (await response.json()) as PublicPaymentConfigurationResponse;
    return payload.data;
  } catch {
    return { paypalClientId: null };
  }
}

async function getPaymentFeePolicies(): Promise<PaymentFeePolicies> {
  const fallback = {
    XENDIT: { percent: 3.5, fixed: 11 },
    PAYPAL: { percent: 4.4, fixed: 15 },
  };
  if (!apiBaseUrl) return fallback;
  try {
    const response = await fetch(`${apiBaseUrl}/payments/public/fees`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return fallback;
    const payload = (await response.json()) as PaymentFeePoliciesResponse;
    return payload.data;
  } catch {
    return fallback;
  }
}

const Page = async () => {
  const [products, paymentFeePolicies, paymentConfiguration] = await Promise.all([
    getPublicProducts(),
    getPaymentFeePolicies(),
    getPaymentConfiguration(),
  ]);
  return (
    <div>
      {/* Hero / Banner */}
      <section className="relative bg-[#032a0d] text-white">
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[url('https://applyarchershub.dlsu.edu.ph/UpdatedAssets/SCSS/ApplicationLandingPage/images/hero-bg.png')] bg-cover bg-center opacity-40" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16 mt-10">
          <p className="text-xs sm:text-sm text-white/70 mb-2">
            <Link href="/">Home</Link>{" "}
            <span className="mx-1 sm:mx-2 text-white/50">/</span>{" "}
            <span className="font-medium text-white">Chaplain Products</span>
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wide">
            Chaplain Products
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-white/80 leading-relaxed">
            Official chaplain pins, patches, accessories, and apparel are
            available for Pearl of the Orient chaplain members and officers who
            wish to avail items for identification, ministry service,
            ceremonies, and official activities.
          </p>
        </div>
      </section>

      <ShopProducts
        products={products}
        paymentFeePolicies={paymentFeePolicies}
        paypalClientId={paymentConfiguration.paypalClientId}
      />
    </div>
  );
};

export default Page;
