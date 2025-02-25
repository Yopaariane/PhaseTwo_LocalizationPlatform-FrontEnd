import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface UserResponse {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://10.12.1.106:8080/api'; 

  private authenticated = false;

  constructor(private http: HttpClient) { }

  signup(user: any): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/register`, user).pipe(
      tap(() => this.authenticated = true)
    );
  }

  login(credentials: any): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(() => this.authenticated = true)
    );
  }
}
