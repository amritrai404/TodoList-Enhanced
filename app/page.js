"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [hydrated, setHydrated] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [completed, setCompleted] = useState([]);
  const [mainTask, setMainTask] = useState([]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const router = useRouter();

  // For date and time display
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update date and time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const savedTasks = JSON.parse(localStorage.getItem("Tasks")) || [];
    const completedTasksList = JSON.parse(localStorage.getItem("completeTasks")) || [];

    setMainTask(savedTasks);
    setCompleted(completedTasksList);
    setCompletedTasks(completedTasksList.length);
    setTotalTasks(savedTasks.length + completedTasksList.length);
  }, [hydrated]);

  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  useEffect(() => {
    setPendingTasks(mainTask.length);
  }, [mainTask]);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem("total", totalTasks);
    localStorage.setItem("complete", completedTasks);
    localStorage.setItem("Tasks", JSON.stringify(mainTask));
    localStorage.setItem("completeTasks", JSON.stringify(completed));
  }, [totalTasks, completedTasks, mainTask, completed, hydrated]);

  const capitalizeEachLine = (text) => {
    return text
      .split("\n")
      .map((line) => line.charAt(0).toUpperCase() + line.slice(1))
      .join("\n");
  };

  const deleteHandler = (e, i) => {
    e.preventDefault();
    let tempTask = [...mainTask];
    tempTask.splice(i, 1);
    setMainTask(tempTask);
    setTotalTasks(totalTasks - 1);
  };

  const completedDeleteHandler = (e, i) => {
    e.preventDefault();
    let tempTask = [...completed];
    tempTask.splice(i, 1);
    setCompleted(tempTask);
    setCompletedTasks(completedTasks - 1);
    setTotalTasks(totalTasks - 1);
  };

  const completeHandler = (e, i) => {
    e.preventDefault();
    setCompleted([...completed, mainTask[i]]);
    deleteHandler(e, i);
    setCompletedTasks(completedTasks + 1);
  };

  const notCompletedHandler = (e, i) => {
    e.preventDefault();
    setMainTask([...mainTask, completed[i]]);
    completedDeleteHandler(e, i);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (taskName === "" || taskDesc === "") {
      return;
    }
    setMainTask([...mainTask, { taskName, taskDesc }]);
    setTaskDesc("");
    setTaskName("");
    setTotalTasks(totalTasks + 1);
  };

  if (!hydrated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-black">Loading...</p>
      </div>
    );
  }

  // Format date, day and time
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const formattedDate = currentDateTime.toLocaleDateString(undefined, options);
  const formattedTime = currentDateTime.toLocaleTimeString();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 py-4 bg-white shadow-sm">
        <img src="./favicon.ico" alt="Icon" className="h-12 w-12" />
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-black">TodoList</h1>
          <p className="text-black text-sm sm:text-base mt-1">{formattedDate}, {formattedTime}</p>
        </div>
      </div>

      {/* Task Creation Form */}
      <form className="flex flex-col md:flex-row justify-center items-center md:items-baseline gap-4 p-4 sm:p-6 md:p-10">
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-4xl">
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(capitalizeEachLine(e.target.value))}
            className="flex-1 text-xl outline-0 text-black p-3 rounded-xl border-2 border-green-400 bg-white"
            id="taskName"
            placeholder="Enter Task Name Here"
          />
          <textarea
            rows="2"
            value={taskDesc}
            onChange={(e) => setTaskDesc(capitalizeEachLine(e.target.value))}
            className="flex-1 text-xl outline-0 text-black p-3 rounded-xl border-2 border-green-400 bg-white"
            id="taskDesc"
            placeholder="Enter Task Description Here"
          />
          <div className="flex flex-col gap-2 w-full md:w-auto" id="taskButtons">
            <button
              id="addTask"
              className="px-4 py-2 text-xl md:text-2xl text-black bg-green-400 hover:bg-green-600 rounded-xl font-bold shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              onClick={submitHandler}
            >
              Add Task
            </button>
          </div>
        </div>
      </form>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 sm:p-5 max-w-6xl mx-auto">
        <div className="completedTasks bg-green-200 p-4 sm:p-5 rounded-xl shadow-lg text-black hover:scale-105 transition duration-300 ease-in-out">
          <h2 className="text-4xl sm:text-5xl font-semibold text-center text-black">{completedTasks}</h2>
          <h3 className="text-base sm:text-lg font-semibold text-center text-black">Completed Task</h3>
        </div>
        <div className="pendingTasks bg-indigo-100 p-4 sm:p-5 rounded-xl shadow-lg text-black hover:scale-105 transition duration-300 ease-in-out">
          <h2 className="text-4xl sm:text-5xl font-semibold text-center text-black">{pendingTasks}</h2>
          <h3 className="text-base sm:text-lg font-semibold text-center text-black">Pending Task</h3>
        </div>
        <div className="totalTasks bg-gray-100 p-4 sm:p-5 rounded-xl shadow-lg text-black hover:scale-105 transition duration-300 ease-in-out">
          <h2 className="text-4xl sm:text-5xl font-semibold text-center text-black">{totalTasks}</h2>
          <h3 className="text-base sm:text-lg font-semibold text-center text-black">Total Task</h3>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="flex flex-col justify-center items-center gap-5 text-xl my-3 px-4">
        <h2 className="text-2xl font-bold text-black">Pending Tasks:</h2>
        {mainTask.length === 0 ? (
          <p className="text-gray-500 py-4">No pending tasks available</p>
        ) : (
          <ul className="flex flex-col gap-3 w-full max-w-6xl">
            {mainTask.map((t, i) => (
              <li
                key={i}
                className="flex flex-col md:flex-row w-full justify-between gap-3 bg-indigo-50 rounded-xl shadow-lg text-black p-3"
              >
                <div className="taskDetails flex flex-col w-full md:w-2/3 justify-center items-start py-2 px-3 sm:py-3 sm:px-5">
                  <div className="flex gap-2 justify-start items-center">
                    <div className="tNum px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-indigo-200 text-sm sm:text-base">
                      {i + 1}
                    </div>
                    <h5 className="tName font-semibold text-lg sm:text-xl text-black">{t.taskName}</h5>
                  </div>
                  <h6 className="tDesc ml-0 sm:ml-10 mt-2 sm:mt-0 max-w-full font-semibold text-xs sm:text-sm text-black">
                    {t.taskDesc}
                  </h6>
                </div>
                <div className="taskButtons flex flex-col sm:flex-row gap-2 justify-center items-center">
                  <button
                    className="bg-green-400 w-full sm:w-auto transition duration-300 ease-in-out font-semibold hover:bg-green-600 hover:scale-105 px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base rounded-lg"
                    onClick={(e) => completeHandler(e, i)}
                  >
                    Completed
                  </button>
                  <button
                    className="bg-red-400 w-full sm:w-auto transition duration-300 ease-in-out font-semibold hover:scale-105 hover:bg-red-600 px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base rounded-lg"
                    onClick={(e) => deleteHandler(e, i)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Completed Tasks */}
      <div className="flex flex-col justify-center items-center gap-5 text-xl my-6 px-4">
        <h2 className="text-2xl font-bold text-black">Completed Tasks:</h2>
        {completed.length === 0 ? (
          <p className="text-gray-500 py-4">No completed tasks available</p>
        ) : (
          <ul className="flex flex-col gap-3 w-full max-w-6xl">
            {completed.map((t, i) => (
              <li
                key={i}
                className="flex flex-col md:flex-row w-full justify-between gap-3 bg-green-200 rounded-xl shadow-lg text-black p-3"
              >
                <div className="taskDetails flex flex-col w-full md:w-2/3 justify-center items-start py-2 px-3 sm:py-3 sm:px-5">
                  <div className="flex gap-2 justify-start items-center">
                    <div className="tNum px-3 py-1 sm:px-4 sm:py-2 rounded-full bg-green-300 text-sm sm:text-base">
                      {i + 1}
                    </div>
                    <h5 className="tName font-semibold text-lg sm:text-xl text-black">{t.taskName}</h5>
                  </div>
                  <h6 className="tDesc ml-0 sm:ml-10 mt-2 sm:mt-0 max-w-full font-semibold text-xs sm:text-sm text-black">
                    {t.taskDesc}
                  </h6>
                </div>
                <div className="taskButtons flex flex-col sm:flex-row gap-2 justify-center items-center">
                  <button
                    className="bg-amber-400 w-full sm:w-auto transition duration-300 ease-in-out font-semibold hover:bg-amber-600 hover:scale-105 px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base rounded-lg"
                    onClick={(e) => notCompletedHandler(e, i)}
                  >
                    Incomplete Task
                  </button>
                  <button
                    className="bg-red-400 w-full sm:w-auto transition duration-300 ease-in-out font-semibold hover:scale-105 hover:bg-red-600 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-2 rounded-lg"
                    onClick={(e) => completedDeleteHandler(e, i)}
                  >
                    Delete Task
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Page;