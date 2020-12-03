import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemPlanDetailRoutingModule } from './item-plan-detail-routing.module';
import { ItemPlanDetailComponent } from './item-plan-detail.component';
import { SharedModule } from './../../shared/shared.module';
import { DemandDashboardUtilService } from './../demand-dashboard/demand-dashboard.utils';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DatePipe } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';

// components

import { ContainerOptionsComponent } from './container/container-options/container-options.component';
import { ContainerTypesComponent } from './container/container-types/container-types.component';
import { StandardContainerComponent } from './container/standard-container/standard-container.component';
import { BulkContainerComponent } from './container/bulk-container/bulk-container.component';
import { PlanAligmentComponent } from './plan-aligment/plan-aligment.component';
import { RequestChangeComponent } from './request-change/request-change.component';



@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ItemPlanDetailRoutingModule,
    SharedModule,
    CalendarModule,
    CommonModule,
    DropdownModule,
    InputSwitchModule,
    DialogModule,
    TooltipModule,
    TableModule,
    DragDropModule,
    DirectivesModule
  ],
  declarations: [
    ItemPlanDetailComponent,
    ContainerOptionsComponent,
    ContainerTypesComponent,
    StandardContainerComponent,
    BulkContainerComponent,
    PlanAligmentComponent,
    RequestChangeComponent
  ],
  providers: [DemandDashboardUtilService, DatePipe]
})
export class ItemPlanDetailModule {
  constructor() { }
}
