/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "..";
import axios from "axios";
import logo from '../images/file.png';
import "react-toastify/dist/ReactToastify.css";

const AddCuttingProcess = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
    const [thickenss, setThickenss] = useState("");
    const [Welding_time, setWelding_time] = useState("");
    const [profileId, setProfileId] = useState("");
    const [profiles, setProfiles] = useState([]); 
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/v1/Profile`);
                setProfiles(response.data.data);
            } catch (error) {
                console.error("Error fetching profiles:", error);
                toast.error("Error fetching profiles. Please try again later.");
            }
        };

        fetchProfiles();
    }, []); // فقط عندما يتم تحميل المكون

    const handleAddSize = async (e) => {
        e.preventDefault();

        try {
            if (!thickenss || !Welding_time || !profileId) {
                toast.error("Please fill in all fields");
                return;
            }

            const res = await axios.post(
                `${apiUrl}/api/v1/CuttingProcess`,
                { thickenss, Welding_time, profile: profileId },
                {
                    withCredentials: false,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success(res.data.message);
            setIsAuthenticated(true);
            setThickenss("");
            setWelding_time("");
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
            <section className="container form-component add-material-form">
                <img src={logo} alt="logo" className="logo" />
                <h1 className="form-title">Add Cutting Process</h1>
                <form onSubmit={handleAddSize}>
                    <div>
                        <input
                            type="number"
                            placeholder="Blade Thickenss"
                            value={thickenss}
                            onChange={(e) => setThickenss(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder="Welding_time"
                            value={Welding_time}
                            onChange={(e) => setWelding_time(e.target.value)}
                        />
                        <select
                            value={profileId}
                            onChange={(e) => setProfileId(e.target.value)}
                            required
                        >
                            <option value="">Select a profile...</option>
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
        </section>
    );
};

export default AddCuttingProcess;
