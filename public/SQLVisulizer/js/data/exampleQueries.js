/**
 * Preloaded example queries for learning
 */

export const EXAMPLE_QUERIES = [
  {
    label: 'Basic SELECT',
    description: 'Retrieve all columns from a table',
    sql: 'SELECT * FROM employees;',
  },
  {
    label: 'SELECT with WHERE',
    description: 'Filter rows by a condition',
    sql: `SELECT name, salary
FROM employees
WHERE salary > 60000;`,
  },
  {
    label: 'INNER JOIN',
    description: 'Match rows from two tables',
    sql: `SELECT e.name, d.name AS department, d.location
FROM employees e
INNER JOIN departments d ON e.department_id = d.id;`,
  },
  {
    label: 'LEFT JOIN',
    description: 'Keep all rows from the left table',
    sql: `SELECT e.name, d.name AS department
FROM employees e
LEFT JOIN departments d ON e.department_id = d.id;`,
  },
  {
    label: 'RIGHT JOIN',
    description: 'Keep all rows from the right table',
    sql: `SELECT e.name, d.name AS department
FROM employees e
RIGHT JOIN departments d ON e.department_id = d.id;`,
  },
  {
    label: 'FULL OUTER JOIN',
    description: 'Keep all rows from both tables',
    sql: `SELECT e.name, d.name AS department
FROM employees e
FULL OUTER JOIN departments d ON e.department_id = d.id;`,
  },
  {
    label: 'GROUP BY & HAVING',
    description: 'Aggregate data with filtering',
    sql: `SELECT department_id, AVG(salary) AS avg_salary, COUNT(*) AS emp_count
FROM employees
GROUP BY department_id
HAVING COUNT(*) > 1;`,
  },
  {
    label: 'ORDER BY & LIMIT',
    description: 'Sort results and limit rows',
    sql: `SELECT name, salary
FROM employees
ORDER BY salary DESC
LIMIT 5;`,
  },
  {
    label: 'Multi-table JOIN',
    description: 'Join three tables together',
    sql: `SELECT e.name, p.name AS project, ep.role
FROM employees e
INNER JOIN employee_projects ep ON e.id = ep.employee_id
INNER JOIN projects p ON ep.project_id = p.id;`,
  },
];
