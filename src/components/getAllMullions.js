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

const GetAllMullions = () => {
    const [Mullions, setMullions] = useState([]);
    const [editMullion, setEditMullion] = useState(null);
    const { isAuthenticated } = useContext(Context);
    const [ProfileOptions, setProfileOptions] = useState([]);
    const [FrameOptions, setFrameOptions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // عدد العناصر لكل صفحة
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchMullions = async () => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/v1/Mullion`, {
                params: {
                    page: currentPage,
                    limit: itemsPerPage,
                },
                withCredentials: false,
            });
            if (data.results > 0) {
                setMullions(data.data.map(Mullion => ({
                    ...Mullion,
                    profile: Mullion.profile || {},
                    colours: Mullion.colours || {}, 
                })));
            } else {
                setMullions([]);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching Mullions");
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
        fetchMullions();
    }, [currentPage]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [profileResponse, frameResponse] = await Promise.all([
                    axios.get(`${apiUrl}/api/v1/Profile`),
                    axios.get(`${apiUrl}/api/v1/Frame`)
                ]);
                setProfileOptions(profileResponse.data.data);
                setFrameOptions(frameResponse.data.data);
            } catch (error) {
                toast.error("Error fetching options: " + error.message);
            }
        };

        fetchOptions();
    }, []);

    useEffect(() => {
        if (editMullion && !isNaN(editMullion.pricePermeter) && isValidObjectId(editMullion.Length_of_Beam)) {
            const selectedLengthOfBeamOption = FrameOptions.find(option => option._id === editMullion.Length_of_Beam);
            if (selectedLengthOfBeamOption) {
                const lengthOfBeam = parseFloat(selectedLengthOfBeamOption.Length_of_Beam);
                const priceBeam = editMullion.pricePermeter * lengthOfBeam;
                setEditMullion(prevEditSash => ({
                    ...prevEditSash,
                    price_beam: priceBeam
                }));
            }
        }
    }, [editMullion?.pricePermeter, editMullion?.Length_of_Beam, FrameOptions]);

    const handleDelete = async (MullionId) => {
        try {
            await axios.delete(`${apiUrl}/api/v1/Mullion/${MullionId}`, {
                withCredentials: false,
            });
            toast.success("Mullion deleted successfully");
            fetchMullions();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting Mullion");
        }
    };

    const handleEdit = (FloatingMullion) => {
        const profileId = FloatingMullion.profile?._id;
        const selectedProfile = ProfileOptions.find(profile => profile._id === profileId);
        const selectedColors = selectedProfile ? selectedProfile.profileColor : ''; // تعديل للحصول على ألوان البروفايل

        setEditMullion({
            ...FloatingMullion,
            profile: profileId || '',
            Length_of_Beam: FloatingMullion.Length_of_Beam?._id || '',
            colours: selectedColors // تحديد اللون من البروفايل المحدد
        });
    };

    const handleUpdate = async (MullionId) => {
        try {
            await axios.put(`${apiUrl}/api/v1/Mullion/${MullionId}`, editMullion, {
                withCredentials: false,
            });
            setMullions(Mullions.map(m => m._id === MullionId ? editMullion : m));
            setEditMullion(null);
            toast.success("Mullion updated successfully");
            fetchMullions();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating Mullion");
        }
    };

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setEditMullion(prevEditSash => {
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

    const indexOfLastMaterial = currentPage * itemsPerPage;
    const indexOfFirstMaterial = indexOfLastMaterial - itemsPerPage;
    const currentMullions = Mullions.slice(indexOfFirstMaterial, indexOfLastMaterial);
    const totalPages = Math.ceil(Mullions.length / itemsPerPage);


    return (
        <section className="page Mullions">
            <h1>Mullions</h1>
            <div className="banner">
                {currentMullions.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Code</th>
                                    <th>Length_of_Beam</th>
                                    <th>Width</th>
                                    <th>WeightPermeter</th>
                                    <th>PricePermeter</th>
                                    <th>Profile</th>
                                    <th>Colours</th>
                                    <th>Price Beam</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentMullions.map((Mullion) => (
                                    <tr key={Mullion._id}>
                                        <td>
                                            {editMullion && editMullion._id === Mullion._id ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editMullion.name}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Mullion.name
                                            )}
                                        </td>
                                        <td>
                                            {editMullion && editMullion._id === Mullion._id ? (
                                                <input
                                                    type="text"
                                                    name="code"
                                                    value={editMullion.code}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Mullion.code
                                            )}
                                        </td>
                                        <td>
                                            {editMullion && editMullion._id === Mullion._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="Length_of_Beam-select-label">Length_of_Beam</InputLabel>
                                                    <Select
                                                        labelId="Length_of_Beam-select-label"
                                                        id="Length_of_Beam-select"
                                                        value={editMullion.Length_of_Beam || ''}
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
                                                Mullion.Length_of_Beam?.Length_of_Beam || ''
                                            )}
                                        </td>
                                        <td>
                                            {editMullion && editMullion._id === Mullion._id ? (
                                                <input
                                                    type="number"
                                                    name="Width"
                                                    value={editMullion.Width}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Mullion.Width
                                            )}
                                        </td>
                                        <td>
                                            {editMullion && editMullion._id === Mullion._id ? (
                                                <input
                                                    type="number"
                                                    name="weightPermeter"
                                                    value={editMullion.weightPermeter}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Mullion.weightPermeter
                                            )}
                                        </td>
                                        <td>
                                            {editMullion && editMullion._id === Mullion._id ? (
                                                <input
                                                    type="number"
                                                    name="pricePermeter"
                                                    value={editMullion.pricePermeter}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Mullion.pricePermeter
                                            )}
                                        </td>
                                        <td>
                                            {editMullion && editMullion._id === Mullion._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="profile-select-label">Profile</InputLabel>
                                                    <Select
                                                        labelId="profile-select-label"
                                                        id="profile-select"
                                                        value={editMullion.profile || ''}
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
                                                Mullion.profile?.brandname || ''
                                            )}
                                        </td>
                                        <td>
                                            {editMullion && editMullion._id === Mullion._id ? (
                                                <div>
                                                    {renderColours(editMullion.colours)}
                                                </div>
                                            ) : (
                                                <div>
                                                    {renderColours(Mullion.profile?.profileColor)}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {editMullion && editMullion._id === Mullion._id ? (
                                                <input
                                                    type="number"
                                                    name="price_beam"
                                                    disabled
                                                    value={editMullion.price_beam} // لا تحتاج إلى التحكم بالتغييرات هنا
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Mullion.price_beam // عرض قيمة "price_beam" التي تم تحديدها من قبل
                                            )}
                                        </td>
                                        <td className="table-actions">
                                            {editMullion && editMullion._id === Mullion._id ? (
                                                <>
                                                    <button
                                                        className="save-button"
                                                        onClick={() => handleUpdate(Mullion._id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="cancel-button"
                                                        onClick={() => setEditMullion(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="edit-button"
                                                        onClick={() => handleEdit(Mullion)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDelete(Mullion._id)}
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
                    <h1>No Registered Mullions Found!</h1>
                )}
            </div>
        </section>
    );
};

export default GetAllMullions;
