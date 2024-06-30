import "./tasks.css";
import { Link, useSearchParams } from "react-router-dom";
import { useGetTasksByUserIdQuery } from "./tasksApiSlice";
import { useSelector } from "react-redux";
import { selectUserId } from "../auth/authSlice";
import SkeletonTasks from "../../components/_skeletons/SkeletonTasks/SkeletonTasks";
import { EditIcon } from "../../icons";
import TablePagination from "../../components/TablePagination/TablePagination";
import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "../../icons";

const TaskList = () => {
  const userId = useSelector(selectUserId);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page")) || 1;
  const query = searchParams.size ? `?${searchParams.toString()}` : "";
  const {
    data: tasks,
    isLoading,
    isSuccess,
  } = useGetTasksByUserIdQuery({
    userId,
    query,
  });
  const [itemCount, setItemCount] = useState(0);
  const orderBy = searchParams.get("orderBy");
  const orderDirection = searchParams.get("orderDirection") || "asc";

  useEffect(() => {
    if (tasks) {
      setItemCount(tasks.taskCount);
    }
  }, [tasks]);

  // Ensure tasks are in the correct format
  const taskIds = tasks?.ids || [];
  const taskEntities = tasks?.entities || {};

  const handleFilterByStatus = (e) => {
    const value = e.target.value;
    if (value) {
      searchParams.set("status", value);
    } else {
      searchParams.delete("status");
    }
    setSearchParams(searchParams);
  };

  const handleOrderBy = (field) => {
    if (orderBy === field) {
      const newDirection = orderDirection === "asc" ? "desc" : "asc";
      searchParams.set("orderDirection", newDirection);
    } else {
      searchParams.set("orderBy", field);
      searchParams.set("orderDirection", "asc");
    }
    searchParams.delete("page");
    setSearchParams(searchParams);
  };

  if (isLoading) {
    return <SkeletonTasks />;
  }

  return (
    <div className="container-general">
      <div className="tasks">
        <h1>Tasks</h1>
        <div className="before-table">
          <div className="selection-task">
            <select className="select-task" onChange={handleFilterByStatus}>
              <option value="">All</option>
              <option value="open">Open</option>
              <option value="done">Done</option>
            </select>
          </div>
          <Link to="/tasks/create-task">Create a New Task</Link>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleOrderBy("title")}>
                  Name{" "}
                  {orderBy === "title" &&
                    (orderDirection === "asc" ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    ))}
                </th>
                <th onClick={() => handleOrderBy("priority")}>
                  Priority{" "}
                  {orderBy === "priority" &&
                    (orderDirection === "asc" ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    ))}
                </th>
                <th onClick={() => handleOrderBy("status")}>
                  Status{" "}
                  {orderBy === "status" &&
                    (orderDirection === "asc" ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    ))}
                </th>
                <th onClick={() => handleOrderBy("due")}>
                  Due Date
                  {orderBy === "due" &&
                    (orderDirection === "asc" ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    ))}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {taskIds.length === 0 ? (
                <tr>
                  <td colSpan="5">No tasks found.</td>
                </tr>
              ) : (
                taskIds.map((taskId) => {
                  const task = taskEntities[taskId];
                  return (
                    <tr key={task._id}>
                      <td>{task.title}</td>
                      <td>
                        <span
                          className={task.priority === "High" ? "urgent" : ""}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td>
                        <span
                          className={task.status === "open" ? "open" : "done"}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td>{task.due?.split("T")[0]}</td>
                      <td>
                        <Link to={`/tasks/${task._id}`}>
                          <EditIcon />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {taskIds.length > 0 && (
          <TablePagination
            itemCount={itemCount}
            pageSize={4} // fixed page size
            currentPage={page}
          />
        )}
      </div>
    </div>
  );
};

export default TaskList;
