/* eslint-disable no-undef */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "..";
import { Navigate } from "react-router-dom";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

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

const GetWeldingProcess = () => {
    const [WeldingProcesss, setWeldingProcesss] = useState([]);
    const [editWeldingProcess, setEditWeldingProcess] = useState(null);
    const { isAuthenticated } = useContext(Context);
    const [currentPage, setCurrentPage] = useState(1);
    const [profileOptions, setProfileOptions] = useState([]);
    const itemsPerPage = 5; // عدد العناصر لكل صفحة
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchWeldingProcesss = async (page) => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/v1/WeldingProcess`, {
                params: { page },
                withCredentials: false,
            });
            if (data.results > 0) {
                setWeldingProcesss(data.data);
            } else {
                setWeldingProcesss([]);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching WeldingProcesss");
        }
    };

    useEffect(() => {
        fetchWeldingProcesss(currentPage);
        axios.get(`${apiUrl}/api/v1/Profile`)
            .then(response => setProfileOptions(response.data.data))
            .catch(error => toast.error("Error fetching profiles: " + error.message));
    }, [currentPage]);

    const handleDelete = async (WeldingProcessId) => {
        try {
            await axios.delete(`${apiUrl}/api/v1/WeldingProcess/${WeldingProcessId}`, { withCredentials: false });
            toast.success("WeldingProcess deleted successfully");
            fetchWeldingProcesss(currentPage);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting WeldingProcess");
        }
    };

    const handleEdit = (WeldingProcess) => {
        setEditWeldingProcess({
            ...WeldingProcess,
            profiles: WeldingProcess.profiles.map(profile => profile.brandname)
        });
    };

    const handleUpdate = async (WeldingProcessId) => {
        try {
            const profileIds = editWeldingProcess.profiles.map(profileName => {
                const profile = profileOptions.find(option => option.brandname === profileName);
                return profile ? profile._id : null;
            }).filter(id => id !== null);

            await axios.put(`${apiUrl}/api/v1/WeldingProcess/${WeldingProcessId}`, 
                { ...editWeldingProcess, profiles: profileIds },
                { withCredentials: false }
            );
            setWeldingProcesss(WeldingProcesss.map(m => m._id === WeldingProcessId ? { ...editWeldingProcess, profiles: profileIds } : m));
            setEditWeldingProcess(null);
            toast.success("WeldingProcess updated successfully");
            fetchWeldingProcesss(currentPage);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating WeldingProcess");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditWeldingProcess({ ...editWeldingProcess, [name]: value });
    };

    const handleProfileChange = (e) => {
        const { value } = e.target;
        setEditWeldingProcess({ ...editWeldingProcess, profiles: value });
    };

    if (!isAuthenticated) {
        return <Navigate to={"/loginAdmin"} />;
    }

    const indexOfLastMaterial = currentPage * itemsPerPage;
    const indexOfFirstMaterial = indexOfLastMaterial - itemsPerPage;
    const currentWeldingProcesss = WeldingProcesss.slice(indexOfFirstMaterial, indexOfLastMaterial);
    const totalPages = Math.ceil(WeldingProcesss.length / itemsPerPage);

    return (
        <section className="page WeldingProcesss">
            <h1>WeldingProcesss</h1>
            <div className="banner">
                {currentWeldingProcesss.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Welding_Allowance</th>
                                    <th>Welding_time</th>
                                    <th>Profiles</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentWeldingProcesss.map((WeldingProcess) => (
                                    <tr key={WeldingProcess._id}>
                                        <td>
                                            {editWeldingProcess && editWeldingProcess._id === WeldingProcess._id ? (
                                                <input
                                                    type="number"
                                                    name="Welding_Allowance"
                                                    value={editWeldingProcess.Welding_Allowance}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                WeldingProcess.Welding_Allowance
                                            )}
                                        </td>
                                        <td>
                                            {editWeldingProcess && editWeldingProcess._id === WeldingProcess._id ? (
                                                <input
                                                    type="number"
                                                    name="Welding_time"
                                                    value={editWeldingProcess.Welding_time}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                WeldingProcess.Welding_time
                                            )}
                                        </td>
                                        <td>
                                            {editWeldingProcess && editWeldingProcess._id === WeldingProcess._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="profile-select-label">Profiles</InputLabel>
                                                    <Select
                                                        labelId="profile-select-label"
                                                        id="profile-select"
                                                        multiple
                                                        value={editWeldingProcess.profiles}
                                                        onChange={handleProfileChange}
                                                        renderValue={(selected) => selected.join(', ')}
                                                        inputProps={{
                                                            name: 'profiles',
                                                            id: 'profiles-checkbox',
                                                        }}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {profileOptions.map((profile) => (
                                                            <MenuItem key={profile._id} value={profile.brandname}>
                                                                <Checkbox checked={editWeldingProcess.profiles.indexOf(profile.brandname) > -1} />
                                                                <ListItemText primary={profile.brandname} />
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                WeldingProcess.profiles.map(profile => profile.brandname).join(', ')
                                            )}
                                        </td>
                                        <td className="table-actions">
                                            {editWeldingProcess && editWeldingProcess._id === WeldingProcess._id ? (
                                                <>
                                                    <button
                                                        className="save-button"
                                                        onClick={() => handleUpdate(WeldingProcess._id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="cancel-button"
                                                        onClick={() => setEditWeldingProcess(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="edit-button"
                                                        onClick={() => handleEdit(WeldingProcess)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDelete(WeldingProcess._id)}
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
                    <h1>No Registered WeldingProcesss Found!</h1>
                )}
            </div>
        </section>
    );
};

export default GetWeldingProcess;
