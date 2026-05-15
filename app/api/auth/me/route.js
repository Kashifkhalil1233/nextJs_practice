// app/api/auth/me/route.js

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import db from "@/models";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 },
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const user = await db.User.findByPk(decoded.id, {
      attributes: ["id", "name", "email", "role"],
      include: [
        {
          model: db.Company,
          as: "Companies",
          attributes: ["id", "name", "email", "location"],
          through: { attributes: [] },
          include: [
            {
              model: db.User,
              as: "owner",
              attributes: ["id", "name", "email"],
            },
          ],
        },
      ],
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user,
    });
  } catch (error) {
    console.error("ME API Error:", error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
