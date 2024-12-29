import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
const dotenv = require("dotenv");
dotenv.config();

const SECRET_KEY: string = process.env.signKey || "someSpecialSuperUser";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

interface DecodedToken {
  userId: string;
}

//-------------------------------- Authentication User Based On JWT Token --------------------------------
module.exports = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.get("authorization");
  if (!authHeader) {
    throw new Error("Not Authorized");
  }
  const token = authHeader.split(" ")[1];
  let decodedToken: DecodedToken | string;
  try {
    decodedToken = jwt.verify(token, SECRET_KEY) as DecodedToken;
  } catch (err) {
    throw new Error("User not found or session expired.\nPlease log in again.");
  }
  if (!decodedToken) throw new Error("not Authorized user");
  req.userId = decodedToken.userId?.toString();
  next();
};
