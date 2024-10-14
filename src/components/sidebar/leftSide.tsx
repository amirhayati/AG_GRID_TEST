import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'

const LeftSide = ({leftSideItems, toggleSidebar, isSidebarOpen, selectedLeftItem, setSelectedLeftItem}) => {

    const handleSelectLeftItem = (item) => {
        setSelectedLeftItem(item);
        toggleSidebar();
    }

    return (
        <div className={`${isSidebarOpen ? 'fixed' : 'hidden'} z-50 left-0 top-0 w-14 h-full p-3 gap-3 bg-black text-green-600 flex flex-col items-center justify-start border-r border-white`}>
            <button
                onClick={toggleSidebar}
                className="flex justify-center items-center w-8 h-8 rounded-md border border-green-800"
            >
                <IoIosArrowBack />
            </button>
            {
                leftSideItems.map((item, key) => (
                    <button 
                        key={key}
                        className={`${selectedLeftItem === item.label?'bg-green-700 text-black ':''} bg-green-950 hover:bg-green-700 hover:text-black font-medium w-full h-fit py-4 rounded-md writing-vertical-rl text-orientation-mixed rotate-180`}
                        onClick={() => handleSelectLeftItem(item.label)}
                    >
                        <span className="text-sm ">{item.label}</span>
                    </button>
                ))
            }
        </div>
    )
}

export default LeftSide
