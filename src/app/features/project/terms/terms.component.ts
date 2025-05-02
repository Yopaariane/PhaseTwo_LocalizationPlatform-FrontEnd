import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ProjectLanguage } from '../../../core/models/project-language.model';
import { Terms } from '../../../core/models/term.model';
import { FormBuilder } from '@angular/forms';
import { Language } from '../../../core/models/langauge.model';
import { TermsService } from '../../../core/terms.service';
import { TranslationService } from '../../../core/translation.service';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { SingleProjectService } from '../../../core/single-project.service';
import { LanguageService } from '../../../core/language.service';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SortDropdownComponent } from '../../../shared/sort-dropdown/sort-dropdown.component';
import { SortingService } from '../../../core/sorting.service';
import { StorageService } from '../../../core/storage.service';

@Component({
  selector: 'app-terms',
  imports: [NgbPagination, CommonModule, RouterLink, RouterModule, SortDropdownComponent],
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css', '../../dashbord/dashbord.component.css']
})
export class TermsComponent implements OnInit, AfterViewInit {
  @ViewChild('addTermModal', { static: true }) addTermModal!: TemplateRef<any>;

  projectId: number | null = null;
  noTerms = false;

  projectLanguage: ProjectLanguage[] = [];
  terms: Terms[] = [];

  currentPage = 1;
  itemsPerPage = 8;
  paginatedTerms: Terms[] = [];
  languages: Language[] = [];

  sortOrder: string = 'Date Asc';

  constructor(
    private fb: FormBuilder,
    private termsService: TermsService,
    private translationService: TranslationService,
    private route: ActivatedRoute,
    private singleProjectService: SingleProjectService,
    private languageService: LanguageService,
    private sortingService: SortingService,
    private localStirageService: StorageService,
  ){

    this.route.data.subscribe(data => {
      this.terms = data['terms'];
  
      if (this.terms.length === 0) {
        this.noTerms = true;
      } else {
        this.noTerms = false;
        this.terms.forEach(term =>{ 
          term['progress'] = 0;
          this.calculateTranslationProgress(term)});
        this.updatePaginatedTerms();
      }
    });
  }

  ngOnInit(): void {
    this.sortingService.sortOrder$.subscribe(order => {
      this.sortOrder = order;
      this.sortTerms();
    });

    this.route.parent?.paramMap.subscribe(params => {
      this.projectId = +params.get('id')!;
    });
    console.log('Project ID:', this.projectId);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.terms.forEach(term => {
        term['progress'] = term.progress; 
      });
    }, 100); 
  }

  // Load terms in the list
  // loadTerms(projectId: number): void {
  //   console.log('Loading terms for project:', projectId);
  //   this.termsService.getTermsByProjectId(projectId).subscribe(
  //     (terms: Terms[]) => {
  //       if (terms.length === 0) {
  //         this.noTerms = true;
  //       } else {
  //         this.noTerms = false;
  //         this.terms = terms;
  //         // For each term, calculate the translation progress
  //       this.terms.forEach(term => {
  //         this.calculateTranslationProgress(term);
  //       });
  //       this.updatePaginatedTerms();
  //       }
  //     },
  //     error => {
  //       console.error('Error loading project terms', error);
  //     }
  //   );
  // }

  // loadLanguages(projectId: number): void {
  //   this.singleProjectService.getLanguageByProjectId(projectId).subscribe((projectLanguage: ProjectLanguage[]) => {
  //     this.projectLanguage = projectLanguage;

  //     projectLanguage.forEach((projectLanguage) =>{
  //       this.languageService.getLanguageById(projectLanguage.languageId).subscribe((languages) =>{
  //         this.languages.push(languages);
  //       })
  //     })
  //   });
  // }


  // Pagination
  pageChanged(event: any): void {
    if (event) {
        this.currentPage = event;
        console.log("Current page:", this.currentPage);
    } else {
        this.currentPage = 1;
    }
    this.updatePaginatedTerms();
  }
  updatePaginatedTerms(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTerms = this.terms.slice(startIndex, endIndex);
  } 
  shouldShowPagination(): boolean {
    return this.terms.length > this.itemsPerPage;
  }

  calculateTranslationProgress(term: Terms): void {
    this.translationService.getTranslationProgressForTerm(term.id).subscribe(
      (progress: number) => {
        term['progress'] = progress;
      },
      error => {
        console.error(`Error fetching translation progress for term ${term.id}`, error);
      }
    );
  }
  

  getTermsNameById(id: number): string{
    const terms = this.terms.find(term => term.id === id);
    return terms ? terms.term : 'Unknown Term';
  }

  getUserId(): number | null {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user).id;
    }
    return null;
  }

  // Delete term
  deleteTerm(id: number): void {
    const userId = this.getUserId();
    if (userId !== null) {
      this.termsService.deleteTerm(id, userId).subscribe(
        () => {
          this.terms = this.terms.filter(term => term.id !== id);
          this.reloadPage();
        },
        error => {
          console.error('Error deleting term:');
        }
      );
    } else {
      console.error('User ID is null. Cannot delete term.');
    }
  }

  reloadPage(): void {
    window.location.reload();
  }

  // Search toggle
  isSearchVisible: boolean = false;

  toggleSearch(): void {
    this.isSearchVisible = !this.isSearchVisible;
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
    this.updatePaginatedTerms();
  }
}
