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
  const [floatingFilterModel, setFloatingFilterModel] = useState<any>({
    // "mission": [
    //   { "filterType": "text", "type": "contains", "filter": "v" }
    // ],
    // "company": [
    //   { "filterType": "text", "type": "contains", "filter": "a" },
    //   { "filterType": "text", "type": "contains", "filter": "b" }
    // ]
  });
  
  const gridRef = useRef<AgGridReact>(null);
  const floatingFilterRef = useRef(floatingFilterModel);  // Use ref to store the model for comparison

  const handleFileUploadData = (entity: EntityListType) => {
    handleEntityData(entity, setEntityData, setColumnData, entityData);
  };

  const defaultColDef = useMemo(() => ({
    flex: 1,
  }), []);

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
      Object.keys(filterModel).forEach((field) => {
        const filters = filterModel[field];
        filters.forEach((filter: any) => {
          gridRef.current.api.getFilterInstance(field, (filterInstance: any) => {
            const model = {
              filterType: filter.filterType,
              type: filter.type,
              filter: filter.filter,
            };
            filterInstance.setModel(model);
            filterInstance.onUiChanged();
          });
        });
      });
  
      gridRef.current.api.onFilterChanged();
    }
  };

  const handleFilterChange = (value: string) => {
    // Update the floating filter model with a new condition
    const newFilterCondition = {
      field: "mission",
      filterType: "text",
      type: "contains",
      filter: value,
    };
  
    // Replace or update the filter conditions in floatingFilterModel
    setFloatingFilterModel(prevState => {
      // Check if "mission" already has a filter condition
      const existingConditions = prevState?.conditions || [];
  
      // Update existing conditions or add the new condition
      const updatedConditions = existingConditions.filter(
        condition => condition.field !== "mission"
      ).concat(newFilterCondition);
  
      // Return the updated floating filter model
      return {
        filterType: "text",
        operator: "AND",
        conditions: updatedConditions,
      };
    });
  };
  
  // When the user presses "Enter", call handleFilterChange with the input value
  

  const getFilterModel = useCallback(() => {
    if (gridRef.current) {
      const filterModel = gridRef.current.api.getFilterModel();
  
      Object.keys(filterModel).forEach((key) => {
        const model = filterModel[key];
        if (!model.type) {
          model.type = 'contains';
        }
        gridRef.current.api.getFilterInstance(key, (filterInstance: any) => {
          filterInstance.setModel(model);
          filterInstance.onUiChanged();
        });
      });

      setFloatingFilterModel((prevModel: any) => {
        const updatedModel = { ...prevModel };
  
        Object.entries(filterModel).forEach(([column, filterData]: [string, any]) => {
          if (!updatedModel[column]) {
            updatedModel[column] = [];
          }
          updatedModel[column].push({
            filterType: filterData.filterType,
            type: filterData.type,
            filter: filterData.filter,
          });
        });

        return updatedModel;
      });

      setShowAdvanceFilterModal(!showAdvanceFilterModal);
    }
  }, [floatingFilterModel, showAdvanceFilterModal]);

  const handleFilterUpdate = useCallback((filterModel: any) => {
    if (filterModel && gridRef.current) {
      const field = filterModel.field;
  
      gridRef.current.api.getFilterInstance(field, (filterInstance: any) => {
        if (filterInstance) {
          const existingModel = filterInstance.getModel();
          const newModel = {
            field: field,
            filterType: filterModel.filterType,
            type: filterModel.type,
            filter: filterModel.filter,
          };

          filterInstance.setModel(newModel);
          filterInstance.onUiChanged();
        }
      });
  
      setFloatingFilterModel((prevModel: any) => {
        const existingFilters = prevModel[field] || [];
        const updatedFilters = [
          ...existingFilters,
          { filterType: filterModel.filterType, type: filterModel.type, filter: filterModel.filter },
        ];

        return { ...prevModel, [field]: updatedFilters };
      });

      gridRef.current.api.onFilterChanged();
    }
  }, []);

  const onGridReady = useCallback((params) => {
    if (floatingFilterModel) {
      params.api.setFilterModel(floatingFilterModel);
    }
  }, [floatingFilterModel]);

  const updatedColumnData = columnData.map(col => {
    if (col.filter === "agTextColumnFilter") {
      return {
        ...col,
        floatingFilterComponent: (props) => (
          <CustomInputFloatingFilter {...props} updateFilter={handleFilterUpdate} />
        ),
      };
    }

    if (col.filter === "agNumberColumnFilter") {
      return {
        ...col,
        floatingFilterComponent: CustomNumberFloatingFilter,
        filterParams: {
          filterOptions: [
            'equals', 'notEqual', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual'
          ],
        },
      };
    }

    if (col.filter === "agDateColumnFilter") {
      return {
        ...col,
        filterParams: {
          filterOptions: [
            'equals', 'notEqual', 'after', 'before', 'inRange'
          ],
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
          { val: 50 },
          { val: 100 }
        ]}
      />
    </div>
  );
};

export default Home;
