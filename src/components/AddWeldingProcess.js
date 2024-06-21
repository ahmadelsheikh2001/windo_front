/* eslint-disable no-undef */
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "..";
import axios from "axios";
import logo from '../images/file.png';
import "react-toastify/dist/ReactToastify.css";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

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

const AddWeldingProcess = () => {
    const { isAuthenticated, setIsAuthenticated } = useContext(Context);
    const [Welding_Allowance, setWelding_Allowance] = useState("");
    const [Welding_time, setWelding_time] = useState("");
    const [profileOptions, setProfileOptions] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        axios.get(`${apiUrl}/api/v1/Profile`)
            .then(response => {
                setProfileOptions(response.data.data);
            })
            .catch(error => {
                console.error("Error fetching profiles:", error);
            });
    }, []);

    const handleProfileChange = (e) => {
        setProfiles(e.target.value);
    };

    const handleAddSize = async (e) => {
        e.preventDefault();

        try {
            if (!Welding_Allowance || !Welding_time || profiles.length === 0) {
                toast.error("Please fill in all fields");
                return;
            }

            const profileIds = profiles.map(profileName => {
                const profile = profileOptions.find(option => option.brandname === profileName);
                return profile ? profile._id : null;
            }).filter(id => id !== null);

            const res = await axios.post(
                `${apiUrl}/api/v1/WeldingProcess`,
                { Welding_Allowance, Welding_time, profiles: profileIds },
                {
                    withCredentials: false,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success(res.data.message);
            setIsAuthenticated(true);
            setWelding_Allowance("");
            setWelding_time("");
            setProfiles([]);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    if (!isAuthenticated) {
        return <Navigate to={"/loginAdmin"} />;
    }

    return (
        <section className="page page2 page4">
            <section className="container form-component add-material-form">
                <img src={logo} alt="logo" className="logo" />
                <h1 className="form-title">Add Welding Process</h1>
                <form onSubmit={handleAddSize}>
                    <div>
                        <input
                            type="number"
                            placeholder="Welding Allowance"
                            value={Welding_Allowance}
                            onChange={(e) => setWelding_Allowance(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="number"
                            placeholder="Welding Time"
                            value={Welding_time}
                            onChange={(e) => setWelding_time(e.target.value)}
                        />
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="profile-select-label">Profiles</InputLabel>
                            <Select
                                labelId="profile-select-label"
                                id="profile-select"
                                multiple
                                value={profiles}
                                onChange={handleProfileChange}
                                renderValue={(selected) => selected.join(', ')}
                                inputProps={{
                                    name: 'profiles',
                                    id: 'profiles-checkbox',
                                }}
                                MenuProps={MenuProps}
                            >
                                {profileOptions.map((profile) => (
                                    <MenuItem key={profile._id} value={profile.brandname}>
                                        <Checkbox checked={profiles.indexOf(profile.brandname) > -1} />
                                        <ListItemText primary={profile.brandname} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div style={{ justifyContent: "center", alignItems: "center" }}>
                        <button type="submit">ADD</button>
                    </div>
                </form>
            </section>
        </section>
    );
};

export default AddWeldingProcess;
