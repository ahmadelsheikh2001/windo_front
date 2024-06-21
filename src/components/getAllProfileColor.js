/* eslint-disable no-undef */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { Context } from "..";

const GetAllProfileColor = () => {
    const [ProfileColors, setProfileColors] = useState([]);
    const [editProfileColor, setEditProfileColor] = useState(null);
    const { isAuthenticated } = useContext(Context);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // عدد العناصر لكل صفحة
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchProfileColors = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/v1/ProfileColor`, {
                withCredentials: false,
            });
            if (data.results > 0) {
                setProfileColors(data.data);
            } else {
                setProfileColors([]);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching ProfileColor");
        }
    };

    useEffect(() => {
        fetchProfileColors();
    }, []);

    const handleDelete = async (ProfileColorId) => {
        try {
            await axios.delete(`${apiUrl}/api/v1/ProfileColor/${ProfileColorId}`, {
                withCredentials: false,
            });
            toast.success("ProfileColor deleted successfully");
            fetchProfileColors();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting ProfileColor");
        }
    };

    const handleEdit = (ProfileColor) => {
        setEditProfileColor(ProfileColor);
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files && files[0]) {
            setEditProfileColor((prevProfileColor) => ({
                ...prevProfileColor,
                [name]: files[0],
                previewImage: URL.createObjectURL(files[0])
            }));
        } else {
            setEditProfileColor((prevProfileColor) => ({
                ...prevProfileColor,
                [name]: value,
                previewImage: prevProfileColor.previewImage ? prevProfileColor.previewImage : null
            }));
        }
    };


    const handleUpdate = async (ProfileColorId) => {
        try {
            const formData = new FormData();
            formData.append("title", editProfileColor.title);
            if (editProfileColor.image) {
                formData.append("image", editProfileColor.image);
            } else if (editProfileColor.previewImage) {
                formData.append("previewImage", editProfileColor.previewImage);
            }

            await axios.put(`${apiUrl}/api/v1/ProfileColor/${ProfileColorId}`, formData, {
                withCredentials: false,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setProfileColors(ProfileColors.map((m) => m._id === ProfileColorId ? editProfileColor : m));
            setEditProfileColor(null);
            toast.success("ProfileColor updated successfully");
            fetchProfileColors();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating ProfileColor");
        }
    };

    if (!isAuthenticated) {
        return <Navigate to={"/loginAdmin"} />;
    }

    const indexOfLastProfileColor = currentPage * itemsPerPage;
    const indexOfFirstProfileColor = indexOfLastProfileColor - itemsPerPage;
    const currentProfileColors = ProfileColors.slice(indexOfFirstProfileColor, indexOfLastProfileColor);
    const totalPages = Math.ceil(ProfileColors.length / itemsPerPage);

    return (
        <section className="page ProfileColors">
            <h1>ProfileColors</h1>
            <div className="banner">
                {currentProfileColors.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Image</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProfileColors.map((ProfileColor) => (
                                    <tr key={ProfileColor._id}>
                                        <td>
                                            {editProfileColor && editProfileColor._id === ProfileColor._id ? (
                                                <input
                                                    type="text"
                                                    name="title"
                                                    value={editProfileColor.title}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                ProfileColor.title
                                            )}
                                        </td>
                                        <td>
                                            {editProfileColor && editProfileColor._id === ProfileColor._id ? (
                                                <>
                                                    <input
                                                        type="file"
                                                        name="image"
                                                        onChange={handleInputChange}
                                                    />
                                                    {editProfileColor.previewImage ? (
                                                        <img src={editProfileColor.previewImage} alt={ProfileColor.name} width="50" height="50" />
                                                    ) : (
                                                        <img src={ProfileColor.image} alt={ProfileColor.name} width="50" height="50" />
                                                    )}
                                                </>
                                            ) : (
                                                <img src={ProfileColor.image} alt={ProfileColor.name} width="50" height="50" />
                                            )}
                                        </td>
                                        <td className="table-actions">
                                            {editProfileColor && editProfileColor._id === ProfileColor._id ? (
                                                <>
                                                    <button
                                                        className="save-button"
                                                        onClick={() => handleUpdate(ProfileColor._id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="cancel-button"
                                                        onClick={() => setEditProfileColor(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="edit-button"
                                                        onClick={() => handleEdit(ProfileColor)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDelete(ProfileColor._id)}
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
                    <h1>No Registered ProfileColors Found!</h1>
                )}
            </div>
        </section>
    );
};

export default GetAllProfileColor;
