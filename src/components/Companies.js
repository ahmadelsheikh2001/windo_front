/* eslint-disable no-undef */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "..";
import { Navigate } from "react-router-dom";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const Companies = () => {
  const [allCompanies, setAllCompanies] = useState([]);
  const [allMateriales, setallMateriales] = useState([]);
  const [editCompany, setEditCompany] = useState(null);
  const { isAuthenticated } = useContext(Context);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const apiUrl = process.env.REACT_APP_API_URL;


  const fetchCompanies = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/v1/Company`, {
        withCredentials: false,
      });
      if (data.results > 0) {
        setAllCompanies(data.data);
      } else {
        setAllCompanies([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching companies");
    }
  };

  useEffect(() => {
    fetchCompanies();
    axios.get(`${apiUrl}/api/v1/Material`)
      .then(response => setallMateriales(response.data.data))
      .catch(error => toast.error("Error fetching profiles: " + error.message));
  }, [currentPage]);

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

  const handleDelete = async (companyId) => {
    try {
      await axios.delete(`${apiUrl}/api/v1/Company/${companyId}`, {
        withCredentials: false,
      });
      toast.success("Company deleted successfully");
      fetchCompanies();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting company");
    }
  };

  const handleEdit = (company) => {
    setEditCompany({
      ...company,
      material: company.material._id 
    });
  };


  const handleUpdate = async (companyId) => {
    try {
      const formData = new FormData();
      formData.append("name", editCompany.name);
      formData.append("size", editCompany.size);
      formData.append("material", editCompany.material);

      if (editCompany.image && editCompany.image !== "") {
        formData.append("image", editCompany.image);
      }

      await axios.put(`${apiUrl}/api/v1/Company/${companyId}`, formData, {
        withCredentials: false,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Company updated successfully");
      fetchCompanies();
      setEditCompany(null); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating Company");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setEditCompany((prevCompany) => ({
        ...prevCompany,
        [name]: files[0],
        previewImage: URL.createObjectURL(files[0])
      }));
    } else {
      setEditCompany((prevCompany) => ({
        ...prevCompany,
        [name]: value,
        previewImage: name === "image" ? prevCompany.previewImage : null
      }));
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/loginAdmin"} />;
  }

  const indexOfLastCompany = currentPage * itemsPerPage;
  const indexOfFirstCompany = indexOfLastCompany - itemsPerPage;
  const currentCompanies = allCompanies.slice(indexOfFirstCompany, indexOfLastCompany);
  const totalPages = Math.ceil(allCompanies.length / itemsPerPage);

  return (
    <section className="page companies">
      <h1>Companies</h1>
      <div className="banner">
        {currentCompanies.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Size</th>
                  <th>Material</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCompanies.map((element) => (
                  <tr key={element._id}>
                    <td>
                      {editCompany && editCompany._id === element._id ? (
                        <input
                          type="text"
                          name="name"
                          value={editCompany.name}
                          onChange={handleInputChange}
                        />
                      ) : (
                        element.name
                      )}
                    </td>
                    <td>
                      {editCompany && editCompany._id === element._id ? (
                        <>
                          <input
                            type="file"
                            name="image"
                            onChange={handleInputChange}
                          />
                          {editCompany.previewImage ? (
                            <img src={editCompany.previewImage} alt={element.name} width="50" height="50" />
                          ) : (
                            <img src={element.image} alt={element.name} width="50" height="50" />
                          )}
                        </>
                      ) : (
                        <img src={element.image} alt={element.name} width="50" height="50" />
                      )}
                    </td>
                    <td>
                      {editCompany && editCompany._id === element._id ? (
                        <input
                          type="text"
                          name="size"
                          value={editCompany.size}
                          onChange={handleInputChange}
                        />
                      ) : (
                        element.size
                      )}
                    </td>
                    <td>
                      {editCompany && editCompany._id === element._id ? (
                        <FormControl sx={{ m: 1, width: 300 }}>
                          <InputLabel id="material-select-label">material</InputLabel>
                          <Select
                            labelId="material-select-label"
                            id="material-select"
                            value={editCompany.material || ''}
                            onChange={(e) => handleInputChange({ target: { name: 'material', value: e.target.value } })}
                            inputProps={{
                              name: 'material',
                              id: 'material-select',
                            }}
                            MenuProps={MenuProps}
                          >
                            {allMateriales.map((frame) => (
                              <MenuItem key={frame._id} value={frame._id}>{frame.type}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        element.material?.type || ''
                      )}
                    </td>
                    <td className="table-actions">
                      {editCompany && editCompany._id === element._id ? (
                        <>
                          <button
                            className="save-button"
                            onClick={() => handleUpdate(element._id)}
                          >
                            Save
                          </button>
                          <button
                            className="cancel-button"
                            onClick={() => setEditCompany(null)}
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
          <h1>No Registered Companies Found!</h1>
        )}
      </div>
    </section>
  );
};

export default Companies;
