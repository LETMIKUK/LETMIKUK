import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export const createToken = (userId: string, role: string) => {
  if (!SECRET_KEY) {
    throw "JWT SECRET KEY is missing";
  }
  const payload = { userId, role };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
};
