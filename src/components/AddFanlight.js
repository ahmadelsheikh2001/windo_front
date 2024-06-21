/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "..";
import axios from "axios";
import logo from '../images/file.png';
import "react-toastify/dist/ReactToastify.css";

const AddFanlight = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
    const [title, setTitle] = useState("");
    const apiUrl = process.env.REACT_APP_API_URL;
    const [layout, setLayoutId] = useState("");
    const [image, setImage] = useState(null);
    const [layouts, setlayoutes] = useState([]);

    useEffect(() => {
        const fetchLayouts = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/v1/Layout`);
                setlayoutes(response.data.data);
            } catch (error) {
                console.error("Error fetching layoutes:", error);
                toast.error("Error fetching layoutes. Please try again later.");
            }
        };

        fetchLayouts();
    }, []);

    const handleAddFanlight = async (e) => {
        e.preventDefault();

        try {
            if (!title || !layout || !image) {
                toast.error("Please fill in all fields");
                return;
            }

            const formData = new FormData();
            formData.append("title", title);
            formData.append("layout", layout);
            formData.append("image", image);

            const res = await axios.post(`${apiUrl}/api/v1/Fanlight`,
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
            setImage(null);
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
                <h1 className="form-title">Add a new Fanlight</h1>
                <form onSubmit={handleAddFanlight}>
                    <div>
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <select
                            value={layout}
                            onChange={(e) => setLayoutId(e.target.value)}
                            required
                        >
                            <option value="">Select Layout...</option>
                            {layouts.map(layout => (
                                <option key={layout._id} value={layout._id}>{layout.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input
                            type="file"
                            className="choose-image"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    <div style={{ justifyContent: "center", alignItems: "center" }}>
                        <button type="submit">ADD</button>
                    </div>
                </form>
            </section>
        </section >
    );
};

export default AddFanlight;
