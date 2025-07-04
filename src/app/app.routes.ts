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
import { ResolverService } from './core/resolver/translation-resolver.service';
import { TermResolverService } from './core/resolver/term-resolver.service';
import { OrganizationComponent } from './features/organization/organization.component';
import { OrganizationProjectsComponent } from './features/organization-projects/organization-projects.component';
import { OrgProjectsComponent } from './features/organization-projects/org-projects/org-projects.component';
import { OrgLanguagesComponent } from './features/organization-projects/org-languages/org-languages.component';
import { OrgContributorsComponent } from './features/organization-projects/org-contributors/org-contributors.component';
import { OrgGlossaryComponent } from './features/organization-projects/org-glossary/org-glossary.component';
import { FilesComponent } from './features/project/files/files.component';
import { ProjectLanguageResolverService } from './core/resolver/project-language-resolver.service';
import { ContributorsResolverService } from './core/resolver/contributors-resolver.service';
import { IntegrationComponent } from './features/integration/integration.component';
import { HelpCenterComponent } from './features/help-center/help-center.component';

export const AppRoutes: Routes = [
    {path: 'signup', component: SignInComponent},
    {path: 'logIn', component: LogInComponent},
    {path: 'dashboard', component: DashbordComponent},
    {path: 'projectsForm', component: ProjectFormComponent},
    {path: 'project/:id', component: ProjectComponent, children: [
        {path: 'languages', component: ProjectLanguageComponent, resolve: {projectLanguage: ProjectLanguageResolverService}},
        {path: 'terms', component: TermsComponent, resolve: {terms: TermResolverService}},
        {path: 'contributors', component: ContributorsComponent, resolve: {contributors: ContributorsResolverService}},
        {path: 'import', component: ImportsComponent},
        {path: 'translation/:id', component: TranslationsComponent, 
            resolve: {resolvedData: ResolverService}},
        {path: 'files', component: FilesComponent},

        {path: '', redirectTo: 'terms', pathMatch: 'full'},
    ]},
    {path: 'termForm/:projectId', component: TermFormComponent}, 
    {path: 'settings', component: SettingsComponent, children: [
       {path: 'general', component: GeneralSettingComponent},
       {path: 'billing', component: BillingPlanComponent},
       {path: 'permissions', component: UserrolePermissionsComponent},
       
       {path: '', redirectTo: 'general', pathMatch: 'full'} 
    ]},

    {path: 'organization', component: OrganizationComponent},
    {path: 'organization/:id', component: OrganizationProjectsComponent, children: [
        {path: 'org-projects', component: OrgProjectsComponent},
        {path: 'org-languages', component: OrgLanguagesComponent},
        {path: 'org-contributors', component: OrgContributorsComponent},
        {path: 'org-glossary', component: OrgGlossaryComponent},

        {path: '', redirectTo: 'org-projects', pathMatch: 'full'}
    ]},
    {path: 'integration', component: IntegrationComponent},
    {path: 'help-center', component: HelpCenterComponent},

    {path: '', redirectTo: 'logIn', pathMatch: 'full'}
];
