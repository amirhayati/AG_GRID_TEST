import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { AG_GRID_LOCALE_IR } from '@ag-grid-community/locale';
import { ColumnDataType, ColumnStateType, EntityListType } from './type/type';
import Footer from './componet/footer/footer.tsx';

const Home: React.FC = () => {
  const [columnData, setColumnData] = useState<ColumnStateType[]>([]);
  const [entityData, setEntityData] = useState<EntityListType>();
  const [rowData] = useState<any[]>([]);
  const numberOfRow: number = 2;

  // ------ handle upload file ---------
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (!event?.target?.files) {
      console.error("No file selected or event object is undefined");
      return; 
    }

    const file = event.target.files[0]; 
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);

          if (jsonData.Entity && jsonData.Entity.columns) {
            setEntityData(jsonData.Entity)

            console.log(jsonData.Entity.columns)
            // ------ Map columns to AG Grid format ---------
            const columns = jsonData.Entity.columns
              .filter((col: ColumnDataType) => col.IsVisible === true)
              .map((col: ColumnDataType) => ({
                headerName: col.title || col.field,
                field: col.field,
                sortable: col.sortable || false,
                align: col.align || "center",
                minWidth: col.width,
                lockPosition: !entityData?.dragableColumn, // Dragable Column
                cellClass: col.cellClass || '',
                floatingFilter: true,
                order: col.OrderId || null,
                filter: 
                  col.ColumnType === 3 || col.ColumnType === 4 || ["3", "4"].includes(String(col.ColumnType)) 
                    ? 'agTextColumnFilter' 
                    : (Number(col.ColumnType) >= 5 && Number(col.ColumnType) <= 12) || ["5", "6", "7", "8", "9", "10", "11", "12"].includes(String(col.ColumnType)) 
                    ? 'agNumberColumnFilter' 
                    : col.ColumnType === 16 || col.ColumnType === 24 || ["16", "24"].includes(String(col.ColumnType))  
                    ? 'agDateColumnFilter' 
                    : col.ColumnType === 2 || ["2"].includes(String(col.ColumnType))
                    ? 'agSetColumnFilter'
                    : false,
            }));

            console.log(columns)
            setColumnData(columns);
          } else {
            console.error('Invalid JSON structure');
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };

      reader.readAsText(file);
    } else {
      console.error("File is not selected");
    }
  };

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
    };
  }, []);

  return (
    <>
      <input 
        type="file" 
        accept=".json, .txt" 
        onChange={handleFileUpload}
      />

      <div 
        style={{width:'100wh', height:'90vh'}}
        className={`ag-theme-quartz`}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnData}
          pagination={false} // Disable AG Grid pagination since we are using custom pagination
          localeText={AG_GRID_LOCALE_IR}
          defaultColDef={defaultColDef}
          pivotMode={false}
        />
      </div>

      {/* Custom Footer */}
      <Footer 
        numberOfRow={numberOfRow}
        rowLength={rowData.length}
      />
    </>
  );
}

export default Home;
