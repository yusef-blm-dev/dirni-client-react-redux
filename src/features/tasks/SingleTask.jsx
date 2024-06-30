import { useState, useEffect } from "react";
import "./tasks.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import TaskSkeleton from "../../components/_skeletons/TaskSkeleton/TaskSkeleton";
import { useSelector } from "react-redux";
import { useGetTaskByIdQuery } from "./tasksApiSlice";
import { useDeleteTaskMutation } from "./tasksApiSlice";
import toast from "react-hot-toast";
import { EditIcon, TrashIcon } from "../../icons";

const SingleTask = () => {
  const [showModal, setShowModal] = useState(false);
  const { taskId } = useParams();
  const navigate = useNavigate();

  const { data: taskData, error, isLoading } = useGetTaskByIdQuery(taskId);
  const task = taskData?.entities[taskId];
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const handleDelete = async () => {
    try {
      await deleteTask(taskId).unwrap();
      toast.success("Task deleted successfully");
      navigate("/tasks"); // Navigate back to tasks list after deletion
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  if (!task) {
    return <TaskSkeleton />;
  }

  return (
    <div className="container-general">
      <div className="container-task">
        <div className="container-task-title">{task.title}</div>
        <div className="container-task-info">
          <div className={task.priority === "High" ? "urgent" : "not-urgent"}>
            {task.priority}
          </div>
          <div className={task.status === "open" ? "open" : "done"}>
            {task.status}
          </div>
        </div>
        <div className="container-task-desc">{task.description}</div>
        <div className="container-task-links">
          <Link to={`/tasks/update-task/${task._id}`}>
            Edit Task <EditIcon />
          </Link>
          <button onClick={() => setShowModal(true)}>
            Delete Task
            <TrashIcon />
          </button>
        </div>
        <Link to="/tasks" className="back-tasks">
          Go Back To Tasks
        </Link>
      </div>

      <ConfirmationModal
        show={showModal}
        onConfirm={handleDelete}
        onCancel={() => setShowModal(false)}
        message="Are you sure you want to delete this task?"
      />
    </div>
  );
};

export default SingleTask;
