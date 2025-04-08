import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Language } from './models/langauge.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private apiUrl = environment.apiUrl;

  constructor (private http: HttpClient){}

  // Get all languages
  getAllLanguages(): Observable<Language[]>{
      return this.http.get<Language[]>(`${this.apiUrl}/languages`);
  }

  // Get language ById
  getLanguageById(id: number): Observable<Language> {
      return this.http.get<Language>(`${this.apiUrl}/languages/${id}`);
  }

  getCountryCode(languageCode: string): string {
      switch (languageCode.toLowerCase()) {
        case 'en':
          return 'gb'; 
        case 'fr':
          return 'fr';
        case 'de':
          return 'de';
        case 'zh':
          return 'cn'; 
        case 'ja':
          return 'jp'; 
        case 'es':
          return 'es'; 
        default:
          return 'us'; 
      }
    }
}
