import { Component } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { SidebarService } from '../../core/side-nav-bar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-bar',
  imports: [MatSidenavModule, CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
private sidebarOpen = false;

  constructor(
    public sidenavbarService: SidebarService
  ) { }

  isOpened(): boolean {
    return this.sidebarOpen;
  }

  toggleSidebar() {
    this.sidenavbarService.toggle();
  }

  isSidebarOpen(): boolean {
    return this.sidenavbarService.isOpen();
  }
}
