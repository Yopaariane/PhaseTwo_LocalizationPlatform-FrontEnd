import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { LoadingService } from './core/loading.service';
import { StorageService } from './core/storage.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, LoadingSpinnerComponent, TranslateModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'EasyTranslate';
  loadingState = { isLoading: false, message: '' };

  constructor(
    private loadingService: LoadingService, 
    private router: Router,
    private localStorage: StorageService,
    private translate: TranslateService
  ) {
    const savedLang = localStorage.getitem('lang');
    if (savedLang) {
      this.translate.use(savedLang);
    } else {
      this.translate.use('en');
    }

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
