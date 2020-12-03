import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MissingDataTablesComponent } from './container-components/missing-data-tables/missing-data-tables.component';
import { AlertDetailsContainerComponent } from './container-components/alert-details-container/alert-details-container.component';
import { homeScreenPath, missingDataScreenPath, pfepRequiredScreenPath, pfepShortageScreenPath, pfepMOQCeilingPath, pfepDemandGapPath, pfepErpAlertPath } from './constants';
import { AuthGuard } from 'src/app/core/guards/auth-guard';

import { CanDeactivateGuard } from 'src/app/core/guards/can-deactivate-guard';


export const homeRoutes = [
    { path: homeScreenPath, component: HomeComponent, children : [
        { path: '', component: HomeComponent, children: [
            { path: '', component: DashboardComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]},
            { path: missingDataScreenPath, component: MissingDataTablesComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]},
            { path: pfepRequiredScreenPath, component: AlertDetailsContainerComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]},
            { path: pfepShortageScreenPath, component: AlertDetailsContainerComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]},
            { path: pfepMOQCeilingPath, component: AlertDetailsContainerComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]},
            { path: pfepDemandGapPath, component: AlertDetailsContainerComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]},
            { path: pfepErpAlertPath, component: AlertDetailsContainerComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard]},
        ]}
    ]}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes)
  ],
  declarations: [],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
