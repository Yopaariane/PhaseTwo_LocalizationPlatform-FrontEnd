import { Component, OnInit } from '@angular/core';
import { NavBarLayoutComponent } from '../../layout/nav-bar-layout/nav-bar-layout.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { StorageService } from '../../core/storage.service';
import { OrganizationService } from '../../core/organization.service';
import { Organization } from '../../core/models/organization.model';
import { Project } from '../../core/models/project.model';
import { TermsService } from '../../core/terms.service';
import { TranslationService } from '../../core/translation.service';
import { SortDropdownComponent } from '../../shared/sort-dropdown/sort-dropdown.component';
import { LanguageService } from '../../core/language.service';

@Component({
  selector: 'app-organization-projects',
  imports: [NavBarLayoutComponent, CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './organization-projects.component.html',
  styleUrls:[ './organization-projects.component.css',
    '../organization/organization.component.css', '../dashbord/dashbord.component.css', '../project/project.component.css'
  ]
})
export class OrganizationProjectsComponent implements OnInit {
  organizationId!: number;
  organizationName!: string;
  organizationProgress!: number;

  constructor(
    private languageService: LanguageService,
    private organizationService: OrganizationService,
    private route: ActivatedRoute,
    private termsService: TermsService,
    private translationService: TranslationService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.organizationId = Number(id);
        this.loadOrganizationProjects(this.organizationId);
        this.translationService.getAverageTranslationProgressForOrganization(this.organizationId).subscribe((progress: number) => {
          this.organizationProgress = progress;
        });
      }
    });
  }

  loadOrganizationProjects(id: number): void {
    this.organizationService.getOrganizationById(id).subscribe((organization: Organization) => {
      this.organizationName = organization.name;
    });
  }
}
