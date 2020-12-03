import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemPlanDetailComponent } from './item-plan-detail.component';
import { AuthGuard } from 'src/app/core/guards/auth-guard';
import { CanDeactivateGuard } from 'src/app/core/guards/can-deactivate-guard';

const itemPlanDetailRoutes: Routes = [{ path: '', component: ItemPlanDetailComponent, data: { roles: ['PFEP SPECIALIST'] }, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] }];


@NgModule({
    imports: [RouterModule.forChild(itemPlanDetailRoutes)],
    exports: [RouterModule]
})

export class ItemPlanDetailRoutingModule { }
