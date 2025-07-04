import { Component } from '@angular/core';
import { AuthService, UserResponse } from '../../core/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { InputFieldComponent } from '../../shared/input-field/input-field.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthLayoutComponent } from '../../shared/auth-layout/auth-layout.component';
import { StorageService } from '../../core/storage.service';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../core/loading.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-sign-in',
    imports: [InputFieldComponent, ReactiveFormsModule, RouterOutlet, RouterLink, AuthLayoutComponent, CommonModule, TranslateModule],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.css'
})
export class SignInComponent {
    signUpForm: FormGroup;
    signUpError: string = '';
    isLoading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService,
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
      // this.loadingService.show('Signing In...');
      this.isLoading = true;
      this.authService.signup(this.signUpForm.value).subscribe({
        next: (data: UserResponse) => {
          this.loadingService.hide();
          this.isLoading = false;
          console.log('User signed up successfully:', data);
          this.localStorage.setitem('user', JSON.stringify(data));
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          // this.loadingService.hide();
          this.isLoading = false;
          // console.error('Error:', error);
          // this.signUpError = 'Sign up failed: ' + (error.error || error.message || 'Unknown error');
          console.error('Error:', error);
          if (error.status === 0) {
          this.signUpError = 'Connection issue. Please check your internet and try again.';
          } else if (error.status >= 500) {
          this.signUpError = 'Server error. Please try again later.';
          } else if (error.status === 401 || error.status === 403) {
            this.signUpError = 'Invalid credentials or existing email. Please try again.';
          } else {
          this.signUpError = 'Something went wrong. Please try again later.';
          }
        }
      });
    }
  }

}
