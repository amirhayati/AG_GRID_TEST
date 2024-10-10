import React, { useEffect, useRef } from 'react';
import { IFilterComp } from 'ag-grid-community';

interface CustomInputFloatingFilterProps extends IFilterComp {
  updateFilter: (filterModel: any) => void; // Add a prop for updating filter
}

const CustomInputFloatingFilter: React.FC<CustomInputFloatingFilterProps> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
  
    // Only update the filter model if the value is not empty
    if (value) {
      const filterModel = {
        field: props.column.colId, // Ensure you're using the correct field identifier
        filterType: 'text',        // Ensure this matches your filter type
        type: 'contains',          // Filter type for the condition
        filter: value              // The input value
      };
      props.updateFilter(filterModel); // Call the update method with the new model
    }
  };
  
  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.code === 'Enter') {
      const value = inputRef.current?.value || '';
  
      // Only update if there is a value
      if (value) {
        const filterModel = {
          field: props.column.colId, // Ensure you're using the correct field identifier
          filterType: 'text',        // Ensure this matches your filter type
          type: 'contains',          // Filter type for the condition
          filter: value              // The input value
        };
  
        // Log the filter model before updating
        console.log('Custom input - Filter model before update on enter:', filterModel);
  
        // Call the update method to append the new model
        props.updateFilter(filterModel);
  
        // Clear the input field after pressing Enter
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    }
  };
  
  
  
  

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = props.filterText || '';
    }
  }, [props.filterText]);

  return (
    <input
      ref={inputRef}
      type="text"
    //   onChange={onInputChange}
      onKeyPress={onKeyPress}
      className='w-full h-[32px] bg-white border-2 place-self-center px-1'
    />
  );
};

export default CustomInputFloatingFilter;
