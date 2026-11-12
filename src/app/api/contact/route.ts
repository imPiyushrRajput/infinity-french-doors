import { NextResponse } from "next/server";

// Receives enquiries from the contact form.
// Wire this to an email provider (Resend, SendGrid, Nodemailer with SMTP) or a CRM.
// For now it validates the payload and logs it on the server.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const required = ["firstName", "lastName", "email", "phone", "message"];
  const missing = required.filter((k) => !String(body[k] ?? "").trim());
  if (missing.length) {
    return NextResponse.json({ ok: false, error: `Missing: ${missing.join(", ")}` }, { status: 400 });
  }

  const { utm, page, ...fields } = body as Record<string, unknown>;
  console.log("[enquiry]", new Date().toISOString(), { ...fields, page, utm });
  return NextResponse.json({ ok: true });
}
