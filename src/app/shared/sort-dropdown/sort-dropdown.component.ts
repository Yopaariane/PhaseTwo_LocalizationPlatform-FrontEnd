import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SortingService } from '../../core/sorting.service';

@Component({
  selector: 'app-sort-dropdown',
  imports: [],
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
