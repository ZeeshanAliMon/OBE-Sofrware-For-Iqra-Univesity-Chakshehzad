import { OBEData, Department, Program, GA } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const apiService = {
  async getAllData(): Promise<OBEData> {
    const [depts, programs, gas] = await Promise.all([
      fetch(`${BASE_URL}/departments/`).then(res => res.json()),
      fetch(`${BASE_URL}/programs/`).then(res => res.json()),
      fetch(`${BASE_URL}/gas/`).then(res => res.json()),
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update department');
    return response.json();
  },

  async updateProgram(id: string, data: Partial<Program>): Promise<Program> {
    const response = await fetch(`${BASE_URL}/programs/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update program');
    return response.json();
  },
};
