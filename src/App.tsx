import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { AG_GRID_LOCALE_IR } from '@ag-grid-community/locale';
import { ColumnDataType, ColumnStateType, EntityListType } from './type/type';
import Footer from './componet/footer/footer.tsx';
import { SampleColumnData } from './data/sample.js';
import ConvertToAdvancedFilterModel from './componet/convertToAdvanceFilterObject.tsx'


const Home: React.FC = () => {
  const [columnData, setColumnData] = useState<ColumnStateType[]>(SampleColumnData);
  const [entityData, setEntityData] = useState<EntityListType>();
  const [rowData, setRowData] = useState<any[]>([]);
  const [showAdvanceFilterModal, setShowAdvanceFilterModal] = useState<boolean>(true);
  const [initialAdvancedFilterModel, setInitialAdvancedFilterModel] = useState<any>();
  const [initialFloatingFilterModel, setInitialFloatingFilterModel] = useState<any>();
  const [initialState, setInitialState] = useState<any>();
console.log(initialAdvancedFilterModel)
  const gridRef = useRef<AgGridReact>(null);
  
  // ------ handle upload file ------
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

  // ------ Refresh Row Data For Pagination ------
  const [startRow, setStartRow] = useState<number>(0);
  const [endRow, setEndRow] = useState<number>(0);
  const handleRowChange = (start: number, end: number) => {
    setStartRow(start);
    setEndRow(end);
  };
  const paginatedData = rowData.slice(startRow, endRow);

 // ------ Get data & update rowData state staticly ------
  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/space-mission-data.json') 
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  // ------ Customize Advanced Filter ------
  const onGridReady = useCallback((params) => {
    // gridRef.current = params.api; //this line just show advance filter on table
    params.api.setGridOption(
      "advancedFilterParent",
      document.getElementById("advancedFilterParent"),
    );
  }, []);




  // Example usage in your getFilterObject function
  const getFilterModel = () => {
    if (gridRef.current) {
      // Get the current floating filter object
      const filterModel = gridRef.current.api.getFilterModel();
      setInitialFloatingFilterModel(filterModel)
      // console.log('Floating Filter object:', filterModel);

      // Convert the floating filter object to advanced filter object
      const advancedFilterModel = ConvertToAdvancedFilterModel(filterModel);
      setInitialAdvancedFilterModel(advancedFilterModel);
      // console.log('Advanced Filter object:', advancedFilterModel);

      // Toggle the advanced filter modal visibility
      setShowAdvanceFilterModal(!showAdvanceFilterModal);
      if (!showAdvanceFilterModal) {
        gridRef.current.api.setFilterModel(advancedFilterModel);
      }else{
        gridRef.current.api.setFilterModel(filterModel)
      }
    }
  };

  const advancedFilterModel = {
    "filterType": "join",
    "type": "AND",
    "conditions": [
        {
            "filterType": "join",
            "type": "AND",
            "conditions": [
                {
                    "filterType": "text",
                    "colId": "mission",
                    "type": "contains",
                    "filter": "a"
                }
            ]
        },
        {
            "filterType": "join",
            "type": "AND",
            "conditions": [
                {
                    "filterType": "text",
                    "colId": "company",
                    "type": "contains",
                    "filter": "a"
                },
                {
                    "filterType": "text",
                    "colId": "company",
                    "type": "notContains",
                    "filter": "b"
                }
            ]
        },
        {
            "filterType": "join",
            "type": "OR",
            "conditions": [
                {
                    "filterType": "text",
                    "colId": "location",
                    "type": "contains",
                    "filter": "a"
                },
                {
                    "filterType": "text",
                    "colId": "location",
                    "type": "endsWith",
                    "filter": "b"
                }
            ]
        }
    ]
}

  // Event handler for Show the advanced filter builder After Click Btn
  const onModelUpdatedRendered = () => {    
    // params.api.showAdvancedFilterBuilder(); //Open Advance Filter Build Modal After enableAdvancedFilter(true)
  };

  useEffect(()=>{
    const initialState = {
      filter: {
        advancedFilterModel: showAdvanceFilterModal?initialFloatingFilterModel:initialAdvancedFilterModel,
      },
    };
    setInitialState(initialState); // update initialState of advance filter
  },[initialAdvancedFilterModel, initialFloatingFilterModel])

  return (
    <div className='space-y-4'>
       <input 
        type="file" 
        accept=".json, .txt" 
        onChange={handleFileUpload}
      />

      {/* ------ Btn to Show Filter Object */}
      <button onClick={getFilterModel} className='border-2 rounded-md p-2'>{showAdvanceFilterModal?'عدم نمایش لیست فیلتر':'نمایش لیست فیلتر'}</button>
      
      {/* ------ Custom Advanced Filter UI ------ */}
      <div id="advancedFilterParent" className="example-header"></div>

      <div 
        style={{width:'100wh', height:'85vh'}}
        className={`ag-theme-quartz`}
      >
        <AgGridReact
          ref={gridRef}
          rowData={paginatedData}
          columnDefs={columnData}
          pagination={false} // Disable AG Grid pagination since we are using custom pagination
          localeText={AG_GRID_LOCALE_IR}
          defaultColDef={defaultColDef}
          pivotMode={false}
          onGridReady={onGridReady}

          // enableAdvancedFilter={true}
          onModelUpdated={onModelUpdatedRendered}

          enableAdvancedFilter={showAdvanceFilterModal}
          initialState={initialState}
        />
      </div>

      {/* Custom Footer */}
      <Footer 
        rowLength={rowData.length}
        onRowChange={handleRowChange} 
        arrayOfPageSiteValue={[
          {val: 20},
          {val: 40},
          {val: 80},
        ]}
      />
    </div>
  );
}

export default Home;
