import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  uploadFile(file: File, projectId: number, languageId: number, creatorId: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId.toString());
    formData.append('languageId', languageId.toString());
    formData.append('creatorId', creatorId.toString());

    return this.http.post(`${this.apiUrl}/import/upload`, formData).pipe(
      catchError(error => {
      console.error('File upload failed:', error);
      throw error;
      })
    );
  }
}
