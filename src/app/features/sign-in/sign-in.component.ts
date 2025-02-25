import { Component } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { InputFieldComponent } from '../../shared/input-field/input-field.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthLayoutComponent } from '../../shared/auth-layout/auth-layout.component';

@Component({
    selector: 'app-sign-in',
    imports: [InputFieldComponent, ReactiveFormsModule, RouterOutlet, RouterLink, AuthLayoutComponent],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.css'
})
export class SignInComponent {
    signUpForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get usernameControl(): FormControl {
    return this.signUpForm.get('username') as FormControl ?? new FormControl();
  }

    get emailControl(): FormControl {
        return this.signUpForm.get('email') as FormControl ?? new FormControl();
    }

    get passwordControl(): FormControl {
        return this.signUpForm.get('password') as FormControl ?? new FormControl();
    }
  

  onSubmit() {
    if (this.signUpForm.valid) {
      this.authService.signup(this.signUpForm.value).subscribe(response => {
        console.log('User signed up:', response);
      });
    }
  }
}
