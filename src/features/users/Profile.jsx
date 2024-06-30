import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateUserAvatarMutation,
  useGetUserByIdQuery,
} from "./userApiSlice";
import { AvatarUploader } from "../../components/AvatarUploader/AvatarUploader";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import Spinner from "../../components/Spinner/Spinner";
import { selectCurrentToken, selectUserId, logOut } from "../auth/authSlice";
import { useSendLogoutMutation } from "../auth/authApiSluice";
import "./users.css";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(selectCurrentToken);
  const userId = useSelector(selectUserId);
  const [sendLogout] = useSendLogoutMutation();
  const [updateUser, { isLoading: isLoadingUser }] = useUpdateUserMutation();
  const [updateUserAvatar] = useUpdateUserAvatarMutation();
  const [deleteUser] = useDeleteUserMutation();
  const {
    data: userData,
    error,
    isLoading,
    refetch,
  } = useGetUserByIdQuery(userId);
  const user = userData?.entities[userId];

  const [formData, setFormData] = useState({
    id: "",
    username: "",
    email: "",
    password: "",
    avatar: "",
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        username: user.username || "",
        email: user.email || "",
        password: "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUpdating(true);

      // If a new avatar file is provided, upload it first
      let avatarUrl = formData.avatar;
      if (files.length > 0) {
        const avatarData = new FormData();
        avatarData.append("image", files[0]);
        const response = await updateUserAvatar(avatarData).unwrap();
        avatarUrl = response.imageUrl;
      }

      // Update user profile with the new avatar URL if it was uploaded
      const updatedFormData = { ...formData, avatar: avatarUrl };
      await updateUser({ id: user.id, userData: updatedFormData }).unwrap();

      // Re-fetch user data to reflect the latest changes
      refetch();

      setIsUpdating(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(
        err.message || "An error occurred while updating the profile."
      );
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser({ id: user.id }).unwrap();
      toast.success("Your account has been deleted successfully");
      dispatch(logOut());
      navigate("/login");
    } catch (err) {
      toast.error(
        err?.data?.message || "An error occurred while deleting your account."
      );
    }
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  const handleSignout = async () => {
    try {
      await sendLogout().unwrap();
      toast.success("Logged Out successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message);
    }
  };

  return (
    <div className="container-general">
      <div className="profile-container">
        <h1>Profile</h1>
        <div className="profile-img">
          <AvatarUploader
            imageUrl={formData.avatar}
            onFileChange={(url) => setFormData({ ...formData, avatar: url })}
            setFiles={setFiles}
          />
        </div>
        <form className="profile-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={formData.username}
            placeholder="Username"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <div className="button-container">
            {isUpdating ? (
              <button type="button" className="update-button" disabled>
                <div className="spinner-container">
                  <Spinner />
                </div>
              </button>
            ) : (
              <input type="submit" value="Update" className="update-button" />
            )}
          </div>
        </form>
        <div className="links-profile">
          <Link onClick={handleDeleteClick} className="delete">
            Delete Account
          </Link>
          <Link onClick={handleSignout} className="signout">
            Log Out
          </Link>
        </div>
      </div>
      <ConfirmationModal
        show={showModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="Are you sure you want to delete your account? This action cannot be undone."
      />
    </div>
  );
};

export default Profile;
