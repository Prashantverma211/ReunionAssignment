import { useContext } from "react";
import UserContext from "../../store/UserContext";
import DashboardTable from "./DashboardTable";

enum TaskStatus {
  Pending = "pending",
  Completed = "completed",
}

function DashboardPage() {
  const { tasks } = useContext(UserContext);

  const calculateTime = (startTime: Date, endTime: Date, currentTime: Date) => {
    const start = startTime.getTime();
    const end = endTime.getTime();
    const current = currentTime.getTime();

    const lapsedTime =
      current < start ? 0 : (current - start) / (1000 * 60 * 60);
    const balanceTime = current > end ? 0 : (end - current) / (1000 * 60 * 60);
    const totalTime = (end - start) / (1000 * 60 * 60);

    return {
      lapsedTime: parseFloat(lapsedTime.toFixed(2)),
      balanceTime: parseFloat(balanceTime.toFixed(2)),
      totalTime: parseFloat(totalTime.toFixed(2)),
    };
  };

  const currentTime = new Date();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.taskStatus === TaskStatus.Completed
  ).length;
  const pendingTasks = totalTasks - completedTasks;

  const taskSummaries = tasks.map((task) => {
    const startTime = new Date(task.startingDate);
    const endTime = new Date(task.endingDate);
    return {
      ...task,
      ...calculateTime(startTime, endTime, currentTime),
    };
  });

  const totalPendingLapsedTime = taskSummaries
    .filter((task) => task.taskStatus === TaskStatus.Pending)
    .reduce((acc, task) => acc + task.lapsedTime, 0);

  const totalPendingBalanceTime = taskSummaries
    .filter((task) => task.taskStatus === TaskStatus.Pending)
    .reduce((acc, task) => acc + task.balanceTime, 0);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="bg-white p-6 shadow-md rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-gray-600">
            <span className="font-bold text-gray-800">Total tasks:</span>{" "}
            {totalTasks}
          </div>
          <div className="text-gray-600">
            <span className="font-bold text-gray-800">Tasks completed:</span>{" "}
            {((completedTasks / totalTasks) * 100).toFixed(1)}%
          </div>
          <div className="text-gray-600">
            <span className="font-bold text-gray-800">Tasks pending:</span>{" "}
            {((pendingTasks / totalTasks) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Pending Task Summary
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-gray-600">
            <span className="font-bold text-gray-800">Pending tasks:</span>{" "}
            {pendingTasks}
          </div>
          <div className="text-gray-600">
            <span className="font-bold text-gray-800">Total time lapsed:</span>{" "}
            {totalPendingLapsedTime.toFixed(1)} hrs
          </div>
          <div className="text-gray-600">
            <span className="font-bold text-gray-800">Total balance time:</span>{" "}
            {totalPendingBalanceTime.toFixed(1)} hrs
          </div>
        </div>
      </div>

      <div className="bg-white p-6 shadow-md rounded-lg">
        <DashboardTable />
      </div>
    </div>
  );
}

export default DashboardPage;
