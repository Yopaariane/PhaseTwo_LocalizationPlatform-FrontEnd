import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProjectLanguage } from './models/project-language.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SingleProjectService {
  private apiUrl = environment.apiUrl;

    

  constructor (private http: HttpClient){}

  // Assign language to a project
  assignLanguageToProject(projectLanguages: ProjectLanguage): Observable<ProjectLanguage>{
      return this.http.post<ProjectLanguage>(`${this.apiUrl}/projectLanguages`, projectLanguages);
  }

  // Get languages by project ID
  getLanguageByProjectId(projectId: number): Observable<ProjectLanguage[]> {
      return this.http.get<ProjectLanguage[]>(`${this.apiUrl}/projectLanguages/project/${projectId}`);
  }

  // get projectLanguage by id
  getProjectLanguageById(id: number): Observable<ProjectLanguage>{
      return this.http.get<ProjectLanguage>(`${this.apiUrl}/projectLanguages/${id}`);
  }

  // Delete a project language by ID
  deleteProjectLanguage(id: number): Observable<void> {
      return this.http.delete<void>(`${this.apiUrl}/projectLanguages/${id}`);
  }

  // get ProjectLanguage
  getProjectLanguageByLanguageIdAndProjectId(projectId: number, languageId: number): Observable<ProjectLanguage>{
      return this.http.get<ProjectLanguage>(`${this.apiUrl}/projectLanguages/project/${projectId}/language/${languageId}`);
  }
}
