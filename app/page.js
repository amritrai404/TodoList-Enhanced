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

  // Mark component as hydrated once mounted
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Load data from localStorage after hydration
  useEffect(() => {
    if (!hydrated) return;

    const savedTasks = JSON.parse(localStorage.getItem("Tasks")) || [];
    const completedTasksList = JSON.parse(localStorage.getItem("completeTasks")) || [];

    setMainTask(savedTasks);
    setCompleted(completedTasksList);
    setCompletedTasks(completedTasksList.length);
    setTotalTasks(savedTasks.length + completedTasksList.length);
  }, [hydrated]);

  // Disable context menu
  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  // Update pendingTasks count when mainTask changes
  useEffect(() => {
    setPendingTasks(mainTask.length);
  }, [mainTask]);

  // Save data to localStorage on changes
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

  const editHandler = (e, i, taskName, taskDesc) => {
    e.preventDefault();
    router.push(
      `/edit?name=${encodeURIComponent(
        taskName
      )}&description=${encodeURIComponent(taskDesc)}&index=${i}`
    );
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
    // Render nothing or loading until hydration completes
    return null;
  }

  let renderTask = <h2>No Task Available</h2>;
  if (mainTask.length > 0) {
    renderTask = mainTask.map((t, i) => {
      return (
        <li
          key={i + 1}
          className="task flex w-[98vw] justify-between gap-2 bg-indigo-50 rounded-xl shadow-lg text-black p-3"
        >
          <div className="taskDetails flex flex-col w-[50vw] justify-center items-start py-3 px-5">
            <div className="flex gap-2 justify-center items-center">
              <div className="tNum px-4 py-2 rounded-full bg-indigo-200">{i + 1}</div>
              <h5 className="tName font-semibold text-xl">{t.taskName}</h5>
            </div>
            <h6 className="tDesc ml-[50px] max-w-[50vw] font-semibold text-sm">
              {t.taskDesc}
            </h6>
          </div>
          <div className="taskButtons flex gap-3 justify-center items-center">
            <button
              className="bg-green-400 transition duration-300 ease-in-out transform font-semibold hover:bg-green-600 hover:scale-110 px-10 py-2 text-xl rounded-lg"
              onClick={(e) => completeHandler(e, i)}
            >
              Completed
            </button>
            <button
              className="bg-red-400 transition duration-300 ease-in-out transform font-semibold hover:scale-110 hover:bg-red-600 px-10 py-2 text-xl rounded-lg"
              onClick={(e) => deleteHandler(e, i)}
            >
              Delete
            </button>
            <button
              className="bg-amber-300 transition duration-300 ease-in-out transform font-semibold hover:scale-110 hover:bg-amber-600 text-xl px-10 py-2 rounded-lg"
              onClick={(e) => editHandler(e, i, t.taskName, t.taskDesc)}
            >
              Edit
            </button>
          </div>
        </li>
      );
    });
  }

  let renderCompletedTask = <h2>No Task Completed</h2>;
  if (completed.length > 0) {
    renderCompletedTask = completed.map((t, i) => {
      return (
        <li
          key={i + 1}
          className="task flex w-[98vw] justify-between gap-2 bg-green-200 rounded-xl shadow-lg text-black p-3"
        >
          <div className="taskDetails flex flex-col w-[50vw] justify-center items-start py-3 px-5">
            <div className="flex gap-2 justify-center items-center">
              <div className="tNum px-4 py-2 rounded-full bg-green-300">{i + 1}</div>
              <h5 className="tName font-semibold text-xl">{t.taskName}</h5>
            </div>
            <h6 className="tDesc ml-[50px] max-w-[50vw] font-semibold text-sm">{t.taskDesc}</h6>
          </div>
          <div className="taskButtons flex gap-3 justify-center items-center">
            <button
              className="bg-amber-400 transition duration-300 ease-in-out transform font-semibold hover:bg-amber-600 hover:scale-110 px-10 py-2 text-xl rounded-lg"
              onClick={(e) => notCompletedHandler(e, i)}
            >
              Incomplete Task
            </button>
            <button
              className="bg-red-400 transition duration-300 ease-in-out transform font-semibold hover:scale-110 hover:bg-red-600 text-xl px-10 py-2 rounded-lg"
              onClick={(e) => completedDeleteHandler(e, i)}
            >
              Delete Task
            </button>
          </div>
        </li>
      );
    });
  }

  return (
    <>
      <div className="flex justify-center items-center gap-2">
        <img src="./favicon.ico" alt="Icon" width="50" />
        <h1 className="text-4xl font-bold text-center py-5">TodoList</h1>
      </div>
      <hr />
      <form className="taskCreaterForm flex justify-center items-baseline gap-10 p-10">
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(capitalizeEachLine(e.target.value))}
          className="text-xl outline-0 text-white p-3 rounded-xl border-2 border-green-400"
          id="taskName"
          placeholder="Enter Task Name Here"
        />
        <textarea
          rows="2"
          cols="50"
          style={{ resize: "none" }}
          value={taskDesc}
          onChange={(e) => setTaskDesc(capitalizeEachLine(e.target.value))}
          className="text-xl outline-0 text-white p-3 rounded-xl border-2 border-green-400"
          id="taskDesc"
          placeholder="Enter Task Description Here"
        />
        <div className="flex flex-col gap-2" id="taskButtons">
          <button
            id="addTask"
            className="px-4 py-2 text-2xl text-black bg-green-400 hover:bg-green-600 rounded-xl font-bold shadow-lg transition duration-300 ease-in-out transform hover:scale-110"
            onClick={submitHandler}
          >
            Add Task
          </button>
          <button
            id="removeAllTasks"
            onClick={(e) => {
              e.preventDefault();
              setMainTask([]);
              setCompleted([]);
              setCompletedTasks(0);
              setTotalTasks(0);
            }}
            className="bg-red-400 text-black transition duration-300 ease-in-out transform font-extrabold hover:scale-110 hover:bg-red-600 text-xl px-10 py-2 rounded-lg"
          >
            Remove all Tasks
          </button>
        </div>
      </form>
      <hr />
      <div className="grid grid-flow-col gap-5 p-5">
        <div className="completedTasks bg-green-200 p-5 rounded-xl shadow-lg text-black hover:scale-105 transition duration-300 ease-in-out">
          <h2 className="text-5xl font-semibold">{completedTasks}</h2>
          <h3 className="text-l font-semibold">Completed Task</h3>
        </div>
        <div className="pendingTasks bg-indigo-100 p-5 rounded-xl shadow-lg text-black hover:scale-105 transition duration-300 ease-in-out">
          <h2 className="text-5xl font-semibold">{pendingTasks}</h2>
          <h3 className="text-l font-semibold">Pending Task</h3>
        </div>
        <div className="totalTasks bg-gray-100 p-5 rounded-xl shadow-lg text-black hover:scale-105 transition duration-300 ease-in-out">
          <h2 className="text-5xl font-semibold">{totalTasks}</h2>
          <h3 className="text-l font-semibold">Total Task</h3>
        </div>
      </div>
      <hr />
      <div className="flex flex-col justify-center items-center gap-5 text-xl my-3">
        <h2 className="text-2xl font-bold">Pending Tasks: </h2>
        <ul className="flex flex-col width-[100vw] gap-2">{renderTask}</ul>
      </div>
      <hr />
      <div className="flex flex-col justify-center items-center gap-5 text-xl mt-3">
        <h2 className="text-2xl font-bold">Completed Tasks: </h2>
        <ul className="flex flex-col width-[100vw] gap-2">{renderCompletedTask}</ul>
      </div>
    </>
  );
};

export default Page;
