import { ReactNode, useCallback, useContext, useState } from "react";
import UserContext from "../../store/UserContext";
import AuthContext from "../../store/AuthContext";
import {
  toastifyError,
  toastifySuccess,
} from "../../Helpers/notificationToastify";

interface UserContextProviderProps {
  children: ReactNode;
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

interface TaskDetails {
  _id?: string;
  title: string;
  startingDate: Date | string;
  endingDate: Date | string;
  priority: Priority;
  taskStatus: TaskStatus;
}

export function UserContextProvider({ children }: UserContextProviderProps) {
  const { isLoggedIn, token } = useContext(AuthContext);
  const [tasks, setTasks] = useState<TaskDetails[]>([]);

  const getAllTasks = useCallback(
    async function fetchAllTasks() {
      try {
        if (isLoggedIn && token) {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/task/getTasks`,
            {
              method: "GET",
              headers: {
                "content-type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + token,
              },
            }
          );
          const resData: {
            message: string;
            tasks: [];
          } = await response.json();
          if (!response.ok) {
            throw new Error(resData.message);
          }
          console.log(resData.tasks);
          setTasks(resData.tasks);
        }
      } catch (error) {
        toastifyError((error as Error).message || "Internal Server Error");
      }
    },
    [isLoggedIn, token]
  );

  const addTask = async function (data: TaskDetails) {
    console.log(data);
    try {
      if (!isLoggedIn && !token) {
        throw new Error("Either Not Authorized or Not Logged In");
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/task/addTask`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "content-type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const resData: {
        message: string;
        taskId: string;
      } = await response.json();
      if (!response.ok) {
        throw new Error(resData.message);
      }

      const newTask: TaskDetails = {
        ...data,
        _id: resData.taskId,
      };
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    } catch (error) {
      toastifyError((error as Error).message || "Internal Server Error");
    }
  };

  const editTask = async function (data: TaskDetails) {
    try {
      console.log(data);
      if (!isLoggedIn && !token) {
        throw new Error("Either Not Authorized or Not Logged In");
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/task/editTask/${data._id}`,
        {
          method: "PATCH",
          body: JSON.stringify(data),
          headers: {
            "content-type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const resData: {
        message: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(resData.message);
      }
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === data._id ? { ...task, ...data } : task
        )
      );

      toastifySuccess("Task updated successfully");
    } catch (error) {
      toastifyError((error as Error).message || "Internal Server Error");
    }
  };

  const deleteTask = async function (taskId: string) {
    try {
      if (!isLoggedIn && !token) {
        throw new Error("Either Not Authorized or Not Logged In");
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/task/removeTask/${taskId}`,
        {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const resData: {
        message: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(resData.message);
      }

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id?.toString() !== taskId.toString())
      );

      toastifySuccess(resData.message);
    } catch (error) {
      toastifyError((error as Error).message || "Internal Server Error");
    }
  };

  const removeTasks = async function (tasks: string[]) {
    try {
      if (!isLoggedIn && !token) {
        throw new Error("Either Not Authorized or Not Logged In");
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/task/deleteTasks`,
        {
          method: "DELETE",
          body: JSON.stringify({ taskIds: tasks }),
          headers: {
            "content-type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const resData: {
        message: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(resData.message);
      }

      setTasks((prevTasks) =>
        prevTasks.filter((task) => !tasks.includes(task?._id?.toString() || ""))
      );
      toastifySuccess(resData.message);
    } catch (error) {
      toastifyError((error as Error).message || "Internal Server Error");
    }
  };

  const clearTask = useCallback(() => {
    setTasks([]);
  }, []);

  const userCtxValue = {
    tasks,
    getAllTasks,
    addTask,
    editTask,
    clearTask,
    deleteTask,
    removeTasks,
  };

  return (
    <UserContext.Provider value={userCtxValue}>{children}</UserContext.Provider>
  );
}
