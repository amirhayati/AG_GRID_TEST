const ConvertToAdvancedFilterModel = (floatingFilter) => {
  const advancedFilterModel = {
      filterType: "join",
      type: "AND",
      conditions: [],
  };

  const convertCondition = (condition, colId) => {
      const { filterType, type, filter, dateFrom, dateTo } = condition;
      const baseCondition = { filterType, colId };

      if (filterType === "date") {
          return {
              ...baseCondition,
              type,
              dateFrom,
              dateTo,
          };
      }

      return {
          ...baseCondition,
          type,
          filter,
      };
  };

  Object.keys(floatingFilter).forEach((colId) => {
      const filterData = floatingFilter[colId];

      if (filterData.filterType === "multi" && filterData.filterModels) {
          const validModels = filterData.filterModels.filter(model => model !== null);

          if (validModels.length > 0) {
              const filterConditions = validModels.flatMap(filterModel => {
                  if (filterModel.conditions) {
                      return filterModel.conditions.map(condition => convertCondition(condition, colId));
                  }
                  return [convertCondition(filterModel, colId)];
              });

              // Create a multi filter condition
              const multiFilter = {
                  filterType: "join",
                  type: filterData.operator || "OR", // Default to OR if no operator specified
                  conditions: filterConditions,
              };

              advancedFilterModel.conditions.push(multiFilter);
          }
      } else if (filterData.filterType === "text" || filterData.filterType === "number") {
          // Handle single filters for text and number types
          const singleFilter = convertCondition(filterData, colId);
          advancedFilterModel.conditions.push(singleFilter);
      } else if (filterData.filterType === "date") {
          // Handle date filter
          const dateFilter = convertCondition(filterData, colId);
          advancedFilterModel.conditions.push(dateFilter);
      }
  });

  return advancedFilterModel;
};

export default ConvertToAdvancedFilterModel;
