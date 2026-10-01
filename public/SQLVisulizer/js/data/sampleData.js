/**
 * Sample database tables for the SQL Query Visualizer
 */

export const TABLES = {
  employees: {
    name: 'employees',
    columns: ['id', 'name', 'department_id', 'salary', 'hire_date'],
    rows: [
      { id: 1, name: 'Alice Johnson', department_id: 1, salary: 75000, hire_date: '2020-03-15' },
      { id: 2, name: 'Bob Smith', department_id: 2, salary: 62000, hire_date: '2019-07-22' },
      { id: 3, name: 'Carol Williams', department_id: 1, salary: 81000, hire_date: '2018-01-10' },
      { id: 4, name: 'David Brown', department_id: 3, salary: 55000, hire_date: '2021-06-01' },
      { id: 5, name: 'Eve Davis', department_id: 2, salary: 68000, hire_date: '2020-11-30' },
      { id: 6, name: 'Frank Miller', department_id: null, salary: 45000, hire_date: '2022-02-14' },
      { id: 7, name: 'Grace Lee', department_id: 3, salary: 92000, hire_date: '2017-09-05' },
      { id: 8, name: 'Henry Wilson', department_id: 1, salary: 58000, hire_date: '2021-04-18' },
    ],
  },

  departments: {
    name: 'departments',
    columns: ['id', 'name', 'location'],
    rows: [
      { id: 1, name: 'Engineering', location: 'New York' },
      { id: 2, name: 'Marketing', location: 'Chicago' },
      { id: 3, name: 'Sales', location: 'San Francisco' },
      { id: 4, name: 'HR', location: 'Boston' },
    ],
  },

  projects: {
    name: 'projects',
    columns: ['id', 'name', 'department_id', 'budget'],
    rows: [
      { id: 1, name: 'Website Redesign', department_id: 1, budget: 50000 },
      { id: 2, name: 'Ad Campaign', department_id: 2, budget: 30000 },
      { id: 3, name: 'CRM Upgrade', department_id: 3, budget: 120000 },
      { id: 4, name: 'Mobile App', department_id: 1, budget: 80000 },
      { id: 5, name: 'Training Program', department_id: 4, budget: 15000 },
    ],
  },

  employee_projects: {
    name: 'employee_projects',
    columns: ['employee_id', 'project_id', 'role'],
    rows: [
      { employee_id: 1, project_id: 1, role: 'Lead Developer' },
      { employee_id: 1, project_id: 4, role: 'Architect' },
      { employee_id: 3, project_id: 1, role: 'Developer' },
      { employee_id: 3, project_id: 4, role: 'Developer' },
      { employee_id: 5, project_id: 2, role: 'Manager' },
      { employee_id: 7, project_id: 3, role: 'Lead' },
      { employee_id: 2, project_id: 2, role: 'Analyst' },
    ],
  },
};

export function getTable(name) {
  const key = name.toLowerCase();
  if (!TABLES[key]) return null;
  return {
    ...TABLES[key],
    rows: TABLES[key].rows.map((r) => ({ ...r })),
  };
}

export function getAllTableNames() {
  return Object.keys(TABLES);
}

export function cloneRows(rows) {
  return rows.map((r) => ({ ...r }));
}
