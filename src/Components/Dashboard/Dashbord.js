import React, { useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../style/Login.css';
import Sidebardash from "./Sidebardash";
import Calender from "./Calender";
import Profile from "./Profile";
import List from  "./List"
import Navbar from "../Navbar/Navbar";

// ... (other imports and code)

const Dashboard = () => {
    const [selectedPage, setSelectedPage] = useState("Profile");
    const [menuCollapse, setMenuCollapse] = useState(false);

    const handleMenuItemClick = (page) => {
        console.log("Selected Page:", page);
        setSelectedPage(page);
    };

    const handleToggleMenu = (isMenuCollapsed) => {
        setMenuCollapse(isMenuCollapsed);
    };

    return (
        <div className="lg-back">
            <Navbar/>
            <Sidebardash onMenuItemClick={handleMenuItemClick} onToggleMenu={handleToggleMenu} />
            <div className="content-container" style={{ marginLeft: menuCollapse ? "80px" : "250px" , paddingTop: "50px" }}>
                {/* Content for different pages */}
                {selectedPage === "Profile" && <div> <Profile/> </div>}
                {selectedPage === "List" && <div><List/></div>}
                {selectedPage === "Calender" && <div><Calender/></div>}
            </div>
        </div>
    );
};

export default Dashboard;
