import db from "@/models";
const { User } = db;
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();
  
    if(!email || !password){
      return NextResponse.json({
    
          message: !email ? "email is equired" :"password is required"
      
      },{status:400})
    }
    const user = await User.findOne({ 
      where: { email },
      include: [{ 
        model: db.Company,
        through: { attributes: [] } 
      }]
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email   },
      "secretkey",
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "Login success",
      token,
      user,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}