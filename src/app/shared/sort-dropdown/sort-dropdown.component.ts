import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SortingService } from '../../core/sorting.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sort-dropdown',
  imports: [TranslateModule],
  templateUrl: './sort-dropdown.component.html',
  styleUrl: './sort-dropdown.component.css'
})
export class SortDropdownComponent {

  constructor(
    private sortingService: SortingService,
  ){}

  updateSortOrder(order: string) {
    this.sortingService.setSortOrder(order);
  }
}
