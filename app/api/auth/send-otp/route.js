import db from "@/models";
const { User } = db;
import { sendOTPEmail } from "@/lib/mailer";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { email: rawEmail } = await req.json();
    const email = rawEmail?.toLowerCase();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    console.log(`[DEBUG] Attempting to send OTP for: ${email}`);

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const user = await User.findOne({ where: { email } });

    // SECURITY: If user doesn't exist, we still return success to prevent user discovery
    if (user) {
      console.log(`[DEBUG] User found. Generating OTP...`);
      // Basic rate limiting/cooldown: Check if OTP was sent in the last 60 seconds
      if (user.otpExpiry && (user.otpExpiry.getTime() - Date.now() > 4 * 60 * 1000)) {
        return NextResponse.json({ 
          message: "Please wait a moment before requesting another OTP." 
        }, { status: 429 });
      }

      await user.update({
        otp,
        otpExpiry
      });

      // Send Email
      await sendOTPEmail(email, otp);
    } else {
       console.log(`[DEBUG] User NOT found in database: ${email}`);
       // Mock delay to prevent timing attacks
       await new Promise(resolve => setTimeout(resolve, 500));
    }

    return NextResponse.json({ 
      message: "If an account with that email exists, we have sent an OTP for password reset." 
    }, { status: 200 });

  } catch (error) {
    console.error("SEND_OTP_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
