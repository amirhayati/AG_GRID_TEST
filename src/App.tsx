import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ColumnDataType, ColumnStateType, EntityListType } from './type/type';
import Footer from './components/footer.tsx';
import { SampleColumnData } from './data/sample.js';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { AG_GRID_LOCALE_IR } from '@ag-grid-community/locale';
import AdvancedFilterUI from './components/advancedFilterUI.tsx';

const Home: React.FC = () => {
  const [columnData, setColumnData] = useState<ColumnStateType[]>(SampleColumnData);
  const [entityData, setEntityData] = useState<EntityListType>();
  const [rowData, setRowData] = useState<any[]>([]);
  const [showAdvanceFilterModal, setShowAdvanceFilterModal] = useState<boolean>(false);
  const [initialAdvancedFilterModel, setInitialAdvancedFilterModel] = useState<any>();
  const [floatingFilterModel, setFloatingFilterModel] = useState<any>();
  const gridRef = useRef<AgGridReact>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (!event?.target?.files) {
      console.error("No file selected or event object is undefined");
      return; 
    }

    const file = event.target.files[0]; 
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);

          if (jsonData.Entity && jsonData.Entity.columns) {
            setEntityData(jsonData.Entity)

            console.log(jsonData.Entity.columns)
            // ------ Map columns to AG Grid format ---------
            const columns = jsonData.Entity.columns
              .filter((col: ColumnDataType) => col.IsVisible === true)
              .map((col: ColumnDataType) => ({
                headerName: col.title || col.field,
                field: col.field,
                sortable: col.sortable || false,
                align: col.align || "center",
                minWidth: col.width,
                lockPosition: !entityData?.dragableColumn, // Dragable Column
                cellClass: col.cellClass || '',
                floatingFilter: true,
                order: col.OrderId || null,
                filter: 
                  col.ColumnType === 3 || col.ColumnType === 4 || ["3", "4"].includes(String(col.ColumnType)) 
                    ? 'agTextColumnFilter' 
                    : (Number(col.ColumnType) >= 5 && Number(col.ColumnType) <= 12) || ["5", "6", "7", "8", "9", "10", "11", "12"].includes(String(col.ColumnType)) 
                    ? 'agNumberColumnFilter' 
                    : col.ColumnType === 16 || col.ColumnType === 24 || ["16", "24"].includes(String(col.ColumnType))  
                    ? 'agDateColumnFilter' 
                    : col.ColumnType === 2 || ["2"].includes(String(col.ColumnType))
                    ? 'agSetColumnFilter'
                    : false,
            }));

            console.log(columns)
            setColumnData(columns);
          } else {
            console.error('Invalid JSON structure');
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };

      reader.readAsText(file);
    } else {
      console.error("File is not selected");
    }
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

  // Example usage in your getFilterModel function
  const getFilterModel = () => {
    if (gridRef.current) {
      const filterModel = gridRef.current.api.getFilterModel();
      setFloatingFilterModel(filterModel)
      console.log('Floating Filter model:', filterModel);
      setShowAdvanceFilterModal(!showAdvanceFilterModal)
    }
  };

  return (
    <div className='space-y-4'>
      <input 
        type="file" 
        accept=".json, .txt" 
        onChange={handleFileUpload}
      />

      <AdvancedFilterUI visible={showAdvanceFilterModal} data={floatingFilterModel} changeVisible={setShowAdvanceFilterModal}/>
      
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
