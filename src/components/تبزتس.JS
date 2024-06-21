
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Context } from "..";

// دالة للتحقق من صحة ObjectId
function isValidObjectId(value) {
    const checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    return checkForHexRegExp.test(value);
}

const GetFloatingMullion = () => {
    const [FloatingMullions, setFloatingMullions] = useState([]);
    const [editFloatingMullion, setEditFloatingMullion] = useState(null);
    const { isAuthenticated } = useContext(Context);
    const [ProfileOptions, setProfileOptions] = useState([]);
    const [FrameOptions, setFrameOptions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // عدد العناصر لكل صفحة

    const fetchFloatingMullions = async (page) => {
        try {
            const { data } = await axios.get(`https://api.wintecpvc.com/api/v1/FloatingMullion`, {
                params: {
                    page,
                },
                withCredentials: false,
            });
            console.log("Fetched data:", data.data);
            if (data.results > 0) {
                setFloatingMullions(data.data);
            } else {
                setFloatingMullions([]);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching FloatingMullions");
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
        fetchFloatingMullions(currentPage);
        axios.get("https://api.wintecpvc.com/api/v1/Profile")
            .then(response => setProfileOptions(response.data.data))
            .catch(error => toast.error("Error fetching profiles: " + error.message));
        axios.get("https://api.wintecpvc.com/api/v1/Frame")
            .then(response => setFrameOptions(response.data.data))
            .catch(error => toast.error("Error fetching frames: " + error.message));
    }, [currentPage]);

    useEffect(() => {
        if (editFloatingMullion && !isNaN(editFloatingMullion.pricePermeter) && isValidObjectId(editFloatingMullion.Length_of_Beam)) {
            const selectedLengthOfBeamOption = FrameOptions.find(option => option._id === editFloatingMullion.Length_of_Beam);
            if (selectedLengthOfBeamOption) {
                const lengthOfBeam = parseFloat(selectedLengthOfBeamOption.Length_of_Beam);
                const priceBeam = editFloatingMullion.pricePermeter * lengthOfBeam;
                setEditFloatingMullion(prevEditSash => ({
                    ...prevEditSash,
                    price_beam: priceBeam
                }));
            }
        }
    }, [editFloatingMullion?.pricePermeter, editFloatingMullion?.Length_of_Beam, FrameOptions]);

    const handleDelete = async (FloatingMullionId) => {
        try {
            await axios.delete(`https://api.wintecpvc.com/api/v1/FloatingMullion/${FloatingMullionId}`, {
                withCredentials: false,
            });
            toast.success("FloatingMullion deleted successfully");
            fetchFloatingMullions(currentPage);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting FloatingMullion");
        }
    };

    const handleEdit = (FloatingMullion) => {
        // تحديث حالة editFloatingMullion لتضمن عرض قيمة المواد في حالة التحديث
        setEditFloatingMullion({
            ...FloatingMullion,
            profile: FloatingMullion.profile._id,
            Length_of_Beam: FloatingMullion.Length_of_Beam?._id || ''
        });
    };

    const handleUpdate = async (FloatingMullionId) => {
        try {
            await axios.put(`https://api.wintecpvc.com/api/v1/FloatingMullion/${FloatingMullionId}`, editFloatingMullion, {
                withCredentials: false,
            });
            setFloatingMullions(FloatingMullions.map(m => m._id === FloatingMullionId ? editFloatingMullion : m));
            setEditFloatingMullion(null);
            toast.success("FloatingMullion updated successfully");
            fetchFloatingMullions(currentPage);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating FloatingMullion");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFloatingMullion(prevEditSash => ({
            ...prevEditSash,
            [name]: value
        }));

        if (name === "pricePermeter" || name === "Length_of_Beam") {
            const updatedPricePermeter = name === "pricePermeter" ? parseFloat(value) : parseFloat(editFloatingMullion.pricePermeter);
            // الحصول على القيمة المحددة من الخيارات لـ "Length_of_Beam"
            const selectedLengthOfBeamOption = FrameOptions.find(option => option._id === (name === "Length_of_Beam" ? value : editFloatingMullion.Length_of_Beam));
            // التحقق مما إذا كانت القيمة المحددة صالحة وموجودة
            if (selectedLengthOfBeamOption && !isNaN(updatedPricePermeter)) {
                const lengthOfBeam = parseFloat(selectedLengthOfBeamOption.Length_of_Beam);
                console.log("Updated Price Permeter:", updatedPricePermeter);
                console.log("Selected Length Of Beam:", selectedLengthOfBeamOption);
                console.log("Parsed Length Of Beam:", lengthOfBeam);
                const price_beam = updatedPricePermeter * lengthOfBeam;
                console.log("Price Beam:", price_beam);
                setEditFloatingMullion(prevEditSash => ({
                    ...prevEditSash,
                    price_beam: price_beam
                }));
            }
        }
    };

    if (!isAuthenticated) {
        return <Navigate to={"/loginAdmin"} />;
    }

    const indexOfLastMaterial = currentPage * itemsPerPage;
    const indexOfFirstMaterial = indexOfLastMaterial - itemsPerPage;
    const currentFloatingMullions = FloatingMullions.slice(indexOfFirstMaterial, indexOfLastMaterial);
    const totalPages = Math.ceil(FloatingMullions.length / itemsPerPage);

    return (
        <section className="page FloatingMullions">
            <h1>FloatingMullions</h1>
            <div className="banner">
                {currentFloatingMullions.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Code</th>
                                    <th>Length_of_Beam</th>
                                    <th>WeightPermeter</th>
                                    <th>pricePermeter</th>
                                    <th>Profile</th>
                                    <th>Price Beam</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentFloatingMullions.map((FloatingMullion) => (
                                    <tr key={FloatingMullion._id}>
                                        <td>
                                            {editFloatingMullion && editFloatingMullion._id === FloatingMullion._id ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editFloatingMullion.name}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                FloatingMullion.name
                                            )}
                                        </td>
                                        <td>
                                            {editFloatingMullion && editFloatingMullion._id === FloatingMullion._id ? (
                                                <input
                                                    type="text"
                                                    name="code"
                                                    value={editFloatingMullion.code}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                FloatingMullion.code
                                            )}
                                        </td>
                                        <td>
                                            {editFloatingMullion && editFloatingMullion._id === FloatingMullion._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="Length_of_Beam-select-label">Length_of_Beam</InputLabel>
                                                    <Select
                                                        labelId="Length_of_Beam-select-label"
                                                        id="Length_of_Beam-select"
                                                        value={editFloatingMullion.Length_of_Beam || ''}
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
                                                FloatingMullion.Length_of_Beam?.Length_of_Beam || ''
                                            )}
                                        </td>
                                        <td>
                                            {editFloatingMullion && editFloatingMullion._id === FloatingMullion._id ? (
                                                <input
                                                    type="number"
                                                    name="weightPermeter"
                                                    value={editFloatingMullion.weightPermeter}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                FloatingMullion.weightPermeter
                                            )}
                                        </td>
                                        <td>
                                            {editFloatingMullion && editFloatingMullion._id === FloatingMullion._id ? (
                                                <input
                                                    type="number"
                                                    name="pricePermeter"
                                                    value={editFloatingMullion.pricePermeter}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                FloatingMullion.pricePermeter
                                            )}
                                        </td>
                                        <td>
                                            {editFloatingMullion && editFloatingMullion._id === FloatingMullion._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="profile-select-label">Profile</InputLabel>
                                                    <Select
                                                        labelId="profile-select-label"
                                                        id="profile-select"
                                                        value={editFloatingMullion.profile || ''}
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
                                                FloatingMullion.profile?.brandname || ''
                                            )}
                                        </td>
                                        <td>
                                            {editFloatingMullion && editFloatingMullion._id === FloatingMullion._id ? (
                                                <input
                                                    type="number"
                                                    name="price_beam"
                                                    disabled
                                                    value={editFloatingMullion.price_beam}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                FloatingMullion.price_beam
                                            )}
                                        </td>
                                        <td className="table-actions">
                                            {editFloatingMullion && editFloatingMullion._id === FloatingMullion._id ? (
                                                <>
                                                    <button
                                                        className="save-button"
                                                        onClick={() => handleUpdate(FloatingMullion._id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="cancel-button"
                                                        onClick={() => setEditFloatingMullion(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="edit-button"
                                                        onClick={() => handleEdit(FloatingMullion)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDelete(FloatingMullion._id)}
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
                    <h1>No Registered FloatingMullions Found!</h1>
                )}
            </div>
        </section>
    );
};

export default GetFloatingMullion;

