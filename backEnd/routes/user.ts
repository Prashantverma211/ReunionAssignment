import express, { Request, Response, NextFunction } from "express";
import { check, body } from "express-validator";
const isAuth = require("../middlewares/is-auth");
const taskController = require("../controllers/user");
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

//-------------------------------- Validation Rules --------------------------------
const validateTaskDetails = [
  body("title")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long."),
  body("startingDate")
    .isISO8601()
    .toDate()
    .withMessage("Starting date must be a valid date in ISO8601 format."),
  body("endingDate")
    .isISO8601()
    .toDate()
    .withMessage("Ending date must be a valid date in ISO8601 format.")
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startingDate)) {
        throw new Error("Ending date must be after the starting date.");
      }
      return true;
    }),
  body("priority")
    .isInt({ min: 1, max: 5 })
    .withMessage("Priority must be a number between 1 and 5."),
  body("taskStatus")
    .isIn(["pending", "completed"])
    .withMessage("Task status must be either 'pending' or 'completed'."),
];

//-------------------------------- Get All Tasks --------------------------------
router.get("/getTasks", isAuth, taskController.getAllTask);

//-------------------------------- Add Task --------------------------------
router.post("/addTask", isAuth, validateTaskDetails, taskController.addTask);

//-------------------------------- Edit Task --------------------------------
router.patch(
  "/editTask/:taskId",
  isAuth,
  validateTaskDetails,
  taskController.editTask
);

//-------------------------------- Remove one Task --------------------------------
router.delete("/removeTask/:taskId", isAuth, taskController.deleteTask);

//-------------------------------- Delete Tasks --------------------------------
router.delete("/deleteTasks", isAuth, taskController.deleteTasks);

export default router;
