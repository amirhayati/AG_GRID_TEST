// Sidebar.js
import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoIosArrowDown, IoIosArrowUp, IoIosArrowForward } from 'react-icons/io';
import { sidebarItems } from './sidebarData';
import SidebarItems from './sidebarItems.tsx';
import SideBarSearch from './sideBarSearch.tsx';

const Sidebar = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [openSections, setOpenSections] = useState({
        favourite: false,
        masterData: true,
        receivingManagement: false,
        shippingManagement: false,
        inventoryManagement: false,
    });

    const toggleSection = (section) => {
        setOpenSections((prevState) => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="w-1/4 min-w-[17rem] max-w-[20rem] bg-gray-100 h-screen p-2 fixed overflow-y-scroll scrollbar-thin-custom">
            {/* Search Box */}
            <SideBarSearch toggleSidebar={toggleSidebar} />

            {/* Sidebar Items */}
            <SidebarItems
                sidebarItems={sidebarItems}  
                openSections={openSections}   
                toggleSection={toggleSection} 
            />
        </div>
    );
};

export default Sidebar;
