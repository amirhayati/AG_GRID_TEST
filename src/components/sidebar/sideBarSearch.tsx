import React from 'react'
import { FiSearch } from 'react-icons/fi'
import { IoIosArrowForward } from 'react-icons/io'

const SideBarSearch = ({toggleSidebar}) => {
        return (
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
        )
}

export default SideBarSearch
