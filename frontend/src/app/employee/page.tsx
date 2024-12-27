'use client';

import { useEffect, useState } from 'react';
import api from '../../utils/api';

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
}

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id'>>({
    name: '',
    email: '',
    position: '',
  });
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const { data } = await api.get<Employee[]>('/employees');
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setErrorMessage('Failed to fetch employees.');
    }
  };

  // Create a new employee
  const createEmployee = async () => {
    try {
      await api.post('/employees', newEmployee);
      setNewEmployee({ name: '', email: '', position: '' }); // Reset form
      fetchEmployees(); // Refresh the employee list
    } catch (error) {
      console.error('Error creating employee:', error);
      setErrorMessage('Failed to create employee.');
    }
  };

  // Update an existing employee
  const updateEmployee = async (id: string) => {
    try {
      await api.put(`/employees/${id}`, selectedEmployee);
      setSelectedEmployee(null); // Deselect employee
      fetchEmployees(); // Refresh the employee list
    } catch (error) {
      console.error('Error updating employee:', error);
      setErrorMessage('Failed to update employee.');
    }
  };

  // Delete an employee
  const deleteEmployee = async (id: string) => {
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees(); // Refresh the employee list
    } catch (error) {
      console.error('Error deleting employee:', error);
      setErrorMessage('Failed to delete employee.');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {/* Employee List */}
      <h2 className="text-xl font-bold mt-4">Employee List</h2>
      <ul className="list-disc pl-5">
        {employees.map(employee => (
          <li key={employee.id} className="mb-2">
            <div className="flex justify-between">
              <span>
                {employee.name} - {employee.position} ({employee.email})
              </span>
              <div>
                <button
                  onClick={() => setSelectedEmployee(employee)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteEmployee(employee.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Add New Employee */}
      <h2 className="text-xl font-bold mt-4">Add New Employee</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={newEmployee.name}
          onChange={e => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
          className="border p-2 mr-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={newEmployee.email}
          onChange={e => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Position"
          value={newEmployee.position}
          onChange={e => setNewEmployee(prev => ({ ...prev, position: e.target.value }))}
          className="border p-2 mr-2"
        />
        <button onClick={createEmployee} className="bg-green-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      {/* Update Employee */}
      {selectedEmployee && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Edit Employee</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Name"
              value={selectedEmployee.name}
              onChange={e => setSelectedEmployee(prev => prev && { ...prev, name: e.target.value })}
              className="border p-2 mr-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={selectedEmployee.email}
              onChange={e => setSelectedEmployee(prev => prev && { ...prev, email: e.target.value })}
              className="border p-2 mr-2"
            />
            <input
              type="text"
              placeholder="Position"
              value={selectedEmployee.position}
              onChange={e => setSelectedEmployee(prev => prev && { ...prev, position: e.target.value })}
              className="border p-2 mr-2"
            />
            <button
              onClick={() => updateEmployee(selectedEmployee.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setSelectedEmployee(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
