import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PuterAiService } from './puter-ai.service';
import { Translations } from './models/translation.model';
import { Terms } from './models/term.model';
import { MatDialog } from '@angular/material/dialog';
import { TranslationProgressDialogComponent } from '../shared/translation-progress-dialog/translation-progress-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class TranslationTaskService {
  private isTranslatingSubject = new BehaviorSubject<boolean>(false);
  private translationProgressSubject = new BehaviorSubject<number>(0);

  isTranslating$ = this.isTranslatingSubject.asObservable();
  translationProgress$ = this.translationProgressSubject.asObservable();

  constructor(
    private puterAiService: PuterAiService,
    private dialog: MatDialog
  ) {}

  async translateTerms(terms: Terms[], englishTranslations: Translations[], targetLanguage: string, context: string, specifications: string, projectName: string): Promise<{ [key: number]: string }> {
    this.isTranslatingSubject.next(true);

    let dialogRef = this.dialog.open(TranslationProgressDialogComponent, {
      data: { progress: 0, isCompleted: false },
      disableClose: false
    });

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

      // this.translationProgressSubject.next((i + 1) / terms.length * 100);
      const progress = ((i + 1) / terms.length) * 100;
      this.translationProgressSubject.next(progress);

      if (dialogRef.componentInstance) {
        dialogRef.componentInstance.data.progress = progress;
      }
    }

    this.isTranslatingSubject.next(false);

    if (!dialogRef.componentInstance) {
      dialogRef = this.dialog.open(TranslationProgressDialogComponent, {
        data: { progress: 100, isCompleted: true },
        disableClose: false
      });
    } else {
      dialogRef.componentInstance.data.isCompleted = true;
    }

  setTimeout(() => {
    if (dialogRef.componentInstance) {
      dialogRef.close();
    }
  }, 5000);

    return draftTranslations;
  }
}
