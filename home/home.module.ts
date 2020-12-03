
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// modules import
import { SharedModule } from '../../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';

// components import
import { HomeComponent } from './home.component';
import { ItemsTableComponent } from './presentational-components/items-table/items-table.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AlertsComponent } from './container-components/alerts/alerts.component';
import { MetricsComponent } from './container-components/metrics/metrics.component';
import { SearchCriteriaComponent } from './presentational-components/search-criteria/search-criteria.component';
import { MissingDataTablesComponent } from './container-components/missing-data-tables/missing-data-tables.component';
import { MissingTableComponent } from './presentational-components/missing-table-component/missing-table-component.component';
import { MissingDataComponent } from './presentational-components/missing-data/missing-data.component';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';

// service import
import { HomeModuleService } from './home-module.service';
import { ChartsComponent } from './presentational-components/charts/charts.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { GroupedChartsComponent } from './presentational-components/grouped-charts/grouped-charts.component';
import { PieChartComponent } from './presentational-components/pie-chart/pie-chart.component';
import { AlertDetailsContainerComponent } from './container-components/alert-details-container/alert-details-container.component';
import { AlertDetailsComponent } from './presentational-components/alert-details-component/alert-details-component.component';
import { DashboardUtilsService } from './dashboad-utils';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import {InputSwitchModule} from 'primeng/inputswitch';


@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    SharedModule,
    TableModule,
    DialogModule,
    PaginatorModule,
    NgxChartsModule,
    CalendarModule,
    DirectivesModule,
    TooltipModule,
    InputSwitchModule
  ],
  declarations: [
    HomeComponent,
    ItemsTableComponent,
    MissingDataComponent,
    AlertsComponent,
    MetricsComponent,
    SearchCriteriaComponent,
    DashboardComponent,
    MissingDataTablesComponent,
    MissingTableComponent,
    ChartsComponent,
    GroupedChartsComponent,
    PieChartComponent,
    AlertDetailsComponent,
    AlertDetailsContainerComponent
  ],
  providers: [HomeModuleService, DashboardUtilsService]
})
export class HomeModule { }
