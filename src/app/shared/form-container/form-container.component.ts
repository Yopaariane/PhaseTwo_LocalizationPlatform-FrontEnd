import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-container',
  imports: [ReactiveFormsModule],
  templateUrl: './form-container.component.html',
  styleUrl: './form-container.component.css'
})
export class FormContainerComponent {
  @Input() title: string = '';
  @Input() formGroup: FormGroup = new FormGroup({});
  @Input() submitButtonText: string = 'save';
  @Output() formSubmit = new EventEmitter<void>();

goBack() {
  if (window && window.history) {
    window.history.back();
  }
}

  onSubmit() {
    this.formSubmit.emit();
  }
}
