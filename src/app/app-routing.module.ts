import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/welcome/welcome.component').then((mod) => mod.WelcomeComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((mod) => mod.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./features/register/register.component').then((mod) => mod.RegisterComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then((mod) => mod.DashboardComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'profile',
        loadComponent: () => import('./features/dashboard/profile/profile.component').then((mod) => mod.ProfileComponent)
      },
      {
        path: 'coins',
        loadComponent: () => import('./features/dashboard/coin-list/coin-list.component').then((mod) => mod.CoinListComponent)
      },
      {
        path: 'exchange',
        loadComponent: () => import('./features/dashboard/exchange/exchange.component').then((mod) => mod.ExchangeComponent)
      },
      {
        path: 'send',
        loadComponent: () => import('./features/dashboard/send/send.component').then((mod) => mod.SendComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/dashboard/settings/settings.component').then((mod) => mod.SettingsComponent)
      }
    ]
  },
  {
    path: 'error',
    loadComponent: () => import('./shared/error/error.component').then((mod) => mod.ErrorComponent)
  },
  {
    path: '**', redirectTo: '/error'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
