import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { LoadingService } from './core/loading.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, LoadingSpinnerComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'EasyTranslate';
  loadingState = { isLoading: false, message: '' };

  constructor(private loadingService: LoadingService, private router: Router) {
    this.loadingService.loadingState$.subscribe(state => {
      this.loadingState = state;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.show('Loading...');
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.loadingService.hide();
      }
    });
  }
}
