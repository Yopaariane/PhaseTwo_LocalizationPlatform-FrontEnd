import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { AuthService, Role } from '../auth.service';
import { catchError, forkJoin, Observable, of } from 'rxjs';
import { UserRole } from '../models/user-role.model';

@Injectable({
  providedIn: 'root'
})
export class ContributorsResolverService implements Resolve<{ userRoles: UserRole[], roles: Role[] }> {
  constructor(private authService: AuthService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ userRoles: UserRole[], roles: Role[] }> {
    const projectId = route.parent?.paramMap.get('id');
    if (!projectId) {
      return of({ userRoles: [], roles: [] });
    }

    const userRoles$ = this.authService.getRolesByProjectId(Number(projectId));
    const roles$ = this.authService.getAllRoles();

    return forkJoin({ userRoles: userRoles$, roles: roles$ }).pipe(
      catchError(error => {
        console.error('Error resolving contributors data', error);
        return of({ userRoles: [], roles: [] });
      })
    );
  }
}
