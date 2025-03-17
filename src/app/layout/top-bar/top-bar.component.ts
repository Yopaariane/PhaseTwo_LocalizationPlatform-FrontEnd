import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { SidebarService } from '../../core/side-nav-bar.service';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { StorageService } from '../../core/storage.service';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  imports: [CommonModule, SideBarComponent, RouterLink, RouterModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent {
  showDropdown = false;
  showSidebar = false;

  constructor(
      private localStorage: StorageService
    ) { }

    user: { id: number, name: string } | null = null;

    ngOnInit() {
      const userData = this.localStorage.getitem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    }
  
    // Method to get user initials
    getUserInitials(name: string): string {
      if (!name) return '';
    
      const nameParts = name.trim().split(' ');
    
      if (nameParts.length > 1) {
        return nameParts[0][0] + nameParts[1][0];
      } else {
        return nameParts[0].slice(0, 2).toUpperCase();
      }
    }
  
    // Method to get user color based on name
    getUserColor(name: string): string {
      const colors = ['#FF5733', '#33B5E5', '#FFBB33', '#2BBBAD', '#FFC107'];
      let sumOfCharCodes = 0;
  
      for (let i = 0; i < name.length; i++) {
        sumOfCharCodes += name.charCodeAt(i);
      }
  
      return colors[sumOfCharCodes % colors.length];
    }
  
    // dropdown in profile 
    toggleDropdown(): void {
      this.showDropdown = !this.showDropdown;
    }
  
    hideDropdown(): void {
      setTimeout(() => {
        this.showDropdown = false;
      }, 200);
    }
    
    logout(): void {
      console.log('Logging out');
      this.showDropdown = false;
    }

    // side nav logic
    toggleSidebar(): void {
      this.showSidebar = !this.showSidebar;
    }
  
    hideSidebar(): void {
      this.showSidebar = false;
    }
  
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
      const target = event.target as HTMLElement;
      if (!target.closest('.navbar-toggler') && !target.closest('app-side-bar')) {
        this.hideSidebar();
      }
    }
}
