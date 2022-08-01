import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';
import { IntroGuard } from './guards/intro.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', //login
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
    canLoad: [AuthGuard,IntroGuard]
  },

  {
    path: 'menu',
    loadChildren: () =>
      import('./pages/menu/menu.module').then((m) => m.MenuPageModule),
    // canLoad: [AuthGuard, IntroGuard],
    canLoad: [AuthGuard]
    // children:[

    // ]
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
  },
  {
    path: 'scan',
    loadChildren: () =>
      import('./pages/scan/scan.module').then((m) => m.ScanPageModule),
    canLoad: [AuthGuard],
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
