import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  imports: [CommonModule, MatInputModule, MatCommonModule, MatIconModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.css',
})
export class InputFieldComponent {
  @Input() label!: string;
  @Input() type: string = 'text'; ;
  @Input() placeholder!: string;
  @Input() icon!: string;

  private _control: FormControl = new FormControl();

  @Input() set control(value: FormControl | null) {
    this._control = value ?? new FormControl();
  }

  get control(): FormControl {
    return this._control;
  }

  isPasswordVisible: boolean = false;

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
