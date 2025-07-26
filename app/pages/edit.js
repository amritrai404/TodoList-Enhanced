"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Edit = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskIndex, setTaskIndex] = useState(null);

  useEffect(() => {
    if (!router.isReady) return;

    const indexParam = router.query.index;

    if (!indexParam) {
      alert("No task index provided");
      router.push("/");
      return;
    }

    const index = parseInt(indexParam, 10);

    if (isNaN(index)) {
      alert("Invalid task index");
      router.push("/");
      return;
    }

    setTaskIndex(index);

    const storedTasks = localStorage.getItem("Tasks");
    if (!storedTasks) {
      alert("No tasks found in localStorage");
      router.push("/");
      return;
    }

    const tasks = JSON.parse(storedTasks);
    if (index < 0 || index >= tasks.length) {
      alert("Task index out of range");
      router.push("/");
      return;
    }

    setTaskName(tasks[index].taskName || "");
    setTaskDesc(tasks[index].taskDesc || "");
    setLoading(false);
  }, [router.isReady, router.query.index]);

  const handleSave = (e) => {
    e.preventDefault();

    if (!taskName.trim() || !taskDesc.trim()) {
      alert("Please fill both task name and description");
      return;
    }

    const storedTasks = localStorage.getItem("Tasks");
    if (!storedTasks) {
      alert("No tasks found in localStorage");
      return;
    }

    const tasks = JSON.parse(storedTasks);

    if (taskIndex === null || taskIndex < 0 || taskIndex >= tasks.length) {
      alert("Invalid task index");
      return;
    }

    tasks[taskIndex] = { taskName: taskName.trim(), taskDesc: taskDesc.trim() };
    localStorage.setItem("Tasks", JSON.stringify(tasks));
    alert("Task updated successfully!");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Loading task details...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 flex justify-center items-center min-h-screen px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Task</h1>
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div>
            <label htmlFor="taskName" className="block text-lg font-semibold mb-2">
              Task Name
            </label>
            <input
              id="taskName"
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task name"
              required
            />
          </div>

          <div>
            <label htmlFor="taskDesc" className="block text-lg font-semibold mb-2">
              Task Description
            </label>
            <textarea
              id="taskDesc"
              rows="4"
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task description"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-2 text-center text-blue-600 hover:underline"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default Edit;