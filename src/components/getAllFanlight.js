/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "..";
import { Navigate } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const GetAllFanligthes = () => {
    const [Fanligth, setFanligth] = useState([]);
    const [displayedFanligth, setDisplayedFanligth] = useState([]);
    const [editFanlight, setEditFanlight] = useState(null);
    const { isAuthenticated } = useContext(Context);
    const [currentPage, setCurrentPage] = useState(1);
    const [ProfileOptions, setProfileOptions] = useState([]);
    const itemsPerPage = 5;
    const apiUrl = process.env.REACT_APP_API_URL;


    const fetchFanligth = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/v1/Fanlight`, {
                withCredentials: false,
            });
            setFanligth(data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching Fanligth");
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
        fetchFanligth();
        axios.get(`${apiUrl}/api/v1/Layout`)
            .then(response => setProfileOptions(response.data.data))
            .catch(error => toast.error("Error fetching profiles: " + error.message));
    }, []);

    const handleDelete = async (FanlightId) => {
        try {
            await axios.delete(`${apiUrl}/api/v1/Fanlight/${FanlightId}`, {
                withCredentials: false,
            });
            toast.success("Fanlight deleted successfully");
            fetchFanligth();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting Fanlight");
        }
    };

    const handleEdit = (company) => {
        setEditFanlight({
          ...company,
          layout: company.layout._id // أو استخدم قيمة أخرى حسب الحاجة
        });
      };

    const handleUpdate = async (FanlightId) => {
        try {
            const formData = new FormData();
            formData.append("title", editFanlight.title);
            formData.append("layout", editFanlight.layout);
      
            if (editFanlight.image && editFanlight.image !== "") {
                formData.append("image", editFanlight.image);
            }

            await axios.put(`${apiUrl}/api/v1/Fanlight/${FanlightId}`, formData, {
                withCredentials: false,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Fanlight updated successfully");
            fetchFanligth();
            setEditFanlight(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating Fanlight");
        }
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files && files[0]) {
            setEditFanlight((prevCompany) => ({
                ...prevCompany,
                [name]: files[0],
                previewImage: URL.createObjectURL(files[0])
            }));
        } else {
            setEditFanlight((prevCompany) => ({
                ...prevCompany,
                [name]: value,
                previewImage: name === "image" ? prevCompany.previewImage : null
            }));
        }
    };

    useEffect(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        setDisplayedFanligth(Fanligth.slice(start, end));
    }, [currentPage, Fanligth]);

    if (!isAuthenticated) {
        return <Navigate to={"/loginAdmin"} />;
    }

    const indexOfLastMaterial = currentPage * itemsPerPage;
    const indexOfFirstMaterial = indexOfLastMaterial - itemsPerPage;
    const currentFanligth = Fanligth.slice(indexOfFirstMaterial, indexOfLastMaterial);
    const totalPages = Math.ceil(Fanligth.length / itemsPerPage);


    return (
        <section className="page Fanligth">
            <h1>Fanlight</h1>
            <div className="banner">
                {currentFanligth.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Image</th>
                                    <th>Layout</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentFanligth.map((element) => (
                                    <tr key={element._id}>
                                        <td>
                                            {editFanlight && editFanlight._id === element._id ? (
                                                <input
                                                    type="text"
                                                    name="title"
                                                    value={editFanlight.title}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                element.title
                                            )}
                                        </td>
                                        <td>
                                            {editFanlight && editFanlight._id === element._id ? (
                                                <>
                                                    <input
                                                        type="file"
                                                        name="image"
                                                        onChange={handleInputChange}
                                                    />
                                                    {editFanlight.previewImage ? (
                                                        <img src={editFanlight.previewImage} alt={element.name} width="50" height="50" />
                                                    ) : (
                                                        <img src={element.image} alt={element.name} width="50" height="50" />
                                                    )}
                                                </>
                                            ) : (
                                                <img src={element.image} alt={element.name} width="50" height="50" />
                                            )}
                                        </td>
                                        <td>
                                            {editFanlight && editFanlight._id === element._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="layout-select-label">layout</InputLabel>
                                                    <Select
                                                        labelId="layout-select-label"
                                                        id="layout-select"
                                                        value={editFanlight.layout || ''}
                                                        onChange={(e) => handleInputChange({ target: { name: 'layout', value: e.target.value } })}
                                                        inputProps={{
                                                            name: 'layout',
                                                            id: 'layout-select',
                                                        }}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {ProfileOptions.map((layout) => (
                                                            <MenuItem key={layout._id} value={layout._id}>{layout.title}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                element.layout?.title || ''
                                            )}
                                        </td>
                                        <td className="table-actions">
                                            {editFanlight && editFanlight._id === element._id ? (
                                                <>
                                                    <button
                                                        className="save-button"
                                                        onClick={() => handleUpdate(element._id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="cancel-button"
                                                        onClick={() => setEditFanlight(null)}
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
                    <h1>No Registered Fanligth Found!</h1>
                )}
            </div>
        </section>
    );
};

export default GetAllFanligthes;
