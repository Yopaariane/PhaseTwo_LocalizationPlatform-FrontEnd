import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Terms } from '../models/term.model';
import { TermsService } from '../terms.service';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TermResolverService implements Resolve<Terms[]> {

  constructor(private termService: TermsService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Terms[]> {
    const projectId = Number(route.parent?.paramMap.get('id'));

    if (isNaN(projectId)) {
      console.error("Invalid Project ID detected.");
      return of([]); // Return empty array to avoid breaking the app
    }

    return this.termService.getTermsByProjectId(projectId).pipe(
      catchError((error) => {
        console.error("Error fetching terms:", error);
        return of([]); // Return empty array on error
      })
    );
  }
}
