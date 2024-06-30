import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSendLogoutMutation } from "../../features/auth/authApiSluice";
import { selectIsLoggedIn, selectUserId } from "../../features/auth/authSlice";
import { useGetUserByIdQuery } from "../../features/users/userApiSlice";
import ImageModal from "../ImageModal/ImageModal";
import { NavBars } from "../../icons";
import "./navbar.css";
import toast from "react-hot-toast";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [isOpen, setIsOpen] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [user, setUser] = useState(null); // State to store user info locally
  const userId = useSelector(selectUserId);
  const [sendLogout] = useSendLogoutMutation();

  const { data: userData } = useGetUserByIdQuery(userId);

  useEffect(() => {
    if (userData && userId) {
      setUser(userData.entities[userId]);
    }
  }, [userData, userId]);

  const handleLogout = async () => {
    try {
      await sendLogout().unwrap();
      toast.success("Logged Out successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.data?.message);
    }
  };

  const handleImageClick = () => {
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
  };

  return (
    <nav id="navbar">
      <Link
        to="/"
        className={location.pathname === "/" ? "home-link active" : "home-link"}
      >
        DoMe
      </Link>
      <NavBars onClick={() => setIsOpen(!isOpen)} />
      <ul className={isOpen ? "open" : "close"}>
        {isLoggedIn ? (
          <>
            <li>
              <Link
                to="/profile"
                className={location.pathname === "/profile" ? "active" : ""}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/tasks"
                className={location.pathname === "/tasks" ? "active" : ""}
              >
                Tasks
              </Link>
            </li>
            <li>
              <Link onClick={handleLogout}>Logout</Link>
            </li>
            {user && (
              <li>
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="profile-pic"
                  onClick={handleImageClick}
                />
              </li>
            )}
          </>
        ) : (
          <li className="signin-link-nav">
            <Link
              to="/login"
              className={location.pathname === "/login" ? "active" : ""}
            >
              Login
            </Link>
          </li>
        )}
      </ul>
      {isLoggedIn && user && (
        <ImageModal
          show={showImageModal}
          onClose={handleCloseImageModal}
          imageUrl={user.avatar}
        />
      )}
    </nav>
  );
};

export default NavBar;
