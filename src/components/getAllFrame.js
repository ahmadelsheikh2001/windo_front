/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "..";
import { Navigate } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const GetAllFrames = () => {
    const [Frames, setFrames] = useState([]);
    const [editFrame, setEditFrame] = useState(null);
    const { isAuthenticated } = useContext(Context);
    const [currentPage, setCurrentPage] = useState(1);
    const [ProfileOptions, setProfileOptions] = useState([]);
    const itemsPerPage = 5; // عدد العناصر لكل صفحة
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchFrames = async (page) => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/v1/Frame`, {
                params: {
                    page,
                },
                withCredentials: false,
            });
            if (data.results > 0) {
                setFrames(data.data.map(frame => {
                    const lengthOfBeam = parseFloat(frame.Length_of_Beam);
                    const pricePermeter = parseFloat(frame.pricePermeter);
                    const priceBeam = pricePermeter * lengthOfBeam;

                    return {
                        ...frame,
                        profile: frame.profile || {}, // تأكد من أن profile موجود
                        price_beam: priceBeam, // حساب وتعيين قيمة price_beam
                    };
                }));
            } else {
                setFrames([]);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching Frames");
        }
    };

    useEffect(() => {
        fetchFrames(currentPage);
        axios.get(`${apiUrl}/api/v1/Profile`)
            .then(response => setProfileOptions(response.data.data))
            .catch(error => toast.error("Error fetching profiles: " + error.message));
    }, [currentPage]);

    const handleDelete = async (FrameId) => {
        try {
            await axios.delete(`${apiUrl}/api/v1/Frame/${FrameId}`, {
                withCredentials: false,
            });
            toast.success("Frame deleted successfully");
            fetchFrames(currentPage);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Error deleting Frame");
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

    const handleUpdate = async (FrameId) => {
        try {
            const formData = new FormData();
            formData.append("name", editFrame.name);
            formData.append("from", editFrame.from);
            formData.append("Length_of_Beam", editFrame.Length_of_Beam);
            formData.append("Renovation", editFrame.Renovation);
            formData.append("Renovation_height", editFrame.Renovation_height);
            formData.append("Frame_Height", editFrame.Frame_Height);
            formData.append("Frame_Width", editFrame.Frame_Width);
            formData.append("weightPermeter", editFrame.weightPermeter);
            formData.append("pricePermeter", editFrame.pricePermeter);
            formData.append("profile", editFrame.profile);

            if (editFrame.image && editFrame.image !== "") {
                formData.append("image", editFrame.image);
            }

            await axios.put(`${apiUrl}/api/v1/Frame/${FrameId}`, editFrame, {
                withCredentials: false,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success("Frame updated successfully");
            fetchFrames(currentPage);
            setEditFrame(null);
        } catch (error) {
            console.error("Error updating Frame:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Error updating Frame");
        }
    };

    const handleEdit = (frame) => {
        const lengthOfBeam = parseFloat(frame.Length_of_Beam);
        const pricePermeter = parseFloat(frame.pricePermeter);
        const priceBeam = pricePermeter * lengthOfBeam;

        setEditFrame({
            ...frame,
            Length_of_Beam: lengthOfBeam,
            pricePermeter: pricePermeter,
            price_beam: priceBeam, // تعيين قيمة price_beam
            profile: frame.profile._id
        });
    };

    useEffect(() => {
        if (editFrame && !isNaN(editFrame.pricePermeter) && !isNaN(editFrame.Length_of_Beam)) {
            const lengthOfBeam = parseFloat(editFrame.Length_of_Beam);
            const priceBeam = editFrame.pricePermeter * lengthOfBeam;
            setEditFrame(prevEditFrame => ({
                ...prevEditFrame,
                price_beam: priceBeam
            }));
        }
    }, [editFrame?.pricePermeter, editFrame?.Length_of_Beam, editFrame]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image" && files && files[0]) {
            setEditFrame(prevEditFrame => ({
                ...prevEditFrame,
                [name]: files[0],
                previewImage: URL.createObjectURL(files[0])
            }));
        } else {
            setEditFrame(prevEditFrame => ({
                ...prevEditFrame,
                [name]: value
            }));

            if (name === "pricePermeter" || name === "Length_of_Beam") {
                const updatedPricePermeter = name === "pricePermeter" ? parseFloat(value) : parseFloat(editFrame.pricePermeter);
                const selectedLengthOfBeamOption = Frames.find(option => option._id === (name === "Length_of_Beam" ? value : editFrame.Length_of_Beam));
                if (selectedLengthOfBeamOption && !isNaN(updatedPricePermeter)) {
                    const lengthOfBeam = parseFloat(selectedLengthOfBeamOption.Length_of_Beam);
                    const price_beam = updatedPricePermeter * lengthOfBeam;
                    setEditFrame(prevEditFrame => ({
                        ...prevEditFrame,
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
    const currentFrames = Frames.slice(indexOfFirstMaterial, indexOfLastMaterial);
    const totalPages = Math.ceil(Frames.length / itemsPerPage);

    return (
        <section className="page Frames">
            <h1>Frames</h1>
            <div className="banner">
                {currentFrames.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Image</th>
                                    <th>From</th>
                                    <th>Code</th>
                                    <th>Length_of_Beam</th>
                                    <th>Renovation</th>
                                    <th>Renovation_height</th>
                                    <th>Frame_Height</th>
                                    <th>Frame_Width</th>
                                    <th>WeightPermeter</th>
                                    <th>PricePermeter</th>
                                    <th>Profile</th>
                                    <th>Price Beam</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentFrames.map((Frame) => (
                                    <tr key={Frame._id}>
                                        <td>
                                            {editFrame && editFrame._id === Frame._id ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editFrame.name}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Frame.name
                                            )}
                                        </td>
                                        <td>
                                            {editFrame && editFrame._id === Frame._id ? (
                                                <>
                                                    <input
                                                        type="file"
                                                        name="image"
                                                        onChange={handleInputChange}
                                                    />
                                                    {editFrame.previewImage ? (
                                                        <img src={editFrame.previewImage} alt={Frame.name} width="50" height="50" />
                                                    ) : (
                                                        <img src={Frame.image} alt={Frame.name} width="50" height="50" />
                                                    )}
                                                </>
                                            ) : (
                                                <img src={Frame.image} alt={Frame.name} width="50" height="50" />
                                            )}
                                        </td>
                                        <td>
                                            {editFrame && editFrame._id === Frame._id ? (
                                                <input
                                                    type="number"
                                                    name="from"
                                                    value={editFrame.from}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Frame.from
                                            )}
                                        </td>
                                        <td>
                                            {editFrame && editFrame._id === Frame._id ? (
                                                <input
                                                    type="text"
                                                    name="code"
                                                    value={editFrame.code}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Frame.code
                                            )}
                                        </td>
                                        <td>
                                            {editFrame && editFrame._id === Frame._id ? (
                                                <input
                                                    type="number"
                                                    name="Length_of_Beam"
                                                    value={editFrame.Length_of_Beam}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Frame.Length_of_Beam
                                            )}
                                        </td>
                                        <td>
                                            {editFrame && editFrame._id === Frame._id ? (
                                                <input
                                                    type="text"
                                                    name="Renovation"
                                                    value={editFrame.Renovation}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Frame.Renovation ? 'Yes' : 'No'
                                            )}
                                        </td>
                                        <td>
                                            {editFrame && editFrame._id === Frame._id ? (
                                                <input
                                                    type="number"
                                                    name="Renovation_height"
                                                    value={editFrame.Renovation_height}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Frame.Renovation_height
                                            )}
                                        </td>
                                        <td>
                                            {editFrame && editFrame._id === Frame._id ? (
                                                <input
                                                    type="number"
                                                    name="Frame_Height"
                                                    value={editFrame.Frame_Height}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Frame.Frame_Height
                                            )}
                                        </td>
                                        <td>
                                            {editFrame && editFrame._id === Frame._id ? (
                                                <input
                                                    type="number"
                                                    name="Frame_Width"
                                                    value={editFrame.Frame_Width}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Frame.Frame_Width
                                            )}
                                        </td>
                                        <td>
                                            {editFrame && editFrame._id === Frame._id ? (
                                                <input
                                                    type="number"
                                                    name="weightPermeter"
                                                    value={editFrame.weightPermeter}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Frame.weightPermeter
                                            )}
                                        </td>
                                        <td>
                                            {editFrame && editFrame._id === Frame._id ? (
                                                <input
                                                    type="number"
                                                    name="pricePermeter"
                                                    value={editFrame.pricePermeter}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Frame.pricePermeter
                                            )}
                                        </td>
                                        <td>
                                            {editFrame && editFrame._id === Frame._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="profile-select-label">Profile</InputLabel>
                                                    <Select
                                                        labelId="profile-select-label"
                                                        id="profile-select"
                                                        value={editFrame.profile || ''}
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
                                                Frame.profile?.brandname || ''
                                            )}
                                        </td>
                                        <td>
                                            {editFrame && editFrame._id === Frame._id ? (
                                                <input
                                                    type="number"
                                                    name="price_beam"
                                                    disabled
                                                    value={editFrame.price_beam}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Frame.price_beam
                                            )}
                                        </td>
                                        <td className="table-actions">
                                            {editFrame && editFrame._id === Frame._id ? (
                                                <>
                                                    <button
                                                        className="save-button"
                                                        onClick={() => handleUpdate(Frame._id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="cancel-button"
                                                        onClick={() => setEditFrame(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="edit-button"
                                                        onClick={() => handleEdit(Frame)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDelete(Frame._id)}
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
                    <h1>No Registered Frames Found!</h1>
                )}
            </div>
        </section>
    );
};

export default GetAllFrames;
