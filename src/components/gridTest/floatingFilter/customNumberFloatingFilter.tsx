import React, { useEffect, useRef } from 'react';
import { IFilterComp } from 'ag-grid-community';

interface CustomNumberFloatingFilterProps {
  parentFilterInstance: (callback: Function) => void;
  api: any;
  filterText?: string;
}

const CustomNumberFloatingFilter: React.FC<CustomNumberFloatingFilterProps> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper function to update the ag-Grid filter model
  const updateFilterModel = (value: string) => {
    const filterValue = value ? Number(value) : null; // Convert value to number or null

    props.parentFilterInstance((instance: any) => {
      instance.setModel(filterValue ? { filter: filterValue, type: 'equals' } : null); // Set model for 'equals' filter type
      instance.onUiChanged(); // Trigger UI update
    });

    props.api.onFilterChanged(); // Notify ag-Grid to update the filters
  };

  // Handle input change and update the filter model
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (!isNaN(Number(value)) || value === '') { // Ensure only numeric input or empty strings
      updateFilterModel(value);
    }
  };

  // Handle Enter key press to submit the filter and clear the input
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const value = inputRef.current?.value || '';
      updateFilterModel(value); // Update filter model on Enter key press
      inputRef.current?.value = ''; // Clear the input field after pressing Enter
    }
  };

  // Set the filter text from the parent component on initial render and when it changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = props.filterText || ''; // Initialize the input with filterText
    }
  }, [props.filterText]);

  return (
    <input
      ref={inputRef}
      type="number"
      onChange={onInputChange} // Trigger filter update on input change
      onKeyDown={onKeyDown}   // Trigger filter update on Enter key press
      className="w-full h-[32px] bg-white border-2 place-self-center px-1"
    />
  );
};

export default CustomNumberFloatingFilter;
