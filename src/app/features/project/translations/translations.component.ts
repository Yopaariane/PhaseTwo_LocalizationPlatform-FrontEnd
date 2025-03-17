import { Component, OnDestroy, OnInit } from '@angular/core';
import { Language } from '../../../core/models/langauge.model';
import { ProjectLanguage } from '../../../core/models/project-language.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ProjectService } from '../../../core/project.service';
import { TranslationService } from '../../../core/translation.service';
import { LanguageService } from '../../../core/language.service';
import { SingleProjectService } from '../../../core/single-project.service';
import { Translations } from '../../../core/models/translation.model';
import { Terms } from '../../../core/models/term.model';
import { filter, Subscription } from 'rxjs';
import { StorageService } from '../../../core/storage.service';
import { TermsService } from '../../../core/terms.service';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExportService } from '../../../core/export.service';
import { SortingService } from '../../../core/sorting.service';
import { SortDropdownComponent } from '../../../shared/sort-dropdown/sort-dropdown.component';
import { PuterAiService } from '../../../core/puter-ai.service';

@Component({
  selector: 'app-translations',
  imports: [NgbPagination, NgClass, CommonModule, FormsModule, SortDropdownComponent],
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.css', '../terms/terms.component.css', '../../dashbord/dashbord.component.css']
})
export class TranslationsComponent implements OnInit, OnDestroy {
  projectId!: number;
  languageId!: number;
  ownerId!: number;
  projectProgress: number | undefined;
  projectName: string | undefined;
  languageName: string | undefined;
  languageCode!: string;

  showDropdown: boolean = false;
  languages: Language[] = [];
  projectLanguage: ProjectLanguage[] = [];

  translation: Translations[] = [];
  englishTranslations: Translations[] = [];
  terms: Terms[] = [];
  user: { id: number, name: string } | null = null;
  newComment: string = "";
  termId!: number;

  draftTranslations: {[termId: number]: string} = {};
  isEditing: { [termId: number]: boolean } = {};
  activeInputs: {[termId: number]: boolean} = {};
  routeId!: number;

  formats: string[] = ['json', 'csv', 'pdf', 'xml', 'xls'];
  selectedFormat: string = 'json';

  currentPage = 1;
  itemsPerPage = 7;
  paginatedTranslation: Terms[] = [];
  routeSubs: Subscription | undefined;
  routerSub: Subscription | undefined;

  sortOrder: string = 'Date Asc';

  translationContext: string = '';
  otherSpecifications: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private singleProjectService: SingleProjectService,
    private sortingService: SortingService,
    private translationListService: TranslationService,
    private languageService: LanguageService,
    private localStorage: StorageService,
    private termsService: TermsService,
    private exportService: ExportService,
    private puterAiService: PuterAiService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = +params.get('id')!;
      this.fetchProjectLanguageDetails(id); 
    });

    const userData = this.localStorage.getitem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }

    this.sortingService.sortOrder$.subscribe(order => {
      this.sortOrder = order;
      this.sortTerms();
    });
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }


  fetchProjectLanguageDetails(id: number): void {
    this.singleProjectService.getProjectLanguageById(id).subscribe((projectLanguage) => {
      this.languageId = projectLanguage.languageId;
      this.projectId = projectLanguage.projectId;
      console.log('Fetching terms for projectId:', this.projectId);
      this.loadTermsAndTranslations();
      this.fetchLanguageDetails(this.languageId);
      this.loadLanguages(this.projectId);
    });
  }
  
  loadTermsAndTranslations(): void {
    this.termsService.getTermsByProjectId(this.projectId).subscribe((terms) => {
      console.log('Fetched terms:', terms);
      this.terms = terms;
      this.translationListService.getTranslationsByLanguageId(this.languageId).subscribe((translations) => {
        this.translation = translations;
        this.updatePaginatedTranslation();
      });

      const englishLanguageId = 1;
      this.translationListService.getTranslationsByLanguageId(englishLanguageId).subscribe((englishTranslations) => {
        this.englishTranslations = englishTranslations;
      });
    });
  }

   // pagination
   pageChanged(event: any): void {
    if (event) {
        this.currentPage = event;
        console.log("Current page:", this.currentPage);
    } else {
        this.currentPage = 1;
    }
    this.updatePaginatedTranslation();
  }
  updatePaginatedTranslation(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    
    this.paginatedTranslation = this.terms.slice(startIndex, endIndex);
  } 
  shouldShowPagination(): boolean {
    return this.terms.length > this.itemsPerPage;
  }

  getTranslationForTerm(termId: number): Translations | any {
    return this.translation.find(t => t.termId === termId);
  }

  onInput(termId: number): void {
    this.activeInputs[termId] = !!this.draftTranslations[termId];
  }

  isInputActive(termId: number): boolean {
    return !!this.activeInputs[termId];
  }

  hasActiveInputs(): boolean {
    return Object.values(this.activeInputs).some(isActive => isActive);
  }

  saveTranslation(termId: number): void {
    const translationText = this.draftTranslations[termId];
  
    if (translationText) {
      const translation: Partial<Translations> = {
        translationText: translationText,
        termId: termId,
        languageId: this.languageId,
        creatorId: this.user?.id,
      };
  
      // Logging to check values before sending the request
      console.log('Saving translation with payload:', translation);
  
      this.translationListService.createTranslation(translation as Translations).subscribe(
        (savedTranslation) => {
          this.translation.push(savedTranslation);
          delete this.draftTranslations[termId];
          this.activeInputs[termId] = false;
          this.reloadPage();
        },
        (error) => {
          console.error('Error saving translation:', error);
        }
      );
    } else {
      console.error('No translation text provided for termId:', termId);
    }
  }

  saveAllTranslations(): void {
    for (const termId in this.activeInputs) {
      if (this.activeInputs[termId]) {
        this.saveTranslation(Number(termId));
      }
    }
  }
  

  reloadPage(): void {
    this.loadTermsAndTranslations()

  }

  isEditingTerm(termId: number): boolean {
    return !!this.isEditing[termId];
  }

  toggleEdit(termId: number): void {
    this.isEditing[termId] = !this.isEditing[termId];
    if (this.isEditing[termId]) {
      const translation = this.getTranslationForTerm(termId)?.translationText || '';
      this.draftTranslations[termId] = translation;
    }
  }

  updateTranslation(termId: number): void {
    const translation = this.getTranslationForTerm(termId);
    if (translation) {
      translation.translationText = this.draftTranslations[termId] || translation.translationText;

      this.translationListService.updateTranslation(translation.id, translation).subscribe(
        () => {
          this.activeInputs[termId] = false;
          delete this.draftTranslations[termId];
          this.reloadPage();
          this.toggleEdit(termId);
        },
        (error) => {
          console.error('Error updating translation:', error);
        }
      );
    } else {
      console.error('No existing translation found for termId:', termId);
    }
  }

  deleteTranslation(termId: number): void {
    const translation = this.getTranslationForTerm(termId);
    if (translation) {
      this.translationListService.deleteTranslation(translation.id).subscribe(
        () => {
          this.translation = this.translation.filter(t => t.termId !== termId);
          delete this.draftTranslations[termId];
          this.activeInputs[termId] = false;
          this.reloadPage();
        },
        (error) => {
          console.error('Error deleting translation:', error);
        }
      );
    } else {
      console.error('No translation to delete for termId:', termId);
    }
  }

  fetchLanguageDetails(languageId: number): void{
    this.languageService.getLanguageById(languageId).subscribe((language) =>{
      this.languageName = language.name;
      this.languageCode = language.code;
    })
  }

  loadLanguages(projectId: number): void {
    this.languageService.getAllLanguages().subscribe((languages: Language[]) => {
      this.languages = languages;
    });

    this.singleProjectService.getLanguageByProjectId(projectId).subscribe((projectLanguage: ProjectLanguage[]) => {
      this.projectLanguage = projectLanguage;
    });
  }
  filteredLanguages(): Language[] {
    return this.languages
      .filter(lang => this.projectLanguage.some(pl => pl.languageId === lang.id));
  }
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }
  hideDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  navigateToProjectLanguage(languageId: number): void {
    const projectId = this.projectId; 
    this.singleProjectService.getProjectLanguageByLanguageIdAndProjectId(projectId, languageId).subscribe((projectLanguage) => {
      const projectLanguageId = projectLanguage.id; 
      this.translationListService.onLanguageChanged$.next(projectLanguageId)
      this.router.navigate(['/project', projectId, 'translation', projectLanguage.id]);
    });
  }

  getFlagClass(languageCode: string): string {
    return `fi fi-${this.languageService.getCountryCode(languageCode)}`;
  }

  // export format
  downloadFile(): void {
    if (this.selectedFormat === 'json') {
      this.exportService.exportTranslationsToJson(this.projectId, this.languageId)
        .subscribe(() => console.log('JSON file downloaded'));
    } else if (this.selectedFormat === 'csv') {
      this.exportService.exportTranslationsToCsv(this.projectId, this.languageId)
        .subscribe(() => console.log('CSV file downloaded'));
    } else {
      console.warn('Unsupported format');
    }
  }

  selectFormat(format: string): void {
    this.selectedFormat = format;
    this.downloadFile();
  }

   // sorting
  sortTerms() {
    this.terms.sort((a, b) => {
      switch (this.sortOrder) {
        case 'Date Asc': return new Date(a.createAt).getTime() - new Date(b.createAt).getTime();
        case 'Date Desc': return new Date(b.createAt).getTime() - new Date(a.createAt).getTime();
        case 'Name Asc': return a.term.localeCompare(b.term);
        case 'Name Desc': return b.term.localeCompare(a.term);
        default: return 0;
      }
    });
    this.updatePaginatedTranslation();
  }

  // PuterAi translate
  isTranslating: boolean = false;

  getEnglishTranslationForTerm(termId: number): Translations | any {
    return this.englishTranslations.find(t => t.termId === termId);
  }

  async aiTranslate(targetLanguage: string): Promise<void> {
    console.log('aiTranslate method called');
    this.isTranslating = true;
  
    for (const term of this.terms) {
      if (this.getTranslationForTerm(term.id)) continue;
  
      try {
        const context = this.translationContext ? this.translationContext : '';
        const specifications = this.otherSpecifications ? this.otherSpecifications : '';
        const termContext = term.context ? term.context : '';
        const projectName = this.projectName ? this.projectName : '';
        const initialTranslation = this.getEnglishTranslationForTerm(term.id)?.translationText || '';
  
        const result = await this.puterAiService.translateText(term.term, termContext, context, specifications, projectName, initialTranslation, targetLanguage);
  
        this.draftTranslations[term.id] = result;
        this.activeInputs[term.id] = true;
      } catch (error) {
        console.error(`Translation failed for term ${term.id}`, error);
      }
    }
  
    this.isTranslating = false;
  }
}
