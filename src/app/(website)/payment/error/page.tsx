import { PaymentResult } from "../_components/PaymentResult";

export default async function PaymentErrorPage({ searchParams }: { searchParams: Promise<{ reference?: string; reason?: string }> }) {
  const { reference, reason } = await searchParams;
  return <PaymentResult mode="error" reference={reference} reason={reason} />;
}
