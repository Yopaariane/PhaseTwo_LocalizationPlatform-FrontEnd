import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validator, Validators } from '@angular/forms';
import { ProjectService } from '../../core/project.service';
import { Project } from '../../core/models/project.model';
import { Router, RouterLink } from '@angular/router';
import { NavBarLayoutComponent } from '../../layout/nav-bar-layout/nav-bar-layout.component';
import { CommonModule } from '@angular/common';
import { FormContainerComponent } from '../../shared/form-container/form-container.component';
import { Language } from '../../core/models/langauge.model';
import { LanguageService } from '../../core/language.service';

@Component({
  selector: 'app-project-form',
  imports: [ReactiveFormsModule, NavBarLayoutComponent, CommonModule, FormContainerComponent],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.css'
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  projects: Project[] = [];
  languages: Language[] = [];
  showDropdown: boolean = false;
  selectedLanguage: Language | null = null;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private projectService: ProjectService,
    private languageService: LanguageService,
  ){
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      defaultLangId: [1, Validators.required],
    });

    // this.loadLanguages();

    // this.projectForm.valueChanges.subscribe(() => {
    //   this.checkFormValidity();
    // });
  }

  ngOnInit(): void {
    this.loadLanguages();
    this.setDefaultLanguage();

    this.projectForm.valueChanges.subscribe(() => {
      this.checkFormValidity();
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
      const newProject = this.projectForm.value;
      const userId = this.getUserId();
      if (userId !== null) {
        newProject.ownerId = userId;
        this.projectService.createProject(newProject).subscribe((project) => {
          this.projects.push(project);
          this.projectForm.reset();
          this.setDefaultLanguage();
          this.router.navigate(['/project', project.id]);
        });
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
    this.projectForm.patchValue({ defaultLanguage: language.id });
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
