import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, MaybeAsync, RedirectCommand, Resolve, RouterStateSnapshot } from '@angular/router';
import { ProjectLanguage } from '../models/project-language.model';
import { Language } from '../models/langauge.model';
import { SingleProjectService } from '../single-project.service';
import { LanguageService } from '../language.service';
import { catchError, forkJoin, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectLanguageResolverService implements Resolve<{ projectLanguages: ProjectLanguage[], languages: Language[] }> {

  constructor(
    private singleProjectService: SingleProjectService,
    private languageService: LanguageService
  ) { }
  

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{ projectLanguages: ProjectLanguage[], languages: Language[] }> {
    const projectId = route.parent?.paramMap.get('id');
    if (!projectId) {
      return of({ projectLanguages: [], languages: [] });
    }

    const projectLanguages$ = this.singleProjectService.getLanguageByProjectId(Number(projectId));
    const languages$ = this.languageService.getAllLanguages();

    return forkJoin({ projectLanguages: projectLanguages$, languages: languages$ }).pipe(
      catchError(error => {
        console.error('Error resolving project languages or languages', error);
        return of({ projectLanguages: [], languages: [] });
      })
    );
  }
}
