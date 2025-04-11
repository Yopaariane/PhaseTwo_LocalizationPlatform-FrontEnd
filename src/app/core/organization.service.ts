import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Organization } from './models/organization.model';
import { Observable } from 'rxjs';
import { Project } from './models/project.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createOrganization(organization: Organization): Observable<Organization> {
    return this.http.post<Organization>(`${this.apiUrl}/organization`, organization);
  }


  assignProjectsToOrganization(organizationId: number, projectIds: number[]): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/organization/${organizationId}/assign-projects`, projectIds);
  }

  getProjectsByOrganization(organizationId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/organization/${organizationId}/projects`);
  }

  getOrganizationsByUser(userId: number): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${this.apiUrl}/organization/user/${userId}`);
  }

  getOrganizationById(id: number): Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/organization/${id}`);
  }
}
