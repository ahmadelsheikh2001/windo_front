/* eslint-disable no-undef */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "..";
import { Navigate } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const GetAllCuttingProcess = () => {
    const [CuttingProcesss, setCuttingProcesss] = useState([]);
    const [editCuttingProcess, setEditCuttingProcess] = useState(null);
    const [ProfileOptions, setProfileOptions] = useState([]);
    const { isAuthenticated } = useContext(Context);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; 
    const apiUrl = process.env.REACT_APP_API_URL;


    const fetchCuttingProcesss = async (page) => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/v1/CuttingProcess`, {
                params: {
                    page,
                },
                withCredentials: false,
            });
            if (data.results > 0) {
                setCuttingProcesss(data.data);
            } else {
                setCuttingProcesss([]);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching CuttingProcesss");
        }
    };

    useEffect(() => {
        fetchCuttingProcesss(currentPage);
        axios.get(`${apiUrl}/api/v1/Profile`)
            .then(response => setProfileOptions(response.data.data))
            .catch(error => toast.error("Error fetching Profile: " + error.message));
    }, [currentPage]);

    const handleDelete = async (CuttingProcessId) => {
        try {
            await axios.delete(`${apiUrl}/api/v1/CuttingProcess/${CuttingProcessId}`, {
                withCredentials: false,
            });
            toast.success("CuttingProcess deleted successfully");
            fetchCuttingProcesss(currentPage);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting CuttingProcess");
        }
    };


    const handleEdit = (CuttingProcess) => {
        setEditCuttingProcess({
            ...CuttingProcess,
            profile: CuttingProcess.profile._id // أو استخدم قيمة أخرى حسب الحاجة
        });
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

    const handleUpdate = async (CuttingProcessId) => {
        try {
            await axios.put(`${apiUrl}/api/v1/CuttingProcess/${CuttingProcessId}`, editCuttingProcess, {
                withCredentials: false,
            });
            setCuttingProcesss(CuttingProcesss.map(m => m._id === CuttingProcessId ? editCuttingProcess : m));
            setEditCuttingProcess(null);
            toast.success("CuttingProcess updated successfully");
            fetchCuttingProcesss(currentPage);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating CuttingProcess");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditCuttingProcess({ ...editCuttingProcess, [name]: value });
    };

    if (!isAuthenticated) {
        return <Navigate to={"/loginAdmin"} />;
    }
    const indexOfLastMaterial = currentPage * itemsPerPage;
    const indexOfFirstMaterial = indexOfLastMaterial - itemsPerPage;
    const currentCuttingProcesss = CuttingProcesss.slice(indexOfFirstMaterial, indexOfLastMaterial);
    const totalPages = Math.ceil(CuttingProcesss.length / itemsPerPage);

    return (
        <section className="page CuttingProcesss">
            <h1>CuttingProcesss</h1>
            <div className="banner">
                {currentCuttingProcesss.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Thickenss</th>
                                    <th>Welding_time</th>
                                    <th>Profile</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCuttingProcesss.map((CuttingProcess) => (
                                    <tr key={CuttingProcess._id}>
                                        <td>
                                            {editCuttingProcess && editCuttingProcess._id === CuttingProcess._id ? (
                                                <input
                                                    type="number"
                                                    name="thickenss"
                                                    value={editCuttingProcess.thickenss}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                CuttingProcess.thickenss
                                            )}
                                        </td>
                                        <td>
                                            {editCuttingProcess && editCuttingProcess._id === CuttingProcess._id ? (
                                                <input
                                                    type="number"
                                                    name="Welding_time"
                                                    value={editCuttingProcess.Welding_time}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                CuttingProcess.Welding_time
                                            )}
                                        </td>
                                        <td>
                                            {editCuttingProcess && editCuttingProcess._id === CuttingProcess._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="profile-select-label">Profile</InputLabel>
                                                    <Select
                                                        labelId="profile-select-label"
                                                        id="profile-select"
                                                        value={editCuttingProcess.profile || ''}
                                                        onChange={(e) => handleInputChange({ target: { name: 'profile', value: e.target.value } })}
                                                        inputProps={{
                                                            name: 'profile',
                                                            id: 'profile-select',
                                                        }}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {ProfileOptions.map((profile) => (
                                                            <MenuItem key={profile._id} value={profile._id}>{profile.brandname}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                CuttingProcess.profile?.brandname || ''
                                            )}
                                        </td>
                                        <td className="table-actions">
                                            {editCuttingProcess && editCuttingProcess._id === CuttingProcess._id ? (
                                                <>
                                                    <button
                                                        className="save-button"
                                                        onClick={() => handleUpdate(CuttingProcess._id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="cancel-button"
                                                        onClick={() => setEditCuttingProcess(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="edit-button"
                                                        onClick={() => handleEdit(CuttingProcess)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDelete(CuttingProcess._id)}
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
                    <h1>No Registered CuttingProcesss Found!</h1>
                )}
            </div>
        </section>
    );
};

export default GetAllCuttingProcess;
