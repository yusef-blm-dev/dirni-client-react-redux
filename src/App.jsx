import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Home from "./pages/home/Home";
import Login from "./features/auth/login/Login";
import Register from "./features/auth/register/Register";
import Profile from "./features/users/Profile";
import TaskList from "./features/tasks/TaskList";
import PersistLogin from "./features/auth/PersistLogin";
import CreateTask from "./features/tasks/CreateTask";
import SingleTask from "./features/tasks/SingleTask";
import UpdateTask from "./features/tasks/UpdateTask";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PersistLogin />}>
          <Route index element={<Home />} />
          <Route path="/profile">
            <Route index element={<Profile />} />
          </Route>
          <Route path="/tasks">
            <Route index element={<TaskList />} />
            <Route path="create-task" element={<CreateTask />} />
            <Route path=":taskId" element={<SingleTask />} />
            <Route path="update-task/:taskId" element={<UpdateTask />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
