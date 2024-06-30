import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setCredentials } from "../authSlice";
import { useLoginMutation } from "../authApiSluice";
import usePersist from "../../../hooks/usePersist";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [persist, setPersist] = usePersist();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  //   const handleToggle = () => setPersist((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(formData).unwrap();
      const { accessToken, userId } = data;
      dispatch(setCredentials({ token: accessToken, userId: userId }));
      setPersist((prev) => !prev);
      setFormData({
        email: "",
        password: "",
      });
      toast.success("Logged in successfully");
      navigate("/");
    } catch (err) {
      const errorMessage =
        err?.data?.message || err?.error || "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="signin">
      <div className="container-signin">
        <div className="heading">Sign In</div>
        <form onSubmit={handleSubmit} className="form">
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
          <p className="signup-link">
            <Link to="/register">
              Don't have an Account? <span>Sign up</span>
            </Link>
          </p>
          <input
            className="login-button"
            type="submit"
            value={isLoading ? "Signing In..." : "Sign In"}
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
