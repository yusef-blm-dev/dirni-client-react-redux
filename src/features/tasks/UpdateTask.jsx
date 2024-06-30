import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./tasks.css";
import { useGetTaskByIdQuery, useUpdateTaskMutation } from "./tasksApiSlice";
import toast from "react-hot-toast";

const UpdateTask = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { data: taskData, error, isLoading } = useGetTaskByIdQuery(taskId);
  const task_ = taskData?.entities[taskId];
  const [task, setTask] = useState({
    user: task_?.user,
    id: task_?.id,
    title: task_.title || "",
    description: task_.description || "",
    status: task_.status || "",
    priority: task_.priority || "",
    due: task_.due || "",
  });
  const [updateTask] = useUpdateTaskMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTask(task).unwrap();
      toast.success("Task updated successfully");
      navigate(`/tasks/${taskId}`);
    } catch (err) {
      toast.error(err?.data?.message);
    }
  };

  return (
    <div className="container-general">
      <div className="update-task-container">
        <form onSubmit={handleSubmit}>
          <div className="update-task-form">
            <div className="left-side">
              <label htmlFor="name">Task Name</label>
              <input
                type="text"
                id="name"
                name="title"
                value={task.title}
                onChange={handleChange}
                required
              />
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={task.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="right-side">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={task.priority}
                onChange={handleChange}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={task.status}
                onChange={handleChange}
                required
              >
                <option value="open">Open</option>
                <option value="done">Done</option>
              </select>
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={task.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <button type="submit">Update Task</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateTask;
