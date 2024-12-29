import { ChangeEvent, useContext, useEffect, useState } from "react";
import { toastifyError } from "../../Helpers/notificationToastify";
import UserContext from "../../store/UserContext";

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

const AddTask: React.FC<{
  onCancel: () => void;
  task?: TaskDetails | null;
}> = ({ onCancel, task }) => {
  const [formData, setFormData] = useState<TaskDetails>({
    title: "",
    startingDate: "",
    endingDate: "",
    priority: Priority.Low,
    taskStatus: TaskStatus.Pending,
    _id: "",
  });

  const { addTask, editTask } = useContext(UserContext);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        startingDate: new Date(task.startingDate).toISOString().split("T")[0],
        endingDate: new Date(task.endingDate).toISOString().split("T")[0],
        priority: task.priority,
        taskStatus: task.taskStatus,
        _id: task._id,
      });
    }
  }, [task]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "priority" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.startingDate || !formData.endingDate) {
      toastifyError("Please provide both starting and ending dates.");
      return;
    }
    formData.startingDate = new Date(formData.startingDate);
    formData.endingDate = new Date(formData.endingDate);

    if (new Date(formData.startingDate) > new Date(formData.endingDate)) {
      toastifyError("Ending date must be later than starting date.");
      return;
    }

    try {
      if (task) {
        formData._id = task._id;
        await editTask(formData);
      } else {
        await addTask(formData);
      }
      onCancel();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center mt-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-2 text-center text-green-600">
          {task ? "Edit Task" : "Add Task Details"}
        </h2>

        <div className="mb-2">
          <label htmlFor="title" className="block text-gray-700 font-semibold">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="mb-2">
          <label
            htmlFor="startingDate"
            className="block text-gray-700 font-semibold"
          >
            Starting Date
          </label>
          <input
            type="date"
            id="startingDate"
            name="startingDate"
            value={formData.startingDate?.toString()}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="mb-2">
          <label
            htmlFor="endingDate"
            className="block text-gray-700 font-semibold"
          >
            Ending Date
          </label>
          <input
            type="date"
            id="endingDate"
            name="endingDate"
            value={formData.endingDate?.toString()}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="mb-2">
          <label
            htmlFor="priority"
            className="block text-gray-700 font-semibold"
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            {Object.entries(Priority)
              .filter(([key]) => isNaN(Number(key)))
              .map(([key, value]) => (
                <option key={value} value={value}>
                  {key}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-2">
          <label
            htmlFor="taskStatus"
            className="block text-gray-700 font-semibold"
          >
            Task Status
          </label>
          <select
            id="taskStatus"
            name="taskStatus"
            value={formData.taskStatus}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            {Object.values(TaskStatus).map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-2 bg-gray-600 text-white rounded-md mt-4"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="ml-2 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          {task ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddTask;
