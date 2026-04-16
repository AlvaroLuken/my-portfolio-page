import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

function clean(value: string | undefined) {
  return (value ?? "").trim();
}

export async function POST(request: Request) {
  const body = (await request.json()) as ContactPayload;
  const name = clean(body.name);
  const email = clean(body.email);
  const subject = clean(body.subject) || "Portfolio inquiry";
  const message = clean(body.message);

  if (!name || !email || !message) {
    return NextResponse.json(
      { message: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const host = process.env.SMTP_HOST ?? (resendApiKey ? "smtp.resend.com" : undefined);
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER ?? (resendApiKey ? "resend" : undefined);
  const pass = process.env.SMTP_PASS ?? resendApiKey;
  const to = "alvluken@gmail.com";
  const from =
    process.env.RESEND_FROM_EMAIL ??
    process.env.CONTACT_FROM_EMAIL ??
    "onboarding@resend.dev";

  if (!host || !user || !pass) {
    return NextResponse.json(
      {
        message:
          "Server email is not configured. Set RESEND_API_KEY or SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.",
      },
      { status: 500 },
    );
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <h2>New portfolio contact</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] Failed to send SMTP email.", error);
    return NextResponse.json({ message: "Unable to send email right now." }, { status: 500 });
  }
}
