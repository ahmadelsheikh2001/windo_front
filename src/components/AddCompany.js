/* eslint-disable no-undef */

import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import logo from '../images/file.png';
import "react-toastify/dist/ReactToastify.css";
import { Context } from "..";
import { Navigate } from "react-router-dom";

const AddCompany = () => {
  const [name, setName] = useState("");
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [materialId, setMaterialId] = useState("");
  const [image, setImage] = useState(null);
  const [size, setSize] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const materialRes = await axios.get(`${apiUrl}/api/v1/Material`);
        setMaterials(materialRes.data.data || []);
      } catch (error) {
        toast.error("Failed to fetch materials");
      }
    };

    fetchData();
  }, []);

  const handleAddCompany = async (e) => {
    e.preventDefault();
    try {
      if (!name || !image || !size || !materialId) { // استخدم التسمية الصحيحة
        toast.error("Please fill in all fields");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);
      formData.append("size", size);
      formData.append("material", materialId); // استخدم التسمية الصحيحة

      const res = await axios.post(
        `${apiUrl}/api/v1/Company`,
        formData,
        {
          withCredentials: false,
        }
      );

      toast.success(res.data.message);
      setName("");
      setMaterialId("");
      setSize("");
      setIsAuthenticated(true)
      setImage(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add company");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/loginAdmin"} />;
  }

  return (
    <section className="page3">
      <section className="container form-component add-company-form">
        <img src={logo} alt="logo" className="logo" />
        <h1 className="form-title">ADD A NEW COMPANY</h1>
        <form onSubmit={handleAddCompany}>
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="file"
              className="choose_image"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
          </div>
          <div>
            <select value={materialId} onChange={(e) => setMaterialId(e.target.value)}>
              <option value="">Select Material</option>
              {materials.length > 0 && materials.map(material => (
                <option key={material._id} value={material._id}>{material.type.join(", ")}</option>
              ))}
            </select>
          </div>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">ADD</button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddCompany;
