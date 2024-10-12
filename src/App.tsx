import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ColumnDataType, ColumnStateType, EntityListType } from './type/type';
import Footer from './components/footer.tsx';
import { SampleColumnData } from './data/sample.js';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css"; 
import AdvancedFilterUI from './components/advancedFilterUI.tsx';
import { handleEntityData } from './components/entityDataHandler.ts';
import FileUploader from './components/fileUploader.tsx';
import CustomNumberFloatingFilter from './components/floatingFilter/customInputFloatingFilter.tsx';
import CustomInputFloatingFilter from './components/floatingFilter/customInputFloatingFilter.tsx';

const Home: React.FC = () => {
  const [columnData, setColumnData] = useState<ColumnStateType[]>(SampleColumnData);
  const [entityData, setEntityData] = useState<EntityListType>();
  const [rowData, setRowData] = useState<any[]>([]);
  const [showAdvanceFilterModal, setShowAdvanceFilterModal] = useState<boolean>(false);
  const [floatingFilterModel, setFloatingFilterModel] = useState<any>({});
  const gridRef = useRef<AgGridReact>(null);

  const handleFileUploadData = (entity: EntityListType) => {
    handleEntityData(entity, setEntityData, setColumnData, entityData);
  };

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

  const applyFilterModel = (filterModel: any) => {
    if (gridRef.current) {
      // Apply each filter condition to the grid for multiple columns
      filterModel.forEach((model: any) => {
        model.conditions.forEach((condition: any) => {
          gridRef.current.api.getFilterInstance(condition.field, (filterInstance: any) => {
            const model = {
              filterType: condition.filterType,
              type: condition.type,
              filter: condition.filter,
            };
            filterInstance.setModel(model);
            filterInstance.onUiChanged();
          });
        });
      });
  
      // Trigger the grid to apply the filters globally
      gridRef.current.api.onFilterChanged();
    }
  };
  

  const handleFilterChange = (newFilterModel: any) => {
    setFloatingFilterModel(newFilterModel);
    applyFilterModel(newFilterModel); 
  };

  const getFilterModel = () => {
    if (gridRef.current) {
      const filterModel = gridRef.current.api.getFilterModel();
      console.log('Floating Filter model:', filterModel);

      Object.keys(filterModel).forEach((key) => {
        const model = filterModel[key];
        if (!model.type) {
          model.type = 'contains'; // Ensure 'contains' filter type
        }
        gridRef.current.api.getFilterInstance(key, (filterInstance: any) => {
          filterInstance.setModel(model);
          filterInstance.onUiChanged();
        });
      });
  
      // Save filter model for advanced filter
      setFloatingFilterModel(filterModel);
      setShowAdvanceFilterModal(!showAdvanceFilterModal);
    }
  };

  const handleFilterUpdate = (filterModel: any) => {
    console.log('Incoming Filter Model:', filterModel);
  
    if (filterModel && gridRef.current) {
      const field = filterModel.field;
  
      // Check if field is present and retrieve filter instance
      gridRef.current.api.getFilterInstance(field, (filterInstance: any) => {
        if (filterInstance) {
          filterInstance.setModel(filterModel);
          filterInstance.onUiChanged();
        } else {
          console.warn(`No filter instance found for field: ${field}`);
        }
      });
  
      // Update the floatingFilterModel in the state
      setFloatingFilterModel((prevModel: any) => {
        // Keep existing filters for other fields intact
        return {
          ...prevModel,
          [field]: filterModel, // Override or add the new filter for the field
        };
      });
  
      // Notify the grid to update
      gridRef.current.api.onFilterChanged();
    }
  };
  
  console.log('Incoming Filter Model:', floatingFilterModel);

  const onGridReady = useCallback((params) => {
    if (floatingFilterModel) {
      params.api.setFilterModel(floatingFilterModel);
      console.log('Applied initial filter model:', floatingFilterModel);
    }
  }, [floatingFilterModel]);

  const updatedColumnData = columnData.map(col => {
    // Check for text column filter
    if (col.filter === "agTextColumnFilter") {
      return {
        ...col,
        floatingFilterComponent: (props) => (
          <CustomInputFloatingFilter {...props} updateFilter={handleFilterUpdate} />
        ),
      };
    }

    // Check for number column filter
    if (col.filter === "agNumberColumnFilter") {
      return {
        ...col,
        floatingFilterComponent: CustomNumberFloatingFilter, // Use your custom number floating filter
        filterParams: {
          filterOptions: [
            'equals',
            'notEqual',
            'greaterThan',
            'greaterThanOrEqual',
            'lessThan',
            'lessThanOrEqual'
          ],
        },
      };
    }

    // Check for date column filter
    if (col.filter === "agDateColumnFilter") {
      return {
        ...col,
        filterParams: {
          filterOptions: [
            'equals',      
            'notEqual',
            'after',
            'before',
            'inRange'
          ],
        },
      };
    }
  
    // Return the column unchanged if no filter matches
    return col;
  });
  

  return (
    <div className='space-y-4'>
      <div className={`${showAdvanceFilterModal ? 'fixed inset-0 blur-lg bg-black opacity-30 z-30' : ''}`} />

      <FileUploader onFileUpload={handleFileUploadData} />

      <AdvancedFilterUI
        visible={showAdvanceFilterModal}
        object={floatingFilterModel}
        columnData={columnData}
        changeVisible={setShowAdvanceFilterModal}
        onFilterChange={handleFilterChange}
      />

      <button onClick={getFilterModel} className='border-2 rounded-md p-2'>
        {showAdvanceFilterModal ? 'عدم نمایش لیست فیلتر' : 'نمایش لیست فیلتر'}
      </button>

      <div style={{ width: '100wh', height: '85vh' }} className={`ag-theme-quartz`}>
        <AgGridReact
          ref={gridRef}
          rowData={paginatedData}
          columnDefs={updatedColumnData}
          pagination={false}
          defaultColDef={defaultColDef}
          pivotMode={false}
          onGridReady={onGridReady}
        />
      </div>

      <Footer 
        rowLength={rowData.length}
        onRowChange={handleRowChange}
        arrayOfPageSiteValue={[
          { val: 20 },
          { val: 50 },
          { val: 100 }
        ]}
      />
    </div>
  );
};

export default Home;
