import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { AuthLayoutComponent } from '../../shared/auth-layout/auth-layout.component';
import { InputFieldComponent } from '../../shared/input-field/input-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-log-in',
    imports: [AuthLayoutComponent, InputFieldComponent, ReactiveFormsModule, RouterOutlet, RouterLink],
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.css',
                '../../features/sign-in/sign-in.component.css'
    ]
})
export class LogInComponent {
    logInForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.logInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  get emailControl(): FormControl {
    return this.logInForm.get('email') as FormControl ?? new FormControl();
  }

    get passwordControl(): FormControl {
        return this.logInForm.get('password') as FormControl ?? new FormControl();
    }

  onSubmit(): void {
    if (this.logInForm.valid) {
      this.authService.login(this.logInForm.value).subscribe(response => {
        // Handle successful login
      });
    }
  }
}
