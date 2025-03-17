import { Component } from '@angular/core';
import { Language } from '../../../core/models/langauge.model';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from '../../../core/language.service';
import { ImportService } from '../../../core/import.service';
import { SingleProjectService } from '../../../core/single-project.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-imports',
  imports: [CommonModule, FormsModule],
  templateUrl: './imports.component.html',
  styleUrl: './imports.component.css'
})
export class ImportsComponent {
  isHovering = false;
  selectedFile: File | null = null;
  showDropdown: boolean = false;
  projectId: number | undefined;
  languages: Language[] = [];
  selectedLanguage: Language | null = null;
  creatorId!: number;

  constructor(
    private route: ActivatedRoute,
    private languageService: LanguageService,
    private importService: ImportService,
    private singleProjectService: SingleProjectService,
    private router: Router
  ){}

  ngOnInit(): void {
    const userId = this.getUserIdFromLocalStorage();
    if (userId) {
      this.creatorId = userId;
    }

    this.route.parent?.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.projectId = Number(id);
        this.loadLanguages();
      }
    });
  }

  getUserIdFromLocalStorage(): number | null {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user).id;
    }
    return null;
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
    this.showDropdown = false;
  }


  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isHovering = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isHovering = false;
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    this.isHovering = false;

    if (event.dataTransfer?.files.length) {
      this.selectedFile = event.dataTransfer.files[0];
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  importToProject() {
    if (this.selectedFile && this.projectId && this.selectedLanguage) {
      this.importService.uploadFile(this.selectedFile, this.projectId, this.selectedLanguage.id, this.creatorId)
        .subscribe({
          next: () => {
            alert('File imported successfully!');
          },
          error: (error) => {
            alert('Error importing file: ' + error.message);
          }
        });
    } else {
      alert('Please select a file, and language to import.');
    }
  }
}
