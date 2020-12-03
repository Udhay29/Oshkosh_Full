import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PfepPlansComponent } from './pfep-plans.component';
import { AuthGuard } from 'src/app/core/guards/auth-guard';
import { CanDeactivateGuard } from 'src/app/core/guards/can-deactivate-guard';

const plansRoutes: Routes = [
  { path: '', component: PfepPlansComponent , data: { roles: ['PFEP SPECIALIST'] } , canActivate: [AuthGuard] , canDeactivate: [CanDeactivateGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(plansRoutes)],
  exports: [RouterModule]
})
export class PfepPlansRoutingModule { }
