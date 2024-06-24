/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { useContext, useState, useEffect } from "react";
import { Context } from "../index";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import img from '../images/file.png'

const AddNewAdmin = () => {
  const { isAuthenticated, role } = useContext(Context);
  const navigateTo = useNavigate();
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;
  const [email, setEmail] = useState("");
  const [telephone, settelephone] = useState("");
  const [password, setPassword] = useState("");
  const [adminRole, setAdminRole] = useState("");

  useEffect(() => {
    if (isAuthenticated && role === "Admin") {
      navigateTo("/");
    }
  }, [isAuthenticated, role, navigateTo]);

  const handleAddNewAdmin = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No token found");
        console.error("No token found");
        return;
      }

      await axios
        .post(
          `${apiUrl}/api/v1/User/addNewAdmin`,
          { first_name, email, telephone, password, country, last_name, state, city, street, area, role: adminRole }, // استخدم adminRole هنا
          {
            withCredentials: false,
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` // إضافة التوكن هنا
            },
          },
        )
        .then((res) => {
          toast.success(res.data.message);
          setfirst_name("");
          setlast_name("");
          setEmail("");
          settelephone("");
          setPassword("");
          setArea("");
          setCity("");
          setCountry("");
          setState("");
          setStreet("");
          setAdminRole(""); // إعادة تعيين الحقل
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/loginAdmin"} />;
  }

  return (
    <section className="page page2 page4">
      <section className="container form-component add-admin-form">
        <img src={img} alt="logo" className="logo" />
        <h1 className="form-title">ADD NEW ADMIN</h1>
        <form onSubmit={handleAddNewAdmin}>
          <div>
            <input
              type="text"
              placeholder="first_name"
              value={first_name}
              onChange={(e) => setfirst_name(e.target.value)}
            />
            <input
              type="text"
              placeholder="last_name"
              value={last_name}
              onChange={(e) => setlast_name(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              value={telephone}
              onChange={(e) => settelephone(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <select value={adminRole} onChange={(e) => setAdminRole(e.target.value)}>
              <option value="">Select Role</option>
              <option value="SuperAdmin">SuperAdmin</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />


            <input
              type="text"
              placeholder="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
            <input
              type="text"
              placeholder="street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">ADD</button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewAdmin;
