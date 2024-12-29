import { NextFunction, Response, Request } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import User from "../models/user";
import Task from "../models/task";

interface CustomError extends Error {
  code?: number;
  data?: any;
}

interface CustomRequest extends Request {
  userId?: string;
}

enum Priority {
  Low = 1,
  MediumLow,
  Medium,
  MediumHigh,
  High,
}

enum TaskStatus {
  Pending = "pending",
  Completed = "completed",
}

interface Task {
  title: string;
  startingDate: Date;
  endingDate: Date;
  priority: Priority;
  taskStatus: TaskStatus;
}

const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

//-------------------------------- Get All Tasks --------------------------------
exports.getAllTask = async function (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const errors = validationResult(req);

    console.log(errors);

    if (!errors.isEmpty()) {
      const error: CustomError = new Error(errors.array()[0].msg);
      error.code = 422;
      error.data = errors.array();
      throw error;
    }

    const userId = req.userId;

    const isUser = await User.findById(userId);

    if (!isUser) {
      throw new Error("User not found");
    }

    const tasks = await Task.find({ userId });
    res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

//-------------------------------- Add Task --------------------------------
exports.addTask = async function (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const errors = validationResult(req);

    console.log(errors);

    if (!errors.isEmpty()) {
      const error: CustomError = new Error(errors.array()[0].msg);
      error.code = 422;
      error.data = errors.array();
      throw error;
    }

    const { title, startingDate, endingDate, priority, taskStatus } = req.body;
    const userId = req.userId;

    const isUser = await User.findById(userId);

    if (!isUser) {
      throw new Error("User not found");
    }

    const task = new Task({
      title,
      startingDate,
      endingDate,
      priority,
      taskStatus,
      userId,
    });

    await task.save();

    res.status(200).json({
      message: "Task saved successfully",
      taskId: task._id,
    });
  } catch (error) {
    next(error);
  }
};

//-------------------------------- Edit Task --------------------------------
exports.editTask = async function (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const errors = validationResult(req);

    console.log(errors);

    if (!errors.isEmpty()) {
      const error: CustomError = new Error(errors.array()[0].msg);
      error.code = 422;
      error.data = errors.array();
      throw error;
    }

    const userId = req.userId;

    const isUser = await User.findById(userId);

    if (!isUser) {
      throw new Error("User not found");
    }
    const taskId = req.params.taskId;
    if (!isValidObjectId(taskId)) {
      throw new Error("Not a valid task id");
    }
    console.log(taskId);
    const { title, startingDate, endingDate, priority, taskStatus } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    task.title = title;
    task.startingDate = startingDate;
    task.endingDate = endingDate;
    task.priority = priority;
    task.taskStatus = taskStatus;

    await task.save();

    res.status(200).json({
      message: "Task Updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

//-------------------------------- Delete Task --------------------------------

exports.deleteTask = async function (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const errors = validationResult(req);

    console.log(errors);

    if (!errors.isEmpty()) {
      const error: CustomError = new Error(errors.array()[0].msg);
      error.code = 422;
      error.data = errors.array();
      throw error;
    }

    const userId = req.userId;

    const isUser = await User.findById(userId);

    if (!isUser) {
      throw new Error("User not found");
    }
    const taskId = req.params.taskId;
    if (!isValidObjectId(taskId)) {
      throw new Error("Not a valid task id");
    }
    console.log(taskId);
    const task = await Task.findById(taskId);

    if (!task) {
      throw new Error("Task not found");
    }

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTasks = async function (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const errors = validationResult(req);

    console.log(errors);

    if (!errors.isEmpty()) {
      const error: CustomError = new Error(errors.array()[0].msg);
      error.code = 422;
      error.data = errors.array();
      throw error;
    }

    const userId = req.userId;

    const isUser = await User.findById(userId);

    if (!isUser) {
      throw new Error("User not found");
    }

    const taskIds = req.body.taskIds;

    taskIds.forEach(async (taskId: string) => {
      if (!isValidObjectId(taskId)) return;

      await Task.findByIdAndDelete(taskId);
    });

    res.status(200).json({
      message: "Tasks deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
