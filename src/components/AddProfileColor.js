/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "..";
import axios from "axios";
import logo from '../images/file.png';
import "react-toastify/dist/ReactToastify.css";

const AddProfileColor = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
    const [title, setTitle] = useState("");
    const apiUrl = process.env.REACT_APP_API_URL;
    const [image, setImage] = useState(null);

    const handleAddNewStudent = async (e) => {
        e.preventDefault();
        try {
            if (!image || !title) {
                toast.error("Please fill in all fields");
                return;
            }

            const formData = new FormData();
            formData.append("title", title);
            formData.append("image", image);

            const res = await axios.post(
                `${apiUrl}/api/v1/ProfileColor`,
                formData,
                {
                    withCredentials: false,
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            toast.success(res.data.message);
            setIsAuthenticated(true);
            setTitle("");
            setImage(null);
        } catch (error) {
            toast.error(error.response.data.message || "An error occurred");
        }
    };
    
    if (!isAuthenticated) {
        return <Navigate to={"/loginAdmin"} />;
    }

    return (
        <section className="page page2">
            <section className="container form-component add-student-form">
                <img src={logo} alt="logo" className="logo" />
                <h1 className="form-title">Add Profile Color</h1>
                <form onSubmit={handleAddNewStudent}>
                    <div>
                        <input
                            type="text"
                            placeholder="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="file"
                            className="Chooose_image Chooose_image2"
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

export default AddProfileColor;
