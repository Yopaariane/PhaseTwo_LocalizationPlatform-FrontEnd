import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-check',
  imports: [],
  templateUrl: './form-check.component.html',
  styleUrl: './form-check.component.css'
})
export class FormCheckComponent {
  @Input() text!: string;

}
