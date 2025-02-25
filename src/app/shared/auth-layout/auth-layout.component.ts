import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-layout',
  imports: [],
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.css',
                '../../features/sign-in/sign-in.component.css'
  ]
})
export class AuthLayoutComponent {
  @Input() WelcomeTitle!: string;
  @Input() authTile!: string;
  @Input() linkTile!: string;
}
