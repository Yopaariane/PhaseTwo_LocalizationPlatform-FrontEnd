import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService, UserResponse } from '../../core/auth.service';
import { AuthLayoutComponent } from '../../shared/auth-layout/auth-layout.component';
import { InputFieldComponent } from '../../shared/input-field/input-field.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../core/storage.service';
import { LoadingService } from '../../core/loading.service';

@Component({
    selector: 'app-log-in',
    imports: [AuthLayoutComponent, InputFieldComponent, ReactiveFormsModule, RouterOutlet, RouterLink, CommonModule],
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.css',
                '../../features/sign-in/sign-in.component.css'
    ]
})
export class LogInComponent {
    logInForm!: FormGroup;
    loginError: string = '';

  constructor(private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router, 
    private loadingService: LoadingService,
    private localStorage: StorageService) {}

  ngOnInit(): void {
    this.logInForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }
  
  get nameControl(): FormControl {
    return this.logInForm.get('name') as FormControl ?? new FormControl();
  }

    get passwordControl(): FormControl {
        return this.logInForm.get('password') as FormControl ?? new FormControl();
    }

    onSubmit() {
        if (this.logInForm.valid) {
          this.loadingService.show('Loging In...');
          this.authService.login(this.logInForm.value).subscribe({
            next: (data: UserResponse) => {
              this.loadingService.hide();
              console.log('User logged in successfully:', data);
              this.localStorage.setitem('user', JSON.stringify(data));
              this.router.navigate(['/dashboard']);
            },
            error: (error) => {
              this.loadingService.hide();
              console.error('Error:', error);
              this.loginError = 'Login failed: ' + (error.error || error.message || 'Unknown error');
            }
          });
        }
      }
}
