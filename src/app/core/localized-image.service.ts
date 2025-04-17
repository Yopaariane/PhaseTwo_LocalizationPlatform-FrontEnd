import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LocalizedImage } from './models/localizedImage.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalizedImageService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  uploadImage(file: File, projectId: number, languageId: number, imageKey: string): Observable<LocalizedImage> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId.toString());
    formData.append('languageId', languageId.toString());
    formData.append('imageKey', imageKey);
    return this.http.post<LocalizedImage>(`${this.apiUrl}/image/upload`, formData);
  }

  getImageById(id: number): Observable<LocalizedImage> {
    return this.http.get<LocalizedImage>(`${this.apiUrl}/image/${id}`);
  }

  getImagesByProjectId(projectId: number): Observable<LocalizedImage[]> {
    return this.http.get<LocalizedImage[]>(`${this.apiUrl}/image/project/${projectId}`);
  }

  getImagesByLanguageId(languageId: number): Observable<LocalizedImage[]> {
    return this.http.get<LocalizedImage[]>(`${this.apiUrl}/image/language/${languageId}`);
  }

  getImagesByProjectAndLanguage(projectId: number, languageId: number): Observable<LocalizedImage[]> {
    return this.http.get<LocalizedImage[]>(
      `${this.apiUrl}/image/project-language?projectId=${projectId}&languageId=${languageId}`
    );
  }

  updateImage(id: number, formData: FormData): Observable<LocalizedImage> {
    return this.http.put<LocalizedImage>(`${this.apiUrl}/image/${id}`, formData);
  }

  deleteImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/image/${id}`);
  }
}
