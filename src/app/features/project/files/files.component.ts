import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../../core/language.service';
import { SortingService } from '../../../core/sorting.service';
import { LocalizedImageService } from '../../../core/localized-image.service';
import { LocalizedImage } from '../../../core/models/localizedImage.model';
import { CommonModule } from '@angular/common';
import { SortDropdownComponent } from '../../../shared/sort-dropdown/sort-dropdown.component';
import { Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { Language } from '../../../core/models/project.model';

@Component({
  selector: 'app-files',
  imports: [CommonModule, SortDropdownComponent, ReactiveFormsModule, NgbPagination, FormsModule],
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css', 
    '../../dashbord/dashbord.component.css', 
    '../terms/terms.component.css', '../imports/imports.component.css'],
})
export class FilesComponent implements OnInit {
  projectId!: number;
  files: LocalizedImage[] = [];
  imageKey!: string;
  imagePath!: string;

  currentPage = 1;
  itemsPerPage = 6;
  paginatedFiles: LocalizedImage[] = [];

  selectedFile: File | null = null;
  selectedLanguage: Language | null = null;
  showUpload = false;
  isHovering = false;
  languages: Language[] = [];
  uploadForm!: FormGroup
  newImageKey!: string;
  showDropdown: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private localizedFilesService: LocalizedImageService,
    private languageService: LanguageService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      newImageKey: [''], 
    });

    this.route.parent?.paramMap.subscribe(params => {
      this.projectId = +params.get('id')!;
    });
    this.loadFiles(this.projectId);
    this.loadLanguages();
  }

  loadFiles(projectId: number): void {
    this.localizedFilesService.getImagesByProjectId(projectId).subscribe((files) => {
      this.files = files; 
      console.log('Files:', this.files);
    });
    this.updatepaginatedFiles();
  }

  // Pagination
  pageChanged(event: any): void {
    if (event) {
        this.currentPage = event;
    } else {
        this.currentPage = 1;
    }
    this.updatepaginatedFiles();
    this.cdr.detectChanges();
  }
  updatepaginatedFiles(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedFiles = this.files.slice(startIndex, endIndex);

    this.cdr.detectChanges();
  } 
  shouldShowPagination(): boolean {
    return this.files.length > this.itemsPerPage;
  }

  // upload file
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
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }
  loadLanguages(): void {
      this.languageService.getAllLanguages().subscribe((languages: Language[]) => {
        this.languages = languages;
      });
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

  filteredLanguages(): Language[] {
    return this.languages.filter(lang => lang.name.toLowerCase());
  }
  onLanguageSelected(language: Language): void {
    this.selectedLanguage = language;
  }
  onSubmit(): void {
    const newImageKey = this.uploadForm.get('newImageKey')?.value;

    if (this.selectedFile && this.selectedLanguage && this.projectId && newImageKey) {
      this.localizedFilesService.uploadImage(this.selectedFile, this.projectId, this.selectedLanguage.id, newImageKey).subscribe({
        next: () => {
          this.loadFiles(this.projectId);
          this.showUpload = false;
        },
        error: (error) => {
          alert('Error importing file: ' + error.message);
        }
      })
    } else{
      alert('Please select a file, a language, and provide a file key.');
    }
  }
}
