import { useContext, useState } from "react";
import UserContext from "../../store/UserContext";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import AddTask from "../../components/task/TaskDetailForm";
import { MdDelete } from "react-icons/md";

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

function TaskAsList() {
  const { tasks, deleteTask, removeTasks } = useContext(UserContext);

  const [filters, setFilters] = useState({
    sort: "",
    priority: "",
    status: "",
  });

  const [deletedTasks, setDeletedTasks] = useState<string[]>([]);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskDetails | null>(null);

  const calculateTimeToFinish = (startTime: string, endTime: string) => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    return Math.max((end - start) / (1000 * 60 * 60), 0).toFixed(2); // In hours
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filters.priority && task.priority !== parseInt(filters.priority)) {
        return false;
      }
      if (filters.status && task.taskStatus.toLowerCase() !== filters.status) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === "startingTimeAsc") {
        return (
          new Date(a.startingDate).getTime() -
          new Date(b.startingDate).getTime()
        );
      }
      if (filters.sort === "startingTimeDesc") {
        return (
          new Date(b.startingDate).getTime() -
          new Date(a.startingDate).getTime()
        );
      }
      if (filters.sort === "endingTimeAsc") {
        return (
          new Date(a.endingDate).getTime() - new Date(b.endingDate).getTime()
        );
      }
      if (filters.sort === "endingTimeDesc") {
        return (
          new Date(b.endingDate).getTime() - new Date(a.endingDate).getTime()
        );
      }
      return 0;
    });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value === "remove" ? "" : value }));
  };

  const handleTaskSelection = (taskId: string) => {
    setDeletedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleDeleteTasks = async () => {
    if (deletedTasks.length > 0) {
      await removeTasks(deletedTasks);
      setDeletedTasks([]);
    } else {
      alert("No tasks selected for deletion.");
    }
  };

  const handleAddTask = () => {
    setTaskToEdit(null);
    setShowAddTaskForm(true);
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    setDeletedTasks([]);
  };

  const handleEditTask = (task: TaskDetails) => {
    console.log(task);
    setTaskToEdit(task);
    setShowAddTaskForm(true);
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Task List</h1>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange("sort", e.target.value)}
            className={`border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 ${
              filters.sort ? "text-blue-700" : ""
            }`}
          >
            {!filters.sort && (
              <option className="text-black" value="">
                Sort
              </option>
            )}
            <option className="text-black" value="startingTimeAsc">
              Starting Time: ASC
            </option>
            <option className="text-black" value="startingTimeDesc">
              Starting Time: DESC
            </option>
            <option className="text-black" value="endingTimeAsc">
              Ending Time: ASC
            </option>
            <option className="text-black" value="endingTimeDesc">
              Ending Time: DESC
            </option>
            {filters.sort && (
              <option className="text-red-700" value="remove">
                Remove
              </option>
            )}
          </select>
        </div>

        <div className="relative">
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className={`border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 ${
              filters.priority ? "text-blue-700" : ""
            }`}
          >
            {!filters.priority && (
              <option className="text-black" value="">
                Priority
              </option>
            )}
            {[1, 2, 3, 4, 5].map((p) => (
              <option className="text-black" key={p} value={p}>
                {p}
              </option>
            ))}
            {filters.priority && (
              <option className="text-red-700" value="remove">
                Remove
              </option>
            )}
          </select>
        </div>

        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className={`border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 ${
              filters.status ? "text-blue-700" : ""
            }`}
          >
            {!filters.status && (
              <option className="text-black" value="">
                Status
              </option>
            )}
            <option className="text-black" value="pending">
              Pending
            </option>
            <option className="text-black" value="completed">
              Completed
            </option>
            {filters.status && (
              <option className="text-red-700" value="remove">
                Remove
              </option>
            )}
          </select>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={handleAddTask}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          <FiPlus size={16} />
          Add Task
        </button>
        {deletedTasks.length > 0 && (
          <button
            onClick={handleDeleteTasks}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            <FiTrash2 size={16} />
            Delete Selected Tasks
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">No.</th>
              <th className="px-4 py-2 text-left text-gray-600">Task ID</th>
              <th className="px-4 py-2 text-left text-gray-600">Title</th>
              <th className="px-4 py-2 text-left text-gray-600">Priority</th>
              <th className="px-4 py-2 text-left text-gray-600">Status</th>
              <th className="px-4 py-2 text-left text-gray-600">Start Time</th>
              <th className="px-4 py-2 text-left text-gray-600">End Time</th>
              <th className="px-4 py-2 text-left text-gray-600">
                Total Time to Finish (hrs)
              </th>
              <th className="px-4 py-2 text-left text-gray-600">Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task._id} className="border-t">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={deletedTasks.includes(task._id?.toString() || "")}
                    onChange={() =>
                      handleTaskSelection(task._id?.toString() || "")
                    }
                  />
                </td>
                <td className="px-4 py-2 text-gray-700">
                  {task?._id?.slice(0, 2) + ".." + task?._id?.slice(-3)}
                </td>
                <td className="px-4 py-2 text-gray-800 font-medium">
                  {task.title}
                </td>
                <td className="px-4 py-2 text-gray-700">{task.priority}</td>
                <td className="px-4 py-2 text-gray-700">{task.taskStatus}</td>
                <td className="px-4 py-2 text-gray-700">
                  {new Date(task.startingDate).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-gray-700">
                  {new Date(task.endingDate).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-gray-700">
                  {calculateTimeToFinish(
                    task.startingDate?.toString(),
                    task.endingDate?.toString()
                  )}
                </td>
                <td className="flex items-center  px-4 py-2 text-gray-700">
                  <FiEdit
                    onClick={() => {
                      handleEditTask(task);
                    }}
                    className="text-blue-500 cursor-pointer ml-2"
                    size={18}
                  />
                  <MdDelete
                    onClick={() => {
                      if (!task._id) return;
                      handleDeleteTask(task._id);
                    }}
                    className="text-red-500 cursor-pointer ml-2 text-2xl"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddTaskForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg transform translate-y-[-100%] animate-slide-down">
            <AddTask
              onCancel={() => setShowAddTaskForm(false)}
              task={taskToEdit}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskAsList;
