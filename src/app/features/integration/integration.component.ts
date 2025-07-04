import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NavBarLayoutComponent } from '../../layout/nav-bar-layout/nav-bar-layout.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-integration',
  imports: [TranslateModule, NavBarLayoutComponent,CommonModule],
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.css', '../project/files/files.component.css']
})
export class IntegrationComponent {
  showPopOver: boolean = false;
  selectedIntegration: string = '';

  openPopOver(integration: string){
    this.selectedIntegration = integration;
    this.showPopOver =true;
  }
}
