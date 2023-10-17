import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/welcome/welcome.component').then((mod) => mod.WelcomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((mod) => mod.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/register/register.component').then((mod) => mod.RegisterComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
