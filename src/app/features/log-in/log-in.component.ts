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
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-log-in',
    imports: [AuthLayoutComponent, InputFieldComponent, ReactiveFormsModule, RouterOutlet, RouterLink, CommonModule, TranslateModule],
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.css',
                '../../features/sign-in/sign-in.component.css'
    ]
})
export class LogInComponent {
    logInForm!: FormGroup;
    loginError: string = '';
    isLoading: boolean = false;

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
          // this.loadingService.show('Loging In...');
          this.isLoading = true;
          this.authService.login(this.logInForm.value).subscribe({
            next: (data: UserResponse) => {
              // this.loadingService.hide();
              this.isLoading = false;
              console.log('User logged in successfully:', data);
              this.localStorage.setitem('user', JSON.stringify(data));
              this.router.navigate(['/dashboard']);
            },
            error: (error) => {
              // this.loadingService.hide();
              this.isLoading = false;
              console.error('Error:', error);
                if (error.status === 0) {
                this.loginError = 'Connection issue. Please check your internet and try again.';
                } else if (error.status >= 500) {
                this.loginError = 'Server error. Please try again later.';
                } else if (error.status === 401 || error.status === 403) {
                this.loginError = 'Wrong name or password. Please try again.';
                } else {
                this.loginError = 'Something went wrong. Please try again later.';
                }
            }
          });
        }
      }
}
