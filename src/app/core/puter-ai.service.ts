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
      if (typeof puter === 'undefined') {
        throw new Error('Puter service is not available');
      }

      const context = translationContext ? `Context: ${translationContext}. ` : '';
      const specs = specifications ? `Specifications: ${specifications}.` : '';
      const termCtx = termContext ? `Term Context: ${termContext}. ` : '';
      const projName = projectName ? `Project Name: ${projectName}. ` : '';
      const translation = initialTranslation ? `Translate as a native speaker of the target langauge the following text without any explanation to ${targetLanguage}: ${initialTranslation}` : `Translate as a native speaker of the target language the following term without any explanation to ${targetLanguage}: ${term}`;

      const prompt = `${projName}${termCtx}${context}${specs}${translation}`;

      const response = await puter.ai.chat(prompt);
      return response?.message?.content || term;
    } catch (error) {
      console.error("Translation error:", error);
      return term;
    }
  }

  // async translateText(
  //   term: string,
  //   termContext: string,
  //   translationContext: string,
  //   specifications: string,
  //   projectName: string,
  //   initialTranslation: string,
  //   targetLanguage: string
  // ): Promise<string> {
  //   try {
  //     if (typeof puter === 'undefined') {
  //       throw new Error('Puter service is not available');
  //     }

  //     const context = translationContext ? `Context: ${translationContext}. ` : '';
  //     const specs = specifications ? `Specifications: ${specifications}.` : '';
  //     const termCtx = termContext ? `Term Context: ${termContext}. ` : '';
  //     const projName = projectName ? `Project Name: ${projectName}. ` : '';
  //     const translation = initialTranslation
  //       ? `Translate as a native speaker of the target language the following text without any explanation to ${targetLanguage}: ${initialTranslation}`
  //       : `Translate as a native speaker of the target language the following term without any explanation to ${targetLanguage}: ${term}`;

  //     const prompt = `${projName}${termCtx}${context}${specs}${translation}`;

  //     const response = await puter.ai.chat(prompt, { model: 'claude', stream: true });

  //     // Handle streaming response
  //     if (response[Symbol.asyncIterator]) {
  //       let translatedText = '';
  //       for await (const part of response) {
  //         if (part?.text) {
  //           translatedText += part.text;
  //         }
  //       }
  //       return translatedText || term;
  //     }

  //     // Handle non-streaming response
  //     return response?.message?.content || term;
  //   } catch (error) {
  //     console.error('Translation error:', error);
  //     return term;
  //   }
  // }
}
