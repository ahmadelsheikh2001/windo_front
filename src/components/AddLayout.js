/* eslint-disable no-undef */

/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "..";
import axios from "axios";
import logo from '../images/file.png';
import "react-toastify/dist/ReactToastify.css";

const AddLayout = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
    const [image, setImage] = useState("");
    const [title, setTitle] = useState("");
    const [openingSystemId, setOpeningSystemId] = useState("");
    const [systems, setSystems] = useState([]);
    const [size, setSize] = useState("");
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const systemsRes = await axios.get(`${apiUrl}/api/v1/OpeningSystem`);
                setSystems(systemsRes.data.data || []);
                } 
             catch (error) {
                toast.error("Failed to fetch systems");
            }
        };

        fetchData();
    }, []);

    const handleAddCompany = async (e) => {
        e.preventDefault();
        try {
            if (!title || !image || !size || !openingSystemId) {
                toast.error("Please fill in all fields");
                return;
            }

            const formData = new FormData();
            formData.append("title", title);
            formData.append("image", image);
            formData.append("size", size);
            formData.append("openingSystem", openingSystemId);

            const res = await axios.post(
                `${apiUrl}/api/v1/Layout`,
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
            setOpeningSystemId("");
            setSize("");
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
                <h1 className="form-title">ADD A NEW LAYOUT</h1>
                <form onSubmit={handleAddCompany}>
                    <div>
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="file"
                            className="choose_image"
                            placeholder="Choose image"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Size"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                        />
                        <select value={openingSystemId} onChange={(e) => setOpeningSystemId(e.target.value)}>
                            <option value="">Select System</option>
                            {systems.map(system => (
                                <option key={system._id} value={system._id}>{system.type}</option>
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

export default AddLayout;
