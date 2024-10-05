import { AdvancedFilterConditionType, AdvancedFilterModelType, FilterModelType } from "../type/type";

const ConvertToAdvancedFilterModel = (filterModel: Record<string, FilterModelType | null>): AdvancedFilterModelType => {
    const conditions: AdvancedFilterConditionType[] = [];
  
    for (const [key, value] of Object.entries(filterModel)) {
      if (value) {
        const { filterType, type } = value;
  
        switch (filterType) {
          case "multi":
            if (Array.isArray(value.filterModels)) {
              const subConditions = value.filterModels
                .filter((model): model is FilterModelType => model !== null) 
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
  
          default:
            console.warn(`Unsupported filterType: ${filterType}`);
        }
      }
    }
  
    return {
      filterType: "join",
      type: "AND",
      conditions: conditions,
    };
  };
  
  export default ConvertToAdvancedFilterModel;
  