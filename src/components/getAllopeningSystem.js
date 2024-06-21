/* eslint-disable no-undef */

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { Context } from "..";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const GetAllOpeningSystem = () => {
    const [OpeningSystem, setOpeningSystem] = useState([]);
    const [editOpeningSystem, setEditOpeningSystem] = useState(null);
    const { isAuthenticated } = useContext(Context);
    const [CompanyOptions, setCompanyOptions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // عدد العناصر لكل صفحة
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchOpeningSystem = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/v1/OpeningSystem`, {
                withCredentials: false,
            });
            if (data.results > 0) {
                setOpeningSystem(data.data);
            } else {
                setOpeningSystem([]);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching OpeningSystem");
        }
    };

    useEffect(() => {
        fetchOpeningSystem();
        axios.get(`${apiUrl}/api/v1/Company`)
            .then(response => setCompanyOptions(response.data.data))
            .catch(error => toast.error("Error fetching profiles: " + error.message));
    }, [currentPage]);

    const handleDelete = async (OpeningSystemId) => {
        try {
            await axios.delete(`${apiUrl}/api/v1/OpeningSystem/${OpeningSystemId}`, {
                withCredentials: false,
            });
            toast.success("OpeningSystem deleted successfully");
            fetchOpeningSystem();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting OpeningSystem");
        }
    };

    const handleEdit = (company) => {
        setEditOpeningSystem({
            ...company,
            company: company.company._id // أو استخدم قيمة أخرى حسب الحاجة
        });
    };
    const handleUpdate = async (ProfileColorId) => {
        try {
            const formData = new FormData();
            formData.append("type", editOpeningSystem.type);
            formData.append("from", editOpeningSystem.from);
            formData.append("company", editOpeningSystem.company);

            if (editOpeningSystem.image) {
                formData.append("image", editOpeningSystem.image);
            } else if (editOpeningSystem.previewImage) {
                formData.append("previewImage", editOpeningSystem.previewImage);
            }

            await axios.put(`${apiUrl}/api/v1/OpeningSystem/${ProfileColorId}`, formData, {
                withCredentials: false,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setOpeningSystem(OpeningSystem.map((m) => m._id === ProfileColorId ? editOpeningSystem : m));
            setEditOpeningSystem(null);
            toast.success("Company updated successfully");
            fetchOpeningSystem();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating Company");
        }
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files && files[0]) {
            setEditOpeningSystem((editOpeningSystem) => ({
                ...editOpeningSystem,
                [name]: files[0],
                previewImage: URL.createObjectURL(files[0])
            }));
        } else {
            setEditOpeningSystem((editOpeningSystem) => ({
                ...editOpeningSystem,
                [name]: value,
                previewImage: editOpeningSystem.previewImage ? editOpeningSystem.previewImage : null
            }));
        }
    };

    if (!isAuthenticated) {
        return <Navigate to={"/loginAdmin"} />;
    }

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const indexOfLastOpeningSystem = currentPage * itemsPerPage;
    const indexOfFirstOpeningSystem = indexOfLastOpeningSystem - itemsPerPage;
    const currentOpeningSystem = OpeningSystem.slice(indexOfFirstOpeningSystem, indexOfLastOpeningSystem);
    const totalPages = Math.ceil(OpeningSystem.length / itemsPerPage);

    return (
        <section className="page OpeningSystem">
            <h1>OpeningSystem</h1>
            <div className="banner">
                {currentOpeningSystem.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Image</th>
                                    <th>From</th>
                                    <th>Company</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOpeningSystem.map((OpeningSystem) => (
                                    <tr key={OpeningSystem._id}>
                                        <td>
                                            {editOpeningSystem && editOpeningSystem._id === OpeningSystem._id ? (
                                                <input
                                                    type="text"
                                                    name="type"
                                                    value={editOpeningSystem.type}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                OpeningSystem.type
                                            )}
                                        </td>
                                        <td>
                                            {editOpeningSystem && editOpeningSystem._id === OpeningSystem._id ? (
                                                <>
                                                    <input
                                                        type="file"
                                                        name="image"
                                                        onChange={handleInputChange}
                                                    />
                                                    {editOpeningSystem.previewImage ? (
                                                        <img src={editOpeningSystem.previewImage} alt={OpeningSystem.name} width="50" height="50" />
                                                    ) : (
                                                        <img src={OpeningSystem.image} alt={OpeningSystem.name} width="50" height="50" />
                                                    )}
                                                </>
                                            ) : (
                                                <img src={OpeningSystem.image} alt={OpeningSystem.name} width="50" height="50" />
                                            )}
                                        </td>
                                        <td>
                                            {editOpeningSystem && editOpeningSystem._id === OpeningSystem._id ? (
                                                <input
                                                    type="number"
                                                    name="from"
                                                    value={editOpeningSystem.from}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                OpeningSystem.from
                                            )}
                                        </td>
                                        <td>
                                            {editOpeningSystem && editOpeningSystem._id === OpeningSystem._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="company-select-label">company</InputLabel>
                                                    <Select
                                                        labelId="company-select-label"
                                                        id="company-select"
                                                        value={editOpeningSystem.company || ''}
                                                        onChange={(e) => handleInputChange({ target: { name: 'company', value: e.target.value } })}
                                                        inputProps={{
                                                            name: 'company',
                                                            id: 'company-select',
                                                        }}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {CompanyOptions.map((frame) => (
                                                            <MenuItem key={frame._id} value={frame._id}>{frame.name}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                OpeningSystem.company?.name || ''
                                            )}
                                        </td>
                                        <td className="table-actions">
                                            {editOpeningSystem && editOpeningSystem._id === OpeningSystem._id ? (
                                                <>
                                                    <button
                                                        className="save-button"
                                                        onClick={() => handleUpdate(OpeningSystem._id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="cancel-button"
                                                        onClick={() => setEditOpeningSystem(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="edit-button"
                                                        onClick={() => handleEdit(OpeningSystem)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDelete(OpeningSystem._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button
                                onClick={() => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </>
                ) : (
                    <h1>No Registered opening system Found!</h1>
                )}
            </div>
        </section>
    );
};

export default GetAllOpeningSystem;
