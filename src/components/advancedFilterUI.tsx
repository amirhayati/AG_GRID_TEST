import React, { useState } from 'react';
import { AdvancedFilterUIType } from '../type/type';


// Define the filter model types
type FilterModel = {
  filterType: 'text' | 'number' | 'multi';
  type: string;
  filter: string | number;
};

type FilterObject = {
  [key: string]: {
    filterType: 'text' | 'number' | 'multi';
    filterModels?: FilterModel[] | null;
    type?: string;
    filter?: string | number;
  };
};



const AdvancedFilterUI = ({visible, changeVisible, data}: AdvancedFilterUIType) => {
  const [filters, setFilters] = useState<FilterObject>(data);

  // To handle changes in the filter values
  const handleFilterChange = (key: string, filterIndex: number, value: string | number, field: keyof FilterModel) => {
    const updatedFilters = { ...filters };

    // Handle multi filter case with filterModels array
    if (updatedFilters[key]?.filterModels && updatedFilters[key]?.filterModels![filterIndex]) {
      updatedFilters[key].filterModels![filterIndex] = {
        ...updatedFilters[key].filterModels![filterIndex],
        [field]: value,
      };
    } else {
      updatedFilters[key] = { ...updatedFilters[key], [field]: value };
    }

    setFilters(updatedFilters);
  };

  // Render each filter block
  const renderFilter = (filterKey: string, filter: any) => {
    if (filter.filterType === 'multi' && filter.filterModels) {
      // Handle multi filter
      return filter.filterModels.map((model: FilterModel | null, index: number) => {
        if (model) {
          return (
            <div key={index} className="filter-block">
              <h4>{filterKey} Filter Model {index + 1}</h4>
              <select
                value={model.type}
                onChange={(e) => handleFilterChange(filterKey, index, e.target.value, 'type')}
              >
                <option value="contains">Contains</option>
                <option value="equals">Equals</option>
              </select>

              <input
                type={model.filterType === 'number' ? 'number' : 'text'}
                value={model.filter}
                onChange={(e) =>
                  handleFilterChange(
                    filterKey,
                    index,
                    model.filterType === 'number' ? +e.target.value : e.target.value,
                    'filter'
                  )
                }
              />
            </div>
          );
        }
        return null;
      });
    } else {
      // Handle single filter
      return (
        <div className="filter-block">
          <h4>{filterKey} Filter</h4>
          <select
            value={filter.type}
            onChange={(e) => handleFilterChange(filterKey, 0, e.target.value, 'type')}
          >
            <option value="contains">Contains</option>
            <option value="equals">Equals</option>
          </select>

          <input
            type={filter.filterType === 'number' ? 'number' : 'text'}
            value={filter.filter}
            onChange={(e) =>
              handleFilterChange(
                filterKey,
                0,
                filter.filterType === 'number' ? +e.target.value : e.target.value,
                'filter'
              )
            }
          />
        </div>
      );
    }
  };  
  
  return (
    <div className="filter-builder">
      <h3>Custom Advanced Filter Builder</h3>

      {Object.keys(filters).map((key) => (
        <div key={key} className="filter-item">
          {renderFilter(key, filters[key])}
        </div>
      ))}

      <h3>Filter Object:</h3>
      <pre>{JSON.stringify(filters, null, 2)}</pre>
    </div>
  );

  // visible &&
  // <div className='fixed z-50 w-screen h-screen flex-center overflow-scroll'>
  //   <div className='absolute blur-lg bg-black opacity-30 inset-0' onClick={()=>changeVisible(false)}/>
  //   <div className='relative bg-white rounded-md shadow-lg w-2/3 h-fit min-h-[20rem] p-8 z-10 '>
  //     {JSON.stringify(dataa)}
  //   </div>
  // </div>
};

export default AdvancedFilterUI;
