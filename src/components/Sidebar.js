/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { useContext, useState } from "react";
import { TiHome } from "react-icons/ti";
import { AiOutlineProfile, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { RxFrame } from "react-icons/rx";
import { MdAddModerator, MdColorLens, MdSystemUpdateAlt } from "react-icons/md";
import { FiLayout } from "react-icons/fi";
import { BsBuildingAdd } from "react-icons/bs";
import { GiMaterialsScience, GiCrackedGlass, GiHamburgerMenu, GiDrill, GiFloatingCrystal, GiPrayerBeads, GiRosaShield, GiTireIronCross } from "react-icons/gi";
import { CiLogout } from "react-icons/ci";
import { TbBrandWindows } from "react-icons/tb";
import { PiFanLight, PiUniteSquareLight } from "react-icons/pi";
import { IoCutOutline } from "react-icons/io5";
import { IoMdColorFill } from "react-icons/io";
import { VscLayoutSidebarRight } from "react-icons/vsc";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "..";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
  const toggleSubMenu = (index) => {
    setOpenSubMenuIndex(openSubMenuIndex === index ? null : index);
  };

  const { isAuthenticated, setIsAuthenticated, admin } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("No token found");
    }

    try {
      localStorage.removeItem("authToken");
      const res = await axios.get(`${apiUrl}/api/v1/Auth/logout`);
      toast.success(res.data.message);
      setIsAuthenticated(false);
      navigateTo("/loginAdmin");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };


  const menuItems = [
    { name: 'Home', icon: <TiHome />, path: "/" },
    admin.role === 'SuperAdmin' && {
      name: 'Admin', icon: <MdAddModerator />, subItems: [
        { name: 'Add Admin', path: "/addNewAdmin" },
        { name: 'get All Admins', path: "/getAllAdmins" }
      ]
    },
    {
      name: 'Material', icon: <GiMaterialsScience />, subItems: [
        { name: 'Add Material', path: "/AddMaterial" },
        { name: 'get All Materiales', path: "/getAllMateriales" }
      ]
    },
    {
      name: 'Company', icon: <BsBuildingAdd />, subItems: [
        { name: 'Add Company', path: "/AddCompany" },
        { name: 'get All Companies', path: "/getAllCompanies" }
      ]
    },
    {
      name: 'Opening System', icon: <MdSystemUpdateAlt />, subItems: [
        { name: 'Add Opening System', path: "/AddOpeningSystem" },
        { name: 'get All Opening Systems', path: "/GetAllOpeningSystem" }
      ]
    },
    {
      name: 'Type Of Unit', icon: <PiUniteSquareLight />, subItems: [
        { name: 'Add Type Of Unit', path: "/AddTypeOfUnit" },
        { name: 'get All TypeOfUnits', path: "/getTypeOfunites" }
      ]
    },
    {
      name: 'Profile Color', icon: <IoMdColorFill />, subItems: [
        { name: 'Add Profile Color', path: "/AddProfileColor" },
        { name: 'get All Profile Color', path: "/getAllProfileColor" }
      ]
    },
    {
      name: 'Profile', icon: <AiOutlineProfile />, subItems: [
        { name: 'Add Profile', path: "/AddProfile" },
        { name: 'get All Profiles', path: "/getAllProfiles" }
      ]
    },
    {
      name: 'Frame', icon: <RxFrame />, subItems: [
        { name: 'Add Frame', path: "/AddFrame" },
        { name: 'get All Frame', path: "/getAllFrames" }
      ]
    },
    {
      name: 'Sash', icon: <GiRosaShield />, subItems: [
        { name: 'Add Sash', path: "/AddSash" },
        { name: 'get All Sash', path: "/getAllSash" }
      ]
    },
    {
      name: 'Layout', icon: <FiLayout />, subItems: [
        { name: 'Add Layout', path: "/AddLayout" },
        { name: 'get All Layoutes', path: "/getAllLayotes" }
      ]
    },
    {
      name: 'Fanlight', icon: <PiFanLight />, subItems: [
        { name: 'Add Fanlight', path: "/AddFanlight" },
        { name: 'get All Fanligthes', path: "/getAllFanligthes" }
      ]
    },
    {
      name: 'Opening Layout', icon: <VscLayoutSidebarRight />, subItems: [
        { name: 'Add Opening Layout', path: "/AddOpeningLayout" },
        { name: 'get All OpeningLayoutes', path: "/getAllOpeningLayoutes" }
      ]
    },
    {
      name: 'Glass Color', icon: <MdColorLens />, subItems: [
        { name: 'Add Glass Color', path: "/AddGlassColor" },
        { name: 'Get All Glass Color', path: "/getAllGlassColor" },
      ]
    },
    {
      name: 'Glass', icon: <GiCrackedGlass />, subItems: [
        { name: 'Add Glass', path: "/AddGlass" },
        { name: 'Get All Glass', path: "/getAllGlass" }
      ]
    },
    {
      name: 'Mullion', icon: <TbBrandWindows />, subItems: [
        { name: 'Add New Mullion', path: "/AddNewMullion" },
        { name: 'Get All Mullion', path: "/getAllMullions" },
      ]
    },
    {
      name: 'Floating Mullion', icon: <GiFloatingCrystal />, subItems: [
        { name: 'Add Floating Mullion', path: "/AddFloatingMullion" },
        { name: 'Get All Floating Mullion', path: "/getAllFloatingMullion" }
      ]
    },
    {
      name: 'Cutting Process', icon: <IoCutOutline />, subItems: [
        { name: 'Add Cutting Process', path: "/AddCuttingProcess" },
        { name: 'Get All Cutting Process', path: "/getAllCuttingProcess" },
      ]
    },
    {
      name: 'Glazing Bead', icon: <GiPrayerBeads />, subItems: [
        { name: 'Add Glazing Bead', path: "/AddGlazingBead" },
        { name: 'Get All GlazingBead', path: "/getAllGlazingBead" },
      ]
    },
    {
      name: 'Reinforcement Steel', icon: <GiTireIronCross />, subItems: [
        { name: 'Add Reinforcement Steel', path: "/AddReinforcementsteel" },
        { name: 'Get All Reinforcement Steel', path: "/getAllReinforcementSteel" },
      ]
    },
    {
      name: 'Welding Process', icon: <GiDrill />, subItems: [
        { name: 'Add Welding Process', path: "/AddWeldingProcess" },
        { name: 'Get All Welding Process', path: "/getAllWeldingProcess" },
      ]
    },
    { name: 'Logout', icon: <CiLogout />, action: handleLogout },
  ];
  const navigate = (path) => {
    navigateTo(path);
    setShow(false);
  };

  // Hide sidebar if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <nav className={`sidebar ${show ? 'show' : ''}`}>
        <div className="links">
          {menuItems.map((item, index) => (
            <div key={index} className={`menu-item ${item.subItems ? 'menu-item-with-submenu' : ''}`}>
              <div onClick={() => item.path ? navigate(item.path) : item.action ? item.action() : toggleSubMenu(index)} title={item.name}>
                {item.icon}
                <span>{item.name}</span>
                {item.subItems && (
                  <button className="button" onClick={() => toggleSubMenu(index)}>
                    {openSubMenuIndex === index ? <AiOutlineUp className="arrow-icon" /> : <AiOutlineDown className="arrow-icon" />}
                  </button>
                )}
              </div>
              {item.subItems && openSubMenuIndex === index && (
                <ul className="submenu">
                  {item.subItems.map((subItem, subIndex) => (
                    <li key={subIndex} onClick={() => navigate(subItem.path)} title={subItem.name}>
                      <span>{subItem.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </nav>
      <div className="wrapper" style={!isAuthenticated ? { display: "none" } : { display: "flex" }}>
        <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
      </div>
    </>
  );
};

export default Sidebar;
