import { Component, OnInit } from '@angular/core';
import { NavBarLayoutComponent } from '../../layout/nav-bar-layout/nav-bar-layout.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StorageService } from '../../core/storage.service';
import { OrganizationService } from '../../core/organization.service';

@Component({
  selector: 'app-organization-projects',
  imports: [NavBarLayoutComponent, CommonModule],
  templateUrl: './organization-projects.component.html',
  styleUrls:[ './organization-projects.component.css',
    '../organization/organization.component.css', '../dashbord/dashbord.component.css'
  ]
})
export class OrganizationProjectsComponent implements OnInit {
  organizationId!: number;

  constructor(
    private localStorageService: StorageService,
    private organizationService: OrganizationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.organizationId = Number(id);
        this.loadOrganizationProjects(this.organizationId);
      }
    });
  }

  loadOrganizationProjects(id: number): void {
    this.organizationService.getProjectsByOrganization(id).subscribe((projects) => {
      console.log('Organization-projects', projects);
    });
  }

}
