import { NextResponse } from "next/server";
import db from "@/models";

export async function GET() {
  try {
    const users = await db.User.findAll({
      attributes: ["id", "name", "email"],
      include: [
        {
          model: db.Company,
          as: "Companies",
          attributes: ["id", "email"],
        },
      ],
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
