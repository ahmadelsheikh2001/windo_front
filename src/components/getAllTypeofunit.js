/* eslint-disable no-undef */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { Context } from "..";

const GetTypeOfunites = () => {
    const [TypeOfUnits, setTypeOfUnits] = useState([]);
    const [editTypeOfUnit, setTypeOfUnit] = useState(null);
    const { isAuthenticated } = useContext(Context);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // عدد العناصر لكل صفحة
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchTypeOfUnits = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/v1/TypeOfUnit`, {
                withCredentials: false,
            });
            if (data.results > 0) {
                setTypeOfUnits(data.data);
            } else {
                setTypeOfUnits([]);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching TypeOfUnit");
        }
    };

    useEffect(() => {
        fetchTypeOfUnits();
    }, []);

    const handleDelete = async (TypeOfUnitId) => {
        try {
            await axios.delete(`${apiUrl}/api/v1/TypeOfUnit/${TypeOfUnitId}`, {
                withCredentials: false,
            });
            toast.success("TypeOfUnit deleted successfully");
            fetchTypeOfUnits();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting TypeOfUnit");
        }
    };

    const handleEdit = (TypeOfUnit) => {
        setTypeOfUnit(TypeOfUnit);
    };

    const handleUpdate = async (TypeOfUnitId) => {
        try {
            await axios.put(`${apiUrl}/api/v1/TypeOfUnit/${TypeOfUnitId}`, editTypeOfUnit, {
                withCredentials: false,
            });
            setTypeOfUnits(TypeOfUnits.map(m => m._id === TypeOfUnitId ? editTypeOfUnit : m));
            toast.success("TypeOfUnit updated successfully");
            fetchTypeOfUnits();
            setTypeOfUnit(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating TypeOfUnit");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTypeOfUnit({ ...editTypeOfUnit, [name]: value });
    };

    if (!isAuthenticated) {
        return <Navigate to={"/loginAdmin"} />;
    }

    const indexOfLastTypeOfUnit = currentPage * itemsPerPage;
    const indexOfFirstTypeOfUnit = indexOfLastTypeOfUnit - itemsPerPage;
    const currentTypeOfUnits = TypeOfUnits.slice(indexOfFirstTypeOfUnit, indexOfLastTypeOfUnit);
    const totalPages = Math.ceil(TypeOfUnits.length / itemsPerPage);

    return (
        <section className="page TypeOfUnits">
            <h1>TypeOfUnits</h1>
            <div className="banner">
                {currentTypeOfUnits.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentTypeOfUnits.map((TypeOfUnit) => (
                                    <tr key={TypeOfUnit._id}>
                                        <td>
                                            {editTypeOfUnit && editTypeOfUnit._id === TypeOfUnit._id ? (
                                                <input
                                                    type="text"
                                                    name="type"
                                                    value={editTypeOfUnit.type}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                TypeOfUnit.type
                                            )}
                                        </td>
                                        <td className="table-actions">
                                            {editTypeOfUnit && editTypeOfUnit._id === TypeOfUnit._id ? (
                                                <>
                                                    <button
                                                        className="save-button"
                                                        onClick={() => handleUpdate(TypeOfUnit._id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="cancel-button"
                                                        onClick={() => setTypeOfUnit(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="edit-button"
                                                        onClick={() => handleEdit(TypeOfUnit)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDelete(TypeOfUnit._id)}
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
                    <h1>No Registered TypeOfUnits Found!</h1>
                )}
            </div>
        </section>
    );
};

export default GetTypeOfunites;
