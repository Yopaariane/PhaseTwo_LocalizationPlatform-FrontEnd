import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  exportTranslationsToCsv(projectId: number, languageId: number): Observable<void> {
    const url = `${this.apiUrl}/export/csv`;
    const headers = new HttpHeaders({
      'Content-Type': 'text/csv',
    });
    const params = { projectId: projectId.toString(), languageId: languageId.toString() };

    return this.http.get(url, { headers, params, responseType: 'text' as 'json', observe: 'response' })
      .pipe(
        map(response => {
          const contentDisposition = response.headers.get('Content-Disposition');
          const fileName = this.getFileNameFromContentDisposition(contentDisposition);

          const blob = new Blob([response.body as string], { type: 'text/csv' });
          this.downloadFile(blob, fileName);
        })
      );
  }

  exportTranslationsToJson(projectId: number, languageId: number): Observable<void> {
    const url = `${this.apiUrl}/export/json`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const params = { projectId: projectId.toString(), languageId: languageId.toString() };

    return this.http.get(url, { headers, params, responseType: 'blob', observe: 'response' })
      .pipe(
        map(response => {
          const contentDisposition = response.headers.get('Content-Disposition');
          const fileName = this.getFileNameFromContentDisposition(contentDisposition);

          const blob = new Blob([response.body as Blob], { type: 'application/json' });
          this.downloadFile(blob, fileName);
        })
      );
  }

  private getFileNameFromContentDisposition(contentDisposition: string | null): string {
    console.log('Content-Disposition Header:', contentDisposition);
    if (!contentDisposition) {
      return 'download';
    }
    const matches = /filename\*?=['"]?([^'";\n]+)['"]?/.exec(contentDisposition);
    console.log('Regex Matches:', matches);
    return matches && matches[1] ? decodeURIComponent(matches[1]) : 'download';
  }

  private downloadFile(blob: Blob, fileName: string): void {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }
}
