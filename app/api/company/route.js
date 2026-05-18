import { NextResponse } from "next/server";
import db from "@/models";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const companies = await db.Company.findAll({
      include: [
        {
          model: db.User,
          as: "Users",
          attributes: ["id", "name", "email"],
          through: { attributes: [] },
        },
        {
          model: db.User,
          as: "owner",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    console.log("compnay detail:", JSON.stringify(companies));
    return NextResponse.json(companies);
  } catch (error) {
    // console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.role !== "admin") {
      return NextResponse.json(
        {
          error: "Only admin can register company",
        },
        { status: 403 },
      );
    }
    const { name, email, location, users } = await request.json();

    if (!name || !email || !location) {
      return NextResponse.json(
        { error: "Name , email and location are required" },
        { status: 400 },
      );
    }

    const company = await db.Company.create({
      name,
      email,
      location,
      createdBy: currentUser.id,
    });

    if (users && users.length > 0) {
      await company.setUsers(users);
    }

    return NextResponse.json(
      {
        message: "Company created successfully",
        company,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating company:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return NextResponse.json(
        { error: "Company email already exists" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Failed to create company" },
      { status: 500 },
    );
  }
}
