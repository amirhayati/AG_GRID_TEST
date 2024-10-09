import React, { useEffect, useRef } from 'react';
import { IFilterComp } from 'ag-grid-community';

const CustomInputFloatingFilter: React.FC<IFilterComp> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    console.log("Typing data:", value); // Log typing data

    // Update the filter model to use 'contains'
    props.parentFilterInstance((instance: any) => {
      instance.setModel(value ? { filter: value, type: 'contains' } : null); // Set type to 'contains'
      instance.onUiChanged(); // Notify the grid to update
    });

    // Trigger the grid to refresh the filter
    props.api.onFilterChanged();
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = props.filterText || '';
    }
  }, [props.filterText]);

  return (
    <input
      ref={inputRef}
      type="text" // Text input for alphanumeric filtering
      onChange={onInputChange}
      className='w-full h-[32px] bg-white border-2 place-self-center px-1'
    />
  );
};

export default CustomInputFloatingFilter;
