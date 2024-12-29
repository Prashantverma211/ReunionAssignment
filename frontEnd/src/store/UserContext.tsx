import { createContext } from "react";

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

interface TaskDetails {
  _id?: string;
  title: string;
  startingDate: Date | string;
  endingDate: Date | string;
  priority: Priority;
  taskStatus: TaskStatus;
}

interface UserContextTypes {
  tasks: TaskDetails[];
  getAllTasks: () => Promise<void>;
  addTask: (data: TaskDetails) => Promise<void>;
  editTask: (data: TaskDetails) => Promise<void>;
  deleteTask: (data: string) => Promise<void>;
  removeTasks: (data: string[]) => Promise<void>;
  clearTask: () => void;
}

const initialUserValue: UserContextTypes = {
  tasks: [],
  getAllTasks: async () => {},
  addTask: async () => {},
  editTask: async () => {},
  deleteTask: async () => {},
  removeTasks: async () => {},
  clearTask: () => {},
};

const UserContext = createContext(initialUserValue);

export default UserContext;
