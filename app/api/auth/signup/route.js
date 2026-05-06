import { users } from "@/lib/users";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const userExists = users.find((u) => u.email === email);
    if (userExists) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In a real app, this should be hashed
    };

    users.push(newUser);

    return NextResponse.json(
      { message: "User created successfully", user: { id: newUser.id, name, email } },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
