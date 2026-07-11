import { NextResponse } from "next/server";
import { Resend } from "resend";

// Resend ko API Key ke sath initialize karein
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Basic Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Resend email sending process
    const data = await resend.emails.send({
      // Free tier onboarding handler
      from: "ShopPeak Contact Form <onboarding@resend.dev>",
      // Direct notification inbox
      to: "kg1338426@gmail.com",
      // CRITICAL FIX: Changed replyTo to reply_to for Resend TypeScript strict rules
      reply_to: email,
      subject: `New Contact Form: ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #f97316; margin-bottom: 20px;">🔥 New Message from ShopPeak</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${message}</div>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <small style="color: #999;">Tip: Just click "Reply" in your email client to respond directly to the user.</small>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
