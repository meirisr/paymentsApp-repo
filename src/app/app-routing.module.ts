import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ActiveRouteGuard } from './guards/active-route.guard';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';
import { DebtsGuard } from './guards/debts.guard';
import { IntroGuard } from './guards/intro.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
    //  canLoad: [IntroGuard, AutoLoginGuard],
    canLoad: [AutoLoginGuard],
  },
  {
    path: 'intro',
    loadChildren: () =>
      import('./pages/intro/intro.module').then((m) => m.IntroPageModule),
    // canLoad: [AutoLoginGuard],
    canLoad: [AuthGuard, IntroGuard, ActiveRouteGuard],
  },

  {
    path: 'menu',
    loadChildren: () =>
      import('./pages/menu/menu.module').then((m) => m.MenuPageModule),
    // canLoad: [AuthGuard, IntroGuard],
    canLoad: [AuthGuard],
    //,DebtsGuard
  },
  {
    path: 'user-profile',
    loadChildren: () =>
      import('./pages/user-profile/user-profile.module').then(
        (m) => m.UserProfilePageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'user-details',
    loadChildren: () =>
      import('./pages/user-details/user-details.module').then(
        (m) => m.UserDetailsPageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'credit-card-details',
    loadChildren: () =>
      import('./pages/credit-card-details/credit-card-details.module').then(
        (m) => m.CreditCardDetailsPageModule
      ),
      canLoad: [AuthGuard],
  },
  {
    path: 'scan',
    loadChildren: () =>
      import('./pages/scan/scan.module').then((m) => m.ScanPageModule),
    canLoad: [AuthGuard,DebtsGuard],
    // canLoad: [AuthGuard, DebtsGuard],
  },
  {
    path: 'payment',
    loadChildren: () =>
      import('./pages/payment/payment.module').then((m) => m.PaymentPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'travel-route-tracking',
    loadChildren: () =>
      import('./pages/travel-route-tracking/travel-route-tracking.module').then(
        (m) => m.TravelRouteTrackingPageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'history',
    loadChildren: () =>
      import('./pages/history/history.module').then((m) => m.HistoryPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'history-pay',
    loadChildren: () =>
      import('./pages/history-pay/history-pay.module').then(
        (m) => m.HistoryPayPageModule
      ),
      canLoad: [AuthGuard],
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./pages/settings/settings.module').then(
        (m) => m.SettingsPageModule
      ),
    canLoad: [AuthGuard],
  },

  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
