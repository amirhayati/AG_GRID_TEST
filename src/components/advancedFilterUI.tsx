import React, { useState, useEffect } from 'react';
import { AdvancedFilterUIType } from '../type/type';
import { operatorSymbols, operators } from './advancedFilterUI/utils/operators.ts';

// Initial filter group structure
interface Condition {
  field: string;
  operator: string;
  value: string | number;
  type: string;
  dateFrom?: string;
}

interface FilterGroup {
  logic: 'AND' | 'OR';
  conditions: Condition[];
}

const initialFilterGroup: FilterGroup = {
  logic: 'AND',
  conditions: [],
};

const initialFilterGroups: FilterGroup[] = [initialFilterGroup]; // Start with one filter group

const AdvancedFilterUI = ({
  visible,
  changeVisible,
  object,
  columnData,
}: AdvancedFilterUIType) => {
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>(initialFilterGroups);

  useEffect(() => {
    if (object && Object.keys(object).length > 0) {
      const newConditions = Object.entries(object).flatMap(([field, filter]: [string, any]) => { // Change made here
        const { filterType, type } = filter;
  
        const condition: Condition = {
          field,
          operator: operatorSymbols[type] || type,
          type: filterType,
          value: filter.filter || '',
        };
  
        // Handle specific filter types
        if (filterType === 'date') {
          condition.dateFrom = filter.dateFrom || '';
        } else if (filterType === 'set') {
          condition.value = filter.values[0] || '';
          if (type === 'boolean') {
            condition.operator = operators.boolean[0].symbol;
          }
        } else if (filterType === 'multi') {
          const validModels = filter.filterModels.filter((model) => model !== null);
          condition.operator = validModels[0]?.type || 'contains';
          condition.value = validModels[0]?.filter || '';
        }
  
        return [condition];
      });
      setFilterGroups([{ logic: 'AND', conditions: newConditions }]);
    } else {
      setFilterGroups(initialFilterGroups);
    }
  }, [object]);
  

  const updateCondition = (
    groupIndex: number,
    index: number,
    key: keyof Condition,
    value: string | number
  ) => {
    const updatedGroups = [...filterGroups];
    const updatedConditions = [...updatedGroups[groupIndex].conditions];

    if (key === 'field') {
      const selectedField = columnData.find((field) => field.field === value);

      const newType =
        selectedField?.filter === 'agBooleanColumnFilter'
          ? 'boolean'
          : selectedField?.filter === 'agNumberColumnFilter'
          ? 'number'
          : selectedField?.filter === 'agDateColumnFilter'
          ? 'date'
          : selectedField?.filter === 'agSetColumnFilter'
          ? 'boolean'
          : 'text';

      const newOperator =
        newType === 'boolean' ? operators.boolean[0].symbol : operators.text[0].symbol;
      const newValue = newType === 'boolean' ? 'true' : '';

      updatedConditions[index] = {
        field: value,
        operator: newOperator,
        value: newValue,
        type: newType,
        dateFrom: newType === 'date' ? '' : undefined,
      };
    } else {
      updatedConditions[index] = { ...updatedConditions[index], [key]: value };
    }

    updatedGroups[groupIndex].conditions = updatedConditions;
    setFilterGroups(updatedGroups);
  };

  const addCondition = (groupIndex: number) => {
    const newCondition: Condition = { field: '', operator: 'contains', value: '', type: 'text', dateFrom: '' };
    const updatedGroups = [...filterGroups];
    updatedGroups[groupIndex].conditions.push(newCondition);
    setFilterGroups(updatedGroups);
  };

  const removeCondition = (groupIndex: number, index: number) => {
    const updatedGroups = [...filterGroups];
    updatedGroups[groupIndex].conditions.splice(index, 1);
    setFilterGroups(updatedGroups);
  };

  const addFilterGroup = () => {
    const newGroup: FilterGroup = { logic: 'AND', conditions: [] };
    setFilterGroups([...filterGroups, newGroup]);
  };

  const getChangedFilterData = () => {
    const filterData: Record<string, any> = {};

    filterGroups.forEach((group) => {
      group.conditions.forEach((condition) => {
        const { field, operator, value, type, dateFrom } = condition;
        if (field) {
          if (type === 'date') {
            if (!filterData[field]) {
              filterData[field] = { filterType: 'date', dateRanges: [] };
            }
            filterData[field].dateRanges.push({ dateFrom, type: operator });
          } else if (type === 'boolean') {
            if (!filterData[field]) {
              filterData[field] = { filterType: 'set', type: operator, values: new Set() };
            }
            if (value) {
              filterData[field].values.add(value);
            }
          } else {
            if (!filterData[field]) {
              filterData[field] = { filterType: type, filters: [] };
            }
            filterData[field].filters.push({ type: operator, filter: value });
          }
        }
      });
    });

    Object.keys(filterData).forEach((field) => {
      if (filterData[field].filterType === 'set') {
        filterData[field].values = Array.from(filterData[field].values);
      }
    });

    return filterData;
  };

  return (
    visible && (
      <div className='fixed z-50 w-screen h-screen flex-center overflow-scroll'>
        <div className='absolute inset-0 z-10' onClick={() => changeVisible(false)} />
        
        <div className="filter-builder w-3/4 max-h-[80vh] overflow-y-scroll z-20">
          {filterGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="filter-group">
              <select
                value={group.logic}
                onChange={(e) => {
                  const updatedGroups = [...filterGroups];
                  updatedGroups[groupIndex].logic = e.target.value as 'AND' | 'OR';
                  setFilterGroups(updatedGroups);
                }}
                className='mb-4'
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>

              {group.conditions.length === 0 && (
                <button className='circleBtn' onClick={() => addCondition(groupIndex)}>+</button>
              )}

              {group.conditions.map((condition, index) => (
                <div key={index} className="filter-condition">
                  <div className="filter-condition-selections">
                    <select
                      value={condition.field}
                      onChange={(e) => updateCondition(groupIndex, index, 'field', e.target.value)}
                    >
                      <option value="">Select your column</option>
                      {columnData.map((field) => (
                        <option key={field.field} value={field.field}>
                          {field.field}
                        </option>
                      ))}
                    </select>
                    
                    <select
                      value={condition.operator}
                      onChange={(e) => updateCondition(groupIndex, index, 'operator', e.target.value)}
                    >
                      {(condition.type === 'number'
                        ? operators.number
                        : condition.type === 'date'
                        ? operators.date
                        : condition.type === 'boolean'
                        ? operators.boolean
                        : operators.text
                      ).map(({ symbol }) => (
                        <option key={symbol} value={symbol}>
                          {symbol}
                        </option>
                      ))}
                    </select>

                    {condition.type === 'date' ? (
                      <div className="date-filters">
                        <input
                          type="date"
                          value={condition.dateFrom || ''}
                          onChange={(e) => updateCondition(groupIndex, index, 'dateFrom', e.target.value)}
                          placeholder="From Date"
                        />
                      </div>
                    ) : condition.type === 'boolean' ? (
                      <select
                        value={condition.value || ''}
                        onChange={(e) => updateCondition(groupIndex, index, 'value', e.target.value)}
                      >
                        <option value="">Select boolean</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    ) : (
                      <input
                        type={condition.type === 'number' ? 'number' : 'text'}
                        value={condition.value}
                        onChange={(e) => updateCondition(groupIndex, index, 'value', condition.type === 'number' ? Number(e.target.value) : e.target.value)}
                      />
                    )}
                  </div>

                  <div className="filter-condition-btn">
                    <button className='circleBtn' onClick={() => removeCondition(groupIndex, index)}>-</button>
                    <button className='circleBtn' onClick={() => addCondition(groupIndex)}>+</button>
                  </div>
                </div>
              ))}

              {/* Button to add a new FilterGroup after the current one */}
              <button className='circleBtn' onClick={addFilterGroup}>+</button>
            </div>
          ))}

          <div className="actions">
            <button className='submit' onClick={() => console.log(getChangedFilterData())}>Submit</button>
            <button className='cancel' onClick={() => changeVisible(false)}>Cancel</button>
          </div>
        </div>
      </div>
    )
  );
};

export default AdvancedFilterUI;
