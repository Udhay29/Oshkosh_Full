import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DemandDashboardRoutingModule } from './demand-dashboard-routing.module';
import { DemandDashboardComponent } from './demand-dashboard.component';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressBarModule } from 'primeng/progressbar';
import { DemandLineChartComponent } from './demand-line-chart/demand-line-chart.component';
import { DemandDashboardService } from './demand-dashboard-service';
import { DemandDashboardUtilService } from './demand-dashboard.utils';
import { MultiSelectModule } from 'primeng/multiselect';
import { SharedModule } from './../../shared/shared.module';
import { DirectivesModule } from './../../shared/directives/directives.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';


// import { TimelinechartComponent } from './timelinechart/timelinechart.component';

@NgModule({
  imports: [
    CommonModule,
    DemandDashboardRoutingModule,
    CalendarModule,
    TableModule,
    DropdownModule,
    InputMaskModule,
    DialogModule,
    PaginatorModule,
    ProgressBarModule,
    ProgressBarModule,
    MultiSelectModule,
    SharedModule,
    ConfirmDialogModule,
    DirectivesModule
  ],
  declarations: [DemandDashboardComponent, DemandLineChartComponent],
  providers: [DemandDashboardService, DemandDashboardUtilService, ConfirmationService]
})
export class DemandDashboardModule {
  constructor() {
    console.log('demand dashboard');
  }
}
