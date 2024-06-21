/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import logo from '../images/file.png';
import "react-toastify/dist/ReactToastify.css";
import { Context } from "..";
import { Navigate } from "react-router-dom";

const AddMaterial = () => {
  const [type, setType] = useState("");
  const [from, setFrom] = useState("");
  const [image, setImage] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const handleAddNewMaterial = async (e) => {
    e.preventDefault();
    try {
      if (!type || !image || !from) {
        toast.error("Please fill in all fields");
        return;
      }
      const formData = new FormData();
      formData.append("type", type);
      formData.append("image", image);
      formData.append("from", from); // إرسال معرف الشركة

      const res = await axios.post(
        `${apiUrl}/api/v1/Material`,
        formData
      );

      toast.success(res.data.message);
      setType("");
      setFrom("");
      setImage("");
      setIsAuthenticated(true)
    } catch (error) {
      toast.error(error.response.data.message || "Failed to add material");
    }
  };
  if (!isAuthenticated) {
    return <Navigate to={"/loginAdmin"} />;
  }
  return (
    <section className="page page2">
      <section className="container form-component add-student-form">
        <img src={logo} alt="logo" className="logo" />
        <h1 className="form-title">Add a New Material</h1>
        <form onSubmit={handleAddNewMaterial}>
          <div>
            <input
              type="text"
              placeholder="Type of Material"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
            <input
              type="number"
              placeholder="From Price"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div>
            <input
              type="file"
              className="Choose_image Choose_image2"
              onChange={(e) => setImage(e.target.files[0])}
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

export default AddMaterial;
