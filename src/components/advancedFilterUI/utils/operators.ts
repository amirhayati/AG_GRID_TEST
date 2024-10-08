// Operator symbols used for display purposes
export const operatorSymbols = {
    equals: '=',
    notEqual: '!=',
    greaterThan: '>',
    greaterThanOrEqual: '>=',
    lessThan: '<',
    lessThanOrEqual: '<=',
    isBlank: 'is blank',
    isNotBlank: 'is not blank',
    contains: 'contains',
    doesNotContain: 'does not contain',
    beginsWith: 'begins with',
    endsWith: 'ends with',
    is: 'is',
    isNot: 'is not',
  };
  
  // Operators categorized by field types
  export const operators = {
    number: [
      { symbol: '=', name: 'Equal' },
      { symbol: '!=', name: 'Not Equal' },
      { symbol: '>', name: 'Greater than' },
      { symbol: '>=', name: 'Greater than or equal' },
      { symbol: '<', name: 'Less than' },
      { symbol: '<=', name: 'Less than or equal' },
      { symbol: 'blank', name: 'Is Blank' },
      { symbol: 'notBlank', name: 'Is Not Blank' },
    ],
    text: [
      { symbol: 'contains', name: 'Contains' },
      { symbol: 'notContains', name: 'Does Not Contain' },
      { symbol: 'equals', name: 'Equals' },
      { symbol: 'notEqual', name: 'Does Not Equal' },
      { symbol: 'startsWith', name: 'Begins With' },
      { symbol: 'endsWith', name: 'Ends With' },
      { symbol: 'blank', name: 'Is Blank' },
      { symbol: 'notBlank', name: 'Is Not Blank' },
    ],
    date: [
      { symbol: '=', name: 'Equal' },
      { symbol: '!=', name: 'Not Equal' },
      { symbol: '>', name: 'Greater than' },
      { symbol: '>=', name: 'Greater than or equal' },
      { symbol: '<', name: 'Less than' },
      { symbol: '<=', name: 'Less than or equal' },
      { symbol: 'blank', name: 'Is Blank' },
      { symbol: 'notBlank', name: 'Is Not Blank' },
    ],
    boolean: [
      { symbol: 'is', name: 'Is' },
      { symbol: 'is not', name: 'Is Not' },
    ],
    multiColumn: [
      { symbol: 'equals', name: 'Equals' },
      { symbol: 'does not equal', name: 'Does Not Equal' },
    ],
  };
  