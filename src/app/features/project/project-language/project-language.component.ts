import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
import { LoadingService } from '../../../core/loading.service';
import { Project } from '../../../core/models/project.model';
import { ProjectService } from '../../../core/project.service';

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
  project: Project[] = [];

  currentPage = 1;
  itemsPerPage = 9;
  paginatedProjectLanguage: ProjectLanguage[] = [];

  sortOrder: string = 'Date Asc';
  defaultLangId!: number;
  
  constructor(
    private route: ActivatedRoute,
    private singleProjectService: SingleProjectService,
    private languageService: LanguageService,
    private translationListService: TranslationService,
    private sortingService: SortingService,
    private loadingService: LoadingService,
    private projectService: ProjectService,
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

    const resolvedData = this.route.snapshot.data['projectLanguage'];
    this.projectLanguages = resolvedData.projectLanguages;
    this.languages = resolvedData.languages;

    this.noLanguages = this.projectLanguages.length === 0;

    this.projectLanguages.forEach(pl => {
      this.updateLanguageProgress(pl.languageId);
    });
    
    this.sortingService.sortOrder$.subscribe(order => {
      this.sortOrder = order;
      this.sortProjectLanguages();
    });
  }

  loadProjectLanguages(projectId: number): void {
    this.loadingService.show('Loading languages...');
    this.singleProjectService.getLanguageByProjectId(projectId).subscribe(
      (projectLanguages: ProjectLanguage[]) => {
        this.loadingService.hide();
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
        this.loadingService.hide();
        console.error('Error loading project languages', error);
      }
    );

    this.projectService.getProjectById(projectId).subscribe(
      (project) => {
        this.defaultLangId = project.defaultLangId;
        console.log('Default Language ID:', this.defaultLangId);
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
          setTimeout(() => {
            const projectLanguage = this.projectLanguages.find(pl => pl.languageId === languageId);
            if (projectLanguage) {
              projectLanguage.progress = progress;
            }
          }, 100);
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
    return language ? language.name : 'Unknown Language'; 
  }
  getLanguageCodeById(id: number): string {
    const language = this.languages.find(lang => lang.id === id);
    return language ? language.code : 'Unknown Language'; 
  }

  // Delete Language from list
  deleteLanguage(id: number): void {
    this.loadingService.show('deleting...');
    const projectLanguage = this.projectLanguages.find(lang => lang.languageId === id);
    if (projectLanguage) {
      this.singleProjectService.deleteProjectLanguage(projectLanguage.id).subscribe(
        () => {
          this.loadingService.hide();
          this.projectLanguages = this.projectLanguages.filter(lang => lang.languageId !== id);
          this.updatePaginatedProjectLanguage(); 
        },
        error => {
          console.error('Error deleting project language', error);
        }
      );
    } else {
      console.error('Project language not found');
    }
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
    return this.languages.filter(lang => 
      lang.name.toLowerCase().includes(this.selectedLanguage.toLowerCase()) &&
      !this.projectLanguages.some(pl => pl.languageId === lang.id)
    );
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
        this.loadingService.show('adding...');
        const saveRequests = newProjectLanguages.map(pl => this.singleProjectService.assignLanguageToProject(pl));
        forkJoin(saveRequests).subscribe(() => {
          this.loadingService.hide();
          // Reload the project languages after saving
          this.loadProjectLanguages(this.projectId!);
          this.selectedLanguageIds = []; 
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
