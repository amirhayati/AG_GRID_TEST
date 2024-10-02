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
    OrderId: number
}

export interface EntityListType {
    title: string;
    fit: boolean;
    pagination: boolean;
    rownumbers: boolean;
    singleSelect: boolean | string;
    dragableColumn: boolean;
    WindowWidth: string;
    WindowHeight: string;
    EnableRemote: boolean;
    EnableSearch: boolean;
    DeleteConfirmMessage: string;
    EnableInsert: boolean;
    EnableUpdate: boolean | string;
    EnableDelete: boolean;
    EnableExport: boolean;
    EnableSecurity: boolean;
    DefaultPagingIndex: number;
    sortName: string;
    sortOrder: number;
    remoteFilter: boolean;
    EnableFilterBar: boolean;
    EnableHeaderContextMenu: boolean;
    IsLoad: boolean;
    Schema: string;
    EntityName: string;
    url: string;
    SaveUrl: string;
    DeleteUrl: string;
    ScriptFile: string;
    idField: string;
    IsSerialChanges: boolean;
    buttons: any[];
  }