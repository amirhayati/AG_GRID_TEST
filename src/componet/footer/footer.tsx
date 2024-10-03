import React, { useState } from 'react'
import { FooterType } from '../../type/type';

const Footer = ({
    numberOfRow, //Number Of Row Per Page
    rowLength  //Row Length
    }: FooterType) => {

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(numberOfRow); //Number Of Row Per Page
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
    // const startRow = (currentPage - 1) * pageSize;
    // const endRow = startRow + pageSize;
    // const paginatedData = rowData.slice(startRow, endRow);

    return (
        <div className="custom-footer" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderTop: '1px solid #d0d0d0', marginTop: '10px' }}>
            <div>
                {/* Page size selector */}
                <label style={{ marginRight: '10px' }}>Page Size:</label>
                <select value={pageSize} onChange={handlePageSizeChange}>
                <option value={2}>2</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
                </select>
            </div>
            <div>
                {/* Custom pagination controls */}
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Previous
                </button>
                <span style={{ margin: '0 10px' }}>
                Page {currentPage} of {totalPages}
                </span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
                </button>
            </div>
            <div>
                <button onClick={refreshData} style={{ padding: '5px 10px' }}>
                Refresh
                </button>
            </div>
        </div>
    )
}

export default Footer
