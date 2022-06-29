import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TravelRouteTrackingPage } from './travel-route-tracking.page';

const routes: Routes = [
  {
    path: '',
    component: TravelRouteTrackingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TravelRouteTrackingPageRoutingModule {}
