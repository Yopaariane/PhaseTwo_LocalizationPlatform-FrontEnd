import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SingleProjectService } from '../../../core/single-project.service';
import { LanguageService } from '../../../core/language.service';
import { TranslationService } from '../../../core/translation.service';
import { ProjectLanguage } from '../../../core/models/project-language.model';
import { Terms } from '../../../core/models/term.model';
import { Translations } from '../../../core/models/translation.model';
import { Language } from '../../../core/models/langauge.model';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { SortDropdownComponent } from '../../../shared/sort-dropdown/sort-dropdown.component';
import { SortingService } from '../../../core/sorting.service';

@Component({
  selector: 'app-project-language',
  imports: [RouterLink, CommonModule, SortDropdownComponent],
  templateUrl: './project-language.component.html',
  styleUrls: ['./project-language.component.css',
    '../terms/terms.component.css', '../../dashbord/dashbord.component.css'
  ]
})
export class ProjectLanguageComponent {
  projectLanguages: ProjectLanguage[] = [];
  languages: Language[] = [];
  noLanguages = false;

  selectedLanguages: Language[] = [];
  selectedLanguageIds: number[] = [];
  selectedLanguage: string = '';
  showDropdown: boolean = false;
  projectId: number | null = null;
  projectName: string | undefined;
  translations: Translations[] = [];
  terms: Terms[] = []

  currentPage = 1;
  itemsPerPage = 9;
  paginatedProjectLanguage: ProjectLanguage[] = [];

  sortOrder: string = 'Date Asc';
  
  constructor(
    private route: ActivatedRoute,
    private singleProjectService: SingleProjectService,
    private languageService: LanguageService,
    private translationListService: TranslationService,
    private sortingService: SortingService,
  ){}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.projectId = Number(id);
        this.loadProjectLanguages(this.projectId);
        this.loadLanguages();
      }
    });

    this.sortingService.sortOrder$.subscribe(order => {
      this.sortOrder = order;
      this.sortProjectLanguages();
    });
  }

  loadProjectLanguages(projectId: number): void {
    this.singleProjectService.getLanguageByProjectId(projectId).subscribe(
      (projectLanguages: ProjectLanguage[]) => {
        if (projectLanguages.length === 0) {
          this.noLanguages = true;
        } else {
          this.noLanguages = false;
          this.projectLanguages = projectLanguages;

          this.updatePaginatedProjectLanguage();

         // Fetch and set progress for each language
         projectLanguages.forEach(pl => {
          this.updateLanguageProgress(pl.languageId);
         }); 
        }
      },
      error => {
        console.error('Error loading project languages', error);
      }
    );
  }

  // Pagination
  pageChanged(event: any): void {
    if (event) {
        this.currentPage = event;
        console.log("Current page:", this.currentPage);
    } else {
        this.currentPage = 1;
    }
    this.updatePaginatedProjectLanguage();
  }
  updatePaginatedProjectLanguage(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProjectLanguage = this.projectLanguages.slice(startIndex, endIndex);
  } 
  shouldShowPagination(): boolean {
    return this.projectLanguages.length > this.itemsPerPage;
  }

  updateLanguageProgress(languageId: number): void {
    if (this.projectId) {
      this.translationListService.getTranslationProgressForLanguage(languageId, this.projectId).subscribe(
        (progress: number) => {
          // progress
          const projectLanguage = this.projectLanguages.find(pl => pl.languageId === languageId);
          if (projectLanguage) {
            projectLanguage.progress = progress;
          }
        },
        error => {
          console.error(`Error fetching translation progress for language ${languageId}`, error);
        }
      );
    }
  }
  
  // flag icon method
  getFlagClass(languageCode: string): string {
    return `fi fi-${this.languageService.getCountryCode(languageCode)}`;
  }

  // Language name and code
  getLanguageNameById(id: number): string {
    const language = this.languages.find(lang => lang.id === id);
    return language ? language.name : 'Unknown Language'; // Handle the case where the language is not found
  }
  getLanguageCodeById(id: number): string {
    const language = this.languages.find(lang => lang.id === id);
    return language ? language.code : 'Unknown Language'; // Handle the case where the language is not found
  }

  // Delete Language from list
  deleteLanguage(id: number): void {
    this.singleProjectService.deleteProjectLanguage(id).subscribe(
      () => {
        this.projectLanguages = this.projectLanguages.filter(lang => lang.id !== id);
        this.loadProjectLanguages(this.projectId!);
      },
      error => {
        console.error('Error deleting project language', error);
      }
    );
  }

  // Add new project language
  loadLanguages(): void {
    this.languageService.getAllLanguages().subscribe((languages: Language[]) => {
      this.languages = languages;
    });
  }

  selectLanguage(language: Language): void {
    const index = this.selectedLanguageIds.indexOf(language.id);
    if (index === -1) {
      this.selectedLanguageIds.push(language.id);
    } else {
      this.selectedLanguageIds.splice(index, 1);
    }
    this.showDropdown = false;
  }

  filteredLanguages(): Language[] {
    return this.languages.filter(lang => lang.name.toLowerCase().includes(this.selectedLanguage.toLowerCase()));
  }

  saveLanguages(): void {
    if (this.projectId && this.selectedLanguageIds.length > 0) {
      const projectLanguages: ProjectLanguage[] = this.selectedLanguageIds.map(id => ({
        id: 0,
        projectId: this.projectId!,
        languageId: id
      }));

      // Prevent saving a language that is already associated with the project
      const newProjectLanguages = projectLanguages.filter(pl => 
        !this.projectLanguages.some(existing => existing.languageId === pl.languageId)
      );

      if (newProjectLanguages.length > 0) {
        const saveRequests = newProjectLanguages.map(pl => this.singleProjectService.assignLanguageToProject(pl));
        forkJoin(saveRequests).subscribe(() => {
          // Reload the project languages after saving
          this.loadProjectLanguages(this.projectId!);
          this.selectedLanguageIds = []; // Clear selected languages after saving
        });
      }
    }
  }

  isSelected(languageId: number): boolean {
    return this.selectedLanguageIds.includes(languageId);
  }

  // sorting
  sortProjectLanguages() {
    this.projectLanguages.sort((a, b) => {
      switch (this.sortOrder) {
        // case 'Date Asc': return new Date(a.createAt).getTime() - new Date(b.createAt).getTime();
        // case 'Date Desc': return new Date(b.createAt).getTime() - new Date(a.createAt).getTime();
        // case 'Name Asc': return a.languageId.localeCompare(b.languageId);
        // case 'Name Desc': return b.languageId.localeCompare(a.languageId);
        default: return 0;
      }
    });
    this.updatePaginatedProjectLanguage();
  }
}
