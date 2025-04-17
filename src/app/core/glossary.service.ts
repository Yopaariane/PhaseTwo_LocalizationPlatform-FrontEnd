import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Glossary } from './models/glossary.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlossaryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createGlossary(glossary: Glossary): Observable<Glossary> {
    return this.http.post<Glossary>(`${this.apiUrl}/glossary`, glossary);
  }

  updateGlossary(id: number, glossary: Glossary): Observable<Glossary> {
    return this.http.put<Glossary>(`${this.apiUrl}/glossary/${id}`, glossary);
  }

  deleteGlossary(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/glossary/${id}`);
  }

  getGlosssaryByOrganizationId(organizationId: number): Observable<Glossary[]> {
    return this.http.get<Glossary[]>(`${this.apiUrl}/glossary/organization/${organizationId}`);
  }
}
