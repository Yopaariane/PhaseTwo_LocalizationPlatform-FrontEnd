import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { SidebarService } from '../../core/side-nav-bar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-bar',
  imports: [MatToolbar, MatIcon, CommonModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent {
  constructor(
      public sidenavbarService: SidebarService
    ) { }
}
