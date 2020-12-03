import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';

// feature modules
import { HomeModule } from './modules/home/home.module';
import { PouPresentationModule } from './modules/pou-presentation/pou-presentation.module';
import { DemandDashboardModule } from './modules/demand-dashboard/demand-dashboard.module';
import { PackagingCatalogModule } from './modules/packaging-catalog/packaging-catalog.module';
import { MasterDataModule } from './modules/master-data/master-data.module';
import { PfepPlansModule } from './modules/pfep-plans/pfep-plans.module';
import { AdministratorModule } from './modules/administrator/administrator.module';
import { PfepSummaryModule } from './modules/pfep-summary/pfep-summary.module';
import { MfcrModule } from "./modules/mfcr/mfcr.module";

// core module
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';
import { CustomReuseStrategy } from './routeReuseStrategy';
import { UnAuthorizedComponent } from './core/un-authorized/un-authorized.component';


// Error module

const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './modules/home/home.module#HomeModule' },
  { path: 'pou', loadChildren: './modules/pou-presentation/pou-presentation.module#PouPresentationModule' },
  { path: 'demand', loadChildren: './modules/demand-dashboard/demand-dashboard.module#DemandDashboardModule' },
  { path: 'catalog', loadChildren: './modules/packaging-catalog/packaging-catalog.module#PackagingCatalogModule' },
  { path: 'masterdata', loadChildren: './modules/master-data/master-data.module#MasterDataModule' },
  { path: 'plans', loadChildren: './modules/pfep-plans/pfep-plans.module#PfepPlansModule' },
  { path: 'administrator', loadChildren: './modules/administrator/administrator.module#AdministratorModule' },
  { path: 'item-plan-detail', loadChildren: './modules/item-plan-detail/item-plan-detail.module#ItemPlanDetailModule' },
  { path: 'pfep-summary', loadChildren: './modules/pfep-summary/pfep-summary.module#PfepSummaryModule' },
  { path: 'work-center-plans', loadChildren: './modules/work-center-plans/work-center-plans.module#WorkCenterPlansModule' },
  { path: 'pou', loadChildren: './modules/pou-presentation/pou-presentation.module#PouPresentationModule' },
  { path: 'mfcr', loadChildren: './modules/mfcr/mfcr.module#MfcrModule' },
  { path: '404', component: PageNotFoundComponent },
  { path: 'un-authorized', component: UnAuthorizedComponent },
  { path: '**', component: PageNotFoundComponent }
];
@NgModule({
  imports: [CommonModule, RouterModule.forRoot(appRoutes)],
  declarations: [],
  providers: [
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }
  ]
})
export class AppRoutingModule { }
