import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from './models/project.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/api/projects`, project);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/api/projects/${id}`);
  }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/api/projects`);
  }

  updateProject(id: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/api/projects/${id}`, project);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/projects/${id}`);
  }

  getUserProjects(userId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/api/projects/user/${userId}`);
  }
}
