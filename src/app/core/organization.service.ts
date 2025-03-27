import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Organization } from './models/organization.model';
import { Observable } from 'rxjs';
import { Project } from './models/project.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = 'http://10.12.1.83:8080/organization';

  constructor(private http: HttpClient) {}

  createOrganization(organization: Organization): Observable<Organization> {
    return this.http.post<Organization>(`${this.apiUrl}`, organization);
  }


  assignProjectsToOrganization(organizationId: number, projectIds: number[]): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/${organizationId}/assign-projects`, projectIds);
  }

  getProjectsByOrganization(organizationId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/${organizationId}/projects`);
  }

  getOrganizationsByUser(userId: number): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${this.apiUrl}/user/${userId}`);
  }
}
