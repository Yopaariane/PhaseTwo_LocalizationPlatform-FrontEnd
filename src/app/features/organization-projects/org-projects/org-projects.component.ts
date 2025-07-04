import { Component, OnInit } from '@angular/core';
import { Project } from '../../../core/models/project.model';
import { LanguageService } from '../../../core/language.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TermsService } from '../../../core/terms.service';
import { TranslationService } from '../../../core/translation.service';
import { OrganizationService } from '../../../core/organization.service';
import { CommonModule } from '@angular/common';
import { SortDropdownComponent } from '../../../shared/sort-dropdown/sort-dropdown.component';
import { Organization } from '../../../core/models/organization.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-org-projects',
  imports: [RouterLink, CommonModule, SortDropdownComponent, TranslateModule],
  templateUrl: './org-projects.component.html',
  styleUrls: ['./org-projects.component.css', '../../dashbord/dashbord.component.css']
})
export class OrgProjectsComponent implements OnInit{
  organizationId!: number;
  projects: Project[] = [];
  organizationName!: string;

  constructor(
    private languageService: LanguageService,
    private route: ActivatedRoute,
    private termsService: TermsService,
    private translationService: TranslationService,
    private organizationService: OrganizationService,
  ){}

  ngOnInit(): void {
    this.organizationId = this.route.parent?.snapshot.params['id'];
    if (this.organizationId) {
      this.loadOrganizationProjects(this.organizationId);
    }
  }

  loadOrganizationProjects(id: number): void {
    this.organizationService.getOrganizationById(id).subscribe((organization: Organization) => {
      this.organizationName = organization.name;
    });

    this.organizationService.getProjectsByOrganization(id).subscribe((projects) => {
      this.projects = projects;

      this.projects.forEach(project =>{
        this.getTotalStringCount(project.id);
          this.calculateTranslationProgress(project);
      })
      console.log('Organization-projects', projects);
    });
  }

  calculateTranslationProgress(project: Project): void {
    this.translationService.getOverallTranslationProgressForProject(project.id).subscribe(
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

  getFlagClass(languageCode: string): string {
    return `fi fi-${this.languageService.getCountryCode(languageCode)}`;
  }
}
