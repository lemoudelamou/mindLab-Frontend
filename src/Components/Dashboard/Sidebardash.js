import React, { useState } from "react";
import {
    Sidebar,
    Menu,
    MenuItem,
} from "react-pro-sidebar";
import { FaList, FaChartPie, FaCalendar, FaPersonBooth } from "react-icons/fa";
import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import "../../style/Sidebardash.css"
import {useAuth} from "../../utils/AuthContext";

const Sidebardash = ({onMenuItemClick, onToggleMenu} ) => {
    const [menuCollapse, setMenuCollapse] = useState(false);
    const {logOut} = useAuth();


    const menuIconClick = () => {
        setMenuCollapse(!menuCollapse);
        onToggleMenu(!menuCollapse);

    };


    const handleLogout = () => {

        logOut();
    }

    const handleItemClick = (page) => {

            onMenuItemClick(page);

    };
    return (
        <>
            <div id="header">
                <Sidebar collapsed={menuCollapse}>
                    <div className="logotext"></div>
                    <div className="closemenu" onClick={menuIconClick} style={{ marginRight: '10px' }}>
                        {menuCollapse ? <FiArrowRightCircle /> : <FiArrowLeftCircle />}
                    </div>
                    <div style={{ height: '100vh', marginTop: '100px' }}>
                        <Menu  iconShape="square">
                            <MenuItem onClick={() => handleItemClick("Profile")}  icon={<FaPersonBooth />}>
                                Profile
                            </MenuItem>

                            <MenuItem onClick={() => handleItemClick("List")} icon={<FaList />}>
                                List
                            </MenuItem>
                            <MenuItem onClick={() => handleItemClick("Calender")}  icon={<FaCalendar />}>Calender</MenuItem>
                            <MenuItem icon={<FaChartPie />}>Graphs</MenuItem>
                        </Menu>
                        {/* Placing the Logout menu at the end */}
                        <Menu iconShape="square" className="logout-menu">
                            <MenuItem onClick={handleLogout} icon={<FiLogOut />}>Logout</MenuItem>
                        </Menu>
                    </div>
                </Sidebar>
            </div>
        </>
    );
};

export default Sidebardash;
