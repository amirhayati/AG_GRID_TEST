
import { AgGridReact } from 'ag-grid-react';

export interface ColumnStateType {
    align: string;
    cellClass: string;
    field: string;
    filter: string;
    floatingFilter: boolean;
    headerName: string;
    lockPosition: boolean;
    minWidth: number;
    order: number | null;
    sortable: boolean;
}

export interface ColumnDataType {
    IsVisible: boolean;
    field: string;
    title?: string;
    sortable?: boolean;
    align?: string;
    width?: number;
    cellClass?: string;
    ColumnType?: number | string;
    OrderId?: number | null;
    filter?: string | boolean;
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

interface PageSize {
    val: number;
}

export interface FooterType {
    rowLength: number;
    onRowChange: (start: number, end: number) => void;
    arrayOfPageSiteValue?: PageSize[];
}

export interface FilterModelType {
    filterType: string;
    type: string;
    filter?: string | number;
    dateFrom?: string;
    dateTo?: string;
    filterModels?: Array<FilterModelType | null>;
};
  
export interface AdvancedFilterConditionType {
    filterType: string;
    colId: string;
    type: string;
    filter?: string | number;
    dateFrom?: string;
    dateTo?: string;
};
  
export interface AdvancedFilterModelType {
    filterType: "join";
    type: "AND";
    conditions: Array<AdvancedFilterConditionType | { filterType: string; type: "OR"; conditions: AdvancedFilterConditionType[] }>;
};

export interface AdvancedFilterUIType {
    visible: boolean;
    object: any;
    changeVisible: React.Dispatch<React.SetStateAction<boolean>>
    onFilterChange:(newFilterModel: any) => void;
    columnData: ColumnStateType[]
}

export interface ConditionType {
    field: string;      // The name of the field/column to be filtered.
    operator: string;   // The operator for the condition (e.g., equals, contains, greater than).
    value: string | number | boolean;  // The value being compared in the condition.
    type: string;       // The type of the field (e.g., text, number, date, boolean).
    dateFrom?: string;  // Optional date value, used when the type is 'date'.
}
  

export interface FilterConditionType {
    field: string;
    operator: string;
    value: string | number;
    type: 'number' | 'text';
  }
  
export interface FilterGroupType {
    logic: 'AND' | 'OR';
    conditions: FilterConditionType[];
  }