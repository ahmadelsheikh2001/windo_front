/* eslint-disable no-undef */

import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from '../images/file.png'
import axios from "axios";
import { Context } from "..";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("SuperAdmin");
  const {isAuthenticated, setIsAuthenticated} = useContext(Context);
  const navigateTo = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${apiUrl}/api/v1/Auth/loginAdmin`,
        { email, password, role },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const token = response.data.token;
      if (token) {
        localStorage.setItem("authToken", token);
        toast.success(response.data.message);
        setIsAuthenticated(true)
        navigateTo("/"); // توجيه المستخدم إلى الصفحة الرئيسية
        setEmail("");
        setPassword("");
        setRole("");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  
  if(isAuthenticated){
    return <Navigate to="/" />
  }
  return (
    <>
      <section className="container form-component login_component">
        <img src={logo} alt="logo" className="logo" />
        <h1 className="form-title">WELCOME TO NILE WINDOW</h1>
        <p>Only Admins Are Allowed To Access These Resources!</p>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="SuperAdmin">SuperAdmin</option>
            <option value="Admin">Admin</option>
          </select>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">Login</button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Login;
