import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddTaskMutation } from "./tasksApiSlice";
import "./tasks.css";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectUserId } from "../auth/authSlice";

const CreateTask = () => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "",
    status: "",
    due: "",
  });
  const userId = useSelector(selectUserId);
  const navigate = useNavigate();
  const [addTask] = useAddTaskMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTask({
        user: userId,
        ...task,
        due: task.due || new Date().toISOString(),
      }).unwrap();
      toast.success("Task created successfully!");
      navigate("/tasks");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className="container-general">
      <div className="create-task-container">
        <form onSubmit={handleSubmit}>
          <div className="create-task-form">
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
                <option value="">Select Priority</option>
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
                <option value="">Select Status</option>
                <option value="open">Open</option>
                <option value="done">Done</option>
              </select>
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="due"
                value={task.due}
                onChange={handleChange}
              />
            </div>
          </div>
          <button type="submit">Create Task</button>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
