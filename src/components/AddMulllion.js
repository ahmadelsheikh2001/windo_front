/* eslint-disable no-undef */

import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import logo from '../images/file.png';
import "react-toastify/dist/ReactToastify.css";
import { Context } from "..";
import { Navigate } from "react-router-dom";

const AddNewMullion = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [Length_of_Beam, setLengthOfBeamId] = useState("");
    const [Width, setWidth] = useState("");
    const [weightPermeter, setWeightPermeter] = useState("");
    const apiUrl = process.env.REACT_APP_API_URL;
    const [pricePermeter, setPricePermeter] = useState("");
    const [ProfileId, setProfileId] = useState("");
    const [profiles, setProfiles] = useState([]);
    const [frames, setFrames] = useState([]);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/v1/Profile`);
                setProfiles(res.data.data); // Set the entire profiles array
            } catch (error) {
                toast.error("Failed to fetch profiles");
            }
        };

        fetchProfiles();
    }, []);

    useEffect(() => {
        const fetchFrames = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/v1/Frame`);
                setFrames(res.data.data);
            } catch (error) {
                toast.error("Failed to fetch frames");
            }
        };

        fetchFrames();
    }, []);
    const handleAddMullion = async (e) => {
        e.preventDefault();
        try {
            if (!name || !code || !Width || !weightPermeter || !pricePermeter || !ProfileId || !Length_of_Beam) {
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

            const res = await axios.post(
                `${apiUrl}/api/v1/Mullion`,
                {
                    name,
                    code,
                    Length_of_Beam,
                    Width,
                    weightPermeter,
                    pricePermeter,
                    price_beam,
                    profile: ProfileId
                },
                {
                    withCredentials: false,
                    headers: { "Content-Type": "application/json" },
                }
            );

            toast.success(res.data.message);
            setIsAuthenticated(true);
            setName("");
            setCode("");
            setLengthOfBeamId("");
            setWidth("");
            setWeightPermeter("");
            setPricePermeter("");
            setProfileId("");
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
                <h1 className="form-title">ADD A NEW MULLION</h1>
                <form onSubmit={handleAddMullion}>
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
                            placeholder="Width"
                            value={Width}
                            onChange={(e) => setWidth(e.target.value)}
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
                        <select value={ProfileId} onChange={(e) => setProfileId(e.target.value)}>
                            <option value="">Select Profile ...</option>
                            {profiles.map(profilee => (
                                <option key={profilee._id} value={profilee._id}>{profilee.brandname}</option>
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

export default AddNewMullion;
