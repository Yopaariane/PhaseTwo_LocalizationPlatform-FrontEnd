import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarOpen = false;

  isOpen(): boolean {
    return this.sidebarOpen;
  }

  toggle(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }                  
  private _isSidBarOpen = new BehaviorSubject<boolean>(true); 
  isSidBarOpen$ = this._isSidBarOpen.asObservable();
  // sidbarVisible$: any;

  get isSidBarOpen(): boolean {
    return this._isSidBarOpen.value;
  }

  setSidebarVisibility(isOpen: boolean): void {
    this._isSidBarOpen.next(isOpen);
  }

  toggleSidebar(): void {
    this._isSidBarOpen.next(!this._isSidBarOpen.value);
  }
}
