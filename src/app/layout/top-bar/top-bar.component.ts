import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { SidebarService } from '../../core/side-nav-bar.service';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { StorageService } from '../../core/storage.service';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { RouterLink, RouterModule } from '@angular/router';
import { AiAssistantComponent } from '../../shared/ai-assistant/ai-assistant.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-top-bar',
  imports: [CommonModule, SideBarComponent, RouterLink, RouterModule, AiAssistantComponent, TranslateModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent {
  showDropdown = false;
  showSidebar = false;
  showDropdownSidebar: boolean = false;
  showAiAssistant: boolean = false;
  user: { id: number, name: string } | null = null;

  languages = [
    {code: 'en', name: 'English', flag: '/img/easy-translate-en.png' },
    {code: 'fr', name: 'French', flag: '/img/easy-translate-fr.png' },
    {code: 'de', name: 'German', flag: '/img/easy-translate-de.png' },
  ];
  selectedLang = this.languages[0];

  constructor(
      private localStorage: StorageService,
      private translate: TranslateService
    ) { 
      this.selectedLang = this.languages.find(l => l.code === this.translate.currentLang) || this.languages[0];
    }


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

    // sidebar
    toggleDropdownSidebar() {
      this.showDropdownSidebar = !this.showDropdownSidebar;
    }
  
    closeDropdownSidebar() {
      this.showDropdownSidebar = false;
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const sidebarElement = document.querySelector('.side-bar-dropdown');
    const togglerElement = document.querySelector('.navbar-toggler');

    if (
      this.showDropdownSidebar &&
      sidebarElement &&
      !sidebarElement.contains(target) &&
      togglerElement &&
      !togglerElement.contains(target)
    ) {
      this.closeDropdownSidebar();
    }
  }

  toggleAiAssistant() {
    this.showAiAssistant = !this.showAiAssistant;
  }

  closeAiAssistant(){
    this.showAiAssistant = false;
  }

  switchLanguage(lang: any) {
    console.log('Switching language to', lang.code);
    this.selectedLang = lang;
    this.translate.use(lang.code).subscribe({
      next: () => console.log('Language switched to', lang.code),
      error: err => console.error('Error switching language:', err)
    });
    this.localStorage.setitem('lang', lang.code);
  }
}
