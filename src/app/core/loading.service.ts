import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<{ isLoading: boolean; message: string }>({ isLoading: false, message: '' });
  loadingState$ = this.loadingSubject.asObservable();

  constructor() { }

  show(message: string = 'Loading...'): void {
    this.loadingSubject.next({ isLoading: true, message });
  }
  hide(): void {
    this.loadingSubject.next({ isLoading: false, message: '' });
  }
}
