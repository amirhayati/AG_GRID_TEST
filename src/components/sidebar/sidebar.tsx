// Sidebar.js
import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoIosArrowDown, IoIosArrowUp, IoIosArrowForward } from 'react-icons/io';
import { sidebarItems } from './sidebarData';
import SidebarItems from './sidebarItems.tsx';

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
        <div className="w-1/4 min-w-[17rem] max-w-[20rem] bg-gray-100 h-screen p-2">
            {/* Search Box */}
            <div className="flex items-center gap-2 ml-2 mb-2 h-8">
                <button
                    onClick={toggleSidebar}
                    className="flex justify-center items-center w-10 h-full rounded-md border border-gray-800"
                >
                    <IoIosArrowForward />
                </button>

                {/* Search Input */}
                <div className="flex items-center px-2 border border-gray-800 rounded-md w-full h-full">
                    <FiSearch className="text-2xl" />
                    <input
                        type="text"
                        placeholder="search here..."
                        className="w-full p-2 bg-transparent outline-none text-sm"
                    />
                </div>
            </div>

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
