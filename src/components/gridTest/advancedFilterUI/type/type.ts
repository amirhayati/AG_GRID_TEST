import { ColumnStateType } from '../../../type/type.ts'

export interface AdvancedFilterUIType {
    visible: boolean;
    object: any;
    changeVisible: React.Dispatch<React.SetStateAction<boolean>>
    onFilterChange:(newFilterModel: any) => void;
    columnData: ColumnStateType[]
}

export interface Condition {
    field: string;
    operator: string;
    value: string | number;
    type: string;
    dateFrom?: string;
  }
  
 export interface FilterGroup {
    logic: 'AND' | 'OR';
    conditions: Condition[];
  }