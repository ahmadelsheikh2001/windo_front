/* eslint-disable no-undef */
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "..";
import logo from '../images/file.png';
import "react-toastify/dist/ReactToastify.css";
import { Navigate } from "react-router-dom";

const AddOpeningLayout = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
    const [image, setImage] = useState("");
    const [title, setTitle] = useState("");
    const apiUrl = process.env.REACT_APP_API_URL;
    const [fanlightId, setFanlightId] = useState("");
    const [layoutId, setLayoutId] = useState("");
    const [fanlights, setFanlights] = useState([]);
    const [layouts, setLayouts] = useState([]);
    const [fanlightDisabled, setFanlightDisabled] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [layoutsRes] = await Promise.all([
                    axios.get(`${apiUrl}/api/v1/Layout`)
                ]);
                if (layoutsRes.data && layoutsRes.data.data) {
                    setLayouts(layoutsRes.data.data);
                }
            } catch (error) {
                toast.error("Failed to fetch data");
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchFanlights = async () => {
            if (layoutId) {
                try {
                    const res = await axios.get(`${apiUrl}/api/v1/Fanlight?layout=${layoutId}`);
                    if (res.data && res.data.data) {
                        setFanlights(res.data.data);
                        setFanlightDisabled(false);
                    }
                } catch (error) {
                    toast.error("Failed to fetch fanlights");
                    setFanlightDisabled(true);
                }
            } else {
                setFanlightDisabled(true);
                setFanlights([]);
            }
        };

        fetchFanlights();
    }, [layoutId]);

    const handleAddCompany = async (e) => {
        e.preventDefault();
        try {
            if (!title || !image || !fanlightId || !layoutId) {
                toast.error("Please fill in all fields");
                return;
            }

            const formData = new FormData();
            formData.append("title", title);
            formData.append("image", image);
            formData.append("fanlight", fanlightId);
            formData.append("layout", layoutId);

            const res = await axios.post(
                `${apiUrl}/api/v1/OpeningLayout`,
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
            setTitle("");
            setLayoutId("");
            setFanlightId("");
            setImage(null);
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
                <h1 className="form-title">Add Opening Layout</h1>
                <form onSubmit={handleAddCompany}>
                    <div>
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <select value={layoutId} onChange={(e) => setLayoutId(e.target.value)}>
                            <option value="">Select layouts</option>
                            {layouts.length > 0 && layouts.map(layout => (
                                <option key={layout._id} value={layout._id}>{layout.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input
                            type="file"
                            className="choose_image"
                            placeholder="Choose image"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                        <select value={fanlightId} onChange={(e) => setFanlightId(e.target.value)} disabled={fanlightDisabled}>
                            <option value="">Select Fanlight</option>
                            {fanlights.length > 0 && fanlights.map(fanlight => (
                                <option key={fanlight._id} value={fanlight._id}>{fanlight.title}</option>
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

export default AddOpeningLayout;
