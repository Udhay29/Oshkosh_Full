import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from "@angular/router";
import { CommonModule } from '@angular/common';
import { MfcrComponent } from "./mfcr.component";
import { AuthGuard } from 'src/app/core/guards/auth-guard';
import { CanDeactivateGuard } from 'src/app/core/guards/can-deactivate-guard';

const mfcrRoutes: Routes = [{ path: '', component: MfcrComponent, data: { roles: ['PFEP SPECIALIST'] }, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] }];

@NgModule({
  imports: [RouterModule.forChild(mfcrRoutes)],
  exports: [RouterModule]
})
export class MfcrRoutingModule { }
