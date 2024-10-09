import { ColumnDataType, EntityListType, ColumnStateType } from '../type/type';

export const handleEntityData = (
  entity: EntityListType,
  setEntityData: (data: EntityListType) => void,
  setColumnData: (columns: ColumnStateType[]) => void,
  entityData?: EntityListType
) => {
  setEntityData(entity);

  const columns = entity.columns
    .filter((col: ColumnDataType) => col.IsVisible === true)
    .map((col: ColumnDataType) => ({
      headerName: col.title || col.field,
      field: col.field,
      sortable: col.sortable || false,
      align: col.align || "center",
      minWidth: col.width,
      lockPosition: !entityData?.dragableColumn,
      cellClass: col.cellClass || '',
      floatingFilter: true,
      order: col.OrderId || null,
      filter:
        col.ColumnType === 3 || col.ColumnType === 4 || ["3", "4"].includes(String(col.ColumnType))
          ? 'agTextColumnFilter'
          : (Number(col.ColumnType) >= 5 && Number(col.ColumnType) <= 12) ||
            ["5", "6", "7", "8", "9", "10", "11", "12"].includes(String(col.ColumnType))
          ? 'agNumberColumnFilter'
          : col.ColumnType === 16 || col.ColumnType === 24 || ["16", "24"].includes(String(col.ColumnType))
          ? 'agDateColumnFilter'
          : col.ColumnType === 2 || ["2"].includes(String(col.ColumnType))
          ? 'agSetColumnFilter'
          : false,
    }));

  setColumnData(columns);
};
