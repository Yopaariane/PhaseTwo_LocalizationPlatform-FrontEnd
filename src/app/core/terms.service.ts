import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Terms } from './models/term.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TermsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Create a term
  createTerms(terms: Terms): Observable<Terms>{
    return this.http.post<Terms>(`${this.apiUrl}/terms`, terms);
  }

  // update Term
  updateTerm(id: number, terms: Terms): Observable<Terms>{
    return this.http.put<Terms>(`${this.apiUrl}/terms/${id}`, terms);
  }

  // delete Term
  deleteTerm(id: number, userId: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/terms/${id}/user/${userId}`);
  }

  // get Term By Id
  getTermById(id: number): Observable<Terms>{
    return this.http.get<Terms>(`${this.apiUrl}/terms/${id}`);
  }

  // get Terms By Project Id
  getTermsByProjectId(projectId: number): Observable<Terms[]>{
    return this.http.get<Terms[]>(`${this.apiUrl}/terms/project/${projectId}`);
  }

  // get Terms Count By Project Id
  getTermsCountByProjectId(projectId: number): Observable<Terms>{
    return this.http.get<Terms>(`${this.apiUrl}/terms/count?projectId={projectId}`);
  }

  // get totalStrig count By projectId
  getTotalStringCountByProjectId(projectId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/terms/project/${projectId}/totalStrings`);
  }
}
