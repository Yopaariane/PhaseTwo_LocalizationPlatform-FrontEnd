import { Component } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar-layout',
  imports: [SideBarComponent, TopBarComponent, CommonModule],
  templateUrl: './nav-bar-layout.component.html',
  styleUrl: './nav-bar-layout.component.css'
})
export class NavBarLayoutComponent {
 
}
