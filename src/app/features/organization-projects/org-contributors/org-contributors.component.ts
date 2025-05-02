import { Component, OnInit } from '@angular/core';
import { LocalizedImageService } from '../../../core/localized-image.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/project.service';
import { ActivatedRoute } from '@angular/router';
import { OrganizationService } from '../../../core/organization.service';
import { Project } from '../../../core/models/project.model';
import { AuthService } from '../../../core/auth.service';
import { UserRole } from '../../../core/models/user-role.model';
import { ContributorsComponent } from '../../project/contributors/contributors.component';

@Component({
  selector: 'app-org-contributors',
  imports: [CommonModule, FormsModule, ContributorsComponent],
  templateUrl: './org-contributors.component.html',
  styleUrl: './org-contributors.component.css'
})
export class OrgContributorsComponent implements OnInit {
  contributors: { userRoleId: number, userDetails: any, roleDetails: any, projectName: string }[] = [];
  organizationId!: number;
  projectId!: number;
  

  constructor(
    private route: ActivatedRoute,
    private organizationService: OrganizationService,
    private authanService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.organizationId = Number(id);
        this.loadOrganizationProject(this.organizationId);
      }
    });
  }

  loadOrganizationProject(organizationId: number): void {
    this.organizationService.getProjectsByOrganization(organizationId).subscribe((projects: Project[]) => {
      projects.forEach((project) => {
        this.authanService.getRolesByProjectId(project.id).subscribe((userRoles) => {
          userRoles.forEach((role) => {
            this.authanService.getUserById(role.userId).subscribe((user) => {
              this.authanService.getRoleById(role.roleId).subscribe((roleDetail) => {
                this.contributors.push({
                  userRoleId: role.id,
                  userDetails: user, 
                  roleDetails: roleDetail, 
                  projectName: project.name 
                });
              });
            });
          });
        });
      });
    });
  }
}
