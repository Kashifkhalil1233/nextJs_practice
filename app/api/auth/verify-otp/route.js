import db from "@/models";
const { User } = db;
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { Op } from "sequelize";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        {
          message: "Email and OTP are required",
        },
        { status: 400 },
      );
    }

    const user = await User.findOne({
      where: {
        email,
        otp,
        otpExpiry: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "Invalid or expired OTP",
        },
        { status: 400 },
      );
    }

    // const hashedPassword = await bcrypt.hash(newPassword, 10);

    // await user.update({
    //   password: hashedPassword,
    //   otp: null,
    //   otpExpiry: null,
    // });

    return NextResponse.json(
      {
        message: "OPT Verify successfully.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("VERIFY_OTP_ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
