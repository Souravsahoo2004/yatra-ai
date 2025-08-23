import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER, // always your account
      to: process.env.SMTP_USER,   // your inbox
      subject: `New Contact Form Message`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br/>${message}</p>`,
    });

    return NextResponse.json({ success: true, message: "Message sent!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to send" }, { status: 500 });
  }
}
