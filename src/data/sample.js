export const SampleColumnData = [
    { field: 'mission', filter: "agTextColumnFilter", floatingFilter: 'true',},
    { field: 'company', filter: "agTextColumnFilter", floatingFilter: 'true' },
    { field: 'location', },
    { field: 'date', filter: 'agDateColumnFilter', floatingFilter: 'true' },
    { field: 'price', filter: 'agNumberColumnFilter', floatingFilter: 'true' },
    { 
      field: 'successful', 
      filter: 'agSetColumnFilter',
      floatingFilter: 'true',
      filterParams: {
          values: [true, false], 
          suppressSelectAll: true,
      }
  },
    { field: 'rocket' },
  ]