/* eslint-disable no-undef */

import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "..";
import axios from "axios";
import logo from '../images/file.png'

const AddGlass = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [glass_density, setglass_density] = useState("");
  const [thickness, setThickness] = useState("");
  const [specification, setSpecification] = useState("");
  const [pricePermeterSqure, setPricePermeterSqure] = useState("");
  const [weightPermeterSqure, setWeightPermeterSqure] = useState("");
  const [glassColors, setGlassColors] = useState([]);
  const [selectedGlassColors, setSelectedGlassColors] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchGlassColors = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/v1/GlassColor`);
        setGlassColors(response.data.data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchGlassColors();
  }, []);

  const handleGlassColorChange = (e) => {
    const selectedColorId = e.target.value;
    if (!selectedGlassColors.includes(selectedColorId)) {
      setSelectedGlassColors([...selectedGlassColors, selectedColorId]);
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    try {
      if (!name || !thickness || !specification || !code || !glass_density || !weightPermeterSqure || !pricePermeterSqure || selectedGlassColors.length === 0) {
        toast.error("Please fill in all fields");
        return;
      }

      const res = await axios.post(
        `${apiUrl}/api/v1/Glass`,
        { name, thickness, specification, code, glass_density, weightPermeterSqure, pricePermeterSqure, glassColorIds: selectedGlassColors },
        {
          withCredentials: false,
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
        }
      );

      toast.success(res.data.message);
      setIsAuthenticated(true);
      setName("");
      setglass_density("");
      setCode("");
      setSpecification("");
      setThickness("");
      setWeightPermeterSqure("");
      setPricePermeterSqure("");
      setSelectedGlassColors([]);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/loginAdmin"} />;
  }

  return (
    <section className="page page2">
      <section className="container form-component add-student-form">
        <img src={logo} alt="logo" className="logo" />
        <h1 className="form-title">ADD A GLASS</h1>
        <form onSubmit={handleAddCompany}>
          <div>
            <input
              type="text"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="thickness"
              value={thickness}
              onChange={(e) => setThickness(e.target.value)}
            />
            <input
              type="text"
              placeholder="specification"
              value={specification}
              onChange={(e) => setSpecification(e.target.value)}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="pricePermeterSqure"
              value={pricePermeterSqure}
              onChange={(e) => setPricePermeterSqure(e.target.value)}
            />
            <input
              type="text"
              placeholder="weightPermeterSqure"
              value={weightPermeterSqure}
              onChange={(e) => setWeightPermeterSqure(e.target.value)}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="density of glass"
              value={glass_density}
              onChange={(e) => setglass_density(e.target.value)}
            />
            <select
              value=""
              onChange={handleGlassColorChange}
            >
              <option value="">Select Glass Color</option>
              {glassColors.map((color) => (
                <option key={color._id} value={color._id} disabled={selectedGlassColors.includes(color._id)}>
                  {color.title}
                </option>
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

export default AddGlass;
