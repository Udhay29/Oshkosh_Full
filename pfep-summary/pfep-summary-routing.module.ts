import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PfepSummaryComponent } from './pfep-summary/pfep-summary.component';
import { AuthGuard } from 'src/app/core/guards/auth-guard';
import { CanDeactivateGuard } from 'src/app/core/guards/can-deactivate-guard';

const routes: Routes = [
  { path: '', component: PfepSummaryComponent , data: { roles: ['PFEP SPECIALIST'] }, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PfepSummaryRoutingModule { }
