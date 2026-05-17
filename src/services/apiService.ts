import { OBEData, Department, Program, GA } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const getHeaders = () => {
  const token = localStorage.getItem('access');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const apiService = {
  async getAllData(): Promise<OBEData> {
    const [depts, programs, gas] = await Promise.all([
      fetch(`${BASE_URL}/departments/`, { headers: getHeaders() }).then(res => res.json()),
      fetch(`${BASE_URL}/programs/`, { headers: getHeaders() }).then(res => res.json()),
      fetch(`${BASE_URL}/gas/`, { headers: getHeaders() }).then(res => res.json()),
    ]);

    return {
      departments: depts,
      programs: programs,
      gas: gas,
    };
  },

  async updateDepartment(id: string, data: Partial<Department>): Promise<Department> {
    const response = await fetch(`${BASE_URL}/departments/${id}/`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update department');
    return response.json();
  },

  async updateProgram(id: string, data: Partial<Program>): Promise<Program> {
    const response = await fetch(`${BASE_URL}/programs/${id}/`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update program');
    return response.json();
  },
};
