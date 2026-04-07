import nodemailer from "nodemailer";

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user || "noreply@example.com";

  if (!host || !user || !pass) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMTP_HOST, SMTP_USER, and SMTP_PASS are required in production");
    }
    // In development, use Ethereal (nodemailer test account) or log to console
    console.warn("[email] SMTP env vars not set — emails will be logged to console only");
    return null;
  }

  return { transporter: nodemailer.createTransport({ host, port, auth: { user, pass } }), from };
}

export async function sendVerificationEmail(to: string, verificationUrl: string): Promise<void> {
  const config = createTransporter();

  if (!config) {
    console.log(`[email] Verification email to ${to}:`);
    console.log(`[email] Verification URL: ${verificationUrl}`);
    return;
  }

  const { transporter, from } = config;

  await transporter.sendMail({
    from,
    to,
    subject: "Verify your email — Sintu",
    text: `Click the link below to verify your email address:\n\n${verificationUrl}\n\nThis link expires in 24 hours.\n\nIf you did not register for Sintu, you can ignore this email.`,
    html: `
      <p>Thank you for registering with Sintu!</p>
      <p>Click the button below to verify your email address:</p>
      <p style="margin:24px 0">
        <a href="${verificationUrl}" style="background:#4f46e5;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block">
          Verify Email
        </a>
      </p>
      <p>Or copy and paste this link into your browser:<br/><a href="${verificationUrl}">${verificationUrl}</a></p>
      <p style="color:#888;font-size:12px">This link expires in 24 hours. If you did not register for Sintu, you can ignore this email.</p>
    `,
  });
}
