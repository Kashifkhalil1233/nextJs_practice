import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return NextResponse.json({ message: "User exists" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    return NextResponse.json({
      message: "User created",
      user,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}