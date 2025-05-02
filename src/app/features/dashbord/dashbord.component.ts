import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavBarLayoutComponent } from '../../layout/nav-bar-layout/nav-bar-layout.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProgressCircleComponent } from '../../shared/progress-circle/progress-circle.component';
import { Project } from '../../core/models/project.model';
import { UserRole } from '../../core/models/user-role.model';
import { Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../core/project.service';
import { TermsService } from '../../core/terms.service';
import { TranslationService } from '../../core/translation.service';
import { LanguageService } from '../../core/language.service';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SortingService } from '../../core/sorting.service';
import { SortDropdownComponent } from '../../shared/sort-dropdown/sort-dropdown.component';
import { Organization } from '../../core/models/organization.model';
import { OrganizationService } from '../../core/organization.service';


@Component({
  selector: 'app-dashbord',
  imports: [NavBarLayoutComponent, MatGridListModule, ProgressCircleComponent, CommonModule, RouterLink, NgbPaginationModule, SortDropdownComponent],
  templateUrl: './dashbord.component.html',
  styleUrl: './dashbord.component.css'
})
export class DashbordComponent implements OnInit {
  projects: Project[] = [];
  userRole: UserRole[] = [];
  organizations: Organization[] = [];
  totalStringCount: number | undefined;
  adminId!: number;
  roleId: number = 2;
  averageProgress: number = 0;
  totalStringNumber: number | undefined;
  stringProgress: number = 0;


  projectRoles: { projects: Project }[] = [];

  currentPage = 1;
  itemsPerPage = 6;
  paginatedProjects: Project[] = [];

  sortOrder: string = 'Date Asc';

  constructor(
    private projectService: ProjectService,
    private termsService: TermsService,
    private translationListService: TranslationService,
    private cdr: ChangeDetectorRef,
    private languageService: LanguageService,
    private userRoleService: AuthService,
    private sortingService: SortingService,
    private organizationService: OrganizationService,
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    const userId = this.getUserId();
    if (userId !== null) {
      this.fetchTotalStringNumber(userId);
      this.fetchStringsTranslationProgress(userId);
      this.fetchAverageTranslationProgressForUser(userId);
    }

    this.sortingService.sortOrder$.subscribe(order => {
      this.sortOrder = order;
      this.sortProjects();
    });
  }

  getUserId(): number | null {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user).id;
    }
    return null;
  }

  getFlagClass(languageCode: string): string {
    return `fi fi-${this.languageService.getCountryCode(languageCode)}`;
  }

  updateSortOrder(order: string) {
    this.sortOrder = order;
    this.sortProjects();
  }

  loadProjects(): void {
    const userId = this.getUserId();
    if (userId !== null) {
      this.adminId = userId; 

      this.projectService.getUserProjects(userId).subscribe((projects) => {
        this.projects = projects;
        console.log('Projects', projects);

        // Fetch total string count and progress for each project
        this.projects.forEach(project => {
          if (project.ownerId !== this.adminId) {
            this.userRoleService.getRoleById(project.roleId).subscribe(role => {
                project['roleName'] = role.name; 
            });
          }
          this.getTotalStringCount(project.id);
          this.calculateTranslationProgress(project);
        });
        // Pagination
        this.sortProjects();
        this.updatePaginatedProjects();
      });

      this.organizationService.getOrganizationsByUser(userId).subscribe((organizations) => {
        this.organizations = organizations;
      });

      this.userRoleService.getRolesByUserId(userId).subscribe((userRoles) => {
        this.userRole = userRoles;
      });

    } else {
      console.error('User ID not found in local storage.');
    }
  }

  sortProjects() {
    this.projects.sort((a, b) => {
      switch (this.sortOrder) {
        case 'Date Asc': return new Date(a.createAt).getTime() - new Date(b.createAt).getTime();
        case 'Date Desc': return new Date(b.createAt).getTime() - new Date(a.createAt).getTime();
        case 'Name Asc': return a.name.localeCompare(b.name);
        case 'Name Desc': return b.name.localeCompare(a.name);
        default: return 0;
      }
    });
    this.updatePaginatedProjects();
  }

  // Pagination
  pageChanged(event: any): void {
    if (event) {
        this.currentPage = event;
        console.log("Current page:", this.currentPage);
    } else {
        this.currentPage = 1;
    }
    this.updatePaginatedProjects();
    this.cdr.detectChanges();
  }
  updatePaginatedProjects(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProjects = this.projects.slice(startIndex, endIndex);

    this.cdr.detectChanges();
  } 
  shouldShowPagination(): boolean {
    return this.projects.length > this.itemsPerPage;
  }

  calculateTranslationProgress(project: Project): void {
    this.translationListService.getOverallTranslationProgressForProject(project.id).subscribe(
      (progress: number) => {
        project['progress'] = progress;
      },
      error => {
        console.error(`Error fetching translation progress for term ${project.id}`, error);
      }
    );
  }

  getTotalStringCount(projectId: number): void {
    this.termsService.getTotalStringCountByProjectId(projectId)
      .subscribe({
        next: (stringCount: number) => { 
          const project = this.projects.find(p => p.id === projectId);
          if (project) {
            project.strings = stringCount; 
          }
        },
        error: (error) => {
          console.error('Error fetching total string count', error);
        }
      });
  }

  fetchTotalStringNumber(userId: number): void {
    this.translationListService.getTotalStringNumber(userId).subscribe(
      (totalStrings) => {
        this.totalStringNumber = totalStrings;
      },
      (error) => {
        console.error('Error fetching total string number', error);
      }
    );
  }

  fetchStringsTranslationProgress(adminId: number): void {
    this.translationListService.getStringsTranslationProgress(adminId).subscribe(
      (progress) => {
        this.stringProgress = progress;
        console.log(progress);
      },
      (error) => {
        console.error('Error fetching strings translation progress', error);
      }
    );
  }

  fetchAverageTranslationProgressForUser(adminId: number): void{
    this.translationListService.getAverageTranslationProgressForUser(adminId).subscribe(
      (averageProgress) => {
        this.averageProgress = averageProgress;
      }
    );
  }
}
