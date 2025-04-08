import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Translations } from './models/translation.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private apiUrl = environment.apiUrl;

  onLanguageChanged$: BehaviorSubject<any> = new BehaviorSubject(null); 

  constructor(private http: HttpClient) { }

  // create translation
  createTranslation(translation: Translations): Observable<Translations>{
    return this.http.post<Translations>(`${this.apiUrl}/translation`, translation);
  }

  // update translation
  updateTranslation(id: number, translation: Translations): Observable<Translations>{
    return this.http.put<Translations>(`${this.apiUrl}/translation/${id}`, translation);
  }

  // delete Translation
  deleteTranslation(id: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/translation/${id}`);
  }

  // get translation by term id
  getTranslationsByTermId(itermId: number): Observable<Translations[]>{
    return this.http.get<Translations[]>(`${this.apiUrl}/translation/item/${itermId}`);
  }
  
  // get tanslations by language id
  getTranslationsByLanguageId(languageId: number): Observable<Translations[]>{
    return this.http.get<Translations[]>(`${this.apiUrl}/translation/language/${languageId}`);
  }

  // get translation count by projectId
  countTranslationsByProjectId(projectId: number): Observable<Translations>{
    return this.http.get<Translations>(`${this.apiUrl}/translation/count/${projectId}`);
  }

  // get Translation Progress For Term
  getTranslationProgressForTerm(termId: number): Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/translation/${termId}/progress`);
  }

  // get Translation Progress For Language
  getTranslationProgressForLanguage(languageId: number, projectId: number): Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/translation/progress/${languageId}/${projectId}`);
  }

  // get Overall Translation Progress For Project
  getOverallTranslationProgressForProject(projectId: number): Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/translation/progress/${projectId}`);
  }

  // get Average Translation Progress For User
  getAverageTranslationProgressForUser(userId: number): Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/translation/translation-progress/users/${userId}`);
  }

  // get Average Translation Progress For Organization
  getAverageTranslationProgressForOrganization(organizationId: number): Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/translation/translation-progress/organization/${organizationId}`);  
  }

  // get Total String Number by user id
  getTotalStringNumber(ownerId: number): Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/translation/total-strings/${ownerId}`);
  }

  // get Strings Translation Progress
  getStringsTranslationProgress(ownerId: number): Observable<number>{
    return this.http.get<number>(`${this.apiUrl}/translation/string-progress/users/${ownerId}`);
  }
}
