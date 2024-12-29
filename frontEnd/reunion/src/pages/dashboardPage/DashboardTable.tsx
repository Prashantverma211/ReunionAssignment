import { useContext } from "react";
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

function DashboardTable() {
  const { tasks } = useContext(UserContext);

  const currentTime = new Date();

  const calculateTime = (startTime: Date, endTime: Date) => {
    const start = startTime.getTime();
    const end = endTime.getTime();
    const current = currentTime.getTime();

    const lapsedTime =
      current < start ? 0 : (current - start) / (1000 * 60 * 60);
    const timeToFinish = current > end ? 0 : (end - current) / (1000 * 60 * 60);

    return {
      lapsedTime: parseFloat(lapsedTime.toFixed(2)),
      timeToFinish: parseFloat(timeToFinish.toFixed(2)),
    };
  };

  const priorities = Object.values(Priority);
  const groupedTasks = priorities
    .filter((priority) => typeof priority === "number")
    .map((priority) => {
      const priorityTasks = tasks.filter(
        (task) =>
          task.priority === priority && task.taskStatus === TaskStatus.Pending
      );

      const summary = priorityTasks.reduce(
        (acc, task) => {
          const { lapsedTime, timeToFinish } = calculateTime(
            new Date(task.startingDate),
            new Date(task.endingDate)
          );

          acc.pendingTasks += 1;
          acc.totalLapsedTime += lapsedTime;
          acc.totalTimeToFinish += timeToFinish;

          return acc;
        },
        { pendingTasks: 0, totalLapsedTime: 0, totalTimeToFinish: 0 }
      );

      return {
        priority,
        pendingTasks: summary.pendingTasks,
        timeLapsed: parseFloat(summary.totalLapsedTime.toFixed(2)),
        timeToFinish: parseFloat(summary.totalTimeToFinish.toFixed(2)),
      };
    });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Task Priority Summary
      </h1>

      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">
                Task Priority
              </th>
              <th className="px-4 py-2 text-left text-gray-600">
                Pending Tasks
              </th>
              <th className="px-4 py-2 text-left text-gray-600">
                Time Lapsed (hrs)
              </th>
              <th className="px-4 py-2 text-left text-gray-600">
                Time to Finish (hrs)
              </th>
            </tr>
          </thead>
          <tbody>
            {groupedTasks.map((task) => (
              <tr key={task.priority} className="border-t">
                <td className="px-4 py-2 text-gray-800 font-medium">
                  {task.priority}
                </td>
                <td className="px-4 py-2 text-gray-700">{task.pendingTasks}</td>
                <td className="px-4 py-2 text-gray-700">{task.timeLapsed}</td>
                <td className="px-4 py-2 text-gray-700">{task.timeToFinish}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardTable;
