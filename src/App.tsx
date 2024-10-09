import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ColumnDataType, ColumnStateType, EntityListType } from './type/type';
import Footer from './components/footer.tsx';
import { SampleColumnData } from './data/sample.js';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css"; 
import { AG_GRID_LOCALE_IR } from '@ag-grid-community/locale';
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
  const [floatingFilterModel, setFloatingFilterModel] = useState<any>();
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
      // Apply each filter to the grid
      filterModel.forEach((filter: any) => {
        filter.conditions.forEach((condition: any) => {
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
  
      // Apply the filter model globally
      gridRef.current.api.onFilterChanged();
    }
  };

const handleFilterChange = (newFilterModel: any[]) => {
  setFloatingFilterModel((prevModel) => {
    // Ensure prevModel is an array
    const currentModel = Array.isArray(prevModel) ? prevModel : [];

    // Create a map for quick lookup of existing filters
    const modelMap = new Map(currentModel.map((filter) => [filter.field, filter]));

    // Update existing filters or add new ones
    newFilterModel.forEach((newFilter) => {
      modelMap.set(newFilter.field, newFilter);
    });

    // Convert the map back to an array
    return Array.from(modelMap.values());
  });

  // Apply the new filter model to the grid
  if (gridRef.current) {
    const gridFilterModel: any = {};
    newFilterModel.forEach((filter) => {
      gridFilterModel[filter.field] = {
        filterType: filter.filterType,
        filter: filter.filter, // Modify based on your filter structure
      };
    });

    // Update the grid with the new filter model
    gridRef.current.api.setFilterModel(gridFilterModel);
  }
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

  const onGridReady = useCallback((params) => {
    if (floatingFilterModel) {
      params.api.setFilterModel(floatingFilterModel);
      console.log('Applied initial filter model:', floatingFilterModel);
    }
  }, [floatingFilterModel]);

  const handleFilterChangeFromFloatingFilter = (newFilterModel: any) => {
    // Update both the grid filter and the AdvancedFilterUI
    setFloatingFilterModel(newFilterModel);
    // applyFilterModel(newFilterModel); // Apply filter to the grid
    
    // Apply the new filter model to the grid
    if (gridRef.current) {
      gridRef.current.api.setFilterModel(newFilterModel);
    }
  };
  
  const updatedColumnData = columnData.map(col => {
    if (col.filter === "agTextColumnFilter") {
      return {
        ...col,
        floatingFilterComponent: CustomInputFloatingFilter,
        floatingFilterComponentParams: {
          onFilterChange: handleFilterChangeFromFloatingFilter, // Pass the handler
        },
      };
    }
    if (col.filter === "agNumberColumnFilter") {
      return {
        ...col,
        floatingFilterComponent: CustomNumberFloatingFilter,
        floatingFilterComponentParams: {
          onFilterChange: handleFilterChangeFromFloatingFilter, // Pass the handler
        },
      };
    }
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
          { val: 40 },
          { val: 80 },
        ]}
      />
    </div>
  );
};

export default Home;
