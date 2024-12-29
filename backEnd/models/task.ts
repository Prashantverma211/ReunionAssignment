import mongoose, { Document, Model } from "mongoose";

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

interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  startingDate: Date;
  endingDate: Date;
  priority: Priority;
  taskStatus: TaskStatus;
}

const taskSchema = new mongoose.Schema<ITask>({
  title: { type: String, required: true },
  startingDate: { type: Date, required: true },
  endingDate: { type: Date, required: true },
  priority: { type: Number, enum: Priority, required: true },
  taskStatus: { type: String, enum: TaskStatus, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

const Task: Model<ITask> = mongoose.model<ITask>("Task", taskSchema);

export default Task;
