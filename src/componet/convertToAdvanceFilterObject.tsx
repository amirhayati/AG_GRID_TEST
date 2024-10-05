import { AdvancedFilterConditionType, AdvancedFilterModelType, FilterModelType } from "../type/type";

const ConvertToAdvancedFilterModel = (filterModel: Record<string, FilterModelType | null>): AdvancedFilterModelType => {
    const conditions: AdvancedFilterConditionType[] = [];
  
    // Iterate through each filter property in the filter model
    for (const [key, value] of Object.entries(filterModel)) {
      if (value) {
        const { filterType, type } = value;
  
        // Handle specific filter types
        switch (filterType) {
          case "multi":
            if (Array.isArray(value.filterModels)) {
              const subConditions = value.filterModels
                .filter((model): model is FilterModelType => model !== null) // Remove null values with type guard
                .map((model) => ({
                  filterType: model.filterType,
                  colId: key, // Use the current key as the column ID
                  type: model.type,
                  filter: model.filter,
                }));
              conditions.push({
                filterType: "join",
                type: "OR",
                conditions: subConditions,
              });
            }
            break;
  
          case "text":
          case "number":
          case "date":
            conditions.push({
              filterType: filterType,
              colId: key,
              type: type,
              ...(filterType === "date" ? { dateFrom: value.dateFrom, dateTo: value.dateTo } : { filter: value.filter }),
            });
            break;
  
          // Handle any additional filter types as needed
          default:
            console.warn(`Unsupported filterType: ${filterType}`);
        }
      }
    }
  
    // Return the transformed structure
    return {
      filterType: "join",
      type: "AND",
      conditions: conditions,
    };
  };
  
  export default ConvertToAdvancedFilterModel;
  