/* eslint-disable no-undef */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "..";
import { Navigate } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function isValidObjectId(value) {
    const checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    return checkForHexRegExp.test(value);
}

const GetAllGlazingBead = () => {
    const [GlazingBeads, setGlazingBeads] = useState([]);
    const [editGlazingBead, setEditGlazingBead] = useState(null);
    const { isAuthenticated } = useContext(Context);
    const [ProfileOptions, setProfileOptions] = useState([]);
    const [FrameOptions, setFrameOptions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // عدد العناصر لكل صفحة
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchGlazingBeads = async (page) => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/v1/GlazingBead`, {
                params: { page },
                withCredentials: false,
            });
            if (data.results > 0) {
                setGlazingBeads(data.data);
            } else {
                setGlazingBeads([]);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching GlazingBeads");
        }
    };

    useEffect(() => {
        fetchGlazingBeads(currentPage);
        axios.get(`${apiUrl}/api/v1/Profile`)
            .then(response => setProfileOptions(response.data.data))
            .catch(error => toast.error("Error fetching profiles: " + error.message));
        axios.get(`${apiUrl}/api/v1/Frame`)
            .then(response => setFrameOptions(response.data.data))
            .catch(error => toast.error("Error fetching frames: " + error.message));

    }, [currentPage]);

    useEffect(() => {
        if (editGlazingBead && !isNaN(editGlazingBead.pricePermeter) && isValidObjectId(editGlazingBead.Length_of_Beam)) {
            const selectedLengthOfBeamOption = FrameOptions.find(option => option._id === editGlazingBead.Length_of_Beam);
            if (selectedLengthOfBeamOption) {
                const lengthOfBeam = parseFloat(selectedLengthOfBeamOption.Length_of_Beam);
                const priceBeam = editGlazingBead.pricePermeter * lengthOfBeam;
                setEditGlazingBead(prevEditSash => ({
                    ...prevEditSash,
                    price_beam: priceBeam
                }));
            }
        }
    }, [editGlazingBead?.pricePermeter, editGlazingBead?.Length_of_Beam, FrameOptions, editGlazingBead]);

    const handleDelete = async (GlazingBeadId) => {
        try {
            await axios.delete(`${apiUrl}/api/v1/GlazingBead/${GlazingBeadId}`, {
                withCredentials: false,
            });
            toast.success("GlazingBead deleted successfully");
            fetchGlazingBeads(currentPage);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting GlazingBead");
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

    const handleEdit = (GlazingBead) => {
        const profileId = GlazingBead.profile?._id;
        const selectedProfile = ProfileOptions.find(profile => profile._id === profileId);
        const selectedColors = selectedProfile ? selectedProfile.profileColor : ''; // تعديل للحصول على ألوان البروفايل

        setEditGlazingBead({
            ...GlazingBead,
            profile: profileId || '',
            Length_of_Beam: GlazingBead.Length_of_Beam?._id || '',
            colours: selectedColors // تحديد اللون من البروفايل المحدد
        });
    };



    const handleUpdate = async (GlazingBeadId) => {
        try {
            await axios.put(`${apiUrl}/api/v1/GlazingBead/${GlazingBeadId}`, editGlazingBead, {
                withCredentials: false,
            });
            setGlazingBeads(GlazingBeads.map(m => m._id === GlazingBeadId ? editGlazingBead : m));
            setEditGlazingBead(null);
            toast.success("GlazingBead updated successfully");
            fetchGlazingBeads(currentPage);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating GlazingBead");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setEditGlazingBead(prevEditSash => {
            const updatedGlazingBead = {
                ...prevEditSash,
                [name]: value
            };

            if (name === "pricePermeter" || name === "Length_of_Beam") {
                const updatedPricePermeter = name === "pricePermeter" ? parseFloat(value) : parseFloat(updatedGlazingBead.pricePermeter);
                const selectedLengthOfBeamOption = FrameOptions.find(option => option._id === (name === "Length_of_Beam" ? value : updatedGlazingBead.Length_of_Beam));

                if (selectedLengthOfBeamOption && !isNaN(updatedPricePermeter)) {
                    const lengthOfBeam = parseFloat(selectedLengthOfBeamOption.Length_of_Beam);
                    const price_beam = updatedPricePermeter * lengthOfBeam;

                    updatedGlazingBead.price_beam = price_beam;
                }
            }

            if (name === "profile") {
                const selectedProfile = ProfileOptions.find(option => option._id === value);
                const selectedLengthOfBeam = selectedProfile?.profileColor || '';
                updatedGlazingBead.colours = selectedLengthOfBeam;
            }

            return updatedGlazingBead;
        });
    };

    if (!isAuthenticated) {
        return <Navigate to={"/loginAdmin"} />;
    }

    const renderColours = (colours) => {
        if (Array.isArray(colours)) {
            return colours.map((colour, index) => (
                <span key={index}>{colour.title}</span>
            ));
        } else if (typeof colours === 'object') {
            return <span>{colours.title}</span>;
        } else {
            return <span>{colours}</span>;
        }
    };


    const indexOfLastMaterial = currentPage * itemsPerPage;
    const indexOfFirstMaterial = indexOfLastMaterial - itemsPerPage;
    const currentGlazingBeads = GlazingBeads.slice(indexOfFirstMaterial, indexOfLastMaterial);
    const totalPages = Math.ceil(GlazingBeads.length / itemsPerPage);
    return (
        <section className="page GlazingBeads">
            <h1>GlazingBeads</h1>
            <div className="banner">
                {currentGlazingBeads.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Code</th>
                                    <th>Length_of_Beam</th>
                                    <th>height</th>
                                    <th>WeightPermeter</th>
                                    <th>pricePermeter</th>
                                    <th>Profile</th>
                                    <th>Colours</th>
                                    <th>Price Beam</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentGlazingBeads.map((GlazingBead) => (
                                    <tr key={GlazingBead._id}>
                                        <td>
                                            {editGlazingBead && editGlazingBead._id === GlazingBead._id ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editGlazingBead.name}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                GlazingBead.name
                                            )}
                                        </td>
                                        <td>
                                            {editGlazingBead && editGlazingBead._id === GlazingBead._id ? (
                                                <input
                                                    type="text"
                                                    name="code"
                                                    value={editGlazingBead.code}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                GlazingBead.code
                                            )}
                                        </td>
                                        <td>
                                            {editGlazingBead && editGlazingBead._id === GlazingBead._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="Length_of_Beam-select-label">Length_of_Beam</InputLabel>
                                                    <Select
                                                        labelId="Length_of_Beam-select-label"
                                                        id="Length_of_Beam-select"
                                                        value={editGlazingBead.Length_of_Beam || ''}
                                                        onChange={(e) => handleInputChange({ target: { name: 'Length_of_Beam', value: e.target.value } })}
                                                        inputProps={{
                                                            name: 'Length_of_Beam',
                                                            id: 'Length_of_Beam-select',
                                                        }}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {FrameOptions.map((frame) => (
                                                            <MenuItem key={frame._id} value={frame._id}>{frame.Length_of_Beam}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                GlazingBead.Length_of_Beam?.Length_of_Beam || ''
                                            )}
                                        </td>
                                        <td>
                                            {editGlazingBead && editGlazingBead._id === GlazingBead._id ? (
                                                <input
                                                    type="number"
                                                    name="height"
                                                    value={editGlazingBead.height}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                GlazingBead.height
                                            )}
                                        </td>
                                        <td>
                                            {editGlazingBead && editGlazingBead._id === GlazingBead._id ? (
                                                <input
                                                    type="number"
                                                    name="weightPermeter"
                                                    value={editGlazingBead.weightPermeter}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                GlazingBead.weightPermeter
                                            )}
                                        </td>
                                        <td>
                                            {editGlazingBead && editGlazingBead._id === GlazingBead._id ? (
                                                <input
                                                    type="number"
                                                    name="pricePermeter"
                                                    value={editGlazingBead.pricePermeter}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                GlazingBead.pricePermeter
                                            )}
                                        </td>
                                        <td>
                                            {editGlazingBead && editGlazingBead._id === GlazingBead._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="profile-select-label">Profile</InputLabel>
                                                    <Select
                                                        labelId="profile-select-label"
                                                        id="profile-select"
                                                        value={editGlazingBead.profile || ''}
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
                                                GlazingBead.profile?.brandname || ''
                                            )}
                                        </td>
                                        <td>
                                            {editGlazingBead && editGlazingBead._id === GlazingBead._id ? (
                                                <div>
                                                    {renderColours(editGlazingBead.colours)}
                                                </div>
                                            ) : (
                                                <div>
                                                    {renderColours(GlazingBead.profile?.profileColor)}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {editGlazingBead && editGlazingBead._id === GlazingBead._id ? (
                                                <input
                                                    type="number"
                                                    name="price_beam"
                                                    disabled
                                                    value={editGlazingBead.price_beam}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                GlazingBead.price_beam
                                            )}
                                        </td>
                                        <td className="table-actions">
                                            {editGlazingBead && editGlazingBead._id === GlazingBead._id ? (
                                                <>
                                                    <button
                                                        className="save-button"
                                                        onClick={() => handleUpdate(GlazingBead._id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="cancel-button"
                                                        onClick={() => setEditGlazingBead(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="edit-button"
                                                        onClick={() => handleEdit(GlazingBead)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDelete(GlazingBead._id)}
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
                    <h1>No Registered GlazingBeads Found!</h1>
                )}
            </div>
        </section>
    );
};

export default GetAllGlazingBead;
