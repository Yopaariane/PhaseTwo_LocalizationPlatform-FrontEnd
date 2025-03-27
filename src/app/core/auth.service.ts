import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserRole } from './models/user-role.model';
import { environment } from '../../environments/environment';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

export interface UserResponse {
  id: number;
  name: string;
  email: string;
}
export interface Role{
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);

  private apiUrl = 'http://10.12.1.83:8080/api'; 

  private authenticated = false;

  constructor(
    private http: HttpClient,
    private socialAuthService: SocialAuthService
  ) { }

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

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  isLoggedIn(): boolean {
    return this.authenticated; 
  }

  // Assign a role to a user
  assignRoleToUser(userRole: UserRole): Observable<UserRole> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<UserRole>(`${this.apiUrl}/userRoles`, userRole, { headers });
  }

  // Get userRoles by user ID
  getRolesByUserId(userId: number): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${this.apiUrl}/userRoles/user/${userId}`);
  }

  // Get userRoles by project ID
  getRolesByProjectId(projectId: number): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${this.apiUrl}/userRoles/project/${projectId}`);
  }

  // Get userRole by userId and role ID
  getByUserIdAndRoleId(userId: number, roleId: number): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${this.apiUrl}/userRoles/user/${userId}/role/${roleId}`);
  }

  // Delete a user role by ID
  deleteUserRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/userRoles/${id}`);
  }

  // get user by id
  getUserById(userId: number): Observable<UserResponse>{
    return this.http.get<UserResponse>(`${this.apiUrl}/${userId}`);
  }

  // get user by email
  getUserByEmail(email: string): Observable<UserResponse>{
    return this.http.get<UserResponse>(`${this.apiUrl}/email/${email}`);
  }

  // get role by id
  getRoleById(roleId: number): Observable<Role>{
    return this.http.get<Role>(`${this.apiUrl}/role/${roleId}`);
  }

  // get all roles
  getAllRoles(): Observable<Role[]>{
    return this.http.get<Role[]>(`${this.apiUrl}/role`);
  }

  // authentication with Google
  loginWithGoogle(): Promise<SocialUser> {
    return this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
      // Send user data to your backend for additional processing
      return this.http.post(`${this.apiUrl}/register`, {
        name: user.name,
        email: user.email,
        password: 'your-default-password' // Use a default password or generate one
      }).toPromise().then(() => user);
    });
  }

  logout(): Promise<void> {
    return this.socialAuthService.signOut();
  }
}
