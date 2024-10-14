import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { IoCubeOutline, IoPeopleOutline, IoFileTrayFullOutline, IoFileTrayStackedOutline } from 'react-icons/io5';

const Sidebar = () => {
  const [openSections, setOpenSections] = useState({
    masterData: true,
    receivingManagement: false,
    shippingManagement: false,
    inventoryManagement: false,
    receivingReport: false,
    shippingReport: false,
    palletManagement: false,
    interface: false,
    keyPerformance: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  // Array containing the sidebar structure
  const sidebarItems = [
    {
      id: 'masterData',
      title: 'Master Data',
      icon: <IoCubeOutline />,
      isActive: openSections.masterData,
      items: [
        { label: 'Section', icon: '',isHighlighted: false },
        { label: 'Storage Group', icon: '',isHighlighted: true },
        { label: 'Store Delivery Schedule', icon: '',isHighlighted: false },
        { label: 'Family', icon: <FaStar />,isHighlighted: false },
        { label: 'Replenishment Location Product', icon: '',isHighlighted: false },
      ],
    },
    {
      id: 'receivingManagement',
      title: 'Receiving Management',
      icon: <IoPeopleOutline />,
      isActive: openSections.receivingManagement,
      items: [],
    },
    {
      id: 'shippingManagement',
      title: 'Shipping Management',
      icon: <IoFileTrayFullOutline />,
      isActive: openSections.shippingManagement,
      items: [],
    },
    {
      id: 'inventoryManagement',
      title: 'Inventory Management',
      icon: <IoFileTrayStackedOutline />,
      isActive: openSections.inventoryManagement,
      items: [],
    },
  ];

  return (
    <div className="w-1/4 min-w-[17rem] max-w-[20rem] bg-gray-100 h-screen p-2">
      {/* Search Box */}
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          placeholder="search here..."
        />
      </div>

      {/* Sidebar Items */}
      {sidebarItems.map((section) => (
        <div key={section.id}>
          <button
            className={`flex justify-between items-center w-full p-2 px-4 mb-2 ${section.isActive ? 'bg-green-600 text-white' : ''} rounded-md`}
            onClick={() => toggleSection(section.id)}
          >
            <div className='flex gap-2 items-center'>
                <span>{section.icon}</span>
                <span className='text-sm font-medium'>{section.title}</span>
            </div>
            <span className='flex'>{section.isActive ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
          </button>

          {section.isActive && section.items.length > 0 && (
            <div className={`ml-6`}>
                {section.items.map((item, id) => (
                    <div
                        key={id}
                        className={`relative flex items-center pl-4 group`}
                    >
                        <span className={`absolute left-0 top-0 bottom-0 transition-all duration-300 ${item.isHighlighted ? 'bg-green-600 w-[2px]' : 'bg-gray-300 w-[1px] group-hover:w-[2px] group-hover:bg-green-600'}`}/>
                        <div className={`flex items-center gap-1 w-full mr-6 px-2 py-2 ${item.isHighlighted?'bg-amber-50':''} group-hover:bg-amber-50`}>
                            <p className={`text-xs ${item.isHighlighted ? 'text-green-600' : 'text-gray-500 group-hover:text-green-600'}`}>
                                {item.label}
                            </p>
                            <span className="text-sm text-gray-300">{item.icon}</span> {/* Icon */}
                        </div>
                    </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
