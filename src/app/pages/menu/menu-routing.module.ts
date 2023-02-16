import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActiveRouteGuard } from 'src/app/guards/active-route.guard';
import { AuthGuard } from 'src/app/guards/auth.guard';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'main',
        loadChildren: () =>
          import('../main/main.module').then((m) => m.MainPageModule),
          canLoad: [AuthGuard]
      },
      {
        path: 'history',
        loadChildren: () =>
          import('../history/history.module').then((m) => m.HistoryPageModule),
        canLoad: [AuthGuard],
      },
      {
        path: 'travel-route-tracking',
        loadChildren: () =>
          import('../travel-route-tracking/travel-route-tracking.module').then(
            (m) => m.TravelRouteTrackingPageModule
          ),
        canLoad: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
