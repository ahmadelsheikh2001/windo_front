/* eslint-disable no-undef */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Context } from "../index";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [adminDetails, setAdminDetails] = useState(null);
  const [companies, setCompanies] = useState(0);
  const [Material, setMaterial] = useState(0);
  const [Glass, setGlass] = useState(0);
  const [Frame, setFrame] = useState(0);
  const [Sash, setSash] = useState(0);
  const [OpeningSystem, setOpeningSystem] = useState(0);
  const [OpeningLayout, setOpeningLayout] = useState(0);
  const [Mullion, setMullion] = useState(0);
  const { isAuthenticated } = useContext(Context);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("No token found");
          console.error("No token found");
          return;
        }

        const res = await axios.get(`${apiUrl}/api/v1/User/getAdminDetails`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        setAdminDetails(res.data.user);
      } catch (error) {
        console.error("Error fetching admin details:", error.response ? error.response.data : error.message);
        toast.error(error.response?.data?.message || error.message);
      }
    };

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("No token found");
          console.error("No token found");
          return;
        }

        const [
          companiesRes,
          materialRes,
          glassRes,
          frameRes,
          MullionRes,
          OpeningSystemRes,
          sashRes,
          OpeningLayoutRes,
        ] = await Promise.all([
          axios.get(`${apiUrl}/api/v1/Company`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          axios.get(`${apiUrl}/api/v1/Material`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          axios.get(`${apiUrl}/api/v1/Glass`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          axios.get(`${apiUrl}/api/v1/Frame`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          axios.get(`${apiUrl}/api/v1/Mullion`, {
            headers: {
              'Authorization': ` Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          axios.get(`${apiUrl}/api/v1/OpeningSystem`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          axios.get(`${apiUrl}/api/v1/Sash`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          axios.get(`${apiUrl}/api/v1/OpeningLayout`, {
            headers: {
              'Authorization': ` Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
        ]);

        countUp(
          companiesRes.data.results,
          materialRes.data.results,
          glassRes.data.results,
          frameRes.data.results,
          MullionRes.data.results,
          OpeningSystemRes.data.results,
          sashRes.data.results,
          OpeningLayoutRes.data.results
        );
      } catch (error) {
        console.error("Error fetching data:", error.response ? error.response.data : error.message);
        toast.error(error.response?.data?.message || error.message);
      }
    };

    fetchAdminDetails();
    fetchData();
  }, []); // add dependencies if needed


  const countUp = (companiesValue, materialValue, glassValue, frameValue, MullionValue, OpeningSystemValue, sashValue, OpeningLayoutValue) => {
    let start = 0;
    const end = Math.max(companiesValue, materialValue, glassValue, frameValue, MullionValue, OpeningSystemValue, sashValue, OpeningLayoutValue);
    const duration = 2000;
    const stepTime = Math.abs(Math.floor(duration / end));
    const timer = setInterval(() => {
      start += 1;
      if (start <= companiesValue) setCompanies(start);
      if (start <= materialValue) setMaterial(start);
      if (start <= glassValue) setGlass(start);
      if (start <= frameValue) setFrame(start);
      if (start <= MullionValue) setMullion(start);
      if (start <= OpeningSystemValue) setOpeningSystem(start);
      if (start <= sashValue) setSash(start);
      if (start <= OpeningLayoutValue) setOpeningLayout(start);
      if (start === end) clearInterval(timer);
    }, stepTime);
  };

  if (!isAuthenticated) {
    return <Navigate to={"/loginAdmin"} />;
  }

  return (
    <section className="dashboard page">
      <div className="banner banner4">
        <div className="firstBox">
          <img src="/user3.png" alt="docImg" />
          <div className="content">
            <div>
              {adminDetails && <p>Hello {adminDetails.first_name}</p>}
            </div>
          </div>
        </div>
        <div className="secondBox">
          <p>Total Companies</p>
          <h3>{companies}</h3>
        </div>
        <div className="thirdBox">
          <p>Total Materials</p>
          <h3>{Material}</h3>
        </div>
      </div>

      <div className="b2">
        <div className="secondBox b2">
          <p>Total Glasses</p>
          <h3>{Glass}</h3>
        </div>
        <div className="secondBox">
          <p>Total Frames</p>
          <h3>{Frame}</h3>
        </div>
        <div className="thirdBox">
          <p>Total Mullions</p>
          <h3>{Mullion}</h3>

        </div>
      </div>
      <div className="b2">

        <div className=" secondBox b2">
          <p>Total OpeningSystem</p>
          <h3>{OpeningSystem}</h3>
        </div>
        <div className="secondBox ">
          <p>Total Sashes</p>
          <h3>{Sash}</h3>
        </div>
        <div className="thirdBox">
          <p>Total OpeningLayout</p>
          <h3>{OpeningLayout}</h3>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
