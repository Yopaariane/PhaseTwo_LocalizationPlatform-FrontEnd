import { Routes } from '@angular/router';
import { SignInComponent } from './features/sign-in/sign-in.component';
import { LogInComponent } from './features/log-in/log-in.component';

export const routes: Routes = [
    {path: 'signup', component: SignInComponent},
    {path: 'logIn', component: LogInComponent},

    {path: '', redirectTo: '/signup', pathMatch: 'full'}
];
