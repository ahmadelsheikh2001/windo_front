/* eslint-disable no-undef */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "..";
import { Navigate } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const GetAllLayotes = () => {
    const [Layouts, setLayouts] = useState([]);
    const [editLayout, setLayout] = useState(null);
    const { isAuthenticated } = useContext(Context);
    const [currentPage, setCurrentPage] = useState(1);
    const [ProfileOptions, setProfileOptions] = useState([]);
    const itemsPerPage = 5; // عدد العناصر لكل صفحة
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchLayouts = async (page) => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/v1/Layout`, {
                params: {
                    page,
                },
                withCredentials: false,
            });
            if (data.results > 0) {
                setLayouts(data.data);
            } else {
                setLayouts([]);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching Layout");
        }
    };

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

    useEffect(() => {
        fetchLayouts(currentPage);
        axios.get(`${apiUrl}/api/v1/OpeningSystem`)
            .then(response => setProfileOptions(response.data.data))
            .catch(error => toast.error("Error fetching profiles: " + error.message));
    }, [currentPage]);

    const handleDelete = async (LayoutId) => {
        try {
            await axios.delete(`${apiUrl}/api/v1/Layout/${LayoutId}`, {
                withCredentials: false,
            });
            toast.success("Layout deleted successfully");
            fetchLayouts(currentPage);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting Layout");
        }
    };

    const handleEdit = (company) => {
        setLayout({
            ...company,
            openingSystem: company.openingSystem._id 
        });
    };


    const handleUpdate = async (LayoutId) => {
        try {
            const formData = new FormData();
            formData.append("title", editLayout.title);
            formData.append("openingSystem", editLayout.openingSystem);

            if (editLayout.image && editLayout.image !== "") {
                formData.append("image", editLayout.image);
            }

            await axios.put(`${apiUrl}/api/v1/Layout/${LayoutId}`, editLayout, {
                withCredentials: false,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Layout updated successfully");
            fetchLayouts();
            setLayout(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating Layout");
        }
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files && files[0]) {
            setLayout((prevLayout) => ({
                ...prevLayout,
                [name]: files[0],
                previewImage: URL.createObjectURL(files[0])
            }));
        } else {
            setLayout((prevLayout) => ({
                ...prevLayout,
                [name]: value,
                previewImage: name === "image" ? prevLayout.previewImage : null
            }));
        }
    };


    if (!isAuthenticated) {
        return <Navigate to={"/loginAdmin"} />;
    }

    const indexOfLastMaterial = currentPage * itemsPerPage;
    const indexOfFirstMaterial = indexOfLastMaterial - itemsPerPage;
    const currentLayouts = Layouts.slice(indexOfFirstMaterial, indexOfLastMaterial);
    const totalPages = Math.ceil(Layouts.length / itemsPerPage);

    return (
        <section className="page Layouts">
            <h1>Layouts</h1>
            <div className="banner">
                {currentLayouts.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Image</th>
                                    <th>OpeningSystem</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentLayouts.map((Layout) => (
                                    <tr key={Layout._id}>
                                        <td>
                                            {editLayout && editLayout._id === Layout._id ? (
                                                <input
                                                    type="text"
                                                    name="title"
                                                    value={editLayout.title}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Layout.title
                                            )}
                                        </td>
                                        <td>
                                            {editLayout && editLayout._id === Layout._id ? (
                                                <>
                                                    <input
                                                        type="file"
                                                        name="image"
                                                        onChange={handleInputChange}
                                                    />
                                                    {editLayout.previewImage ? (
                                                        <img src={editLayout.previewImage} alt={Layout.name} width="50" height="50" />
                                                    ) : (
                                                        <img src={Layout.image} alt={Layout.name} width="50" height="50" />
                                                    )}
                                                </>
                                            ) : (
                                                <img src={Layout.image} alt={Layout.name} width="50" height="50" />
                                            )}
                                        </td>
                                        <td>
                                            {editLayout && editLayout._id === Layout._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="openingSystem-select-label">openingSystem</InputLabel>
                                                    <Select
                                                        labelId="openingSystem-select-label"
                                                        id="openingSystem-select"
                                                        value={editLayout.openingSystem || ''}
                                                        onChange={(e) => handleInputChange({ target: { name: 'openingSystem', value: e.target.value } })}
                                                        inputProps={{
                                                            name: 'openingSystem',
                                                            id: 'openingSystem-select',
                                                        }}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {ProfileOptions.map((openingSystem) => (
                                                            <MenuItem key={openingSystem._id} value={openingSystem._id}>{openingSystem.type}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                Layout.openingSystem?.type || ''
                                            )}
                                        </td>
                                        <td className="table-actions">
                                            {editLayout && editLayout._id === Layout._id ? (
                                                <>
                                                    <button
                                                        className="save-button"
                                                        onClick={() => handleUpdate(Layout._id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="cancel-button"
                                                        onClick={() => setLayout(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="edit-button"
                                                        onClick={() => handleEdit(Layout)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDelete(Layout._id)}
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
                    <h1>No Registered Layouts Found!</h1>
                )}
            </div>
        </section>
    );
};

export default GetAllLayotes;
