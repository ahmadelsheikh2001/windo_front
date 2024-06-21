/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import AddCompany from "./components/AddCompany";
import Admins from "./components/Admin";
import { Context } from ".";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/Sidebar";
import AddNewAdmin from "./components/AddNewAdmin";
import "./index.css";
import AddMaterial from "./components/AddMaterial";
import AddGlass from "./components/AddGlass";
import AddFrame from "./components/AddFrame";
import AddLayout from "./components/AddLayout";
import AddNewMullion from "./components/AddMulllion";
import AddProfile from "./components/AddProfile";
import AddFanlight from "./components/AddFanlight";
import AddFloatingMullion from "./components/AddFloatingMullion";
import AddGlassColor from "./components/AddGlassColor";
import AddGlazingBead from "./components/AddGlazingBead";
import AddOpeningLayout from "./components/AddOpeningLayout";
import AddOpeningSystem from "./components/AddOpeningSystem";
import AddProfileColor from "./components/AddProfileColor";
import AddReinforcementsteel from "./components/AddReinforcementsteel";
import AddSash from "./components/AddSash";
import AddWeldingProcess from "./components/AddWeldingProcess";
import AddTypeOfUnit from "./components/AddTypeOfUnit";
import Companies from "./components/Companies";
import GetAllGlass from "./components/getAllGlasses";
import GetAllMateriales from "./components/getAllMaterial";
import AddCuttingProcess from "./components/AddCuttingProcess";
import GetAllOpeningSystem from "./components/getAllopeningSystem";
import GetTypeOfunites from "./components/getAllTypeofunit";
import GetAllProfiles from "./components/getAllProfiles";
import GetAllFrames from "./components/getAllFrame";
import GetAllSash from "./components/getAllSashes";
import GetAllProfileColor from "./components/getAllProfileColor";
import GetAllLayotes from "./components/getAllLayoutes";
import GetAllFanligthes from "./components/getAllFanlight";
import GetAllOpeningLayoutes from "./components/getAllOpeningLayout";
import GetAllMullions from "./components/getAllMullions";
import GetFloatingMullion from "./components/getAllFloatingMullion";
import GetAllGlazingBead from "./components/getAllGlazingBead";
import GetAllCuttingProcess from "./components/getAllCuttingProcess";
import GetAllGlassColor from "./components/getAllGlassColor";
import GetAllReinforcementSteel from "./components/getAllReinforcementSteel";
import GetWeldingProcess from "./components/getAllWeldingProcess";

const App = () => {
  // eslint-disable-next-line no-unused-vars
  const { isAuthenticated, setIsAuthenticated, admin, setAdmin } = useContext(Context);
  const token = localStorage.getItem("authToken");
  const apiUrl = process.env.REACT_APP_API_URL;
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
      setAdmin({});
      setRedirect(true);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/User/getAdminDetails`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: false,
          }
        );
        setIsAuthenticated(true);
        setAdmin(response.data.user);
        setRedirect(false);

      } catch (error) {
        setIsAuthenticated(false);
        setAdmin({});
        setRedirect(true);
      }
    };
    fetchUser();
  }, [setAdmin, setIsAuthenticated, token]);


  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={isAuthenticated ? <Dashboard /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/loginAdmin" element={<Login />} />
        <Route path="/AddCompany" element={isAuthenticated ? <AddCompany /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/AddMaterial" element={isAuthenticated ? <AddMaterial /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/addNewAdmin" element={isAuthenticated && admin?.role === 'SuperAdmin' ? <AddNewAdmin /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/admins" element={isAuthenticated && admin?.role === 'SuperAdmin' ? <Admins /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/AddGlass" element={isAuthenticated ? <AddGlass /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/getAllCompanies" element={isAuthenticated ? <Companies /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/AddFrame" element={isAuthenticated ? <AddFrame /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/AddLayout" element={isAuthenticated ? <AddLayout /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/AddNewMullion" element={isAuthenticated ? <AddNewMullion /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/AddProfile" element={isAuthenticated ? <AddProfile /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/AddFanlight" element={isAuthenticated ? <AddFanlight /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/AddFloatingMullion" element={isAuthenticated ? <AddFloatingMullion /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/AddGlassColor" element={isAuthenticated ? <AddGlassColor /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/AddGlazingBead" element={isAuthenticated ? <AddGlazingBead /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/AddOpeningLayout" element={isAuthenticated ? <AddOpeningLayout /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/AddOpeningSystem" element={isAuthenticated ? <AddOpeningSystem /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/AddProfileColor" element={isAuthenticated ? <AddProfileColor /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/AddReinforcementsteel" element={isAuthenticated ? <AddReinforcementsteel /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/AddSash" element={isAuthenticated ? <AddSash /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/AddWeldingProcess" element={isAuthenticated ? <AddWeldingProcess /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/AddTypeOfUnit" element={isAuthenticated ? <AddTypeOfUnit /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/getAllGlass" element={isAuthenticated ? <GetAllGlass /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/getAllAdmins" element={isAuthenticated ? <Admins /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/getAllMateriales" element={isAuthenticated ? <GetAllMateriales /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/AddCuttingProcess" element={isAuthenticated ? <AddCuttingProcess /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/getAllOpeningSystem" element={isAuthenticated ? <GetAllOpeningSystem /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/getTypeOfunites" element={isAuthenticated ? <GetTypeOfunites /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/getAllProfiles" element={isAuthenticated ? <GetAllProfiles /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/getAllFrames" element={isAuthenticated ? <GetAllFrames /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/getAllSash" element={isAuthenticated ? <GetAllSash /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/getAllProfileColor" element={isAuthenticated ? <GetAllProfileColor /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/getAllLayotes" element={isAuthenticated ? <GetAllLayotes /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/getAllFanligthes" element={isAuthenticated ? <GetAllFanligthes /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/getAllOpeningLayoutes" element={isAuthenticated ? <GetAllOpeningLayoutes /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/getAllMullions" element={isAuthenticated ? <GetAllMullions /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/getAllFloatingMullion" element={isAuthenticated ? <GetFloatingMullion /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/getAllGlazingBead" element={isAuthenticated ? <GetAllGlazingBead /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/getAllCuttingProcess" element={isAuthenticated ? <GetAllCuttingProcess /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/getAllGlassColor" element={isAuthenticated ? <GetAllGlassColor /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/getAllReinforcementSteel" element={isAuthenticated ? <GetAllReinforcementSteel /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
        <Route path="/getAllWeldingProcess" element={isAuthenticated ? <GetWeldingProcess /> : redirect ? <Navigate to="/loginAdmin" /> : null} />
      </Routes>
      <ToastContainer position="top-center" />
    </Router>
  );
};

export default App;
