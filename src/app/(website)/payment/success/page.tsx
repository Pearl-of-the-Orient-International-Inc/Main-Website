import { PaymentResult } from "../_components/PaymentResult";

export default async function PaymentSuccessPage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const { reference } = await searchParams;
  return <PaymentResult mode="success" reference={reference} />;
}
