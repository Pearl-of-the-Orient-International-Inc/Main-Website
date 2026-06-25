import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";

interface FeeBreakdownItem {
  label: string;
  amount: string;
  note?: string;
}

interface OutstandingBalanceEmailProps {
  customerName?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  outstandingAmount?: string;
  companyName?: string;
  companyEmail?: string;
  companyPhone?: string;
  paymentLink?: string;
  logoUrl?: string;
  feeBreakdown?: FeeBreakdownItem[];
  totalAmount?: string;
  reminderNumber?: number;
}

const defaultFeeBreakdown: FeeBreakdownItem[] = [
  {
    label: "Tuition Fee",
    amount: "₱2,000.00",
  },
  {
    label: "School Uniform",
    amount: "₱900.00",
  },
  {
    label: "Technology Subscription",
    amount: "₱100.00",
  },
];

const brand = {
  primary: "#032A0D",
  gold: "#C9A84C",
  goldBg: "#fdf8ec",
  white: "#ffffff",
  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray700: "#374151",
  gray900: "#111827",
};

export const OutstandingBalanceEmail = ({
  customerName = "Kyle Andre Lim",
  invoiceNumber = "INV-2026-0001",
  invoiceDate = "June 17, 2026",
  outstandingAmount = "₱3,000.00",
  companyName = "Pearl of the Orient International Auxiliary Chaplain Values Educators Inc.",
  companyEmail = "poile2005official@gmail.com",
  companyPhone = "(+63) 919-458-9099",
  paymentLink = "https://pearlchaplaincy.org.com/pay/INV-2026-0001",
  logoUrl = "https://pearlchaplaincy.org/_next/image?url=%2Fmain%2Flogo.png&w=256&q=75",
  feeBreakdown = defaultFeeBreakdown,
  totalAmount = "₱3,000.00",
  reminderNumber = 1,
}: OutstandingBalanceEmailProps) => {
  const reminderConfig = {
    1: {
      label: "PAYMENT REMINDER",
      badgeColor: brand.gold,
      badgeBg: brand.goldBg,
      badgeText: brand.primary,
      accentBar: brand.gold,
      previewText: `Friendly reminder: Invoice ${invoiceNumber} for ${outstandingAmount} is outstanding.`,
      message: `We hope this message finds you well. This is a friendly reminder that the following balance remains outstanding on your account. If you have already settled this, please disregard this notice — and thank you!`,
    },
    2: {
      label: "SECOND REMINDER",
      badgeColor: "#b45309",
      badgeBg: "#fffbeb",
      badgeText: "#78350f",
      accentBar: "#d97706",
      previewText: `Invoice ${invoiceNumber} for ${outstandingAmount} is still unpaid. Please settle at your earliest convenience.`,
      message: `We noticed that invoice ${invoiceNumber} remains unpaid. We kindly ask that you arrange payment as soon as possible to avoid any further charges or interruptions to your account.`,
    },
    3: {
      label: "FINAL NOTICE",
      badgeColor: "#b91c1c",
      badgeBg: "#fef2f2",
      badgeText: "#7f1d1d",
      accentBar: "#dc2626",
      previewText: `FINAL NOTICE: Invoice ${invoiceNumber} for ${outstandingAmount} requires immediate attention.`,
      message: `This is a final notice regarding the outstanding balance on invoice ${invoiceNumber}. Immediate payment is required to prevent account suspension. If you believe this is an error or wish to discuss a payment arrangement, please contact us right away.`,
    },
  };

  const config =
    reminderConfig[reminderNumber as keyof typeof reminderConfig] ||
    reminderConfig[1];

  return (
    <Html>
      <Head />
      <Preview>{config.previewText}</Preview>
      <Tailwind>
        <Body
          style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            margin: 0,
            padding: 0,
          }}
        >
          <Container
            style={{
              maxWidth: "620px",
              margin: "32px auto",
              padding: "0 16px",
            }}
          >
            {/* ── Header ── */}
            <Section>
              <Row>
                <Column>
                  <Row>
                    <Column style={{ width: "48px", verticalAlign: "middle" }}>
                      <Img
                        src={logoUrl}
                        width="60"
                        height="60"
                        alt="Pearl of the Orient Seal"
                        style={{ borderRadius: "50%", display: "block" }}
                      />
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Section>

            {/* ── Body ── */}
            <Section
              style={{ border: "1px solid #dedede", borderRadius: "5px", padding: "36px 36px 0", marginTop: "20px" }}
            >
              <Heading
                style={{
                  fontSize: "21px",
                  fontWeight: "700",
                  color: brand.gray900,
                  margin: "0 0 8px",
                  letterSpacing: "-0.3px",
                }}
              >
                Hi, {customerName}!
              </Heading>
              <Text
                style={{
                  fontSize: "14px",
                  color: brand.gray500,
                  lineHeight: "1.65",
                  margin: "0 0 28px",
                }}
              >
                {config.message}
              </Text>

              {/* Outstanding Balance Card */}
              <Section
                style={{
                  border: `1.5px solid ${brand.gray200}`,
                  borderLeft: `4px solid ${brand.primary}`,
                  padding: "20px 24px",
                  marginBottom: "28px",
                }}
              >
                <Row>
                  <Column>
                    <Text
                      style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        color: brand.gray400,
                        textTransform: "uppercase",
                        margin: "0 0 4px",
                      }}
                    >
                      Total Outstanding Balance
                    </Text>
                    <Text
                      style={{
                        fontSize: "34px",
                        fontWeight: "800",
                        color: brand.primary,
                        margin: 0,
                        lineHeight: "1",
                      }}
                    >
                      {outstandingAmount}
                    </Text>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: brand.gray400,
                        margin: "6px 0 0",
                      }}
                    >
                      Philippine Peso (PHP)
                    </Text>
                  </Column>
                  <Column align="right" style={{ verticalAlign: "top" }}>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: brand.gray500,
                        margin: "0 0 4px",
                      }}
                    >
                      <span style={{ fontWeight: 600, color: brand.gray700 }}>
                        Invoice No:
                      </span>{" "}
                      {invoiceNumber}
                    </Text>
                    <Text
                      style={{
                        fontSize: "12px",
                        color: brand.gray500,
                        margin: 0,
                      }}
                    >
                      <span style={{ fontWeight: 600, color: brand.gray700 }}>
                        Date Issued:
                      </span>{" "}
                      {invoiceDate}
                    </Text>
                  </Column>
                </Row>
              </Section>

              {/* Fee Breakdown Label */}
              <Text
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  color: brand.gray400,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  margin: "0 0 10px",
                }}
              >
                Fee Breakdown
              </Text>

              {/* Breakdown Items */}
              {feeBreakdown.map((item, index) => (
                <Row
                  key={index}
                  style={{
                    borderBottom:
                      index === feeBreakdown.length - 1
                        ? "none"
                        : `1px solid ${brand.gray100}`,
                    paddingTop: "12px",
                    paddingBottom: "12px",
                  }}
                >
                  <Column>
                    <Text
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: brand.gray700,
                        margin: 0,
                      }}
                    >
                      {item.label}
                    </Text>
                    {item.note && (
                      <Text
                        style={{
                          fontSize: "11px",
                          color: brand.gray400,
                          margin: "2px 0 0",
                        }}
                      >
                        {item.note}
                      </Text>
                    )}
                  </Column>
                  <Column align="right" style={{ verticalAlign: "middle" }}>
                    <Text
                      style={{
                        fontSize: "13px",
                        fontWeight: "700",
                        color: brand.gray700,
                        margin: 0,
                      }}
                    >
                      {item.amount}
                    </Text>
                  </Column>
                </Row>
              ))}

              {/* Total Row */}
              <Hr
                style={{
                  borderColor: "#dedede",
                  borderWidth: "1.5px",
                  margin: "12px 0",
                }}
              />
              <Row style={{ paddingBottom: "28px" }}>
                <Column>
                  <Text
                    style={{
                      fontSize: "15px",
                      fontWeight: "700",
                      color: brand.primary,
                      margin: 0,
                    }}
                  >
                    Total Amount Due
                  </Text>
                </Column>
                <Column align="right">
                  <Text
                    style={{
                      fontSize: "15px",
                      fontWeight: "800",
                      color: brand.primary,
                      margin: 0,
                    }}
                  >
                    {totalAmount}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* ── CTA ── */}
            <Section
              style={{ backgroundColor: brand.white, marginTop: "20px" }}
            >
              <Button
                href={paymentLink}
                style={{
                  backgroundColor: brand.primary,
                  color: brand.white,
                  fontSize: "14px",
                  fontWeight: "700",
                  padding: "14px 32px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Pay Now →
              </Button>
              <Text
                style={{
                  fontSize: "12px",
                  color: brand.gray400,
                  marginTop: "12px",
                }}
              >
                Or copy this payment link:{" "}
                <a
                  href={paymentLink}
                  style={{
                    color: brand.primary,
                    textDecoration: "underline",
                    wordBreak: "break-all",
                  }}
                >
                  {paymentLink}
                </a>
              </Text>
            </Section>

            {/* ── Divider ── */}
            <Section
              style={{ backgroundColor: brand.white, }}
            >
              <Hr style={{ borderColor: brand.gray200 }} />
            </Section>

            {/* ── Footer ── */}
            <Section
              style={{
                backgroundColor: brand.white,
                marginTop: "20px",
              }}
            >
              <Text
                style={{
                  fontSize: "13px",
                  color: brand.gray500,
                  lineHeight: "1.6",
                  margin: "0 0 10px",
                }}
              >
                Have questions about this invoice? Contact us at{" "}
                <a
                  href={`mailto:${companyEmail}`}
                  style={{ color: brand.primary, fontWeight: 600 }}
                >
                  {companyEmail}
                </a>{" "}
                or call <span style={{ fontWeight: 600 }}>{companyPhone}</span>.
              </Text>
              <Text
                style={{ fontSize: "11px", color: brand.gray400, margin: 0 }}
              >
                © {new Date().getFullYear()} {companyName}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OutstandingBalanceEmail;
