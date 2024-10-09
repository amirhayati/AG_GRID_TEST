import React, { useEffect, useRef } from 'react';
import { IFilterComp } from 'ag-grid-community';

const CustomNumberFloatingFilter: React.FC<IFilterComp> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Update the filter model to use 'greaterThan'
    updateFilterModel(value);
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.code === 'Enter') {
      const value = inputRef.current?.value || '';
      // Update the filter model when Enter is pressed
      updateFilterModel(value);

      // Clear the input field after pressing Enter
      if (inputRef.current) {
        inputRef.current.value = ''; // Clear the input field
      }
    }
  };

  const updateFilterModel = (value: string) => {
    props.parentFilterInstance((instance: any) => {
      instance.setModel(value ? { filter: Number(value), type: 'equals' } : null);
      instance.onUiChanged();
    });
    props.api.onFilterChanged(); // Notify the grid to update
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = props.filterText || '';
    }
  }, [props.filterText]);

  return (
    <input
      ref={inputRef}
      type="number"
      onChange={onInputChange}
      onKeyPress={onKeyPress} // Listen for key presses
      className='w-full h-[32px] bg-white border-2 place-self-center px-1'
    />
  );
};

export default CustomNumberFloatingFilter;
