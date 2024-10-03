import React, { useState } from 'react'
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

import { FooterType } from '../../type/type';

const Footer = ({
    defaultRow, //Default Number Of page size
    rowLength,  //Row Length
    arrayOfPageSiteValue  //Page Size Value
    }: FooterType) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(defaultRow || 2); //Number Of Row Per Page
    const totalPages = Math.ceil(rowLength / pageSize);
    const pageSizeValue = arrayOfPageSiteValue || [
      {val: 5},
      {val: 10},
      {val: 20},
    ]

  
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
    // const startRow = (currentPage - 1) * pageSize;
    // const endRow = startRow + pageSize;
    // const paginatedData = rowData.slice(startRow, endRow);

    return (
        <div className="flex flex-row items-center justify-between p-4 gap-4 border-[1px] border-t-0 border-t-gray-400 rounded-b-[5px] text-sm">
          {/* Footer Left Side */}
          <div className='flex gap-8'>
            {/* Page size selector */}
            <div>
                {/* <label style={{ marginRight: '10px' }}>Page Size:</label> */}
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
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  <GrFormPrevious color={currentPage === 1 ? '#000' : '#aaa'} size={18}/>
                </button>
                <span style={{ margin: '0 10px' }}>
                  صفحه  {totalPages} از {currentPage}
                </span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  <GrFormNext color={currentPage === totalPages ? '#000' : '#aaa'} size={18}/>
                </button>
            </div>
          </div>

          {/* Footer Right Side */}
          <div className='flex gap-8'>
            <div>
                <button onClick={refreshData} style={{ padding: '5px 10px' }}>
                Refresh
                </button>
            </div>
          </div>
        </div>
    )
}

export default Footer
