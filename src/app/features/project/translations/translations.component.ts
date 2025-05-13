import { Component, OnInit } from '@angular/core';
import { Language } from '../../../core/models/langauge.model';
import { ProjectLanguage } from '../../../core/models/project-language.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../core/project.service';
import { TranslationService } from '../../../core/translation.service';
import { LanguageService } from '../../../core/language.service';
import { SingleProjectService } from '../../../core/single-project.service';
import { Translations } from '../../../core/models/translation.model';
import { Terms } from '../../../core/models/term.model';
import { Subscription } from 'rxjs';
import { StorageService } from '../../../core/storage.service';
import { TermsService } from '../../../core/terms.service';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExportService } from '../../../core/export.service';
import { SortingService } from '../../../core/sorting.service';
import { SortDropdownComponent } from '../../../shared/sort-dropdown/sort-dropdown.component';
import { TranslationTaskService } from '../../../core/translation-task.service';
import { LoadingService } from '../../../core/loading.service';

@Component({
  selector: 'app-translations',
  imports: [NgbPagination, NgClass, CommonModule, FormsModule, SortDropdownComponent],
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.css', '../terms/terms.component.css', '../../dashbord/dashbord.component.css']
})
export class TranslationsComponent implements OnInit{
  projectId!: number;
  languageId!: number;
  ownerId!: number;
  defaultLangId!: number;
  projectProgress: number | undefined;
  projectName: string | undefined;
  languageName: string | undefined;
  languageCode!: string;

  showDropdown: boolean = false;
  languages: Language[] = [];
  projectLanguage!: ProjectLanguage;
  projectLanguages: ProjectLanguage[] = [];

  translation: Translations[] = [];
  englishTranslations: Translations[] = [];
  terms: Terms[] = [];
  user: { id: number, name: string } | null = null;
  newComment: string = "";
  termId!: number;

  draftTranslations: {[Key: string]: string} = {};
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
    private translationTaskService: TranslationTaskService,
    private projectService: ProjectService,
    private loadingService: LoadingService,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      console.log('Resolved Data:', data);
      const resolvedData = data['resolvedData'];
      if (!resolvedData || !resolvedData.projectLanguage) {
        console.error("Project Language is missing in resolver data.", resolvedData);
        return;
      }
  
      this.projectLanguage = resolvedData.projectLanguage;
      this.terms = resolvedData.terms || [];
      this.translation = resolvedData.translations || [];
      this.englishTranslations = resolvedData.englishTranslations || [];
  
      // Ensure languageId and projectId are set correctly
      this.languageId = this.projectLanguage.languageId;
      this.projectId = this.projectLanguage.projectId;
  
      // Fetch language details only after languageId is set
      if (this.languageId) {
        this.fetchLanguageDetails(this.languageId);
      } else {
        console.error('Language ID is undefined.');
      }
  
      this.loadLanguages(this.projectId);
      this.loadDraftTranslations();
      this.updatePaginatedTranslation();
    });

    // Handle user data from local storage 
    const userData = this.localStorage.getitem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
  
    // Handle sorting and translation progress
    this.sortingService.sortOrder$.subscribe(order => {
      this.sortOrder = order;
      this.sortTerms();
    });

    this.translationTaskService.isTranslating$.subscribe(isTranslating => {
      this.isTranslating = isTranslating;
    });

    this.translationTaskService.translationProgress$.subscribe(progress => {
      console.log(`Translation progress: ${progress}%`);
    });
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
    this.loadingService.show('Loading translations...');
    this.termsService.getTermsByProjectId(this.projectId).subscribe((terms) => {
      this.terms = terms;
      this.translationListService.getTranslationsByLanguageId(this.languageId).subscribe((translations) => {
        this.loadingService.hide();
        this.translation = translations;
        this.updatePaginatedTranslation();
      });

      this.projectService.getProjectById(this.projectId).subscribe((project) => {
        this.defaultLangId = project.defaultLangId;
        console.log('Default Language ID:', this.defaultLangId);

        this.translationListService.getTranslationsByLanguageId(this.defaultLangId).subscribe((englishTranslations) => {
          this.englishTranslations = englishTranslations;
          console.log('English Translations:', this.englishTranslations);
      });
      });
    });
  }

   // pagination
   pageChanged(event: any): void {
    this.currentPage = event || 1;
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
    return this.translation.find(t => t.termId === termId && t.languageId === this.languageId);
  }

  onInput(termId: number): void {
    this.activeInputs[termId] = !!this.draftTranslations[termId];
  
    if (!this.draftTranslations[termId]) {
      this.clearDraftTranslation(termId);
    } else {
      this.saveDraftTranslations();
    }
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
      this.loadingService.show('Saving...');
  
      // Logging to check values before sending the request
      console.log('Saving translation with payload:', translation);
  
      this.translationListService.createTranslation(translation as Translations).subscribe(
        (savedTranslation) => {
          this.loadingService.hide();
          this.translation.push(savedTranslation);
          this.clearDraftTranslation(termId);
          this.reloadPage();
        },
        (error) => {
          this.loadingService.hide();
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
    this.clearAllDraftTranslations();
  }

  private saveDraftTranslations(): void {
    const key = `draftTranslations_${this.projectId}_${this.languageId}`;
    this.localStorage.setitem(key, JSON.stringify(this.draftTranslations));
  }
  
  private loadDraftTranslations(): void {
    const key = `draftTranslations_${this.projectId}_${this.languageId}`;
    const savedDrafts = this.localStorage.getitem(key);
    if (savedDrafts) {
      this.draftTranslations = JSON.parse(savedDrafts);
      for (const termId in this.draftTranslations) {
        this.activeInputs[Number(termId)] = !!this.draftTranslations[termId];
      }
    }
  }
  
  private clearDraftTranslation(termId: number): void {
    delete this.draftTranslations[termId];
    this.saveDraftTranslations();
  }
  
  private clearAllDraftTranslations(): void {
    this.draftTranslations = {};
    this.saveDraftTranslations();
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
          this.clearDraftTranslation(termId);
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
          this.clearDraftTranslation(termId);
          // this.activeInputs[termId] = false;
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
      this.projectLanguages = projectLanguage;
    });

    this.projectService.getProjectById(this.projectId).subscribe((project) => {
      this.defaultLangId = project.defaultLangId;
    });
  }
  filteredLanguages(): Language[] {
    return this.languages
      .filter(lang => this.projectLanguages.some(pl => pl.languageId === lang.id));
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
    this.loadingService.show('Loading...');
    const projectId = this.projectId; 
    const defaultLangId = this.defaultLangId;

    this.singleProjectService.getProjectLanguageByLanguageIdAndProjectId(projectId, languageId).subscribe((projectLanguage) => {
      this.loadingService.hide();
      const projectLanguageId = projectLanguage.id; 
      this.translationListService.onLanguageChanged$.next(projectLanguageId)

      this.draftTranslations = {};
      this.activeInputs = {}
      this.router.navigate(['/project', projectId, 'translation', projectLanguage.id],
        { queryParams: { defaultLangId } }
      );
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
    const context = this.translationContext ? this.translationContext : '';
    const specifications = this.otherSpecifications ? this.otherSpecifications : '';
    const projectName = this.projectName ? this.projectName : '';
  
    const termsToTranslate = this.terms.filter(term => !this.getTranslationForTerm(term.id));
  
    if (termsToTranslate.length === 0) {
      console.log('No terms to translate');
      return;
    }
  
    this.isTranslating = true;
  
    try {
      const draftTranslations = await this.translationTaskService.translateTerms(termsToTranslate, this.englishTranslations, targetLanguage, context, specifications, projectName);
      this.draftTranslations = { ...this.draftTranslations, ...draftTranslations };
      this.activeInputs = { ...this.activeInputs, ...Object.keys(draftTranslations).reduce((acc, key) => ({ ...acc, [key]: true }), {}) };
  
      this.saveDraftTranslations();
    } catch (error) {
      console.error('Error during AI translation:', error);
    } finally {
      this.isTranslating = false;
    }
  }
}
