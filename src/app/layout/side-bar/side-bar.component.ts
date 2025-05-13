import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [MatSidenavModule, CommonModule, RouterLinkActive, RouterModule, RouterLink],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  @Input() dropdownMode: boolean = false;
  @Output() closeSidebar = new EventEmitter<void>();

  navigateAndClose() {
    if (this.dropdownMode) {
      this.closeSidebar.emit();
    }
  }

  onClickOutside() {
    if (this.dropdownMode) {
      this.closeSidebar.emit();
    }
  }
}
