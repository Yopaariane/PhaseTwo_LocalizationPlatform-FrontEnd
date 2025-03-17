import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

declare const puter: any;

@Injectable({
  providedIn: 'root'
})
export class PuterAiService {
  constructor() {}

  async translateText(term: string, termContext: string, translationContext: string, specifications: string, projectName: string, initialTranslation: string, targetLanguage: string): Promise<string> {
    try {
      const context = translationContext ? `Context: ${translationContext}. ` : '';
      const specs = specifications ? `Specifications: ${specifications}.` : '';
      const termCtx = termContext ? `Term Context: ${termContext}. ` : '';
      const projName = projectName ? `Project Name: ${projectName}. ` : '';
      const translation = initialTranslation ? `Translate the following text to ${targetLanguage}: ${initialTranslation}` : `Translate the following term to ${targetLanguage}: ${term}`;

      const prompt = `${projName}${termCtx}${context}${specs}${translation}`;

      const response = await puter.ai.chat(prompt);
      return response?.message?.content || term;
    } catch (error) {
      console.error("Translation error:", error);
      return term;
    }
  }


}
