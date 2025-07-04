import { Component } from '@angular/core';
import { FormCheckComponent } from '../../../shared/form-check/form-check.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-userrole-permissions',
  imports: [FormCheckComponent, TranslateModule],
  templateUrl: './userrole-permissions.component.html',
  styleUrl: './userrole-permissions.component.css'
})
export class UserrolePermissionsComponent {

}
