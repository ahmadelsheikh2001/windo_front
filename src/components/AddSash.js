/* eslint-disable no-undef */

import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "..";
import { Navigate } from "react-router-dom";
import logo from '../images/file.png';
import "react-toastify/dist/ReactToastify.css";

const AddSash = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [Length_of_Beam, setLengthOfBeamId] = useState("");
    const [image, setImage] = useState("");
    const [from, setFrom] = useState("");
    const [height, setHeight] = useState("");
    const [weightPermeter, setWeightPermeter] = useState("");
    const [pricePermeter, setPricePermeter] = useState("");
    const [profile, setProfileId] = useState("");
    const [profiles, setProfiles] = useState([]);
    const [frames, setFrames] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, framesRes] = await Promise.all([
                    axios.get(`${apiUrl}/api/v1/Profile`),
                    axios.get(`${apiUrl}/api/v1/Frame`)
                ]);
                if (profileRes.data && profileRes.data.data) {
                    setProfiles(profileRes.data.data);
                }
                if (framesRes.data && framesRes.data.data) {
                    setFrames(framesRes.data.data);
                }
            } catch (error) {
                toast.error("Failed to fetch data");
            }
        };

        fetchData();
    }, []);

    const handleAddSash = async (e) => {
        e.preventDefault();

        try {
            if (!name || !code || !height || !image || !from || !weightPermeter || !pricePermeter || !profile) {
                toast.error("Please fill in all required fields");
                return;
            }

            const selectedFrame = frames.find(frame => frame._id === Length_of_Beam);
            if (!selectedFrame) {
                toast.error("Invalid length of beam");
                return;
            }

            const lengthOfBeam = parseFloat(selectedFrame.Length_of_Beam);
            const price_beam = parseFloat(pricePermeter) * lengthOfBeam;

            const formData = new FormData();
            formData.append("name", name);
            formData.append("code", code);
            formData.append("height", height);
            formData.append("image", image);
            formData.append("from", from);
            formData.append("weightPermeter", weightPermeter);
            formData.append("Length_of_Beam", Length_of_Beam);
            formData.append("pricePermeter", pricePermeter);
            formData.append("price_beam", price_beam);
            formData.append("profile", profile);

            const res = await axios.post(
                `${apiUrl}/api/v1/Sash`,
                formData,
                {
                    withCredentials: false,
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            toast.success(res.data.message);
            setIsAuthenticated(true);
            setName("");
            setCode("");
            setLengthOfBeamId("");
            setHeight("");
            setWeightPermeter("");
            setPricePermeter("");
            setProfileId("");
            setFrom("");
            setImage("");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    if (!isAuthenticated) {
        return <Navigate to={"/loginAdmin"} />;
    }

    return (
        <section className="page page2 page4">
            <section className="container form-component add-mullion-form">
                <img src={logo} alt="logo" className="logo" />
                <h1 className="form-title">Add Sash</h1>
                <form onSubmit={handleAddSash}>
                    <div>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>
                    <div>
                        <select value={Length_of_Beam} onChange={(e) => setLengthOfBeamId(e.target.value)}>
                            <option value="">Select Length of Beam</option>
                            {frames.map(frame => (
                                <option key={frame._id} value={frame._id}>{frame.Length_of_Beam}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="height"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder="Weight per Meter"
                            value={weightPermeter}
                            onChange={(e) => setWeightPermeter(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder="Price per Meter"
                            value={pricePermeter}
                            onChange={(e) => setPricePermeter(e.target.value)}
                        />
                        <select value={profile} onChange={(e) => setProfileId(e.target.value)}>
                            <option value="">Select Profile</option>
                            {profiles.length > 0 && profiles.map(profile => (
                                <option key={profile._id} value={profile._id}>{profile.brandname}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder="from"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="file"
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

export default AddSash;
