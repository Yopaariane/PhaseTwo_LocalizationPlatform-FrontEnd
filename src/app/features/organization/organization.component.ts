import { Component, OnInit } from '@angular/core';
import { NavBarLayoutComponent } from '../../layout/nav-bar-layout/nav-bar-layout.component';
import { SortDropdownComponent } from '../../shared/sort-dropdown/sort-dropdown.component';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Organization } from '../../core/models/organization.model';
import { user } from '@angular/fire/auth';
import { StorageService } from '../../core/storage.service';
import { OrganizationService } from '../../core/organization.service';
import { LanguageService } from '../../core/language.service';
import { Language, Project } from '../../core/models/project.model';
import { ProjectService } from '../../core/project.service';
import { TranslationService } from '../../core/translation.service';
import { LoadingService } from '../../core/loading.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-organization',
  imports: [NavBarLayoutComponent, SortDropdownComponent, RouterLink, CommonModule, TranslateModule],
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css','../dashbord/dashbord.component.css']
})
export class OrganizationComponent implements OnInit {
  organizations: Organization[] = [];
  organizationId!: number;
  defaultLanguage: string | undefined;
  newOrganization: string = 'newOrganization';
  isLoading: boolean = false;

  constructor(
    private organizationService: OrganizationService,
    private localStorageService: StorageService,
    private languageService: LanguageService,
    private projectService: ProjectService,
    private translationService: TranslationService,
    private loadingService: LoadingService,
  ) {}

  ngOnInit(): void {
    this.loadOrganizations();
    const userId = this.getUserId();
    if (user !== null) {
      // this.fetchOrganizationsByUser(userId);
    }
  }

  getUserId(): number  | null {
    const user = this.localStorageService.getitem('user');
    if (user) {
      return JSON.parse(user).id;
    }
    return null;
  }

  loadOrganizations(): void {
    // this.loadingService.show('Loading organizations...');
    this.isLoading = true;
    const userId = this.getUserId();
    if (userId !== null) {
      this.organizationService.getOrganizationsByUser(userId).subscribe((organizations) => {
        // this.loadingService.hide();
        this.isLoading = false;
        this.organizations = organizations;

        console.log('Organizations', this.organizations);

        this.organizations.forEach(organization => {
          this.fetchAverageTranslationProgressForOrganization(organization);
          this.languageService.getLanguageById(organization.defaultLangId).subscribe((language: Language) => {
            organization.defaultLangCode = language.code;
          });
          console.log("organization language", organization.defaultLangCode);
        });

      });
    } else {
      // this.loadingService.hide();
      this.isLoading = false;
      console.log('User not found');
    }
  } 

  fetchAverageTranslationProgressForOrganization(organization: Organization): void {
    this.translationService.getAverageTranslationProgressForOrganization(organization.id).subscribe({
      next: (progress: number) => {
        organization.progress = progress;
      },
      error: (error) => {
        console.log('Error fetching average translation progress for organization', error);
      }
    });
  }

  getFlagClass(languageCode: string): string {
    return `fi fi-${this.languageService.getCountryCode(languageCode)}`;
  }
}
