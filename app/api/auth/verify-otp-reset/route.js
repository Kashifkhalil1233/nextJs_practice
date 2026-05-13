import db from "@/models";
const { User } = db;
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { Op } from "sequelize";

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ 
        message: "Email, OTP, and new password are required" 
      }, { status: 400 });
    }

    const user = await User.findOne({ 
      where: { 
        email,
        otp,
        otpExpiry: {
          [Op.gt]: new Date() // Must be greater than current time
        }
      } 
    });

    if (!user) {
      return NextResponse.json({ 
        message: "Invalid or expired OTP" 
      }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user and clear OTP fields
    await user.update({
      password: hashedPassword,
      otp: null,
      otpExpiry: null
    });

    return NextResponse.json({ 
      message: "Password has been reset successfully. You can now login with your new password." 
    }, { status: 200 });

  } catch (error) {
    console.error("VERIFY_OTP_ERROR:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
