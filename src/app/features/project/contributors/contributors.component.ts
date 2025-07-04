import { Component, Input } from '@angular/core';
import { UserRole } from '../../../core/models/user-role.model';
import { AuthService, Role, UserResponse } from '../../../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SortingService } from '../../../core/sorting.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingService } from '../../../core/loading.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contributors',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslateModule],
  templateUrl: './contributors.component.html',
  styleUrls: ['./contributors.component.css', '../terms/terms.component.css', '../../dashbord/dashbord.component.css']
})
export class ContributorsComponent {

  @Input() userRoleDetails: any[] = []; 
  @Input() userField: string = 'user'; 
  @Input() roleField: string = 'role'; 
  @Input() projectField: string = 'projectName';
  @Input() showProjectColumn: boolean = false;


  userRoles: UserRole[] = [];
  role: Role[] = [];
  projectId: number | null = null;
  userDetailsList = [];
  userEmail: string = "";

  sortOrder: string = 'Date Asc';
  showDropdown: boolean = false;
  selectedRole: Role | null = null;
  emailError: string | null = null;
  roleError: string | null = null;

  showPopper: boolean = false;
  popperTimeout: any;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private sortingService: SortingService,
    private loadingService: LoadingService,
  ) {}

  ngOnInit(): void {
    const resolvedData = this.route.snapshot.data['contributors'];
    this.userRoles = resolvedData.userRoles;
    this.role = resolvedData.roles;

    this.route.parent?.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.projectId = Number(id);
        console.log("project id:", this.projectId)
        this.getUserRolesByProjectId(this.projectId);
        this.loadRoles();
      }
    });

    this.sortingService.sortOrder$.subscribe(order => {
      this.sortOrder = order;
      this.sortContributors();
    });
  }

  getUserRolesByProjectId(projectId: number): void {
    // this.loadingService.show('Loading contributors...');
    this.isLoading = true;
    this.authService.getRolesByProjectId(projectId).subscribe((roles) => {
      // this.loadingService.hide();
      this.isLoading = false;
      this.userRoles = roles;

    this.userRoles.forEach((role) => {
      this.authService.getUserById(role.userId).subscribe((user) => {
        this.authService.getRoleById(role.roleId).subscribe((roleDetail) => {
          this.userRoleDetails.push({
            userRoleId: role.id,
            user: user,
            role: roleDetail
          });

          if (this.userRoleDetails.length === 1) {
            this.showPopperWithTimeout();
          }else {
            this.showPopper = false;
          }
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

  assignRoleToUser(userRole: UserRole): void {
    this.authService.assignRoleToUser(userRole).subscribe((createdRole) => {
      this.userRoles.push(createdRole);
    });
  }

  loadRoles(): void {
    this.authService.getAllRoles().subscribe((roles: Role[]) => {
      this.role = roles;
    });
  }

  filteredRoles(): Role[] {
    return this.role.filter(rl => rl.name.toLowerCase());
  }
  hideDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }
  selectRole(role: Role, event: Event): void {
    event.stopPropagation();
    this.selectedRole = role;
    this.showDropdown = true;
  }

  SaveContributor(): void{
    this.clearErrors();

    if (!this.userEmail) {
      this.emailError = 'Please enter the user email.';
      return;
    }

    if (!this.selectedRole) {
      this.roleError = 'Please select a role.';
      return;
    }

    if (this.userEmail && this.selectedRole && this.projectId !== null) {
      this.authService.getUserByEmail(this.userEmail).subscribe({
        next: (userResponse: UserResponse) => {
          const userRole: UserRole = {
            id:0,
            userId: userResponse.id,
            projectId: this.projectId!,
            roleId: this.selectedRole!.id
          };

          this.assignRoleToUser(userRole);
          this.reloadPage();
        },
        error: () => {
          this.emailError = 'The email entered is incorrect. Please try again.';
        }
      });
    }
  }

  clearErrors(): void {
    this.emailError = null;
    this.roleError = null;
  }

  // user initials and color
  getUserInitials(name: string): string {
    if (!name) return '';

    const nameParts = name.trim().split(' ');

    if (nameParts.length > 1) {
      return nameParts[0][0] + nameParts[1][0];
    } else {
      return nameParts[0].slice(0, 2).toUpperCase();
    }
  }
  getUserColor(name: string): string {
    const colors = ['#FF5733', '#33B5E5', '#FFBB33', '#2BBBAD', '#FFC107'];
    let sumOfCharCodes = 0;

    for (let i = 0; i < name.length; i++) {
      sumOfCharCodes += name.charCodeAt(i);
    }

    return colors[sumOfCharCodes % colors.length];
  }

  // popper handling
  showPopperWithTimeout(): void {
    this.showPopper = true;

    this.popperTimeout = setTimeout(() => {
      this.showPopper = false;
    }, 2000);
  }

  ngOnDestroy(): void {
    if (this.popperTimeout) {
      clearTimeout(this.popperTimeout);
    }
  }
}
