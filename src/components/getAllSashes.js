/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
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

const GetAllSash = () => {
    const [Sashs, setSashs] = useState([]);
    const [editSash, setEditSash] = useState(null);
    const { isAuthenticated } = useContext(Context);
    const [FrameOptions, setFramesOptions] = useState([]);
    const [ProfileOptions, setProfileOptions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // عدد العناصر لكل صفحة
    const apiUrl = process.env.REACT_APP_API_URL;

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

    const fetchSashs = async (page) => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/v1/Sash`, {
                params: {
                    page,
                },
                withCredentials: false,
            });
            if (data.results > 0) {
                setSashs(data.data);
            } else {
                setSashs([]);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching Sashs");
        }
    };

    useEffect(() => {
        fetchSashs(currentPage);
        axios.get(`${apiUrl}/api/v1/Profile`)
            .then(response => setProfileOptions(response.data.data))
            .catch(error => toast.error("Error fetching profiles: " + error.message));
        axios.get(`${apiUrl}/api/v1/Frame`)
            .then(response => setFramesOptions(response.data.data))
            .catch(error => toast.error("Error fetching profiles: " + error.message));
    }, [currentPage]);

    useEffect(() => {
        if (editSash && !isNaN(editSash.pricePermeter) && isValidObjectId(editSash.Length_of_Beam)) {
            const selectedLengthOfBeamOption = FrameOptions.find(option => option._id === editSash.Length_of_Beam);
            if (selectedLengthOfBeamOption) {
                const lengthOfBeam = parseFloat(selectedLengthOfBeamOption.Length_of_Beam);
                const priceBeam = editSash.pricePermeter * lengthOfBeam;
                setEditSash(prevEditSash => ({
                    ...prevEditSash,
                    price_beam: priceBeam
                }));
            }
        }
    }, [editSash?.pricePermeter, editSash?.Length_of_Beam, FrameOptions, editSash]);


    const handleDelete = async (SashId) => {
        try {
            await axios.delete(`${apiUrl}/api/v1/Sash/${SashId}`, {
                withCredentials: false,
            });
            toast.success("Sash deleted successfully");
            fetchSashs(currentPage);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting Sash");
        }
    };

    const handleEdit = (Sash) => {
        setEditSash({
            ...Sash,
            profile: Sash.profile._id,
            Length_of_Beam: Sash.Length_of_Beam?._id || ''
        });
    };

    const handleUpdate = async (SashId) => {
        try {
            const formData = new FormData();
            formData.append("name", editSash.name);
            formData.append("code", editSash.code);
            formData.append("Length_of_Beam", editSash.Length_of_Beam);
            formData.append("from", editSash.from);
            formData.append("height", editSash.height);
            formData.append("weightPermeter", editSash.weightPermeter);
            formData.append("pricePermeter", editSash.pricePermeter);
            formData.append("profile", editSash.profile);

            if (editSash.image && editSash.image !== "") {
                formData.append("image", editSash.image);
            }

            await axios.put(`${apiUrl}/api/v1/Sash/${SashId}`, editSash, {
                withCredentials: false,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Sash updated successfully");
            fetchSashs(currentPage);
            setEditSash(null);
        } catch (error) {
            console.error("Error updating Mullion:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Error updating Mullion");
        }
    };
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files && files[0]) {
            setEditSash(prevEditSash => ({
                ...prevEditSash,
                [name]: files[0],
                previewImage: URL.createObjectURL(files[0])
            }));
        } else {
            setEditSash(prevEditSash => ({
                ...prevEditSash,
                [name]: value
            }));

            if (name === "pricePermeter" || name === "Length_of_Beam") {
                const updatedPricePermeter = name === "pricePermeter" ? parseFloat(value) : parseFloat(editSash.pricePermeter);
                const selectedLengthOfBeamOption = FrameOptions.find(option => option._id === (name === "Length_of_Beam" ? value : editSash.Length_of_Beam));
                if (selectedLengthOfBeamOption && !isNaN(updatedPricePermeter)) {
                    const lengthOfBeam = parseFloat(selectedLengthOfBeamOption.Length_of_Beam);
                    const price_beam = updatedPricePermeter * lengthOfBeam;
                    setEditSash(prevEditSash => ({
                        ...prevEditSash,
                        price_beam: price_beam
                    }));
                }
            }
        }
    };

    if (!isAuthenticated) {
        return <Navigate to={"/loginAdmin"} />;
    }

    const indexOfLastMaterial = currentPage * itemsPerPage;
    const indexOfFirstMaterial = indexOfLastMaterial - itemsPerPage;
    const currentSashs = Sashs.slice(indexOfFirstMaterial, indexOfLastMaterial);
    const totalPages = Math.ceil(Sashs.length / itemsPerPage);
    
    return (
        <section className="page Sashs">
            <h1>Sashs</h1>
            <div className="banner">
                {currentSashs.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Code</th>
                                    <th>Length_of_Beam</th>
                                    <th>Image</th>
                                    <th>From</th>
                                    <th>Height</th>
                                    <th>WeightPermeter</th>
                                    <th>PricePermeter</th>
                                    <th>Profile</th>
                                    <th>Price Beam</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentSashs.map((Sash) => (
                                    <tr key={Sash._id}>
                                        <td>
                                            {editSash && editSash._id === Sash._id ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editSash.name}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Sash.name
                                            )}
                                        </td>
                                        <td>
                                            {editSash && editSash._id === Sash._id ? (
                                                <input
                                                    type="text"
                                                    name="code"
                                                    value={editSash.code}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Sash.code
                                            )}
                                        </td>
                                        <td>
                                            {editSash && editSash._id === Sash._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="Length_of_Beam-select-label">Length_of_Beam</InputLabel>
                                                    <Select
                                                        labelId="Length_of_Beam-select-label"
                                                        id="Length_of_Beam-select"
                                                        value={editSash.Length_of_Beam || ''}
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
                                                Sash.Length_of_Beam?.Length_of_Beam || ''
                                            )}
                                        </td>
                                        <td>
                                            {editSash && editSash._id === Sash._id ? (
                                                <>
                                                    <input
                                                        type="file"
                                                        name="image"
                                                        onChange={handleInputChange}
                                                    />
                                                    {editSash.previewImage ? (
                                                        <img src={editSash.previewImage} alt={Sash.name} width="50" height="50" />
                                                    ) : (
                                                        <img src={Sash.image} alt={Sash.name} width="50" height="50" />
                                                    )}
                                                </>
                                            ) : (
                                                <img src={Sash.image} alt={Sash.name} width="50" height="50" />
                                            )}
                                        </td>
                                        <td>
                                            {editSash && editSash._id === Sash._id ? (
                                                <input
                                                    type="number"
                                                    name="from"
                                                    value={editSash.from}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Sash.from
                                            )}
                                        </td>
                                        <td>
                                            {editSash && editSash._id === Sash._id ? (
                                                <input
                                                    type="number"
                                                    name="height"
                                                    value={editSash.height}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Sash.height
                                            )}
                                        </td>
                                        <td>
                                            {editSash && editSash._id === Sash._id ? (
                                                <input
                                                    type="Number"
                                                    name="weightPermeter"
                                                    value={editSash.weightPermeter}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Sash.weightPermeter
                                            )}
                                        </td>
                                        <td>
                                            {editSash && editSash._id === Sash._id ? (
                                                <input
                                                    type="number"
                                                    name="pricePermeter"
                                                    value={editSash.pricePermeter}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Sash.pricePermeter
                                            )}
                                        </td>
                                        <td>
                                            {editSash && editSash._id === Sash._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="profile-select-label">Profile</InputLabel>
                                                    <Select
                                                        labelId="profile-select-label"
                                                        id="profile-select"
                                                        value={editSash.profile || ''}
                                                        onChange={(e) => handleInputChange({ target: { name: 'profile', value: e.target.value } })}
                                                        inputProps={{
                                                            name: 'profile',
                                                            id: 'profile-select',
                                                        }}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {ProfileOptions.map((Profile) => (
                                                            <MenuItem key={Profile._id} value={Profile._id}>{Profile.brandname}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                Sash.profile?.brandname || ''
                                            )}
                                        </td>
                                        <td>
                                            {editSash && editSash._id === Sash._id ? (
                                                <input
                                                    type="number"
                                                    name="price_beam"
                                                    disabled
                                                    value={editSash.price_beam}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Sash.price_beam
                                            )}
                                        </td>
                                        <td className="table-actions">
                                            {editSash && editSash._id === Sash._id ? (
                                                <>
                                                    <button
                                                        className="save-button"
                                                        onClick={() => handleUpdate(Sash._id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="cancel-button"
                                                        onClick={() => setEditSash(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="edit-button"
                                                        onClick={() => handleEdit(Sash)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDelete(Sash._id)}
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
                    <h1>No Registered Sashs Found!</h1>
                )}
            </div>
        </section>
    );
};

export default GetAllSash;
