/* eslint-disable no-undef */

import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "..";
import axios from "axios";
import logo from '../images/file.png'

const AddGlassColor = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState("");
    const [plus, setPlus] = useState("");
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleAddNewStudent = async (e) => {
        e.preventDefault();
        try {
            if (!title || !image || !plus) {
                toast.error("Please fill in all fields");
                return;
            }

            const formData = new FormData();
            formData.append("title", title);
            formData.append("image", image);
            formData.append("plus", plus);

            const res = await axios.post(
                `${apiUrl}/api/v1/GlassColor`,
                formData,
                {
                    withCredentials: false,
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            toast.success(res.data.message);
            setIsAuthenticated(true);
            setTitle("");
            setPlus("");
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
                <h1 className="form-title">Add Glass Color</h1>
                <form onSubmit={handleAddNewStudent}>
                    <div>
                        <input
                            type="text"
                            placeholder="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="plus"
                            value={plus}
                            onChange={(e) => setPlus(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="file"
                            className="Chooose_image"
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

export default AddGlassColor;
