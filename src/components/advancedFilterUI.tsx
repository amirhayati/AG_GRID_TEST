import React, { useState, useEffect } from 'react';
import { AdvancedFilterUIType } from '../type/type';

// Operators based on field types
const operators = {
  number: ['=', '!=', '>', '>=', '<', '<=', 'is blank', 'is not blank'],
  text: ['contains', 'does not contain', 'equals', 'does not equal', 'begins with', 'ends with', 'is blank', 'is not blank'],
  date: ['=', '!=', '>', '>=', '<', '<=', 'is blank', 'is not blank'],
  multiColumn: ['equals', 'does not equal'],
};

const AdvancedFilterUI = ({ visible, changeVisible, object = {}, columnData = [] }: AdvancedFilterUIType) => {
  // Initialize filter group using object.mission conditions
  const initialFilterGroup = {
    logic: 'AND', // Logic: AND / OR
    conditions: object.mission?.filterModels
      ? object.mission.filterModels
          .filter((model) => model !== null) // Remove null values
          .map(({ filterType, type, filter }, index) => ({
            field: columnData[index]?.field || '', // Set default field from columnData
            operator: type || '', // Use the type as operator
            value: filter || '', // Use filter as value
            type: filterType || 'text', // Use filterType as type (default to 'text')
          }))
      : [],
  };

  const [filterGroup, setFilterGroup] = useState(initialFilterGroup);

  // Effect to update filterGroup when object or columnData changes
  useEffect(() => {
    const newConditions = object.mission?.filterModels
      ? object.mission.filterModels
          .filter((model) => model !== null)
          .map(({ filterType, type, filter }, index) => ({
            field: columnData[index]?.field || '', // Ensure field is set correctly from columnData
            operator: type || '',
            value: filter || '',
            type: filterType || 'text',
          }))
      : [];
    
    setFilterGroup({ ...filterGroup, conditions: newConditions });
  }, [object, columnData]);

  // Handler for updating a condition
  const updateCondition = (index: number, key: string, value: string | number) => {
    const updatedConditions = [...filterGroup.conditions];
    updatedConditions[index] = { ...updatedConditions[index], [key]: value };
    setFilterGroup({ ...filterGroup, conditions: updatedConditions });
  };

  // Handle adding a new filter
  const addFilter = (index?: number) => {
    const newFilter = { field: columnData[0]?.field || '', operator: 'contains', value: '', type: 'text' };
    const updatedConditions = index !== undefined 
      ? [...filterGroup.conditions.slice(0, index + 1), newFilter, ...filterGroup.conditions.slice(index + 1)] 
      : [...filterGroup.conditions, newFilter];

    setFilterGroup({ ...filterGroup, conditions: updatedConditions });
  };

  // Handle removing a filter
  const removeFilter = (index: number) => {
    const newConditions = [...filterGroup.conditions];
    newConditions.splice(index, 1);
    setFilterGroup({ ...filterGroup, conditions: newConditions });
  };

  // Function to transform filterGroup into the desired data format
  const getChangedFilterData = () => {
    const filterData: any = {};

    filterGroup.conditions.forEach(({ field, operator, value, type }) => {
      if (field) {
        filterData[field.toLowerCase()] = {
          filterType: type,
          type: operator,
          filter: value,
        };
      }
    });

    return filterData;
  };

  return (
    visible && (
      <div className='fixed z-50 w-screen h-screen flex-center overflow-scroll'>
        <div className='absolute inset-0 z-10' onClick={() => changeVisible(false)} />
        
        <div className="filter-builder w-3/4 z-20">
          <div className="filter-group">
            <select
              value={filterGroup.logic}
              onChange={(e) => setFilterGroup({ ...filterGroup, logic: e.target.value })}
              className='mb-4'
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>

            {filterGroup.conditions.map((condition, index) => (
              <div key={index} className="filter-condition">
                <select
                  value={condition.field}
                  onChange={(e) => updateCondition(index, 'field', e.target.value)}
                >
                  {columnData.map((field) => (
                    <option key={field.field} value={field.field}>
                      {field.field}
                    </option>
                  ))}
                </select>

                <select
                  value={condition.operator}
                  onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                >
                  {(operators[condition.type] || operators.text).map((operator) => (
                    <option key={operator} value={operator}>
                      {operator}
                    </option>
                  ))}
                </select>

                <input
                  type={condition.type === 'number' ? 'number' : 'text'}
                  value={condition.value}
                  onChange={(e) => updateCondition(index, 'value', condition.type === 'number' ? Number(e.target.value) : e.target.value)}
                />

                <button className='btn' onClick={() => removeFilter(index)}>-</button>
                <button className='btn' onClick={() => addFilter(index)}>+</button>
              </div>
            ))}

            <div className="actions">
              <button className='btn' onClick={() => changeVisible(false)}>Apply</button>
              <button className='btn' onClick={() => changeVisible(false)}>Cancel</button>
            </div>
          </div>

          {/* Show the latest changed filter data object */}
          <div className="filter-data">
            <h3>Changed Filter Data Object:</h3>
            <pre>{JSON.stringify(getChangedFilterData(), null, 2)}</pre>
          </div>
        </div>
      </div>
    )
  );
};

export default AdvancedFilterUI;
