import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';
import { IntroGuard } from './guards/intro.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'intro', //login
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    // canLoad: [AuthGuard],
  },
  {
    path: 'scan',
    loadChildren: () =>
      import('./pages/scan/scan.module').then((m) => m.ScanPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'camera',
    loadChildren: () =>
      import('./pages/camera/camera.module').then((m) => m.CameraPageModule),
    // canLoad: [AuthGuard],
  },
  {
    path: 'menu',
    loadChildren: () =>
      import('./pages/menu/menu.module').then((m) => m.MenuPageModule),
      canLoad: [AuthGuard],
    // canLoad: [IntroIntroGuardGuard],
    // children:[

    // ]
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./pages/settings/settings.module').then(
        (m) => m.SettingsPageModule
      ),canLoad: [AuthGuard]
  },
  {
    path: 'intro',
    loadChildren: () =>
      import('./pages/intro/intro.module').then((m) => m.IntroPageModule),
      canLoad: [AutoLoginGuard]
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
    //  canLoad: [IntroGuard, AutoLoginGuard],
    canLoad: [AutoLoginGuard],
  },
  {
    path: 'google-map',
    loadChildren: () =>
      import('./pages/google-map/google-map.module').then(
        (m) => m.GoogleMapPageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'user-details',
    loadChildren: () =>
      import('./pages/user-details/user-details.module').then(
        (m) => m.UserDetailsPageModule
      ),canLoad: [AuthGuard]

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
