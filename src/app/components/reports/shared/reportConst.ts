export const REPORT_TYPE_CLOSEDXML = 'closedXml';
export const REPORT_TYPE_MALIBU = 'malibu';
export const REPORT_TYPE_DOCX = 'docx';

export const REPORT_TYPES = [
  REPORT_TYPE_CLOSEDXML,
  REPORT_TYPE_MALIBU
];


export const DATASOURCE_TYPE_MSSQL = 'msSql';
export const DATASOURCE_TYPE_POSTGRESQL = 'postgreSql';

export const DATASOURCE_TYPES = [
  DATASOURCE_TYPE_MSSQL,
  DATASOURCE_TYPE_POSTGRESQL
];

export const CONNECTION_TYPE_CONNECTION_STRING = { name: 'connectionString', label: 'Строка подключения' }
export const CONNECTION_TYPE_HOST = { name: 'host', label: 'Хост' }

export const CONNECTION_TYPES = [
  CONNECTION_TYPE_CONNECTION_STRING,
  CONNECTION_TYPE_HOST
]


export const DATASET_TYPE_SQLQUERY = { name: 'sqlQuery', label: 'SQL запрос'};

export const DATASET_TYPES = [
  DATASET_TYPE_SQLQUERY
];


export const VARIABLE_TYPE_SELECT = { name: 'select', label: 'Список'};
export const VARIABLE_TYPE_MULTIPLE_SELECT = { name: 'multipleSelect', label: 'Список с множественным выбором'};
export const VARIABLE_TYPE_STRING = { name: 'string', label: 'Строка'};
export const VARIABLE_TYPE_DATE = { name: 'date', label: 'Дата'};
export const VARIABLE_TYPE_PERIOD = { name: 'period', label: 'Период'};

export const VARIABLE_TYPES = [
  VARIABLE_TYPE_SELECT,
  VARIABLE_TYPE_MULTIPLE_SELECT,
  VARIABLE_TYPE_STRING,
  VARIABLE_TYPE_DATE,
  VARIABLE_TYPE_PERIOD
]