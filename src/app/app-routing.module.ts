import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './core/guards/auth-guard.service';
import { SigninRedirectCallbackComponent } from './components/signin-redirect-callback/signin-redirect-callback.component';
import { SignoutRedirectCallbackComponent } from './components/signout-redirect-callback/signout-redirect-callback.component';
import { NotFoundComponent } from './components/error-pages/not-found/not-found.component';
import { SigninHostComponent } from './components/signin-host/signin-host.component';

const routes: Routes = [
  { path: 'signin-host', component: SigninHostComponent },
  { path: 'signin-callback', component: SigninRedirectCallbackComponent },
  { path: 'signout-callback', component: SignoutRedirectCallbackComponent },
  { 
    path: 'reports', 
    loadChildren: () => import('./components/reports/reports.module').then(m => m.ReportsModule), 
    canActivate: [AuthGuardService] 
  },
  { path: '404', component : NotFoundComponent},
  { path: '', redirectTo: '/reports', pathMatch: 'full' },
  { path: '**', redirectTo: '/404', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    SigninRedirectCallbackComponent,
    SignoutRedirectCallbackComponent
  ],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
