import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PuterAiService } from './puter-ai.service';
import { Translations } from './models/translation.model';
import { Terms } from './models/term.model';

@Injectable({
  providedIn: 'root'
})
export class TranslationTaskService {
  private isTranslatingSubject = new BehaviorSubject<boolean>(false);
  private translationProgressSubject = new BehaviorSubject<number>(0);

  isTranslating$ = this.isTranslatingSubject.asObservable();
  translationProgress$ = this.translationProgressSubject.asObservable();

  constructor(private puterAiService: PuterAiService) {}

  async translateTerms(terms: Terms[], englishTranslations: Translations[], targetLanguage: string, context: string, specifications: string, projectName: string): Promise<{ [key: number]: string }> {
    this.isTranslatingSubject.next(true);
    const draftTranslations: { [key: number]: string } = {};

    for (let i = 0; i < terms.length; i++) {
      const term = terms[i];
      const initialTranslation = englishTranslations.find(t => t.termId === term.id)?.translationText || '';

      try {
        const result = await this.puterAiService.translateText(term.term, term.context || '', context, specifications, projectName, initialTranslation, targetLanguage);
        draftTranslations[term.id] = result;
      } catch (error) {
        console.error(`Translation failed for term ${term.id}`, error);
      }

      this.translationProgressSubject.next((i + 1) / terms.length * 100);
    }

    this.isTranslatingSubject.next(false);
    return draftTranslations;
  }
}
