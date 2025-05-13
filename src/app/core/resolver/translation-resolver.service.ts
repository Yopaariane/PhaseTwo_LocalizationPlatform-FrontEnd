import { Injectable } from '@angular/core';
import { SingleProjectService } from '../single-project.service';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { filter, forkJoin, Observable, of, switchMap, take, throwError } from 'rxjs';
import { ProjectLanguage } from '../models/project-language.model';
import { Terms } from '../models/term.model';
import { Language } from '../models/langauge.model';
import { TermsService } from '../terms.service';
import { LanguageService } from '../language.service';
import { Translations } from '../models/translation.model';
import { TranslationService } from '../translation.service';

@Injectable({
  providedIn: 'root'
})
export class ResolverService implements Resolve<{
  projectLanguage: ProjectLanguage,
  terms: Terms[],
  translations: Translations[],
  englishTranslations: Translations[]
}> {

  constructor(
    private singleprojectService: SingleProjectService, 
    private termsService: TermsService,
    private translationService: TranslationService,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<{
    projectLanguage: ProjectLanguage,
    terms: Terms[],
    translations: Translations[],
    englishTranslations: Translations[]
  }> {
    const id = +route.paramMap.get('id')!;
    const defaultLangId = +route.queryParamMap.get('defaultLangId')!;
    // const englishLanguageId = 1;
    console.log("default language id", defaultLangId);

    return this.singleprojectService.getProjectLanguageById(id).pipe(
      switchMap((projectLanguage: ProjectLanguage) => {
        if (!projectLanguage) {
          return throwError(() => new Error('Project Language not found'));
        }

        return forkJoin({
          projectLanguage: of(projectLanguage),
          terms: this.termsService.getTermsByProjectId(projectLanguage.projectId),
          translations: this.translationService.getTranslationsByLanguageId(projectLanguage.languageId),
          englishTranslations: this.translationService.getTranslationsByLanguageId(defaultLangId)
        });
      }), 
      take(1)
    );
  }
}
