import React, { useState, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const FloatingFilterExample = () => {
  const [rowData] = useState([
    { name: 'John', age: 25 },
    { name: 'Jane', age: 30 },
    { name: 'Doe', age: 35 },
    { name: 'Smith', age: 40 },
  ]);

  const [columnDefs] = useState([
    {
      headerName: 'Name',
      field: 'name',
      filter: true, // Enable standard filtering
      floatingFilter: true, // Enable floating filter
      floatingFilterComponent: CustomFloatingFilter, // Use custom floating filter
      floatingFilterComponentParams: { suppressFilterButton: true },
    },
    {
      headerName: 'Age',
      field: 'age',
    },
  ]);

  const gridApi = useRef<any>(null);
  const [filterValues, setFilterValues] = useState<string[]>([]); // Filter values are stored here

  // Function to apply the external filter when the user types
  const applyExternalFilters = () => {
    if (gridApi.current) {
      gridApi.current.onFilterChanged(); // Trigger AG Grid to apply the filters
    }
  };

  // AG Grid external filter logic
  const isExternalFilterPresent = () => {
    return filterValues.length > 0; // Check if there are active filters
  };

  const doesExternalFilterPass = (node: any) => {
    const name = node.data.name.toLowerCase();
    return filterValues.every((filterValue) => name.includes(filterValue));
  };

  return (
    <div>
      {/* Display the list of current filter values */}
      <div style={{ marginBottom: '10px' }}>
        <strong>Current Filters:</strong> 
        <ul>
          {filterValues.map((value, index) => (
            <li key={index}>{value}</li>
          ))}
        </ul>
      </div>

      {/* AG Grid Table */}
      <div
        className="ag-theme-alpine"
        style={{ height: 400, width: 600 }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          onGridReady={(params) => (gridApi.current = params.api)}
          isExternalFilterPresent={isExternalFilterPresent}
          doesExternalFilterPass={doesExternalFilterPass}
          frameworkComponents={{ CustomFloatingFilter }} // Register the custom floating filter component
          context={{ setFilterValues }} // Provide the setFilterValues function in the context
        />
      </div>
    </div>
  );
};

// Custom floating filter component
const CustomFloatingFilter = (props: any) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const inputValue = inputRef.current?.value.trim().toLowerCase() || '';
      if (inputValue) {
        // Access the context to update the filter values
        props.context.setFilterValues((prevFilters: string[]) => [
          ...prevFilters,
          inputValue, // Append the new filter value
        ]);

        // Trigger external filtering
        props.api.onFilterChanged();

        // Clear the input field
        inputRef.current!.value = '';
      }
    }
  };

  return (
    <input
      type="text"
      ref={inputRef}
      placeholder="Enter filter"
      onKeyPress={handleKeyPress}
      style={{ width: '100%' }}
    />
  );
};

export default FloatingFilterExample;
