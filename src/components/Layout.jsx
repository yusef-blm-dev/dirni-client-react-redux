import { Outlet } from "react-router-dom";
import NavBar from "./navbar/NavBar";
import { Toaster } from "react-hot-toast";
const Layout = () => {
  return (
    <>
      <Toaster position="bottom-right" />
      <NavBar />
      <div className="app">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
