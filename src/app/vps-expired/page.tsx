/* eslint-disable @next/next/no-img-element */
export const metadata = {
  title: "VPS subscription expired",
};

export default function VpsExpiredPage() {
  return (
    <main className="min-h-screen bg-[#F3F3F9] user-select-none cursor-not-allowed">
      <img
        src="/mock-expired.png"
        alt="VPS subscription expired"
        className="h-screen w-full object-contain pointer-events-none"
      />
    </main>
  );
}
