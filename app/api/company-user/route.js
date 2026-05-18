import db from "@/models";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    const { userId, companyId } = await req.json();

    if (!userId || !companyId) {
      return NextResponse.json(
        { message: "userId and companyId are required" },
        { status: 400 },
      );
    }

    const { User, Company } = db;

    const company = await Company.findByPk(companyId);

    if (!company) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 },
      );
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await company.removeUser(user);

    return NextResponse.json({
      message: "User removed from company successfully",
    });
  } catch (error) {
    console.error("DELETE Error:", error);

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { companyId, userIds } = await req.json();

    if (!companyId || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { message: "companyId and at least one userId are required" },
        { status: 400 },
      );
    }

    const { Company, User } = db;

    const company = await Company.findByPk(companyId);

    if (!company) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 },
      );
    }

    const users = await User.findAll({
      where: {
        id: userIds,
      },
    });

    if (users.length === 0) {
      return NextResponse.json(
        { message: "No valid users found" },
        { status: 404 },
      );
    }

    await company.addUsers(users);

    return NextResponse.json({
      message: "Users added successfully",
    });
  } catch (error) {
    console.error("POST Error:", error);

    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
