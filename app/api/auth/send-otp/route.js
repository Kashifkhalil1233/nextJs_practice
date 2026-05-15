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

    // console.log(`[DEBUG] Attempting to send OTP for: ${email}`);

   
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    const user = await User.findOne({ where: { email } });

  
    if (user) {
      console.log(`[DEBUG] User found. Generating OTP...`);
   
      if (user.otpExpiry && (user.otpExpiry.getTime() - Date.now() > 4 * 60 * 1000)) {
        return NextResponse.json({ 
          message: "Please wait a moment before requesting another OTP." 
        }, { status: 429 });
      }

      await user.update({
        otp,
        otpExpiry
      });

     
      await sendOTPEmail(email, otp);
    } else {
       console.log(`[DEBUG] User NOT found in database: ${email}`);
      
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
