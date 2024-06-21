/* eslint-disable no-undef */


import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "..";
import axios from "axios";
import logo from '../images/file.png';
import "react-toastify/dist/ReactToastify.css";

const AddFloatingMullion = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [lengthOfBeamId, setLengthOfBeamId] = useState("");
    const [weightPermeter, setWeightPermeter] = useState("");
    const apiUrl = process.env.REACT_APP_API_URL;
    const [pricePermeter, setPricePermeter] = useState("");
    const [profileId, setProfileId] = useState("");
    const [lengthOfBeams, setLengthOfBeams] = useState([]);
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        const fetchLengthOfBeams = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/v1/Frame`);
                setLengthOfBeams(response.data.data);
            } catch (error) {
                console.error("Error fetching length of beams:", error);
                toast.error("Error fetching length of beams. Please try again later.");
            }
        };

        const fetchProfiles = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/v1/Profile`);
                setProfiles(response.data.data);
            } catch (error) {
                console.error("Error fetching profiles:", error);
                toast.error("Error fetching profiles. Please try again later.");
            }
        };

        fetchLengthOfBeams();
        fetchProfiles();
    }, []);

    const handleAddMullion = async (e) => {
        e.preventDefault();

        try {
            if (!name || !code || !weightPermeter || !pricePermeter || !profileId) {
                toast.error("Please fill in all required fields");
                return;
            }

            const selectedLengthOfBeamOption = lengthOfBeams.find(option => option._id === lengthOfBeamId);
            if (!selectedLengthOfBeamOption) {
                toast.error("Invalid length of beam");
                return;
            }
            const lengthOfBeam = parseFloat(selectedLengthOfBeamOption.Length_of_Beam);
            const price_beam = parseFloat(pricePermeter) * lengthOfBeam;

            const res = await axios.post(
                `${apiUrl}/api/v1/FloatingMullion`,
                {
                    name,
                    code,
                    Length_of_Beam: lengthOfBeamId,
                    weightPermeter,
                    pricePermeter,
                    price_beam,
                    profile: profileId
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
                <h1 className="form-title">Add Floating Mullion</h1>
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
                        <select
                            value={lengthOfBeamId}
                            onChange={(e) => setLengthOfBeamId(e.target.value)}
                            required
                        >
                            <option value="">Select a length of beam...</option>
                            {lengthOfBeams.map(beam => (
                                <option key={beam._id} value={beam._id}>{beam.Length_of_Beam}</option>
                            ))}
                        </select>
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
                        <select
                            value={profileId}
                            onChange={(e) => setProfileId(e.target.value)}
                            required
                        >
                            <option value="">Select profile...</option>
                            {profiles.map(profile => (
                                <option key={profile._id} value={profile._id}>{profile.brandname}</option>
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

export default AddFloatingMullion;
