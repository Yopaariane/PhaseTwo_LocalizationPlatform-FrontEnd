import { Component } from '@angular/core';
import { AuthService, UserResponse } from '../../core/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { InputFieldComponent } from '../../shared/input-field/input-field.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthLayoutComponent } from '../../shared/auth-layout/auth-layout.component';
import { StorageService } from '../../core/storage.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sign-in',
    imports: [InputFieldComponent, ReactiveFormsModule, RouterOutlet, RouterLink, AuthLayoutComponent, CommonModule],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.css'
})
export class SignInComponent {
    signUpForm: FormGroup;
    signUpError: string = '';

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router,
    private localStorage: StorageService) {
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get nameControl(): FormControl {
    return this.signUpForm.get('name') as FormControl ?? new FormControl();
  }

    get emailControl(): FormControl {
        return this.signUpForm.get('email') as FormControl ?? new FormControl();
    }

    get passwordControl(): FormControl {
        return this.signUpForm.get('password') as FormControl ?? new FormControl();
    }
  

  onSubmit() {
    if (this.signUpForm.valid) {
      this.authService.signup(this.signUpForm.value).subscribe({
        next: (data: UserResponse) => {
          console.log('User signed up successfully:', data);
          this.localStorage.setitem('user', JSON.stringify(data));
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error:', error);
          this.signUpError = 'Sign up failed: ' + (error.error || error.message || 'Unknown error');
        }
      });
    }
  }

}
