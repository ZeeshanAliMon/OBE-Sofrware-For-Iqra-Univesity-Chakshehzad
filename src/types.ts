export type UserType = 'student' | 'instructor' | 'QA';

export interface GA {
  id: string;
  name: string;
  description: string;
}

export interface ProgramObjective {
  id: string;
  text: string;
  mappedGAs: string[]; // array of GA ids
}

export interface Program {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  pos: ProgramObjective[]; // exactly 4 POs
}

export interface Department {
  id: string;
  name: string;
  vision: string;
  mission: string;
}

export interface OBEData {
  departments: Department[];
  programs: Program[];
  gas: GA[];
}
