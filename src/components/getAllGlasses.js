/* eslint-disable no-undef */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "..";
import { Navigate } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const GetAllGlass = () => {
    const [glasses, setGlasses] = useState([]);
    const [editGlass, setEditGlass] = useState(null);
    const { isAuthenticated } = useContext(Context);
    const [currentPage, setCurrentPage] = useState(1);
    const [ProfileOptions, setProfileOptions] = useState([]);
    const itemsPerPage = 5; // عدد العناصر لكل صفحة
    const apiUrl = process.env.REACT_APP_API_URL;

    const fetchGlasses = async (page) => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/v1/Glass`, {
                params: {
                    page,
                },
                withCredentials: false,
            });
            setGlasses(data.results > 0 ? data.data : []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching Glasses");
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
        fetchGlasses(currentPage);
        axios.get(`${apiUrl}/api/v1/GlassColor`)
            .then(response => setProfileOptions(response.data.data))
            .catch(error => toast.error("Error fetching profiles: " + error.message));
    }, [currentPage]);

    const handleDelete = async (glassId) => {
        try {
            await axios.delete(`${apiUrl}/api/v1/Glass/${glassId}`, {
                withCredentials: false,
            });
            toast.success("Glass deleted successfully");
            fetchGlasses(currentPage);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting Glass");
        }
    };

    const handleEdit = (glass) => {
        setEditGlass({
            ...glass,
            glassColorIds: glass.glassColorIds.map(color => color._id)
        });
    };

    const handleUpdate = async (glassId) => {
        try {
            await axios.put(`${apiUrl}/api/v1/Glass/${glassId}`, editGlass, {
                withCredentials: false,
            });
            setGlasses(glasses.map(glass => glass._id === glassId ? editGlass : glass));
            setEditGlass(null);
            toast.success("Glass updated successfully");
            fetchGlasses(currentPage);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating Glass");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditGlass({ ...editGlass, [name]: value });
    };

    if (!isAuthenticated) {
        return <Navigate to={"/loginAdmin"} />;
    }

    const indexOfLastMaterial = currentPage * itemsPerPage;
    const indexOfFirstMaterial = indexOfLastMaterial - itemsPerPage;
    const currentGlasses = glasses.slice(indexOfFirstMaterial, indexOfLastMaterial);
    const totalPages = Math.ceil(glasses.length / itemsPerPage);

    return (
        <section className="page Glasses">
            <h1>Glasses</h1>
            <div className="banner">
                {currentGlasses.length > 0 ? (
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Code</th>
                                    <th>Glass Density</th>
                                    <th>Thickness</th>
                                    <th>Specification</th>
                                    <th>Price per Meter Square</th>
                                    <th>Weight per Meter Square</th>
                                    <th>Color</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentGlasses.map((element) => (
                                    <tr key={element._id}>
                                        <td>
                                            {editGlass && editGlass._id === element._id ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editGlass.name}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                element.name
                                            )}
                                        </td>
                                        <td>
                                            {editGlass && editGlass._id === element._id ? (
                                                <input
                                                    type="text"
                                                    name="code"
                                                    value={editGlass.code}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                element.code
                                            )}
                                        </td>
                                        <td>
                                            {editGlass && editGlass._id === element._id ? (
                                                <input
                                                    type="number"
                                                    name="glass_density"
                                                    value={editGlass.glass_density}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                element.glass_density
                                            )}
                                        </td>
                                        <td>
                                            {editGlass && editGlass._id === element._id ? (
                                                <input
                                                    type="number"
                                                    name="thickness"
                                                    value={editGlass.thickness}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                element.thickness
                                            )}
                                        </td>
                                        <td>
                                            {editGlass && editGlass._id === element._id ? (
                                                <input
                                                    type="text"
                                                    name="specification"
                                                    value={editGlass.specification}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                element.specification
                                            )}
                                        </td>
                                        <td>
                                            {editGlass && editGlass._id === element._id ? (
                                                <input
                                                    type="number"
                                                    name="pricePermeterSqure"
                                                    value={editGlass.pricePermeterSqure}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                element.pricePermeterSqure
                                            )}
                                        </td>
                                        <td>
                                            {editGlass && editGlass._id === element._id ? (
                                                <input
                                                    type="text"
                                                    name="weightPermeterSqure"
                                                    value={editGlass.weightPermeterSqure}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                element.weightPermeterSqure
                                            )}
                                        </td>

                                        <td>
                                            {editGlass && editGlass._id === element._id ? (
                                                <FormControl sx={{ m: 1, width: 300 }}>
                                                    <InputLabel id="glassColorIds-select-label">Colors</InputLabel>
                                                    <Select
                                                        labelId="glassColorIds-select-label"
                                                        id="glassColorIds-select"
                                                        multiple
                                                        value={editGlass.glassColorIds || []}
                                                        onChange={(e) => handleInputChange({ target: { name: 'glassColorIds', value: e.target.value } })}
                                                        inputProps={{
                                                            name: 'glassColorIds',
                                                            id: 'glassColorIds-select',
                                                        }}
                                                        MenuProps={MenuProps}
                                                    >
                                                        {ProfileOptions.map((glassColor) => (
                                                            <MenuItem key={glassColor._id} value={glassColor._id}>{glassColor.title}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            ) : (
                                                element.glassColorIds && element.glassColorIds.length > 0 ? (
                                                    element.glassColorIds.map(color => color.title).join(', ')
                                                ) : ''
                                            )}
                                        </td>

                                        <td className="table-actions">
                                            {editGlass && editGlass._id === element._id ? (
                                                <>
                                                    <button
                                                        className="save-button"
                                                        onClick={() => handleUpdate(element._id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="cancel-button"
                                                        onClick={() => setEditGlass(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="edit-button"
                                                        onClick={() => handleEdit(element)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="delete-button"
                                                        onClick={() => handleDelete(element._id)}
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
                    <h1>No Registered Glasses Found!</h1>
                )}
            </div>
        </section>
    );
};

export default GetAllGlass;
