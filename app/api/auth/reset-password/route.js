import db from "@/models";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { where } from "sequelize";
const { User } = db;

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      NextResponse.json(
        {
          message: "Email,otp and newPassword are required",
        },
        {
          status: "400",
        },
      );
    }

    const user = await User.findOne({
      where: {
        email,
        otp,
      },
    });

    if (!user) {
      NextResponse.json({ message: "Invalid request" }, { status: "400" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashedPassword,
      opt: null,
      otpExpiry: null,
    });

    return NextResponse.json({ message: "Password Resent Successful" });
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
