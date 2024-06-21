/* eslint-disable no-undef */

import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import logo from '../images/file.png';
import { Context } from "..";
import { Navigate } from "react-router-dom";

const AddOpeningSystem = () => {
    const [newOption, setNewOption] = useState("");
    const [type, setType] = useState([]);
    const [from, setFrom] = useState("");
    const apiUrl = process.env.REACT_APP_API_URL;
    const [image, setImage] = useState(null); 
    const [companies, setCompanies] = useState([]); 
    const [companyId, setCompanyId] = useState("");
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const companyRes = await axios.get(`${apiUrl}/api/v1/Company`);
                setCompanies(companyRes.data.data || []);
            } catch (error) {
                toast.error("Failed to fetch companies");
            }
        };

        fetchData();
    }, []);

    const handleAddOption = () => {
        if (newOption.trim() === '') return;
        setType([...type, { option: newOption, checked: true }]);
        setNewOption('');
    };

    const handleToggleOption = (index) => {
        const updatedOptions = type.map((item, idx) =>
            idx === index ? { ...item, checked: !item.checked } : item
        );
        setType(updatedOptions);
    };

    const handleRemoveOption = (index) => {
        const updatedOptions = type.filter((_, idx) => idx !== index);
        setType(updatedOptions);
    };

    const handleAddNewOpeningSystem = async (e) => {
        e.preventDefault();
        try {
            if (!type.length || !image || !from || !companyId) {
                toast.error("Please fill in all fields");
                return;
            }

            const formData = new FormData();
            type.forEach((item) => {
                if (item.checked) {
                    formData.append("type", item.option);
                }
            });
            formData.append("image", image);
            formData.append("from", from);
            formData.append("company", companyId); // استخدم التسمية الصحيحة

            const res = await axios.post(
                `${apiUrl}/api/v1/OpeningSystem`,
                formData,
                {
                    withCredentials: false,
                }
            );

            toast.success(res.data.message);
            setType([]);
            setFrom("");
            setImage(null);
            setCompanyId("");
            setIsAuthenticated(true)
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    if (!isAuthenticated) {
        return <Navigate to={"/loginAdmin"} />;
    }

    return (
        <section className="page page2 page4">
            <section className="container form-component add-opening-system-form">
                <img src={logo} alt="logo" className="logo" />
                <h1 className="form-title">Add a new Opening System</h1>
                <form onSubmit={handleAddNewOpeningSystem}>
                    <div className="dsd">
                        {type.map((item, index) => (
                            <div key={index} className="option-item">
                                <input
                                    type="checkbox"
                                    id={`type${index}`}
                                    value={item.option}
                                    checked={item.checked}
                                    onChange={() => handleToggleOption(index)}
                                />
                                <label htmlFor={`type${index}`}>{item.option}</label>
                                <span className="remove-option" onClick={() => handleRemoveOption(index)}>×</span>
                            </div>
                        ))}
                    </div>
                    <div className="buttons">
                        <input
                            className="input"
                            type="text"
                            placeholder="Add new option"
                            value={newOption}
                            onChange={(e) => setNewOption(e.target.value)}
                        />
                        <button type="button" onClick={handleAddOption}>Add Option</button>
                    </div>
                    <div>
                        <input
                            className="input"
                            type="number"
                            placeholder="From price"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                        />
                        <select value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
                            <option value="">Select Company</option>
                            {companies.length > 0 && companies.map(company => (
                                <option key={company._id} value={company._id}>{company.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input
                            type="file"
                            className="input Chooose_image Chooose_image2"
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

export default AddOpeningSystem;
