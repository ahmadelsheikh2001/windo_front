/* eslint-disable no-undef */
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "..";
import axios from "axios";
import logo from '../images/file.png';
import "react-toastify/dist/ReactToastify.css";

const AddFrame = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [from, setFrom] = useState("");
  const [code, setCode] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;
  const [Length_of_Beam, setLengthOfBeam] = useState("");
  const [Renovation, setRenovation] = useState("");
  const [Renovation_height, setRenovationHeight] = useState("");
  const [Frame_Height, setFrameHeight] = useState("");
  const [Frame_Width, setFrameWidth] = useState("");
  const [weightPermeter, setWeightPermeter] = useState("");
  const [pricePermeter, setPricePermeter] = useState("");
  const [profile, setProfile] = useState("");
  const [profiles, setProfileies] = useState([]);
  const [price_beam, setPriceBeam] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get(`${apiUrl}/api/v1/Profile`);
        setProfileies(profileRes.data.data || []);
      } catch (error) {
        toast.error("Failed to fetch profiles");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const beamPrice = Length_of_Beam && pricePermeter ? Length_of_Beam * pricePermeter : 0;
    setPriceBeam(beamPrice);
  }, [Length_of_Beam, pricePermeter]);

  const handleAddCompany = async (e) => {
    e.preventDefault();
    try {
      if (!name || !image || !Renovation || !code || !Length_of_Beam || !pricePermeter || !profile || !weightPermeter || !Frame_Width || !Frame_Height || !Renovation_height) {
        toast.error("Please fill in all fields");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);
      formData.append("code", code);
      formData.append("from", from);
      formData.append("profile", profile);
      formData.append("Renovation", Renovation === "Yes");
      formData.append("Length_of_Beam", Length_of_Beam);
      formData.append("pricePermeter", pricePermeter);
      formData.append("weightPermeter", weightPermeter);
      formData.append("Frame_Width", Frame_Width);
      formData.append("Frame_Height", Frame_Height);
      formData.append("Renovation_height", Renovation_height);
      formData.append("price_beam", price_beam);

      const res = await axios.post(
        `${apiUrl}/api/v1/Frame`,
        formData,
        {
          withCredentials: false,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(res.data.message);
      setIsAuthenticated(true);
      setName("");
      setImage(null);
      setFrom("");
      setCode("");
      setLengthOfBeam("");
      setRenovation("");
      setRenovationHeight("");
      setFrameHeight("");
      setFrameWidth("");
      setWeightPermeter("");
      setPricePermeter("");
      setProfile("");
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
        <h1 className="form-title">Add Frame</h1>
        <form onSubmit={handleAddCompany}>
          <div>
            <input
              type="text"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="number"
              placeholder="from price"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div>
            <input
              type="file"
              className="Chooose_image3"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <div className="radio">
              <label>Renovation:</label>
              <div>
                <label>Yes</label>
                <input
                  type="radio"
                  placeholder="Renovation"
                  name="renovation"
                  value="Yes"
                  checked={Renovation === "Yes"}
                  onChange={(e) => setRenovation(e.target.value)}
                />
                <label>No</label>
                <input
                  type="radio"
                  name="renovation"
                  placeholder="Renovation"
                  value="No"
                  checked={Renovation === "No"}
                  onChange={(e) => setRenovation(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div>
            <input
              type="number"
              placeholder="Length_of_Beam"
              value={Length_of_Beam}
              onChange={(e) => setLengthOfBeam(e.target.value)}
            />
            <input
              type="number"
              placeholder="Frame of Height"
              value={Frame_Height}
              onChange={(e) => setFrameHeight(e.target.value)}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Frame_Width"
              value={Frame_Width}
              onChange={(e) => setFrameWidth(e.target.value)}
            />
            <input
              type="number"
              placeholder="Renovation of height"
              value={Renovation_height}
              onChange={(e) => setRenovationHeight(e.target.value)}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="weight_Permeter"
              value={weightPermeter}
              onChange={(e) => setWeightPermeter(e.target.value)}
            />
            <input
              type="number"
              placeholder="price_Permeter"
              value={pricePermeter}
              onChange={(e) => setPricePermeter(e.target.value)}
            />
          </div>
          <div>
            <select value={profile} onChange={(e) => setProfile(e.target.value)}>
              <option value="">Select Profile</option>
              {profiles.length > 0 && profiles.map(profile => (
                <option key={profile._id} value={profile._id}>{profile.brandname}</option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="number"
              placeholder="priceBeam"
              value={price_beam}
              readOnly
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

export default AddFrame;
