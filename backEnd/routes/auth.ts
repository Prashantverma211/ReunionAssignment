import express, { Request, Response, NextFunction } from "express";
import { check, body } from "express-validator";
import dotenv from "dotenv";
import User from "../models/user";
const authController = require("../controllers/auth");

dotenv.config();

const router = express.Router();

//-------------------------------- SignUp --------------------------------
router.post(
  "/signup",
  [
    body(
      "username",
      "username cannot be empty and must be at least 10 characters long"
    )
      .trim()
      .isLength({ min: 10 })
      .custom(async function (value) {
        const isUser = await User.findOne({ username: value });
        if (isUser) {
          throw new Error(`User ${value} is already Existed`);
        }
        return true;
      }),
    body("password", "Password must be 5 characters long.")
      .trim()
      .isLength({ min: 5 }),
    body("confirmPassword", "Password can't match")
      .trim()
      .custom((value: string, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password can't match");
        }
        return true;
      }),
  ],
  authController.signup
);

//-------------------------------- Login --------------------------------
router.post(
  "/login",
  [
    body("username", "username can't be empty").trim().notEmpty(),
    body("password", "password can't be empty").trim().notEmpty(),
  ],
  authController.login
);

export default router;
