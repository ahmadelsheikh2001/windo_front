/* eslint-disable no-undef */

import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "..";
import { Navigate } from "react-router-dom";

const GetAllMaterials = () => {
    const [allMaterials, setAllMaterials] = useState([]);
    const [editMaterial, setEditMaterial] = useState(null);
    const [originalMaterial, setOriginalMaterial] = useState(null);
    const { isAuthenticated } = useContext(Context);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchMaterials = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/v1/Material`, {
                withCredentials: false,
            });
            if (data.results > 0) {
                setAllMaterials(data.data);
            } else {
                setAllMaterials([]);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching materials");
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    const handleDelete = async (materialId) => {
        try {
            await axios.delete(`${apiUrl}/api/v1/Material/${materialId}`, {
                withCredentials: false,
            });
            toast.success("Material deleted successfully");
            fetchMaterials();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting material");
        }
    };

    const handleEdit = (material) => {
        setEditMaterial(material);
        setOriginalMaterial(material);
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files && files[0]) {
            setEditMaterial((prevMaterial) => ({
                ...prevMaterial,
                [name]: files[0],
                previewImage: URL.createObjectURL(files[0])
            }));
        } else {
            setEditMaterial((prevMaterial) => ({
                ...prevMaterial,
                [name]: value,
                previewImage: prevMaterial.previewImage ? prevMaterial.previewImage : null
            }));
        }
    };

    const handleUpdate = async (materialId) => {
        try {
            const formData = new FormData();
            if (editMaterial.type !== originalMaterial.type) {
                formData.append("type", editMaterial.type);
            }
            if (editMaterial.image && editMaterial.image !== originalMaterial.image) {
                formData.append("image", editMaterial.image);
            }
            if (editMaterial.from !== originalMaterial.from) {
                formData.append("from", editMaterial.from);
            }

            await axios.put(`${apiUrl}/api/v1/Material/${materialId}`, formData, {
                withCredentials: false,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const updatedMaterials = allMaterials.map((m) =>
                m._id === materialId ? { ...m, ...editMaterial, image: editMaterial.previewImage || m.image } : m
            );

            setAllMaterials(updatedMaterials);
            setEditMaterial(null);
            setOriginalMaterial(null);
            toast.success("Material updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating material");
        }
    };

    if (!isAuthenticated) {
        return <Navigate to={"/loginAdmin"} />;
    }

    const indexOfLastMaterial = currentPage * itemsPerPage;
    const indexOfFirstMaterial = indexOfLastMaterial - itemsPerPage;
    const currentMaterials = allMaterials.slice(indexOfFirstMaterial, indexOfLastMaterial);
    const totalPages = Math.ceil(allMaterials.length / itemsPerPage);

    return (
        <section className="page materials">
            <h1>Materials</h1>
            <div className="banner">
                {currentMaterials.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Image</th>
                                    <th>From</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentMaterials.map((material) => (
                                    <tr key={material._id}>
                                        <td>
                                            {editMaterial && editMaterial._id === material._id ? (
                                                <input
                                                    type="text"
                                                    name="type"
                                                    value={editMaterial.type}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                material.type
                                            )}
                                        </td>
                                        <td>
                                            {editMaterial && editMaterial._id === material._id ? (
                                                <>
                                                    <input
                                                        type="file"
                                                        name="image"
                                                        onChange={handleInputChange}
                                                    />
                                                    {editMaterial.previewImage ? (
                                                        <img src={editMaterial.previewImage} alt={material.type} width="50" height="50" />
                                                    ) : (
                                                        <img src={material.image} alt={material.type} width="50" height="50" />
                                                    )}
                                                </>
                                            ) : (
                                                <img src={material.image} alt={material.type} width="50" height="50" />
                                            )}
                                        </td>
                                        <td>
                                            {editMaterial && editMaterial._id === material._id ? (
                                                <input
                                                    type="number"
                                                    name="from"
                                                    value={editMaterial.from}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                material.from
                                            )}
                                        </td>
                                        <td className="table-actions">
                                            {editMaterial && editMaterial._id === material._id ? (
                                                <>
                                                    <button
                                                        className="save-button"
                                                        onClick={() => handleUpdate(material._id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="cancel-button"
                                                        onClick={() => {
                                                            setEditMaterial(null);
                                                            setOriginalMaterial(null);
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="edit-button"
                                                        onClick={() => handleEdit(material)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDelete(material._id)}
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
                    <h1>No Registered Materials Found!</h1>
                )}
            </div>
        </section>
    );
};

export default GetAllMaterials;
