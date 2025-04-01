export interface Language {
    id: number;
    code: string;
    name: string;
  }

export interface Project {
    id: number;
  name: string;
  description: string;
  createAt: Date;
  ownerId: number;
  defaultLangId: number;
  roleId: number;
  strings: number;
  languages: Language[];
  progress: number;
  roleName: string;
}