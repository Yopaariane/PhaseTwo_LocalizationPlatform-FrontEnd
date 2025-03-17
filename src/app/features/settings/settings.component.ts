import { Component } from '@angular/core';
import { NavBarLayoutComponent } from '../../layout/nav-bar-layout/nav-bar-layout.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [NavBarLayoutComponent, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

}
