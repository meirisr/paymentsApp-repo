import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../main/main.module').then((m) => m.MainPageModule),
        canLoad: [AuthGuard],
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../settings/settings.module').then(
            (m) => m.SettingsPageModule
          ),
        canLoad: [AuthGuard],
      },

      {
        path: 'camera',
        loadChildren: () =>
          import('../camera/camera.module').then((m) => m.CameraPageModule),
        // canLoad: [AuthGuard],
      },

      {
        path: 'user-details',
        loadChildren: () =>
          import('../user-details/user-details.module').then(
            (m) => m.UserDetailsPageModule
          ),
        canLoad: [AuthGuard],
      },
      {
        path: 'credit-card-details',
        loadChildren: () =>
          import('../credit-card-details/credit-card-details.module').then(
            (m) => m.CreditCardDetailsPageModule
          ),
      },
      {
        path: 'user-profile',
        loadChildren: () =>
          import('../user-profile/user-profile.module').then(
            (m) => m.UserProfilePageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
