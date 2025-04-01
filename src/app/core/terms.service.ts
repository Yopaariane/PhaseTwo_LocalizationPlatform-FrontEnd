import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Terms } from './models/term.model';

@Injectable({
  providedIn: 'root'
})
export class TermsService {
  private apiUrl = 'http://10.12.1.113:8080/terms';

  constructor(private http: HttpClient) { }

  // Create a term
  createTerms(terms: Terms): Observable<Terms>{
    return this.http.post<Terms>(`${this.apiUrl}`, terms);
  }

  // update Term
  updateTerm(id: number, terms: Terms): Observable<Terms>{
    return this.http.put<Terms>(`${this.apiUrl}/${id}`, terms);
  }

  // delete Term
  deleteTerm(id: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // get Term By Id
  getTermById(id: number): Observable<Terms>{
    return this.http.get<Terms>(`${this.apiUrl}/${id}`);
  }

  // get Terms By Project Id
  getTermsByProjectId(projectId: number): Observable<Terms[]>{
    return this.http.get<Terms[]>(`${this.apiUrl}/project/${projectId}`);
  }

  // get Terms Count By Project Id
  getTermsCountByProjectId(projectId: number): Observable<Terms>{
    return this.http.get<Terms>(`${this.apiUrl}/count?projectId={projectId}`);
  }

  // get totalStrig count By projectId
  getTotalStringCountByProjectId(projectId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/project/${projectId}/totalStrings`);
  }
}
