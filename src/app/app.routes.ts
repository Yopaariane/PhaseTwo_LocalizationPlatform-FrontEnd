import { Routes } from '@angular/router';
import { SignInComponent } from './features/sign-in/sign-in.component';
import { LogInComponent } from './features/log-in/log-in.component';
import { DashbordComponent } from './features/dashbord/dashbord.component';
import { ProjectFormComponent } from './features/project-form/project-form.component';
import { ProjectComponent } from './features/project/project.component';
import { ProjectLanguageComponent } from './features/project/project-language/project-language.component';
import { TermsComponent } from './features/project/terms/terms.component';
import { ContributorsComponent } from './features/project/contributors/contributors.component';
import { ImportsComponent } from './features/project/imports/imports.component';
import { TranslationsComponent } from './features/project/translations/translations.component';
import { TermFormComponent } from './features/project/term-form/term-form.component';
import { SettingsComponent } from './features/settings/settings.component';
import { GeneralSettingComponent } from './features/settings/general-setting/general-setting.component';
import { BillingPlanComponent } from './features/settings/billing-plan/billing-plan.component';
import { UserrolePermissionsComponent } from './features/settings/userrole-permissions/userrole-permissions.component';

export const AppRoutes: Routes = [
    {path: 'signup', component: SignInComponent},
    {path: 'logIn', component: LogInComponent},
    {path: 'dashboard', component: DashbordComponent},
    {path: 'projectsForm', component: ProjectFormComponent},
    {path: 'project/:id', component: ProjectComponent, children: [
        {path: 'languages', component: ProjectLanguageComponent},
        {path: 'terms', component: TermsComponent},
        {path: 'contributors', component: ContributorsComponent},
        {path: 'import', component: ImportsComponent},
        {path: 'translation/:id', component: TranslationsComponent},

        {path: '', redirectTo: 'terms', pathMatch: 'full'},
    ]},
    {path: 'termForm/:projectId', component: TermFormComponent}, 
    {path: 'settings', component: SettingsComponent, children: [
       {path: 'general', component: GeneralSettingComponent},
       {path: 'billing', component: BillingPlanComponent},
       {path: 'permissions', component: UserrolePermissionsComponent},
       
       {path: '', redirectTo: 'general', pathMatch: 'full'} 
    ]},

    {path: '', redirectTo: 'logIn', pathMatch: 'full'}
];
