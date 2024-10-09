import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ColumnDataType, ColumnStateType, EntityListType } from './type/type';
import Footer from './components/footer.tsx';
import { SampleColumnData } from './data/sample.js';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { AG_GRID_LOCALE_IR } from '@ag-grid-community/locale';
import AdvancedFilterUI from './components/advancedFilterUI.tsx';
import { handleEntityData } from './components/entityDataHandler.ts';
import FileUploader from './components/fileUploader.tsx';

const Home: React.FC = () => {
  const [columnData, setColumnData] = useState<ColumnStateType[]>(SampleColumnData);
  const [entityData, setEntityData] = useState<EntityListType>();
  const [rowData, setRowData] = useState<any[]>([]);
  const [showAdvanceFilterModal, setShowAdvanceFilterModal] = useState<boolean>(false);
  const [initialAdvancedFilterModel, setInitialAdvancedFilterModel] = useState<any>();
  const [floatingFilterModel, setFloatingFilterModel] = useState<any>();
  const gridRef = useRef<AgGridReact>(null);

// Callback for FileUploader to pass entity data
  const handleFileUploadData = (entity: EntityListType) => {
    handleEntityData(entity, setEntityData, setColumnData, entityData);
  };

  // ------ defaultColDef ------
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
    };
  }, []);

  const [startRow, setStartRow] = useState<number>(0);
  const [endRow, setEndRow] = useState<number>(0);
  const handleRowChange = (start: number, end: number) => {
    setStartRow(start);
    setEndRow(end);
  };
  const paginatedData = rowData.slice(startRow, endRow);

  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/space-mission-data.json') 
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);


  // Function to apply filter model to the grid
  const applyFilterModel = (filterModel: any) => {
    if (gridRef.current) {
      gridRef.current.api.setFilterModel(filterModel);
    }
  };

  // Handle filter model changes from AdvancedFilterUI
  const handleFilterChange = (newFilterModel: any) => {
    setFloatingFilterModel(newFilterModel);
    applyFilterModel(newFilterModel); // Apply the new filter model to the grid
  };

  const getFilterModel = () => {
    if (gridRef.current) {
      const filterModel = gridRef.current.api.getFilterModel();
      setFloatingFilterModel(filterModel);
      console.log('Floating Filter model:', filterModel);
      setShowAdvanceFilterModal(!showAdvanceFilterModal);
    }
  };

  const onGridReady = useCallback((params) => {
    if (floatingFilterModel) {
      params.api.setFilterModel(floatingFilterModel); // Apply initial filter model when grid is ready
      console.log('Applied initial filter model:', floatingFilterModel); // Debugging
    }
  }, [floatingFilterModel]);

  return (
    <div className='space-y-4'>
      <div className={`${showAdvanceFilterModal?'fixed inset-0 blur-lg bg-black opacity-30 z-30':''}`}/>

      <FileUploader onFileUpload={handleFileUploadData} />

      <AdvancedFilterUI
        visible={showAdvanceFilterModal}
        object={floatingFilterModel}
        columnData={columnData}
        changeVisible={setShowAdvanceFilterModal}
        onFilterChange={handleFilterChange} // Pass filter change handler
      />

      {/* ------ Btn to Show Filter Object */}
      <button onClick={getFilterModel} className='border-2 rounded-md p-2'>{showAdvanceFilterModal?'عدم نمایش لیست فیلتر':'نمایش لیست فیلتر'}</button>

      <div style={{ width: '100wh', height: '85vh' }} className={`ag-theme-quartz`}>
        <AgGridReact
          ref={gridRef}
          rowData={paginatedData}
          columnDefs={columnData}
          pagination={false}
          localeText={AG_GRID_LOCALE_IR}
          defaultColDef={defaultColDef}
          pivotMode={false}
          onGridReady={onGridReady}  // Set your default filter model
        />
      </div>

      <Footer 
        rowLength={rowData.length}
        onRowChange={handleRowChange}
        arrayOfPageSiteValue={[
          { val: 20 },
          { val: 40 },
          { val: 80 },
        ]}
      />
    </div>
  );
};

export default Home;
