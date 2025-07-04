import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validator, Validators } from '@angular/forms';
import { ProjectService } from '../../core/project.service';
import { Project } from '../../core/models/project.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavBarLayoutComponent } from '../../layout/nav-bar-layout/nav-bar-layout.component';
import { CommonModule } from '@angular/common';
import { FormContainerComponent } from '../../shared/form-container/form-container.component';
import { Language } from '../../core/models/langauge.model';
import { LanguageService } from '../../core/language.service';
import { or } from 'firebase/firestore';
import { OrganizationService } from '../../core/organization.service';
import { LoadingService } from '../../core/loading.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-project-form',
  imports: [ReactiveFormsModule, NavBarLayoutComponent, CommonModule, FormContainerComponent, TranslateModule],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  projects: Project[] = [];
  languages: Language[] = [];
  showDropdown: boolean = false;
  selectedLanguage: Language | null = null;
  organizationId: number | null = null;
  orgText: string | null = null;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private languageService: LanguageService,
    private organizationService: OrganizationService,
    private loadingService: LoadingService,
  ){
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.nullValidator],
      defaultLangId: [1, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadLanguages();
    this.setDefaultLanguage();

    this.projectForm.valueChanges.subscribe(() => {
      this.checkFormValidity();
    });

    this.route.queryParams.subscribe(params => {
      const orgText = params['orgText'];
      const orgId = params['orgId'];
      console.log('orgText', orgText);
      if (orgId) {
        this.organizationId = Number(orgId);
      }
      if (orgText) {
        this.orgText = orgText;
      }
    });
  }

  checkFormValidity(): void {
    if (this.projectForm.invalid) {
      Object.keys(this.projectForm.controls).forEach(field => {
      const control = this.projectForm.get(field);
      if (control) {
        control.markAsTouched({ onlySelf: true });
      }
      });
    }
  }

  getUserId(): number | null {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user).id;
    }
    return null;
  }

  addProject(): void {
    if (this.projectForm.valid) {
      const newEntity = this.projectForm.value;
      const userId = this.getUserId();
  
      if (userId !== null) {
  
        if (this.orgText) {
          // Save for organization
          this.loadingService.show('Loading languages...');
          newEntity.userId = userId;
          delete newEntity.description;
          this.organizationService.createOrganization(newEntity).subscribe((organization) => {
            this.loadingService.hide();
            console.log('Organization created:', organization);
            this.projectForm.reset();
            this.router.navigate(['/organization', organization.id]);
          });
        } else {
          // Save for project
          this.loadingService.show('Loading languages...');
          newEntity.ownerId = userId;
          newEntity.organizationId = this.organizationId;
          this.projectService.createProject(newEntity).subscribe((project) => {
            console.log('Project created:', project);
            this.loadingService.hide();
            this.projects.push(project);
            this.projectForm.reset();
            this.setDefaultLanguage();
            this.router.navigate(['/project', project.id]);
          });
        }
      } else {
        console.error('User ID not found in local storage.');
      }
    }
  }

  onSubmit(): void {
    this.checkFormValidity();
    this.addProject();
  }

  loadLanguages(): void {
    this.languageService.getAllLanguages().subscribe((languages: Language[]) => {
      this.languages = languages;
    });
  }
  filteredLanguages(): Language[] {
    return this.languages.filter(lang => lang.name.toLowerCase());
  }
  hideDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }
  selectLanguage(language: Language): void {
    this.selectedLanguage = language;
    this.projectForm.patchValue({ defaultLangId: language.id });
    this.showDropdown = false;
  }

  setDefaultLanguage(): void {
    const defaultLanguage = this.languages.find(lang => lang.id === 1);
    if (defaultLanguage) {
      this.selectedLanguage = defaultLanguage;
      this.projectForm.patchValue({ defaultLanguage: defaultLanguage.id });
    }
  }
}
