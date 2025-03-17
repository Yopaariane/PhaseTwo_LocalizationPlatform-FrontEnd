import { Component } from '@angular/core';
import { UserRole } from '../../../core/models/user-role.model';
import { AuthService, Role } from '../../../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SortingService } from '../../../core/sorting.service';
import { PuterAiService } from '../../../core/puter-ai.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contributors',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './contributors.component.html',
  styleUrls: ['./contributors.component.css', '../terms/terms.component.css', '../../dashbord/dashbord.component.css']
})
export class ContributorsComponent {
  userRoles: UserRole[] = [];
  role: Role[] = [];
  projectId: number | null = null;
  userDetailsList = [];
  userRoleDetails: { userRoleId: number, user: any, role: any }[] = [];
  userEmail: string = "";

  sortOrder: string = 'Date Asc'

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private sortingService: SortingService,
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.projectId = Number(id);
        console.log("project id:", this.projectId)
        this.getUserRolesByProjectId(this.projectId);
      }
    });

    this.sortingService.sortOrder$.subscribe(order => {
      this.sortOrder = order;
      this.sortContributors();
    });
  }

  getUserRolesByProjectId(projectId: number): void {
    this.authService.getRolesByProjectId(projectId).subscribe((roles) => {
      this.userRoles = roles;

    this.userRoles.forEach((role) => {
      this.authService.getUserById(role.userId).subscribe((user) => {
        this.authService.getRoleById(role.roleId).subscribe((roleDetail) => {
          this.userRoleDetails.push({
            userRoleId: role.id,
            user: user,
            role: roleDetail
          });
        });
      });
    });
    });
  }

  deleteUserRole(userRoleId: number): void {
    this.authService.deleteUserRole(userRoleId).subscribe(() => {
      this.userRoleDetails = this.userRoleDetails.filter(detail => detail.userRoleId !== userRoleId);
      this.reloadPage();
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

  // sorting
  sortContributors() {
    // to be managed 
  }

}
