/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "..";
import axios from "axios";
import logo from '../images/file.png';
import "react-toastify/dist/ReactToastify.css";

const AddGlazingBead = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [lengthOfBeamId, setLengthOfBeamId] = useState("");
    const [height, setheight] = useState("");
    const [weightPermeter, setWeightPermeter] = useState("");
    const apiUrl = process.env.REACT_APP_API_URL;
    const [pricePermeter, setPricePermeter] = useState("");
    const [profileId, setProfileId] = useState("");
    const [profiles, setProfiles] = useState([]);
    const [frames, setFrames] = useState([]);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/v1/Profile`);
                setProfiles(res.data.data);
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
    const handleAddGlazingBead = async (e) => {
        e.preventDefault();

        try {
            if (!name || !code || !height || !weightPermeter || !pricePermeter || !profileId || !lengthOfBeamId) {
                toast.error("Please fill in all required fields");
                return;
            }

            const selectedFrame = frames.find(frame => frame._id === lengthOfBeamId);
            if (!selectedFrame) {
                toast.error("Invalid length of beam");
                return;
            }

            const lengthOfBeam = parseFloat(selectedFrame.Length_of_Beam);
            const price_beam = parseFloat(pricePermeter) * lengthOfBeam;

            const selectedProfile = profiles.find(profile => profile._id === profileId);
            if (!selectedProfile) {
                toast.error("Invalid profile");
                return;
            }
            const profileColorId = selectedProfile.profileColor?._id;
            const res = await axios.post(
                `${apiUrl}/api/v1/GlazingBead`,
                {
                    name,
                    code,
                    Length_of_Beam: lengthOfBeamId,
                    height,
                    weightPermeter,
                    pricePermeter,
                    price_beam,
                    profile: profileId,
                    profileColor: profileColorId 
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
            setheight("");
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
                <h1 className="form-title">Add Glazing Bead</h1>
                <form onSubmit={handleAddGlazingBead}>
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
                        <select value={lengthOfBeamId} onChange={(e) => setLengthOfBeamId(e.target.value)}>
                            <option value="">Select Length of Beam</option>
                            {frames.map(frame => (
                                <option key={frame._id} value={frame._id}>{frame.Length_of_Beam}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="height"
                            value={height}
                            onChange={(e) => setheight(e.target.value)}
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
                        <select value={profileId} onChange={(e) => setProfileId(e.target.value)}>
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
        </section >
    );
};

export default AddGlazingBead;
