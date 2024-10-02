export interface ColumnDataType {
    title: string;
    field: string;
    sortable: boolean;
    align: string;
    IsVisible: boolean;
    filter: string | boolean;
    width: number;
    cellClass: string;
    ColumnType?: number | string;
}
