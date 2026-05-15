// app/api/auth/login/route.js

import db from "@/models";
const { User } = db;
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          message: !email ? "Email is required" : "Password is required",
        },
        { status: 400 },
      );
    }

    const user = await User.findOne({
      where: { email },
      attributes: ["id", "name", "email", "password", "role"],
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 },
      );
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      message: "Login success",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
