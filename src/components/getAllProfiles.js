/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "..";
import { Navigate } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const GetAllProfiles = () => {
    const [Profiles, setProfiles] = useState([]);
    const [editProfile, setEditProfile] = useState(null);
    const { isAuthenticated } = useContext(Context);
    const [currentPage, setCurrentPage] = useState(1);
    const [ProfileOptions, setProfileOptions] = useState([]);
    const [SystemOptions, setSystemOptions] = useState([]);
    const [MaterialOptions, setMaterialOptions] = useState([]);
    const [ColorsOptions, setColorsOptions] = useState([]);
    const itemsPerPage = 5; // عدد العناصر لكل صفحة
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchProfiles = async (page) => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/v1/Profile`, {
                params: {
                    page,
                },
                withCredentials: false,
            });
            if (data.results > 0) {
                setProfiles(data.data);
            } else {
                setProfiles([]);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching Profiles");
        }
    };
    const ITEM_HEIGHT = 40;
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
        fetchProfiles(currentPage);
        axios.get(`${apiUrl}/api/v1/Company`)
            .then(response => setProfileOptions(response.data.data))
            .catch(error => toast.error("Error fetching profiles: " + error.message));
        axios.get(`${apiUrl}/api/v1/OpeningSystem`)
            .then(response => setSystemOptions(response.data.data))
            .catch(error => toast.error("Error fetching profiles: " + error.message));
        axios.get(`${apiUrl}/api/v1/Material`)
            .then(response => setMaterialOptions(response.data.data))
            .catch(error => toast.error("Error fetching profiles: " + error.message));
        axios.get(`${apiUrl}/api/v1/ProfileColor`)
            .then(response => setColorsOptions(response.data.data))
            .catch(error => toast.error("Error fetching profiles: " + error.message));

    }, [currentPage]);

    const handleDelete = async (ProfileId) => {
        try {
            await axios.delete(`${apiUrl}/api/v1/Profile/${ProfileId}`, {
                withCredentials: false,
            });
            toast.success("Profile deleted successfully");
            fetchProfiles(currentPage);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting Profile");
        }
    };
    const fetchFanlightsByLayout = async (layoutId) => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/v1/Company?material=${layoutId}`);
            setProfileOptions(data.data);
        } catch (error) {
            toast.error("Error fetching fanlights: " + error.message);
        }
    };
    const fetchFanlightsByompany = async (layoutId) => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/v1/OpeningSystem?company=${layoutId}`);
            setSystemOptions(data.data);
        } catch (error) {
            toast.error("Error fetching fanlights: " + error.message);
        }
    };
    const handleEdit = async (company) => {
        setEditProfile({
            ...company,
            material: company.material._id,
            profileColor: company.profileColor._id,
            system: company.system._id,
            company: company.company._id

        });
        await fetchFanlightsByLayout(company.material._id);
        await fetchFanlightsByompany(company.company._id);

    };
    const handleUpdate = async (ProfileColorId) => {
        try {
            const formData = new FormData();
            formData.append("brandname", editProfile.brandname);
            formData.append("desc1", editProfile.desc1);
            formData.append("desc2", editProfile.desc2);
            formData.append("desc3", editProfile.desc3);
            formData.append("surcharge", editProfile.surcharge);
            formData.append("company", editProfile.company);
            formData.append("profileColor", editProfile.profileColor);
            formData.append("system", editProfile.system);
            formData.append("material", editProfile.material);

            if (editProfile.image && editProfile.image !== "") {
                formData.append("image", editProfile.image);
            }

            await axios.put(`${apiUrl}/api/v1/Profile/${ProfileColorId}`, formData, {
                withCredentials: false,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setProfiles(Profiles.map((m) => m._id === ProfileColorId ? editProfile : m));
            setEditProfile(null);
            toast.success("Company updated successfully");
            fetchProfiles();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating Company");
        }
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files && files[0]) {
            setEditProfile((editProfile) => ({
                ...editProfile,
                [name]: files[0],
                previewImage: URL.createObjectURL(files[0])
            }));
        } else {
            setEditProfile((editProfile) => ({
                ...editProfile,
                [name]: value,
                previewImage: editProfile.previewImage ? editProfile.previewImage : null
            }));

            if (name === "material") {
                fetchFanlightsByLayout(value);
                setEditProfile((prev) => ({
                    ...prev,
                    company: '',
                }));
            }
            if (name === "company") {
                fetchFanlightsByompany(value);
                setEditProfile((prev) => ({
                    ...prev,
                    system: '',
                }));
            }
        }
    };


    if (!isAuthenticated) {
        return <Navigate to={"/loginAdmin"} />;
    }
    const indexOfLastMaterial = currentPage * itemsPerPage;
    const indexOfFirstMaterial = indexOfLastMaterial - itemsPerPage;
    const currentProfiles = Profiles.slice(indexOfFirstMaterial, indexOfLastMaterial);
    const totalPages = Math.ceil(Profiles.length / itemsPerPage);

    return (
        <section className="page Profiles">
            <h1>Profiles</h1>
            <div className="banner">
                {currentProfiles.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>brandname</th>
                                    <th>Image</th>
                                    <th>Description1</th>
                                    <th>Description2</th>
                                    <th>Description3</th>
                                    <th>Surcharge</th>
                                    <th>Material</th>
                                    <th>Company</th>
                                    <th>System</th>
                                    <th>ProfileColor</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProfiles.map((Profile) => (
                                    <tr key={Profile._id}>
                                        <td>
                                            {editProfile && editProfile._id === Profile._id ? (
                                                <input
                                                    type="text"
                                                    name="brandname"
                                                    value={editProfile.brandname}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Profile.brandname
                                            )}
                                        </td>
                                        <td>
                                            {editProfile && editProfile._id === Profile._id ? (
                                                <>
                                                    <input
                                                        type="file"
                                                        name="image"
                                                        onChange={handleInputChange}
                                                    />
                                                    {editProfile.previewImage ? (
                                                        <img src={editProfile.previewImage} alt={Profile.name} width="50" height="50" />
                                                    ) : (
                                                        <img src={Profile.image} alt={Profile.name} width="50" height="50" />
                                                    )}
                                                </>
                                            ) : (
                                                <img src={Profile.image} alt={Profile.name} width="50" height="50" />
                                            )}
                                        </td>
                                        <td>
                                            {editProfile && editProfile._id === Profile._id ? (
                                                <input
                                                    type="text"
                                                    name="desc1"
                                                    value={editProfile.desc1}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Profile.desc1
                                            )}
                                        </td>
                                        <td>
                                            {editProfile && editProfile._id === Profile._id ? (
                                                <input
                                                    type="text"
                                                    name="desc2"
                                                    value={editProfile.desc2}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Profile.desc2
                                            )}
                                        </td>
                                        <td>
                                            {editProfile && editProfile._id === Profile._id ? (
                                                <input
                                                    type="text"
                                                    name="desc3"
                                                    value={editProfile.desc3}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Profile.desc3
                                            )}
                                        </td>
                                        <td>
                                            {editProfile && editProfile._id === Profile._id ? (
                                                <input
                                                    type="text"
                                                    name="surcharge"
                                                    value={editProfile.surcharge}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Profile.surcharge
                                            )}
                                        </td>
                                        <td>
                                            {editProfile && editProfile._id === Profile._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="material-select-label">material</InputLabel>
                                                    <Select
                                                        labelId="material-select-label"
                                                        id="material-select"
                                                        value={editProfile.material || ''}
                                                        onChange={(e) => handleInputChange({ target: { name: 'material', value: e.target.value } })}
                                                        inputProps={{
                                                            name: 'material',
                                                            id: 'material-select',
                                                        }}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {MaterialOptions.map((profile) => (
                                                            <MenuItem key={profile._id} value={profile._id}>{profile.type}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                Profile.material?.type || ''
                                            )}
                                        </td>
                                        <td>
                                            {editProfile && editProfile._id === Profile._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="Company-select-label">Company</InputLabel>
                                                    <Select
                                                        labelId="Company-select-label"
                                                        id="Company-select"
                                                        value={editProfile.company || ''}
                                                        onChange={(e) => handleInputChange({ target: { name: 'company', value: e.target.value } })}
                                                        inputProps={{
                                                            name: 'company',
                                                            id: 'Company-select',
                                                        }}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {ProfileOptions.map((profile) => (
                                                            <MenuItem key={profile._id} value={profile._id}>{profile.name}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                Profile.company?.name || ''
                                            )}
                                        </td>
                                        <td>
                                            {editProfile && editProfile._id === Profile._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="system-select-label">System</InputLabel>
                                                    <Select
                                                        labelId="system-select-label"
                                                        id="system-select"
                                                        value={editProfile.system || ''}
                                                        onChange={(e) => handleInputChange({ target: { name: 'system', value: e.target.value } })}
                                                        inputProps={{
                                                            name: 'system',
                                                            id: 'system-select',
                                                        }}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {SystemOptions.map((profile) => (
                                                            <MenuItem key={profile._id} value={profile._id}>{profile.type}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                Profile.system?.type || ''
                                            )}
                                        </td>
                                        <td>
                                            {editProfile && editProfile._id === Profile._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="profileColor-select-label">profileColor</InputLabel>
                                                    <Select
                                                        labelId="profileColor-select-label"
                                                        id="profileColor-select"
                                                        value={editProfile.profileColor || ''}
                                                        onChange={(e) => handleInputChange({ target: { name: 'profileColor', value: e.target.value } })}
                                                        inputProps={{
                                                            name: 'profileColor',
                                                            id: 'profileColor-select',
                                                        }}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {ColorsOptions.map((profile) => (
                                                            <MenuItem key={profile._id} value={profile._id}>{profile.title}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                Profile.profileColor?.title || ''
                                            )}
                                        </td>
                                        <td className="table-actions">
                                            {editProfile && editProfile._id === Profile._id ? (
                                                <>
                                                    <button
                                                        className="save-button"
                                                        onClick={() => handleUpdate(Profile._id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="cancel-button"
                                                        onClick={() => setEditProfile(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="edit-button"
                                                        onClick={() => handleEdit(Profile)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDelete(Profile._id)}
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
                    <h1>No Registered Profiles Found!</h1>
                )}
            </div>
        </section>
    );
};

export default GetAllProfiles;
