import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { SocialLoginModule } from '@abacritt/angularx-social-login';

declare const google: any;

@Component({
  selector: 'app-auth-layout',
  imports: [SocialLoginModule],
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.css',
                '../../features/sign-in/sign-in.component.css'
  ]
})
export class AuthLayoutComponent implements OnInit {
  @Input() WelcomeTitle!: string;
  @Input() authTile!: string;
  @Input() linkTile!: string;

  constructor(
    private authService: AuthService,
  ){}

  ngOnInit() {
    google.accounts.id.initialize({
      client_id: "354332020338-up7gdsonl8uo70g12hq8tnk39f7n9akk.apps.googleusercontent.com",
      callback: (response: any) => this.handleGoogleLogin(response),
    });
  
    google.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      { theme: "outline", size: "large" }
    );
  }

  handleGoogleLogin(response: any) {
    console.log("Google login response:", response);
    if (response.credential) {
      this.authService.loginWithGoogle()
        .then(user => console.log('User signed up/logged in:', user))
        .catch(error => console.error('Error:', error));
    }
  }
  
  // authentication with google
  loginWithGoogle() {
    this.authService.loginWithGoogle()
      .then(user => console.log('User signed up/logged in:', user))
      .catch(error => console.error('Error:', error));
  }
}
