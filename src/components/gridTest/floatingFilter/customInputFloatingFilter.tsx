import React, { useEffect, useRef } from 'react';
import { IFilterComp } from 'ag-grid-community';

interface CustomInputFloatingFilterProps {
  updateFilter: (filterModel: any) => void;
  column: any; // Assuming this contains column data like `colId`
  api: any; // ag-Grid API reference
}

const CustomInputFloatingFilter: React.FC<CustomInputFloatingFilterProps> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Use ag-Grid's built-in filter behavior by setting the filter model
    const filterModel = {
      [props.column.colId]: {
        type: 'contains',
        filter: value
      }
    };

    // Update the ag-Grid filter model
    props.api.setFilterModel(filterModel);
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.code === 'Enter') {
      const value = inputRef.current?.value || '';

      // Use ag-Grid's built-in filter behavior by setting the filter model
      const filterModel = {
        [props.column.colId]: {
          type: 'contains',
          filter: value
        }
      };

      // Update the ag-Grid filter model on Enter press
      props.api.setFilterModel(filterModel);

      // Clear the input field after pressing Enter
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      const currentFilterModel = props.api.getFilterModel();
      const filterValue = currentFilterModel?.[props.column.colId]?.filter || '';
      inputRef.current.value = filterValue;
    }
  }, [props.api, props.column.colId]);

  return (
    <input
      ref={inputRef}
      type="text"
      onChange={onInputChange}
      onKeyPress={onKeyPress}
      className="w-full h-[32px] bg-white border-2 place-self-center px-1"
    />
  );
};

export default CustomInputFloatingFilter;
