/* eslint-disable no-undef */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "..";
import { Navigate } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const GetAllOpeningLayoutes = () => {
    const [OpeningLayout, setOpeningLayout] = useState([]);
    const [editOpeningLayout, setEditOpeningLayout] = useState(null);
    const { isAuthenticated } = useContext(Context);
    const [currentPage, setCurrentPage] = useState(1);
    const [ProfileOptions, setProfileOptions] = useState([]);
    const [layoutOptions, setLayoutOptions] = useState([]);
    const itemsPerPage = 5;
    const apiUrl = process.env.REACT_APP_API_URL;


    const fetchOpeningLayout = async (page) => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/v1/OpeningLayout`, {
                params: { page, limit: 15 },
                withCredentials: false,
            });
            if (data.results > 0) {
                setOpeningLayout(data.data);
            } else {
                setOpeningLayout([]);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching OpeningLayout");
        }
    };

    const fetchFanlightsByLayout = async (layoutId) => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/v1/Fanlight?layout=${layoutId}`);
            setProfileOptions(data.data);
        } catch (error) {
            toast.error("Error fetching fanlights: " + error.message);
        }
    };

    useEffect(() => {
        fetchOpeningLayout(currentPage);
        axios.get(`${apiUrl}/api/v1/Layout`)
            .then(response => setLayoutOptions(response.data.data))
            .catch(error => toast.error("Error fetching layouts: " + error.message));
    }, [currentPage]);

    const handleDelete = async (OpeningLayoutId) => {
        try {
            await axios.delete(`${apiUrl}/api/v1/OpeningLayout/${OpeningLayoutId}`, {
                withCredentials: false,
            });
            toast.success("OpeningLayout deleted successfully");
            fetchOpeningLayout(currentPage);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting OpeningLayout");
        }
    };

    const handleEdit = async (company) => {
        setEditOpeningLayout({
            ...company,
            layout: company.layout._id,
            fanlight: company.fanlight._id,
        });
        await fetchFanlightsByLayout(company.layout._id);
    };

    const handleUpdate = async (OpeningLayoutId) => {
        try {
            const formData = new FormData();
            formData.append("title", editOpeningLayout.title);
            formData.append("fanlight", editOpeningLayout.fanlight);
            formData.append("layout", editOpeningLayout.layout);

            if (editOpeningLayout.image && editOpeningLayout.image !== "") {
                formData.append("image", editOpeningLayout.image);
            }

            await axios.put(`${apiUrl}/api/v1/OpeningLayout/${OpeningLayoutId}`, formData, {
                withCredentials: false,
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("OpeningLayout updated successfully");
            fetchOpeningLayout(currentPage);
            setEditOpeningLayout(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating OpeningLayout");
        }
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files && files[0]) {
            setEditOpeningLayout((prev) => ({
                ...prev,
                [name]: files[0],
                previewImage: URL.createObjectURL(files[0])
            }));
        } else {
            setEditOpeningLayout((prev) => ({
                ...prev,
                [name]: value,
                previewImage: name === "image" ? prev.previewImage : null
            }));

            if (name === "layout") {
                fetchFanlightsByLayout(value);
                setEditOpeningLayout((prev) => ({
                    ...prev,
                    fanlight: '',
                }));
            }
        }
    };

    if (!isAuthenticated) {
        return <Navigate to={"/loginAdmin"} />;
    }

    const indexOfLastMaterial = currentPage * itemsPerPage;
    const indexOfFirstMaterial = indexOfLastMaterial - itemsPerPage;
    const currentOpeningLayout = OpeningLayout.slice(indexOfFirstMaterial, indexOfLastMaterial);
    const totalPages = Math.ceil(OpeningLayout.length / itemsPerPage);

    return (
        <section className="page OpeningLayout">
            <h1>OpeningLayout</h1>
            <div className="banner">
                {currentOpeningLayout.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Image</th>
                                    <th>Fanlight</th>
                                    <th>Layout</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOpeningLayout.map((element) => (
                                    <tr key={element._id}>
                                        <td>
                                            {editOpeningLayout && editOpeningLayout._id === element._id ? (
                                                <input
                                                    type="text"
                                                    name="title"
                                                    value={editOpeningLayout.title}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                element.title
                                            )}
                                        </td>
                                        <td>
                                            {editOpeningLayout && editOpeningLayout._id === element._id ? (
                                                <>
                                                    <input
                                                        type="file"
                                                        name="image"
                                                        onChange={handleInputChange}
                                                    />
                                                    {editOpeningLayout.previewImage ? (
                                                        <img src={editOpeningLayout.previewImage} alt={element.title} width="50" height="50" />
                                                    ) : (
                                                        <img src={element.image} alt={element.title} width="50" height="50" />
                                                    )}
                                                </>
                                            ) : (
                                                <img src={element.image} alt={element.title} width="50" height="50" />
                                            )}
                                        </td>

                                        <td>
                                            {editOpeningLayout && editOpeningLayout._id === element._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="layout-select-label">Layout</InputLabel>
                                                    <Select
                                                        labelId="layout-select-label"
                                                        id="layout-select"
                                                        value={editOpeningLayout.layout || ''}
                                                        onChange={(e) => handleInputChange({ target: { name: 'layout', value: e.target.value } })}
                                                        inputProps={{ name: 'layout', id: 'layout-select' }}
                                                        MenuProps={{ PaperProps: { style: { maxHeight: 48 * 4.5 + 8, width: 250 } } }}
                                                    >
                                                        {layoutOptions.map((layout) => (
                                                            <MenuItem key={layout._id} value={layout._id}>{layout.title}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                element.layout?.title || ''
                                            )}
                                        </td>
                                        <td>
                                            {editOpeningLayout && editOpeningLayout._id === element._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="fanlight-select-label">Fanlight</InputLabel>
                                                    <Select
                                                        labelId="fanlight-select-label"
                                                        id="fanlight-select"
                                                        value={editOpeningLayout.fanlight || ''}
                                                        onChange={(e) => handleInputChange({ target: { name: 'fanlight', value: e.target.value } })}
                                                        inputProps={{ name: 'fanlight', id: 'fanlight-select' }}
                                                        MenuProps={{ PaperProps: { style: { maxHeight: 48 * 4.5 + 8, width: 250 } } }}
                                                    >
                                                        {ProfileOptions.map((fanlight) => (
                                                            <MenuItem key={fanlight._id} value={fanlight._id}>{fanlight.title}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                element.fanlight?.title || ''
                                            )}
                                        </td>
                                        <td className="table-actions">
                                            {editOpeningLayout && editOpeningLayout._id === element._id ? (
                                                <>
                                                    <button
                                                        className="save-button"
                                                        onClick={() => handleUpdate(element._id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="cancel-button"
                                                        onClick={() => setEditOpeningLayout(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="edit-button"
                                                        onClick={() => handleEdit(element)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDelete(element._id)}
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
                    <h1>No Registered OpeningLayout Found!</h1>
                )}
            </div>
        </section>
    );
};

export default GetAllOpeningLayoutes;
