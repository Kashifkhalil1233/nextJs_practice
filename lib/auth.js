import jwt from "jsonwebtoken";
import db from "@/models";

const SECRET = process.env.JWT_SECRET || "secretkey";

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  const user = await db.User.findByPk(decoded.id, {
    attributes: ["id", "name", "email", "role"],
  });

  return user;
}
