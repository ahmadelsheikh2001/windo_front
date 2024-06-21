/* eslint-disable no-undef */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "..";
import { Navigate } from "react-router-dom";

const GetAllGlassColor = () => {
    const [GlassColors, setGlassColors] = useState([]);
    const [editGlassColor, setEditGlassColor] = useState(null);
    const { isAuthenticated } = useContext(Context);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // عدد العناصر لكل صفحة
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchGlassColors = async (page) => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/v1/GlassColor`, {
                params: {
                    page,
                },
                withCredentials: false,
            });
            if (data.results > 0) {
                setGlassColors(data.data);
            } else {
                setGlassColors([]);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching GlassColors");
        }
    };

    useEffect(() => {
        fetchGlassColors(currentPage);
    }, [currentPage]);

    const handleDelete = async (GlassColorId) => {
        try {
            await axios.delete(`${apiUrl}/api/v1/GlassColor/${GlassColorId}`, {
                withCredentials: false,
            });
            toast.success("GlassColor deleted successfully");
            fetchGlassColors(currentPage);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting GlassColor");
        }
    };

    const handleEdit = (company) => {
        setEditGlassColor({
            ...company,
        });
    };

    const handleUpdate = async (GlassColorId) => {
        try {
            const formData = new FormData();
            formData.append("title", editGlassColor.title);
            formData.append("plus", editGlassColor.plus);
            if (editGlassColor.image && editGlassColor.image !== "") {
                formData.append("image", editGlassColor.image);
            }

            await axios.put(`${apiUrl}/api/v1/GlassColor/${GlassColorId}`, editGlassColor, {
                withCredentials: false,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("GlassColor updated successfully");
            fetchGlassColors();
            setEditGlassColor(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating GlassColor");
        }
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files && files[0]) {
            setEditGlassColor((prevCompany) => ({
                ...prevCompany,
                [name]: files[0],
                previewImage: URL.createObjectURL(files[0])
            }));
        } else {
            setEditGlassColor((prevCompany) => ({
                ...prevCompany,
                [name]: value,
                previewImage: name === "image" ? prevCompany.previewImage : null
            }));
        }
    };

    if (!isAuthenticated) {
        return <Navigate to={"/loginAdmin"} />;
    }

    const indexOfLastMaterial = currentPage * itemsPerPage;
    const indexOfFirstMaterial = indexOfLastMaterial - itemsPerPage;
    const currentGlassColors = GlassColors.slice(indexOfFirstMaterial, indexOfLastMaterial);
    const totalPages = Math.ceil(GlassColors.length / itemsPerPage);


    return (
        <section className="page GlassColors">
            <h1>GlassColors</h1>
            <div className="banner">
                {currentGlassColors.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>image</th>
                                    <th>Title</th>
                                    <th>Plus</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentGlassColors.map((GlassColor) => (
                                    <tr key={GlassColor._id}>
                                        <td>
                                            {editGlassColor && editGlassColor._id === GlassColor._id ? (
                                                <>
                                                    <input
                                                        type="file"
                                                        name="image"
                                                        onChange={handleInputChange}
                                                    />
                                                    {editGlassColor.previewImage ? (
                                                        <img src={editGlassColor.previewImage} alt={GlassColor.name} width="50" height="50" />
                                                    ) : (
                                                        <img src={GlassColor.image} alt={GlassColor.name} width="50" height="50" />
                                                    )}
                                                </>
                                            ) : (
                                                <img src={GlassColor.image} alt={GlassColor.name} width="50" height="50" />
                                            )}
                                        </td>
                                        <td>
                                            {editGlassColor && editGlassColor._id === GlassColor._id ? (
                                                <input
                                                    type="text"
                                                    name="title"
                                                    value={editGlassColor.title}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                GlassColor.title
                                            )}
                                        </td>
                                        <td>
                                            {editGlassColor && editGlassColor._id === GlassColor._id ? (
                                                <input
                                                    type="number"
                                                    name="plus"
                                                    value={editGlassColor.plus}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                GlassColor.plus
                                            )}
                                        </td>
                                        <td className="table-actions">
                                            {editGlassColor && editGlassColor._id === GlassColor._id ? (
                                                <>
                                                    <button
                                                        className="save-button"
                                                        onClick={() => handleUpdate(GlassColor._id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="cancel-button"
                                                        onClick={() => setEditGlassColor(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="edit-button"
                                                        onClick={() => handleEdit(GlassColor)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDelete(GlassColor._id)}
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
                    <h1>No Registered GlassColors Found!</h1>
                )}
            </div>
        </section>
    );
};

export default GetAllGlassColor;
