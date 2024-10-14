import React, { useState } from 'react'
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { FiRefreshCcw } from "react-icons/fi";

import { FooterType } from '../type/type';
import { FaMinus, FaPlus } from 'react-icons/fa';

const Footer = ({
    rowLength,  //Row Length
    onRowChange, //Pass Start Row And End Row To Parent Component
    arrayOfPageSiteValue  //Page Size Value
    }: FooterType) => {

    const pageSizeValue = arrayOfPageSiteValue || [
      {val: 5},
      {val: 10},
      {val: 20},
    ]
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState<number>(pageSizeValue[0].val); //Number Of Row Per Page
    const totalPages = Math.ceil(rowLength / pageSize);
  
    const refreshData = () => {
      setCurrentPage(1);
    };
  
    const handlePageChange = (newPage) => {
      if (newPage < 1 || newPage > totalPages) return;
      setCurrentPage(newPage);
    };
  
    const handlePageSizeChange = (event) => {
      const newSize = Number(event.target.value);
      setPageSize(newSize);
      setCurrentPage(1); // Reset to the first page on page size change
    };
  
    
    // Calculate the data for the current page
    const startRow = (currentPage - 1) * pageSize;
    const endRow = startRow + pageSize;
    onRowChange(startRow, endRow);
    

    return (
        <div className="flex w-full min-h-12 flex-row items-center justify-between px-4 gap-4 border-[1px] border-t-0 border-t-gray-400 rounded-b-[5px] text-sm">
          {/* Footer Left Side */}
          <div className='flex gap-8'>
            {/* Page size selector */}
            <div>
                {/* <label>Page Size:</label> */}
                <select value={pageSize} onChange={handlePageSizeChange} className='border-2 px-1 py-1 min-w-12 rounded-md'>
                  {
                    pageSizeValue.map((item)=>(
                      <option value={item.val}>{item.val}</option>
                    ))
                  }
                </select>
            </div>

            {/* Custom pagination controls */}
            <div className='flex flex-row items-center'>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className='p-2 hover:bg-gray-100 rounded-full'>
                <GrFormPrevious color={currentPage === totalPages ? '#aaa' : '#000'} size={18}/>
              </button>
              <span className='mx-3'>
                صفحه  {totalPages} از {currentPage}
              </span>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className='p-2 hover:bg-gray-100 rounded-full'>
                <GrFormNext color={currentPage === 1 ? '#aaa' : '#000'} size={18}/>
              </button>
            </div>
          </div>

          {/* Footer Right Side */}
          <div className='flex gap-4 h-full'>
              <button onClick={refreshData} className='w-8 h-8 flex-center rounded-md hover:bg-gray-200'>
                <FaMinus />
              </button>

              <button onClick={refreshData} className='w-8 h-8 flex-center rounded-md hover:bg-gray-200'>
                <FaPlus />
              </button>

              <button onClick={refreshData} className='w-8 h-8 flex-center rounded-md hover:bg-gray-200'>
                <FiRefreshCcw />
              </button>
          </div>
        </div>
    )
}

export default Footer
