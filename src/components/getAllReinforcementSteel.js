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

const GetAllReinforcementSteel = () => {
    const [Reinforcementsteels, setReinforcementsteels] = useState([]);
    const [editReinforcementsteel, setEditReinforcementsteel] = useState(null);
    const { isAuthenticated } = useContext(Context);
    const [SashOptions, setSashOptions] = useState([]);
    const [FrameOptions, setFrameOptions] = useState([]);
    const [FloatingMullionOptions, setFloatingMullionOptions] = useState([]);
    const [MullionOptions, setMullionOptions] = useState([]);
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

    const fetchReinforcementsteels = async (page) => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/v1/Reinforcementsteel`, {
                params: {
                    page,
                },
                withCredentials: false,
            });
            if (data.results > 0) {
                setReinforcementsteels(data.data);
            } else {
                setReinforcementsteels([]);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching Reinforcementsteels");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                fetchReinforcementsteels(currentPage);
                const [sashRes, FrameRes, FloatingMullionRes, MullionRes] = await Promise.all([
                    axios.get(`${apiUrl}/api/v1/Sash`),
                    axios.get(`${apiUrl}/api/v1/Frame`),
                    axios.get(`${apiUrl}/api/v1/FloatingMullion`),
                    axios.get(`${apiUrl}/api/v1/Mullion`)
                ]);
                setSashOptions(sashRes.data.data);
                setFrameOptions(FrameRes.data.data);
                setFloatingMullionOptions(FloatingMullionRes.data.data);
                setMullionOptions(MullionRes.data.data);
            } catch (error) {
                toast.error("Failed to fetch data: " + error.message);
            }
        };
        fetchData();
    }, [currentPage]);

    useEffect(() => {
        if (editReinforcementsteel && !isNaN(editReinforcementsteel.pricePermeter) && isValidObjectId(editReinforcementsteel.frame.Length_of_Beam)) {
            const selectedLengthOfBeamOption = FrameOptions.find(option => option._id === editReinforcementsteel.Length_of_Beam);
            if (selectedLengthOfBeamOption) {
                const lengthOfBeam = parseFloat(selectedLengthOfBeamOption.Length_of_Beam);
                const priceBeam = editReinforcementsteel.pricePermeter * lengthOfBeam;
                setEditReinforcementsteel(prevEditSash => ({
                    ...prevEditSash,
                    price_beam: priceBeam
                }));
            }
        }
    }, [FrameOptions, editReinforcementsteel]);


    const handleDelete = async (ReinforcementsteelId) => {
        try {
            await axios.delete(`${apiUrl}/api/v1/Reinforcementsteel/${ReinforcementsteelId}`, {
                withCredentials: false,
            });
            toast.success("Reinforcementsteel deleted successfully");
            fetchReinforcementsteels(currentPage);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting Reinforcementsteel");
        }
    };

    const handleEdit = (Reinforcementsteel) => {
        const frameId = Reinforcementsteel.frame?._id;
        const selectedFrame = FrameOptions.find(frame => frame._id === frameId);
        const selectedLengthOfBeam = selectedFrame?.Length_of_Beam || '';
        setEditReinforcementsteel({
            ...Reinforcementsteel,
            sash: Reinforcementsteel.sash?._id || '',
            frame: frameId || '',
            floatingMullion: Reinforcementsteel.floatingMullion?._id || '',
            mullion: Reinforcementsteel.mullion?._id || '',
            Length_of_Beam: selectedLengthOfBeam
        });
    };

    const handleUpdate = async (ReinforcementsteelId) => {
        const updatedReinforcementsteel = {
            ...editReinforcementsteel,
        };

        if (!isNaN(updatedReinforcementsteel.pricePermeter) && !isNaN(updatedReinforcementsteel.Length_of_Beam)) {
            updatedReinforcementsteel.price_beam = updatedReinforcementsteel.pricePermeter * updatedReinforcementsteel.Length_of_Beam;
        }

        try {
            await axios.put(`${apiUrl}/api/v1/Reinforcementsteel/${ReinforcementsteelId}`, updatedReinforcementsteel, {
                withCredentials: false,
            });
            setReinforcementsteels(Reinforcementsteels.map(m => m._id === ReinforcementsteelId ? updatedReinforcementsteel : m));
            setEditReinforcementsteel(null);
            toast.success("Reinforcementsteel updated successfully");
            fetchReinforcementsteels(currentPage);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating Reinforcementsteel");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setEditReinforcementsteel(prevEditSash => {
            const updatedReinforcementsteel = {
                ...prevEditSash,
                [name]: value
            };

            if (name === "frame") {
                const selectedFrame = FrameOptions.find(frame => frame._id === value);
                const selectedLengthOfBeam = selectedFrame?.Length_of_Beam || '';
                updatedReinforcementsteel.Length_of_Beam = selectedLengthOfBeam;
            }

            if (name === "pricePermeter" || name === "Length_of_Beam" || name === "frame") {
                const updatedPricePermeter = name === "pricePermeter" ? parseFloat(value) : parseFloat(updatedReinforcementsteel.pricePermeter);
                const selectedLengthOfBeam = name === "Length_of_Beam" || name === "frame" ? parseFloat(updatedReinforcementsteel.Length_of_Beam) : parseFloat(updatedReinforcementsteel.Length_of_Beam);

                if (!isNaN(updatedPricePermeter) && !isNaN(selectedLengthOfBeam)) {
                    updatedReinforcementsteel.price_beam = updatedPricePermeter * selectedLengthOfBeam;
                }
            }

            return updatedReinforcementsteel;
        });
    };

    if (!isAuthenticated) {
        return <Navigate to={"/loginAdmin"} />;
    }

    const indexOfLastMaterial = currentPage * itemsPerPage;
    const indexOfFirstMaterial = indexOfLastMaterial - itemsPerPage;
    const currentReinforcementsteels = Reinforcementsteels.slice(indexOfFirstMaterial, indexOfLastMaterial);
    const totalPages = Math.ceil(Reinforcementsteels.length / itemsPerPage);

    return (
        <section className="page Reinforcementsteels">
            <h1>Reinforcementsteels</h1>
            <div className="banner">
                {currentReinforcementsteels.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Code</th>
                                    <th>Length_of_Beam</th>
                                    <th>Thickness</th>
                                    <th>WeightPermeter</th>
                                    <th>PricePermeter</th>
                                    <th>Sash</th>
                                    <th>Frame</th>
                                    <th>FloatingMullion</th>
                                    <th>Mullion</th>
                                    <th>Price Beam</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentReinforcementsteels.map((Reinforcementsteel) => (
                                    <tr key={Reinforcementsteel._id}>
                                        <td>
                                            {editReinforcementsteel && editReinforcementsteel._id === Reinforcementsteel._id ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editReinforcementsteel.name}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Reinforcementsteel.name
                                            )}
                                        </td>
                                        <td>
                                            {editReinforcementsteel && editReinforcementsteel._id === Reinforcementsteel._id ? (
                                                <input
                                                    type="text"
                                                    name="code"
                                                    value={editReinforcementsteel.code}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Reinforcementsteel.code
                                            )}
                                        </td>

                                        <td>
                                            {editReinforcementsteel && editReinforcementsteel._id === Reinforcementsteel._id ? (
                                                <input
                                                    type="text"
                                                    disabled
                                                    name="Length_of_Beam"
                                                    value={editReinforcementsteel.Length_of_Beam}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Reinforcementsteel.frame?.Length_of_Beam
                                            )}
                                        </td>
                                        <td>
                                            {editReinforcementsteel && editReinforcementsteel._id === Reinforcementsteel._id ? (
                                                <input
                                                    type="number"
                                                    name="thickness"
                                                    value={editReinforcementsteel.thickness}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Reinforcementsteel.thickness
                                            )}
                                        </td>
                                        <td>
                                            {editReinforcementsteel && editReinforcementsteel._id === Reinforcementsteel._id ? (
                                                <input
                                                    type="number"
                                                    name="weightPermeter"
                                                    value={editReinforcementsteel.weightPermeter}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Reinforcementsteel.weightPermeter
                                            )}
                                        </td>
                                        <td>
                                            {editReinforcementsteel && editReinforcementsteel._id === Reinforcementsteel._id ? (
                                                <input
                                                    type="number"
                                                    name="pricePermeter"
                                                    value={editReinforcementsteel.pricePermeter}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Reinforcementsteel.pricePermeter
                                            )}
                                        </td>
                                        <td>
                                            {editReinforcementsteel && editReinforcementsteel._id === Reinforcementsteel._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="sash-select-label">Sash</InputLabel>
                                                    <Select
                                                        labelId="sash-select-label"
                                                        id="sash-select"
                                                        value={editReinforcementsteel.sash || ''}
                                                        onChange={(e) => handleInputChange({ target: { name: 'sash', value: e.target.value } })}
                                                        inputProps={{
                                                            name: 'sash',
                                                            id: 'sash-select',
                                                        }}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {SashOptions.map((sash) => (
                                                            <MenuItem key={sash._id} value={sash._id}>{sash.name}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                Reinforcementsteel.sash?.name || ''
                                            )}
                                        </td>
                                        <td>
                                            {editReinforcementsteel && editReinforcementsteel._id === Reinforcementsteel._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="frame-select-label">Frame</InputLabel>
                                                    <Select
                                                        labelId="frame-select-label"
                                                        id="frame-select"
                                                        value={editReinforcementsteel.frame || ''}
                                                        onChange={(e) => handleInputChange({ target: { name: 'frame', value: e.target.value } })}
                                                        inputProps={{
                                                            name: 'frame',
                                                            id: 'frame-select',
                                                        }}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {FrameOptions.map((frame) => (
                                                            <MenuItem key={frame._id} value={frame._id}>{frame.name}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                Reinforcementsteel.frame?.name || ''
                                            )}
                                        </td>
                                        <td>
                                            {editReinforcementsteel && editReinforcementsteel._id === Reinforcementsteel._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="floatingMullion-select-label">FloatingMullion</InputLabel>
                                                    <Select
                                                        labelId="floatingMullion-select-label"
                                                        id="floatingMullion-select"
                                                        value={editReinforcementsteel.floatingMullion || ''}
                                                        onChange={(e) => handleInputChange({ target: { name: 'floatingMullion', value: e.target.value } })}
                                                        inputProps={{
                                                            name: 'floatingMullion',
                                                            id: 'floatingMullion-select',
                                                        }}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {FloatingMullionOptions.map((floatingMullion) => (
                                                            <MenuItem key={floatingMullion._id} value={floatingMullion._id}>{floatingMullion.name}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                Reinforcementsteel.floatingMullion?.name || ''
                                            )}
                                        </td>
                                        <td>
                                            {editReinforcementsteel && editReinforcementsteel._id === Reinforcementsteel._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="mullion-select-label">Mullion</InputLabel>
                                                    <Select
                                                        labelId="m
                                                        ullion-select-label"
                                                        id="mullion-select"
                                                        value={editReinforcementsteel.mullion || ''}
                                                        onChange={(e) => handleInputChange({ target: { name: 'mullion', value: e.target.value } })}
                                                        inputProps={{
                                                            name: 'mullion',
                                                            id: 'mullion-select',
                                                        }}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {MullionOptions.map((mullion) => (
                                                            <MenuItem key={mullion._id} value={mullion._id}>{mullion.name}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                Reinforcementsteel.mullion?.name || ''
                                            )}
                                        </td>
                                        {/* <td>
                                            {editReinforcementsteel && editReinforcementsteel._id === Reinforcementsteel._id ? (
                                                <input
                                                    type="number"
                                                    name="price_beam"
                                                    disabled
                                                    value={editReinforcementsteel.price_beam}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                Reinforcementsteel.price_beam
                                            )}
                                        </td> */}
                                        <td>
                                            {editReinforcementsteel && editReinforcementsteel._id === Reinforcementsteel._id ? (
                                                <input
                                                    type="number"
                                                    name="price_beam"
                                                    disabled
                                                    value={editReinforcementsteel.price_beam || 0}
                                                />
                                            ) : (
                                                Reinforcementsteel.price_beam
                                            )}
                                        </td>

                                        <td className="table-actions">
                                            {editReinforcementsteel && editReinforcementsteel._id === Reinforcementsteel._id ? (
                                                <>
                                                    <button
                                                        className="save-button"
                                                        onClick={() => handleUpdate(Reinforcementsteel._id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="cancel-button"
                                                        onClick={() => setEditReinforcementsteel(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="edit-button"
                                                        onClick={() => handleEdit(Reinforcementsteel)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDelete(Reinforcementsteel._id)}
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
                    <h1>No Registered Reinforcementsteels Found!</h1>
                )}
            </div>
        </section>
    );
};

export default GetAllReinforcementSteel;
