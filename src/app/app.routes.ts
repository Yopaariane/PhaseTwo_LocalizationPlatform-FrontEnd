import { Routes } from '@angular/router';
import { SignInComponent } from './features/sign-in/sign-in.component';
import { LogInComponent } from './features/log-in/log-in.component';
import { NavBarLayoutComponent } from './layout/nav-bar-layout/nav-bar-layout.component';

export const AppRoutes: Routes = [
    {path: 'signup', component: SignInComponent},
    {path: 'logIn', component: LogInComponent},
    {path: 'navbar', component: NavBarLayoutComponent},

    {path: '', redirectTo: 'navbar', pathMatch: 'full'}
];
