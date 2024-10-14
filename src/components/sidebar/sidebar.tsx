import React, { useEffect, useState } from 'react';
import { sidebarItems, leftSideItems } from './sidebarData';
import SidebarItems from './sidebarItems.tsx';
import SideBarSearch from './sideBarSearch.tsx';
import LeftSide from './leftSide.tsx';
import { SidebarItemTypes } from '../../type/sideBar/type.tsx';

const Sidebar = () => {
    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [selectedLeftItem, setSelectedLeftItem] = useState<string>(leftSideItems[0].label);
    const [sidebarValues, setSidebarValues] = useState<SidebarItemTypes[]>([]);
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setSidebarValues([])
        for (let i = 0; i < sidebarItems.length; i++) {
            if(sidebarItems[i].leftSideId === selectedLeftItem){
                setSidebarValues(prevState => [...prevState, sidebarItems[i]]);

                setOpenSections((prevState) => ({
                    ...prevState,
                    [sidebarItems[i].id]: false,
                }));
            }
        }
    }, [selectedLeftItem]);
    
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
        <div className="w-1/4 min-w-[17rem] max-w-[20rem] h-screen p-2 fixed overflow-y-scroll scrollbar-thin-custom">
            {/* Search Box */}
            <SideBarSearch toggleSidebar={toggleSidebar} />

            {/* Sidebar Items */}
            <SidebarItems
                sidebarItems={sidebarValues}  
                openSections={openSections}   
                toggleSection={toggleSection} 
            />

            {/* Left Side */}
            <LeftSide 
                leftSideItems={leftSideItems}
                toggleSidebar={toggleSidebar} 
                isSidebarOpen={isSidebarOpen}
                selectedLeftItem={selectedLeftItem}
                setSelectedLeftItem={setSelectedLeftItem}
            />
        </div>
    );
};

export default Sidebar;
