import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SortingService {
  private sortOrderSubject = new BehaviorSubject<string>('Date Asc');
  sortOrder$ = this.sortOrderSubject.asObservable();

  setSortOrder(order: string) {
    this.sortOrderSubject.next(order);
  }
}
