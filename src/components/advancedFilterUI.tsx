import React, { useState, useEffect } from 'react';
import { operatorSymbols, operators } from './advancedFilterUI/utils/operators.ts';
import { AdvancedFilterUIType, Condition, FilterGroup } from './advancedFilterUI/type/type.ts';
import { ImBlocked } from 'react-icons/im';

const initialFilterGroup: FilterGroup = {
  logic: 'AND',
  conditions: [{ field: '', operator: '', value: '', type: 'text', dateFrom: '' }],
};

const AdvancedFilterUI = ({
  visible,
  changeVisible,
  object,
  columnData,
  onFilterChange,
}: AdvancedFilterUIType) => {
  const [filterGroups, setFilterGroups] = useState<FilterGroup[]>([initialFilterGroup]);

  const filteredColumnData = columnData.filter((column) => column.floatingFilter === 'true');

  useEffect(() => {
    if (object && Object.keys(object).length > 0) {
      const newConditions = Object.entries(object).flatMap(([field, filters]: [string, any[]]) => {
        return filters.map((filter: any) => {
          const { filterType, type, filter: filterValue } = filter;
          const condition: Condition = {
            field,
            operator: operatorSymbols[type] || type,
            type: filterType,
            value: filterValue || '',
          };
          return condition;
        });
      });

      // Prevent duplicate conditions by checking existing filterGroups
      const uniqueConditions = newConditions.filter((condition, index, self) =>
        self.findIndex(
          (c) =>
            c.field === condition.field &&
            c.operator === condition.operator &&
            c.value === condition.value
        ) === index
      );

      if (uniqueConditions.length > 0) {
        setFilterGroups([{ logic: 'AND', conditions: uniqueConditions }]);
      }
    }
  }, [object, columnData]);

  const addCondition = (groupIndex: number) => {
    const newCondition: Condition = { field: '', operator: '', value: '', type: 'text', dateFrom: '' };
    const updatedGroups = [...filterGroups];
    const groupConditions = updatedGroups[groupIndex].conditions;
  
    // Check if the new condition already exists in the group (based on field, operator, and value)
    const isDuplicate = groupConditions.some(
      (condition) =>
        condition.field === newCondition.field &&
        condition.operator === newCondition.operator &&
        condition.value === newCondition.value
    );
  
    // Only add the new condition if it is not a duplicate
    if (!isDuplicate) {
      updatedGroups[groupIndex].conditions.push(newCondition);
    }
  
    setFilterGroups(updatedGroups);
  };

  const removeCondition = (groupIndex: number, index: number) => {
    const updatedGroups = [...filterGroups];
    updatedGroups[groupIndex].conditions.splice(index, 1); // Remove the specified condition

    // Check if there are no conditions left in the group
    if (updatedGroups[groupIndex].conditions.length === 0) {
      updatedGroups.splice(groupIndex, 1); // If no conditions left, remove the group
    }

    setFilterGroups(updatedGroups); // Update the state with the modified groups
  };

  const addFilterGroup = () => {
    const newGroup: FilterGroup = {
      logic: 'AND',
      conditions: [{ field: '', operator: '', value: '', type: 'text', dateFrom: '' }],
    };

    const updatedGroups = [...filterGroups];

    // Check if the new group already exists in the filterGroups
    const isDuplicateGroup = updatedGroups.some(
      (group) => group.conditions.every((condition, index) =>
        condition.field === newGroup.conditions[index]?.field &&
        condition.operator === newGroup.conditions[index]?.operator &&
        condition.value === newGroup.conditions[index]?.value
      )
    );

    if (!isDuplicateGroup) {
      setFilterGroups([...updatedGroups, newGroup]);
    }
  };

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

      const newOperator = newType === 'boolean' ? operators.boolean[0].symbol : operators.text[0].symbol;
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

  const getChangedFilterData = () => {
    const filterData = filterGroups.map((group) => {
      const uniqueConditions = group.conditions.filter(
        (condition, index, self) =>
          self.findIndex(
            (c) =>
              c.field === condition.field &&
              c.operator === condition.operator &&
              c.value === condition.value
          ) === index
      );

      return {
        filterType: group.conditions[0]?.type || 'text', // Set default filter type if conditions are empty
        operator: group.logic, // Use logic (AND/OR)
        conditions: uniqueConditions.map((condition) => ({
          field: condition.field,
          filterType: condition.type, // Type of the filter
          type: condition.operator, // Type of operation (contains, equals, etc.)
          filter: condition.value, // The value to filter on
        })).filter((condition) => condition.filter !== ''), // Exclude empty filters
      };
    });

    return filterData;
  };

  const handleSubmit = () => {
    const filterData = getChangedFilterData();

    // Pass the filter data back to the parent
    onFilterChange(filterData);

    // Close the modal after submission
    changeVisible(false);
  };

  return (
    visible && (
      <div className="fixed z-50 w-screen h-screen flex-center overflow-scroll">
        <div className="absolute inset-0 z-10" onClick={() => changeVisible(false)} />

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
                className="mb-4"
              >
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>

              {group.conditions.map((condition, index) => (
                <div key={index} className="filter-condition">
                  <div className="filter-condition-selections">
                    <select
                      value={condition.field}
                      onChange={(e) => updateCondition(groupIndex, index, 'field', e.target.value)}
                    >
                      <option value="">Select your column</option>
                      {filteredColumnData.map((field) => (
                        <option key={field.field} value={field.field}>
                          {field.field}
                        </option>
                      ))}
                    </select>

                    <select
                      value={condition.operator}
                      onChange={(e) => updateCondition(groupIndex, index, 'operator', e.target.value)}
                    >
                      {(condition.field === ''
                        ? [{ symbol: 'Select field' }]
                        : condition.type === 'number'
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

                    {condition.operator === '' ? (
                      <ImBlocked />
                    ) : condition.type === 'date' ? (
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
                        onChange={(e) =>
                          updateCondition(groupIndex, index, 'value', condition.type === 'number' ? Number(e.target.value) : e.target.value)
                        }
                      />
                    )}
                  </div>

                  <div className="filter-condition-btn">
                    <button className="circleBtn" onClick={() => removeCondition(groupIndex, index)}>
                      -
                    </button>
                    <button className="circleBtn" onClick={() => addCondition(groupIndex)}>
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <button className="actionsBtn" onClick={addFilterGroup}>
            Add Filter Group
          </button>

          <div className="actions">
            <button className="actionsBtn" onClick={handleSubmit}>
              Submit
            </button>
            <button className="actionsBtn" onClick={() => changeVisible(false)}>
              Cancel
            </button>
          </div>

          <div className="filter-data">
            <pre>{JSON.stringify(getChangedFilterData(), null, 2)}</pre>
          </div>
        </div>
      </div>
    )
  );
};

export default AdvancedFilterUI;
