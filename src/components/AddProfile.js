/* eslint-disable no-undef */

import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Context } from "..";
import axios from "axios";
import logo from '../images/file.png';
import "react-toastify/dist/ReactToastify.css";
import { Navigate } from "react-router-dom";

const AddProfile = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [brandname, setBrandname] = useState("");
  const [company, setCompanyId] = useState("");
  const [image, setImage] = useState(null);
  const [desc1, setDesc1] = useState("");
  const [desc2, setDesc2] = useState("");
  const [desc3, setDesc3] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;
  const [surcharge, setSurcharge] = useState("");
  const [system, setSystemId] = useState("");
  const [material, setMaterialId] = useState("");
  const [profileColor, setColorId] = useState("");
  const [companies, setCompanies] = useState([]);
  const [systems, setSystems] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/Company`);
      setCompanies(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch companies");
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/Material`);
      setMaterials(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch materials");
    }
  };

  const fetchColors = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/v1/ProfileColor`);
      setColors(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch profile colors");
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchMaterials();
    fetchColors();
  }, []);

  useEffect(() => {
    if (company) {
      const fetchSystemsByCompany = async () => {
        try {
          const response = await axios.get(`${apiUrl}/api/v1/OpeningSystem?company=${company}`);
          setSystems(response.data.data || []);
        } catch (error) {
          toast.error("Failed to fetch opening systems");
        }
      };
      fetchSystemsByCompany();
    } else {
      setSystems([]);
    }
  }, [company]);

  useEffect(() => {
    if (material) {
      const fetchCompaniesByMaterial = async () => {
        try {
          const response = await axios.get(`${apiUrl}/api/v1/Company?material=${material}`);
          setCompanies(response.data.data || []);
        } catch (error) {
          toast.error("Failed to fetch companies");
        }
      };
      fetchCompaniesByMaterial();
    } else {
      fetchCompanies(); 
    }
  }, [material]);

  const handleAddProfile = async (e) => {
    e.preventDefault();
    try {
      if (!brandname || !company || !system || !material || !profileColor || !image) {
        toast.error("Please fill in all fields");
        return;
      }
      const formData = new FormData();
      formData.append("brandname", brandname);
      formData.append("company", company);
      formData.append("system", system);
      formData.append("material", material);
      formData.append("profileColor", profileColor);
      formData.append("image", image);
      formData.append("desc1", desc1);
      formData.append("desc2", desc2);
      formData.append("desc3", desc3);
      formData.append("surcharge", surcharge);

      const res = await axios.post(
        `${apiUrl}/api/v1/Profile`,
        formData,
        {
          withCredentials: false,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data.message);
      setIsAuthenticated(true);

      // Reset fields after submission
      setBrandname("");
      setCompanyId("");
      setSystemId("");
      setMaterialId("");
      setColorId("");
      setDesc1("");
      setDesc2("");
      setDesc3("");
      setImage(null);
      setSurcharge("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/loginAdmin"} />;
  }

  return (
    <section className="page page2 page4">
      <section className="container form-component add-profile-form">
        <img src={logo} alt="logo" className="logo" />
        <h1 className="form-title">Add a new Profile</h1>
        <form onSubmit={handleAddProfile}>
          <div>
            <input
              type="text"
              placeholder="Brand Name"
              value={brandname}
              onChange={(e) => setBrandname(e.target.value)}
            />
          </div>
          <div>
            <select value={material} onChange={(e) => setMaterialId(e.target.value)}>
              <option value="">Select material</option>
              {materials.length > 0 && materials.map(material => (
                <option key={material._id} value={material._id}>{material.type}</option>
              ))}
            </select>
          </div>
          <div>
            <select value={company} onChange={(e) => setCompanyId(e.target.value)} disabled={!material}>
              <option value="">Select company</option>
              {companies.length > 0 && companies.map(company => (
                <option key={company._id} value={company._id}>{company.name}</option>
              ))}
            </select>
          </div>
          <div>
            <select value={system} onChange={(e) => setSystemId(e.target.value)} disabled={!company}>
              <option value="">Select Opening system</option>
              {systems.length > 0 && systems.map(system => (
                <option key={system._id} value={system._id}>{system.type}</option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="file"
              className="choose-image"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <div>
            <select value={profileColor} onChange={(e) => setColorId(e.target.value)}>
              <option value="">Select Color</option>
              {colors.length > 0 && colors.map(color => (
                <option key={color._id} value={color._id}>{color.title}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Description1"
              value={desc1}
              onChange={(e) => setDesc1(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Description2"
              value={desc2}
              onChange={(e) => setDesc2(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Description3"
              value={desc3}
              onChange={(e) => setDesc3(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="surcharge"
              value={surcharge}
              onChange={(e) => setSurcharge(e.target.value)}
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

export default AddProfile;
