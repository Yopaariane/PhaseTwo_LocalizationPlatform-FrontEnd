import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgModelGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SortDropdownComponent } from '../../../shared/sort-dropdown/sort-dropdown.component';
import { ActivatedRoute} from '@angular/router';
import { GlossaryService } from '../../../core/glossary.service';

@Component({
  selector: 'app-org-glossary',
  imports: [CommonModule, ReactiveFormsModule, SortDropdownComponent],
  templateUrl: './org-glossary.component.html',
  styleUrls: ['./org-glossary.component.css', '../../dashbord/dashbord.component.css']
})
export class OrgGlossaryComponent implements OnInit {
  formGroup: FormGroup;
  organizationId!: number;
  draftGlossaries: { [id: string]: boolean } = {};
  activeInputs: { [rowId: number]: boolean } = {};

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private glossaryService: GlossaryService,
  ) {
    this.formGroup = this.fb.group({
      rows: this.fb.array([])
    });
  }

  ngOnInit(): void {  
    this.route.parent?.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.organizationId = Number(id);
        this.loadOrganizationGlossary(this.organizationId);
        this.loadDraftGlossaries();
      }
    });
  
    this.loadFromLocalStorage(); 
  }
  

  get rows(): FormArray {
    return this.formGroup.get('rows') as FormArray;
  }

  onInput(rowId: number): void {
    this.activeInputs[rowId] = !!this.draftGlossaries[rowId];
    this.saveDraftGlossaries();
  }

  createRow(data: any = {}): FormGroup {
    const row = this.fb.group({
      term: [data.term || '', Validators.required],
      initial_translation: [data.initial_translation || '', Validators.required],
      context: [data.context || '', Validators.required],
      translatable: [data.translatable || 'yes'],
      comment: [data.comment || ''],
      status: [data.status || 'Pending'],
      isEditing: [data.isEditing || false],
      organizationId: [data.organizationId || this.organizationId]
    });
  
    return row;
  }
  

  addRow(): void {
    const newRow = this.createRow({ isEditing: true });
    this.rows.push(newRow);
    this.saveToLocalStorage();
  }

  deleteRow(index: number): void {
    const row = this.rows.at(index);
    const id = row.get('id')?.value;

    if (id) {
      this.glossaryService.deleteGlossary(id).subscribe(() => {
        this.rows.removeAt(index);
        this.saveToLocalStorage();
      });
    } else {
      this.rows.removeAt(index);
      this.saveToLocalStorage();
    }
  }

  onSubmit(index: number): void {
    const row = this.rows.at(index);
    const rowId = row.get('id')?.value;
    console.log('Submitting row:', row.value); 
    console.log('Row validity:', row.valid); 

    if (row.invalid) {
      alert('Please fill in all required fields before saving.');
      return;
    }
  
    const { isEditing, ...glossaryData } = row.value;
  
    if (rowId) {
      this.glossaryService.updateGlossary(rowId, glossaryData).subscribe(updated => {
        row.patchValue({ ...updated, isEditing: false });
      });
    } else {
      this.glossaryService.createGlossary(glossaryData).subscribe({
        next: (created) => {
          row.patchValue({ ...created, isEditing: false, id: created.id }); 
        },
        error: (err) => {
          console.error('Error creating glossary:', err);
          alert('Failed to create glossary. Please try again.');
        }
      });
    }
  }
  

  saveToLocalStorage(): void {
    const unsavedData = this.rows.value.filter((row: any) => !row.id);
    localStorage.setItem('unsavedGlossary', JSON.stringify(unsavedData));
  }

  loadFromLocalStorage(): void {
    const unsavedData = JSON.parse(localStorage.getItem('unsavedGlossary') || '[]');
    unsavedData.forEach((data: any) => {
      this.rows.push(this.createRow({ ...data, isEditing: true }));
    });
  }


  editRow(index: number): void {
    const row = this.rows.at(index);
    row.get('isEditing')?.setValue(true);
  }

  getStatusColor(status: string | null): string {
    switch (status) {
        case 'Approved':
            return '#46B24D';
        case 'NotApproved':
            return 'red';
        case 'Pending':
            return 'lightgray';
        default:
            return 'black';
    }
  }

  loadOrganizationGlossary(organizationId: number): void {
    this.glossaryService.getGlosssaryByOrganizationId(organizationId).subscribe(glossaries => {
      this.rows.clear(); 
      glossaries.forEach(glossary => {
        this.rows.push(this.createRow({ ...glossary, isEditing: false }));
      });
      this.saveToLocalStorage();
    });
  }

  saveDraftGlossaries(): void {
    const key = `draftGlossaries_${this.organizationId}`;
    localStorage.setItem(key, JSON.stringify(this.draftGlossaries));
  }
  
  loadDraftGlossaries(): void {
    const key = `draftGlossaries_${this.organizationId}`;
    const savedDrafts = localStorage.getItem(key);
    if (savedDrafts) {
      this.draftGlossaries = JSON.parse(savedDrafts);
    }
  }
  
  clearDraftGlossary(rowId: number): void {
    delete this.draftGlossaries[rowId];
    this.saveDraftGlossaries();
  }
}
