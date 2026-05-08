import db from "@/models";
const { User } = db;
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
if (!name || !email || !password) {
  const message =
    !name
      ? "Name is required"
      : !email
      ? "Email is required"
      : "Password is required";

  return NextResponse.json(
    { message },
    { status: 400 }
  );
}
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return NextResponse.json({ message: "User exists" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: 'user', 
    });

    return NextResponse.json({
      message: "User created",
      user,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}