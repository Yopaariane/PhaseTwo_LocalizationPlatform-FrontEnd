import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { SidebarService } from '../../core/side-nav-bar.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar-layout',
  imports: [RouterOutlet, SideBarComponent, TopBarComponent, CommonModule],
  templateUrl: './nav-bar-layout.component.html',
  styleUrl: './nav-bar-layout.component.css'
})
export class NavBarLayoutComponent {
  isSidbarOpen = false;
  private subscription!: Subscription;

  constructor(
    public sidebarService: SidebarService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.sidebarService.isSidBarOpen$.subscribe((value: boolean) => {
      this.isSidbarOpen = value;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleSidebar() {
    this.isSidbarOpen = !this.isSidbarOpen;
    this.sidebarService.setSidebarVisibility(this.isSidbarOpen);
  }
}
