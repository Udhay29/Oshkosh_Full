import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DemandDashboardComponent } from './demand-dashboard.component';
import { AuthGuard } from 'src/app/core/guards/auth-guard';
import { CanDeactivateGuard } from 'src/app/core/guards/can-deactivate-guard';

const demandRoutes: Routes = [
  { path: '', component: DemandDashboardComponent, data: { roles: ['PFEP SPECIALIST'] }, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(demandRoutes)],
  exports: [RouterModule]
})
export class DemandDashboardRoutingModule { }
