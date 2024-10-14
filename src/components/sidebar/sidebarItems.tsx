import React from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

const SidebarItems = ({ sidebarItems, openSections, toggleSection }) => {
    return (
        <>
            {sidebarItems.map((section) => (
                <div key={section.id}>
                    <button
                        className={`flex justify-between items-center w-full p-2 px-4 mb-2 ${openSections[section.id] ? 'bg-green-600 text-white' : ''} rounded-md`}
                        onClick={() => toggleSection(section.id)}
                    >
                        <div className="flex gap-2 items-center">
                            <span>{section.icon}</span>
                            <span className="text-sm font-medium">{section.title}</span>
                        </div>
                        <span className="flex">
                            {openSections[section.id] ? <IoIosArrowUp /> : <IoIosArrowDown />}
                        </span>
                    </button>

                    {openSections[section.id] && section.items.length > 0 && (
                        <div className="ml-6 mb-4">
                            {section.items.map((item, id) => (
                                <div key={id} className="relative flex items-center pl-4 group">
                                    <span
                                        className={`absolute left-0 top-0 bottom-0 transition-all duration-300 ${
                                            item.isHighlighted ? 'bg-green-600 w-[2px]' : 'bg-gray-300 w-[1px] group-hover:w-[2px] group-hover:bg-green-600'
                                        }`}
                                    />
                                    <div className={`flex items-center gap-1 w-full mr-6 px-2 py-2 ${item.isHighlighted ? 'bg-amber-50' : ''} group-hover:bg-amber-50`}>
                                        <p
                                            className={`text-xs ${
                                                item.isHighlighted ? 'text-green-600' : 'text-gray-500 group-hover:text-green-600'
                                            }`}
                                        >
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
        </>
    );
};

export default SidebarItems;
