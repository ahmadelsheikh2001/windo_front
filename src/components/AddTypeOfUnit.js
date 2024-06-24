/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "..";
import axios from "axios";
import logo from '../images/file.png';
import "react-toastify/dist/ReactToastify.css";
import { Navigate } from "react-router-dom";

const AddTypeOfUnit = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
    const [type, setType] = useState("");
    const apiUrl = process.env.REACT_APP_API_URL;

    const handleAddSize = async (e) => {
        e.preventDefault();
        try {
            if (!type) {
                toast.error("Please fill in all fields");
                return;
            }
            const res = await axios.post(
                `${apiUrl}/api/v1/TypeOfUnit`,
                { type },
                {
                    withCredentials: false,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success(res.data.message);
            setIsAuthenticated(true);
            setType("");
        } catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    if (!isAuthenticated) {
        return <Navigate to={"/loginAdmin"} />;
    }

    return (
        <section className="page page4 page2">
            <section className="container form-component add-material-form">
                <img src={logo} alt="logo" className="logo" />
                <h1 className="form-title">Add Type of unit</h1>
                <form onSubmit={handleAddSize}>
                    <div>
                        <input
                            type="text"
                            placeholder="Type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
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

export default AddTypeOfUnit;
