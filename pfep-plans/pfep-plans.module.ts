import { PouItemPlanComponent } from './pou-item-plan/pou-item-plan.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';
import {DialogModule} from 'primeng/dialog';

import { PfepPlansRoutingModule } from './pfep-plans-routing.module';
import { PfepPlansComponent } from './pfep-plans.component';
import { UpStreamItemPlanComponent } from './up-stream-item-plan/up-stream-item-plan.component';
import { SharedModule } from '../../shared/shared.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { PfepRequiredComponent } from './pfep-required/pfep-required.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PfepPlansRoutingModule,
    TableModule,
    SharedModule,
    CalendarModule,
    DirectivesModule,
    DialogModule
  ],
  declarations: [PfepPlansComponent, UpStreamItemPlanComponent, SearchResultsComponent, PouItemPlanComponent, PfepRequiredComponent]
})
export class PfepPlansModule {
  constructor() {
    console.log('PFEP plans module');
  }
}
