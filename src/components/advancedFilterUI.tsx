import React, { useState, useEffect } from 'react';
import { AdvancedFilterUIType } from '../type/type';
import { operatorSymbols, operators} from './advancedFilterUI/utils/operators.ts'

// Initial filter data structure
const initialFilterGroup = {
  logic: 'AND',
  conditions: [],
};

const AdvancedFilterUI = ({ visible, changeVisible, object, columnData }: AdvancedFilterUIType) => {
  const [filterGroup, setFilterGroup] = useState(initialFilterGroup);

  useEffect(() => {
    if (object && Object.keys(object).length > 0) {
        const newConditions = Object.entries(object).map(([field, filter]) => {
            const { filterType, type } = filter;

            const condition = {
                field,
                operator: operatorSymbols[type] || type, // Use the symbol mapping
                type: filterType,
            };

            // For date type, include dateFrom
            if (filterType === 'date') {
                condition.dateFrom = filter.dateFrom || '';
            } else if (filterType === 'set') {
                condition.value = filter.values[0];
            } else if (filterType === 'multi') {
                const validModels = filter.filterModels.filter(model => model !== null);
                condition.operator = validModels[0]?.type || 'contains';
                condition.value = validModels[0]?.filter || '';
            } else {
                condition.value = filter.filter;
            }

            return condition;
        });
        setFilterGroup({ logic: 'AND', conditions: newConditions });
    } else {
        setFilterGroup(initialFilterGroup);
    }
  }, [object]);



  const updateCondition = (index: number, key: string, value: string | number) => {
    const updatedConditions = [...filterGroup.conditions];

    if (key === 'field') {
      const selectedField = columnData.find((field) => field.field === value);

      const newType = selectedField?.filter === 'agBooleanColumnFilter'
        ? 'boolean'
        : selectedField?.filter === 'agNumberColumnFilter'
        ? 'number'
        : selectedField?.filter === 'agDateColumnFilter'
        ? 'date'
        : selectedField?.filter === 'agSetColumnFilter'
        ? 'boolean'
        : 'text';

      const newOperator = newType === 'boolean' ? 'is' : operators.text[0].symbol; // Use the symbol
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

    setFilterGroup({ ...filterGroup, conditions: updatedConditions });
  };

  const addFilter = () => {
    const newFilter = { field: '', operator: 'contains', value: '', type: 'text' };
    setFilterGroup({ ...filterGroup, conditions: [...filterGroup.conditions, newFilter] });
  };

  const removeFilter = (index: number) => {
    const newConditions = [...filterGroup.conditions];
    newConditions.splice(index, 1);
    setFilterGroup({ ...filterGroup, conditions: newConditions });
  };

  const getChangedFilterData = () => {
    const filterData: any = {};

    filterGroup.conditions.forEach((condition) => {
      const { field, operator, value, type, dateFrom } = condition;
      if (field) {
        if (type === 'date') {
          filterData[field] = {
            filterType: 'date',
            type: operator,
            dateFrom,
          };
        } else if (type === 'boolean') {
          if (!filterData[field]) {
            filterData[field] = {
              filterType: 'set',
              type: operator,
              values: [],
            };
          }
          if (value) {
            filterData[field].values.push(value);
          }
        } else {
          filterData[field] = {
            filterType: type,
            type: operator,
            filter: value,
          };
        }
      }
    });

    return filterData;
  };

  return (
    visible && (
      <div className='fixed z-50 w-screen h-screen flex-center overflow-scroll'>
        <div className='absolute inset-0 z-10' onClick={() => changeVisible(false)} />
        
        <div className="filter-builder w-3/4 max-h-[80vh] overflow-y-scroll z-20">
          <div className="filter-group">
            <select
              value={filterGroup.logic}
              onChange={(e) => setFilterGroup({ ...filterGroup, logic: e.target.value })}
              className='mb-4'
            >
              <option value="AND">AND</option>
              <option value="OR">OR</option>
            </select>

            {filterGroup.conditions.length === 0 && (
              <button className='circleBtn' onClick={addFilter}>+</button>
            )}

            {filterGroup.conditions.map((condition, index) => (
              <div key={index} className="filter-condition">
                <div className="filter-condition-selections">
                  <select
                    value={condition.field}
                    onChange={(e) => updateCondition(index, 'field', e.target.value)}
                  >
                    <option value="">Select your column</option>
                    {columnData.map((field) => (
                      <option key={field.field} value={field.field}>
                        {field.field}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    value={condition.operator} // Keep the operator value set correctly
                    onChange={(e) => updateCondition(index, 'operator', e.target.value)}
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
                        {symbol} {/* Use symbol from the mapping */}
                      </option>
                    ))}
                  </select>

                  {condition.type === 'date' ? (
                    <div className="date-filters">
                      <input
                        type="date"
                        value={condition.dateFrom || ''}
                        onChange={(e) => updateCondition(index, 'dateFrom', e.target.value)}
                        placeholder="From Date"
                      />
                    </div>
                  ) : condition.type === 'boolean' ? (
                    <select
                      value={condition.value || ''}
                      onChange={(e) => updateCondition(index, 'value', e.target.value)}
                    >
                      <option value="">Select boolean</option>
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  ) : (
                    <input
                      type={condition.type === 'number' ? 'number' : 'text'}
                      value={condition.value}
                      onChange={(e) => updateCondition(index, 'value', condition.type === 'number' ? Number(e.target.value) : e.target.value)}
                    />
                  )}
                </div>

                <div className="filter-condition-btn">
                  <button className='circleBtn' onClick={() => removeFilter(index)}>-</button>
                  <button className='circleBtn'onClick={() => addFilter()}>+</button>
                </div>
              </div>
            ))}

            <div className="actions">
              <button className='btn' onClick={() => changeVisible(false)}>Apply</button>
              <button className='btn' onClick={() => changeVisible(false)}>Cancel</button>
            </div>
          </div>

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
