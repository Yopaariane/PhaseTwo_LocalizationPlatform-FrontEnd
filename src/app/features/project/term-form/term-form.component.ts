import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TermsService } from '../../../core/terms.service';
import { Terms } from '../../../core/models/term.model';
import { NavBarLayoutComponent } from '../../../layout/nav-bar-layout/nav-bar-layout.component';
import { FormContainerComponent } from '../../../shared/form-container/form-container.component';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/loading.service';

@Component({
  selector: 'app-term-form',
  imports: [FormContainerComponent, ReactiveFormsModule, CommonModule, NavBarLayoutComponent],
  templateUrl: './term-form.component.html',
  styleUrl: './term-form.component.css'
})
export class TermFormComponent {
  termsForm: FormGroup;
  projectId: number | null = null;
  terms: Terms[] = [];

  constructor(
    private route: ActivatedRoute,
    private termsService: TermsService,
    private fb: FormBuilder,
    private loadingService: LoadingService,
  ){
    this.route.paramMap.subscribe(params => {
      const projectId = params.get('projectId');
      console.log("project id " ,projectId);
      
      if (projectId) {
        this.projectId = Number(projectId);
        this.initializeForm()
      }
    });

    this.termsForm = this.fb.group({
      term: ['', Validators.required],
      context:['', Validators.nullValidator],
      projectId:[this.projectId, Validators.nullValidator]
    });
  }

  initializeForm()  {
  }

  addTerm(): void {
    console.log('projectId:', this.projectId);

    if (this.termsForm.valid) {
      this.loadingService.show('adding term...');
      const newTerm = { ...this.termsForm.value, projectId: this.projectId }; 
       
      this.termsService.createTerms(newTerm).subscribe((terms) => {
        this.terms.push(terms);
        this.loadingService.hide();
        this.termsForm.reset();
        this.reloadPage();
      });
    }
  }

  reloadPage(): void{
    window.location.reload()
  }
}
