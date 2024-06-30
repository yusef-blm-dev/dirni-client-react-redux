import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAddNewUserMutation } from "../../users/userApiSlice";
import toast from "react-hot-toast";
import "./register.css";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../authApiSluice";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData).unwrap();
      toast.success("User registered successfully!");
      // Reset form fields
      setFormData({
        username: "",
        email: "",
        password: "",
      });
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message);
    }
  };

  return (
    <div className="signup">
      <div className="container-signup">
        <div className="heading">Sign Up</div>
        <form onSubmit={handleSubmit} className="form">
          <input
            required
            className="input"
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            required
            className="input"
            type="email"
            name="email"
            id="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            required
            className="input"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            className="login-button"
            type="submit"
            value="Sign Up"
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default Register;
