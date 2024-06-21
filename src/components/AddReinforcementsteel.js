/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "..";
import axios from "axios";
import logo from '../images/file.png';
import "react-toastify/dist/ReactToastify.css";

const AddReinforcementsteel = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const apiUrl = process.env.REACT_APP_API_URL;
    const [thickness, setthickness] = useState("");
    const [weightPermeter, setWeightPermeter] = useState("");
    const [pricePermeter, setPricePermeter] = useState("");
    const [sashId, setSashId] = useState("");
    const [FrameId, setFrameId] = useState("");
    const [FloatingMullionId, setFloatingMullionId] = useState("");
    const [MullionId, setMullionId] = useState("");
    const [Sash, setSash] = useState([]);
    const [Frame, setFrame] = useState([]);
    const [FloatingMullion, setFloatingMullion] = useState([]);
    const [Mullion, setMullion] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [SashRes, framesRes, FloatingMullionRes, MullionRes] = await Promise.all([
                    axios.get(`${apiUrl}/api/v1/Sash`),
                    axios.get(`${apiUrl}/api/v1/Frame`),
                    axios.get(`${apiUrl}/api/v1/FloatingMullion`),
                    axios.get(`${apiUrl}/api/v1/Mullion`),
                ]);
                if (SashRes.data && SashRes.data.data) {
                    setSash(SashRes.data.data);
                }
                if (framesRes.data && framesRes.data.data) {
                    setFrame(framesRes.data.data);
                }
                if (FloatingMullionRes.data && FloatingMullionRes.data.data) {
                    setFloatingMullion(FloatingMullionRes.data.data);
                }
                if (MullionRes.data && MullionRes.data.data) {
                    setMullion(MullionRes.data.data);
                }
            } catch (error) {
                toast.error("Failed to fetch data");
            }
        };

        fetchData();
    }, []);

    const handleAddMullion = async (e) => {
        e.preventDefault();
        try {
            if (!name || !code || !weightPermeter || !thickness || !pricePermeter || !sashId || !FrameId || !FloatingMullionId || !MullionId) {
                toast.error("Please fill in all required fields");
                return;
            }
            const selectedFrame = Frame.find(frame => frame._id === FrameId);
            if (!selectedFrame) {
                toast.error("Selected frame not found");
                return;
            }

            const lengthOfBeam = parseFloat(selectedFrame.Length_of_Beam);
            const price_beam = parseFloat(pricePermeter) * lengthOfBeam;

            const res = await axios.post(
                `${apiUrl}/api/v1/Reinforcementsteel`,
                {
                    name, code, thickness, weightPermeter, pricePermeter,
                    sash: sashId, frame: FrameId, floatingMullion: FloatingMullionId, mullion: MullionId, price_beam
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
            setWeightPermeter("");
            setPricePermeter("");
            setSashId("");
            setFrameId("");
            setFloatingMullionId("");
            setMullionId("");
            setthickness("");
            setIsAuthenticated(true)
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
                <h1 className="form-title">Add Reinforcementsteel</h1>
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
                        <input
                            type="number"
                            placeholder="Weight per Meter"
                            value={weightPermeter}
                            onChange={(e) => setWeightPermeter(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="thickness"
                            value={thickness}
                            onChange={(e) => setthickness(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder="Price per Meter"
                            value={pricePermeter}
                            onChange={(e) => setPricePermeter(e.target.value)}
                        />
                        <select value={sashId} onChange={(e) => setSashId(e.target.value)}>
                            <option value="">Select Sash</option>
                            {Sash.length > 0 && Sash.map(sash => (
                                <option key={sash._id} value={sash._id}>{sash.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select value={FrameId} onChange={(e) => setFrameId(e.target.value)}>
                            <option value="">Select Frame ...</option>
                            {Frame.length > 0 && Frame.map(frame => (
                                <option key={frame._id} value={frame._id}>{frame.name}</option>
                            ))}
                        </select>
                        <select value={FloatingMullionId} onChange={(e) => setFloatingMullionId(e.target.value)}>
                            <option value="">Select FloatingMullion ...</option>
                            {FloatingMullion.length > 0 && FloatingMullion.map(float => (
                                <option key={float._id} value={float._id}>{float.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select value={MullionId} onChange={(e) => setMullionId(e.target.value)}>
                            <option value="">Select Mullion ...</option>
                            {Mullion.length > 0 && Mullion.map(mullion => (
                                <option key={mullion._id} value={mullion._id}>{mullion.name}</option>
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

export default AddReinforcementsteel;
