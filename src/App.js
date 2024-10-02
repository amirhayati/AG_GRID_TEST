import React, { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { AG_GRID_LOCALE_IR } from '@ag-grid-community/locale';
import data from './Datagrid_Josn.json';
import axios from 'axios';

const Home = () => {
  const [columnData, setColumnData] = useState([{}]);
  const [rowData, setRowData] = useState();

  
  useEffect(() => {
    const columns = data.Entity.columns.map((col) => ({
      headerName: col.title || col.field, 
      field: col.field,                   
      sortable: col.sortable || false,  
      lockPosition: col.align,  
      lockVisible: col.IsVisible,
      filter: true,                       
      width: col.width || 100,           
      cellClass: col.cellClass || '',  
      // valueFormatter: (params) => `£ ${params.value}`,   
    }));

    console.log(columnData)
    setColumnData(columns);
  }, []);

  useEffect(() => {
    axios.get(`https://www.ag-grid.com/example-assets/olympic-winners.json`)
    .then((response) => {
      setRowData(response.data);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      floatingFilter: true,
    };
  }, []);

  return (
    <div 
      style={{width:'100wh', height:'100vh'}}
      className={`ag-theme-quartz`}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnData}
        pagination={data.Entity.pagination}
        localeText={AG_GRID_LOCALE_IR}
        defaultColDef={defaultColDef}
        pivotMode={true}
      />
    </div>
  );
}

export default Home;
