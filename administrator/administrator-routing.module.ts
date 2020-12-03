import { AdministratorComponent } from './administrator.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/core/guards/can-deactivate-guard';


const adminRoutes: Routes = [
  { path: '', component: AdministratorComponent, data: { roles: { Partial: ['BUSINESS ADMINISTRATOR'], All: ['USER ACCESS ADMINISTRATOR'] } }, canDeactivate: [CanDeactivateGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdministratorRoutingModule { }
