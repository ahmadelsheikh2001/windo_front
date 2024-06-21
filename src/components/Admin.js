/* eslint-disable no-undef */

import { useContext, useEffect, useState } from "react";
import { Context } from "../index";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [editAdmins, setEditAdmins] = useState({});
  const { isAuthenticated } = useContext(Context);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;
  const apiUrl = process.env.REACT_APP_API_URL;


  const fetchAdmins = async (page) => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/v1/User/getAllAdmins`, {
        params: {
          page,
          limit: itemsPerPage,
        },
        withCredentials: false,
      });
      setAdmins(data.admins);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchAdmins(currentPage);
  }, [currentPage]);

  const handleDelete = async (adminId) => {
    try {
      await axios.delete(`${apiUrl}/api/v1/User/${adminId}`, {
        withCredentials: false,
      });
      toast.success("Admin deleted successfully");
      fetchAdmins(currentPage);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleEdit = (adminId) => {
    const adminToEdit = admins.find((admin) => admin._id === adminId);
    setEditAdmins(prevState => ({
      ...prevState,
      [adminId]: {
        ...adminToEdit,
        editing: true
      }
    }));
  };

  const handleUpdate = async (adminId) => {
    try {
      const updatedAdmin = editAdmins[adminId];
      await axios.put(`${apiUrl}/api/v1/User/${adminId}`, updatedAdmin, {
        withCredentials: false,
      });
      setAdmins(admins.map(admin => admin._id === adminId ? updatedAdmin : admin));
      setEditAdmins(prevState => ({
        ...prevState,
        [adminId]: {
          ...prevState[adminId],
          editing: false
        }
      }));
      toast.success("Admin updated successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleInputChange = (e, adminId) => {
    const { name, value } = e.target;
    setEditAdmins(prevState => ({
      ...prevState,
      [adminId]: {
        ...prevState[adminId],
        [name]: value
      }
    }));
  };

  if (!isAuthenticated) {
    return <Navigate to={"/loginAdmin"} />;
  }

  return (
    <section className="page request">
      <h1>All Admins</h1>
      <div className="banner">
        {admins && admins.length > 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Country</th>
                  <th>State</th>
                  <th>City</th>
                  <th>Area</th>
                  <th>Street</th>
                  <th>Role</th>
                  <th>Password</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((element) => (
                  <tr key={element._id}>
                    <td>
                      {editAdmins[element._id] && editAdmins[element._id].editing ? (
                        <input
                          type="text"
                          name="first_name"
                          value={editAdmins[element._id].first_name || ''}
                          onChange={(e) => handleInputChange(e, element._id)}
                        />
                      ) : (
                        element.first_name
                      )}
                    </td>
                    <td>
                      {editAdmins[element._id] && editAdmins[element._id].editing ? (
                        <input
                          type="text"
                          name="last_name"
                          value={editAdmins[element._id].last_name || ''}
                          onChange={(e) => handleInputChange(e, element._id)}
                        />
                      ) : (
                        element.last_name
                      )}
                    </td>
                    <td>{element.email}</td>
                    <td>
                      {editAdmins[element._id] && editAdmins[element._id].editing ? (
                        <input
                          type="text"
                          name="telephone"
                          value={editAdmins[element._id].telephone || ''}
                          onChange={(e) => handleInputChange(e, element._id)}
                        />
                      ) : (
                        element.telephone
                      )}
                    </td>
                    <td>{element.country}</td>
                    <td>{element.state}</td>
                    <td>{element.city}</td>
                    <td>{element.area}</td>
                    <td>{element.street}</td>
                    <td>
                      {editAdmins[element._id] && editAdmins[element._id].editing ? (
                        <select className="responsive-select"
                          name="role"
                          value={editAdmins[element._id].role || ''}
                          onChange={(e) => handleInputChange(e, element._id)}
                        >
                          <option value="Admin">Admin</option>
                          <option value="SuperAdmin">SuperAdmin</option>
                        </select>
                      ) : (
                        element.role
                      )}
                    </td>
                    <td>
                      {editAdmins[element._id] && editAdmins[element._id].editing ? (
                        <input
                          name="password"
                          value={editAdmins[element._id].password || ''}
                          onChange={(e) => handleInputChange(e, element._id)}
                        />
                      ) : (
                        element.password
                      )}
                    </td>
                    <td className="table-actions">
                      {editAdmins[element._id] && editAdmins[element._id].editing ? (
                        <>
                          <button
                            className="save-button"
                            onClick={() => handleUpdate(element._id)}
                          >
                            Save
                          </button>
                          <button
                            className="cancel-button"
                            onClick={() => setEditAdmins(prevState => ({
                              ...prevState,
                              [element._id]: {
                                ...prevState[element._id],
                                editing: false
                              }
                            }))}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="edit-button"
                            onClick={() => handleEdit(element._id)}
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
          <h1>No Registered Admins Found!</h1>
        )}
      </div>
    </section>
  );
};

export default Admins;
