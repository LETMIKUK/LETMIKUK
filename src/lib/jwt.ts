import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export const createToken = (userId: string, role?: string) => {
  if (!SECRET_KEY) {
    throw new Error("JWT SECRET KEY is missing");
  }
  const payload = role ? { userId, role } : { userId };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
};

// Function to verify the token and return the decoded payload
export const verifyToken = (token: string) => {
  if (!SECRET_KEY) {
    throw new Error("JWT SECRET KEY is missing");
  }

  try {
    // Verify the token and decode the payload
    const decoded = jwt.verify(token, SECRET_KEY);
    // Since `decoded` is of type `string | jwt.JwtPayload`, cast to `jwt.JwtPayload` to access claims
    return decoded as jwt.JwtPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
