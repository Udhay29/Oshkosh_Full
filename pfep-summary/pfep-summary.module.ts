import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PfepSummaryRoutingModule } from './pfep-summary-routing.module';
import { PfepSummaryComponent } from './pfep-summary/pfep-summary.component';
import { DetailsComponentComponent } from './details-component/details-component.component';
import { PouItemPlanComponent } from './pou-item-plan/pou-item-plan.component';
import { UpStreamItemPlanComponent } from './up-stream-item-plan/up-stream-item-plan.component';
import { SharedModule } from '../../shared/shared.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import {CalendarModule} from 'primeng/calendar';
import {TooltipModule} from 'primeng/tooltip';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PfepSummaryRoutingModule,
    SharedModule,
    DirectivesModule,
    TableModule,
    CalendarModule,
    DropdownModule,
    TooltipModule
  ],
  declarations: [PfepSummaryComponent, DetailsComponentComponent, PouItemPlanComponent, UpStreamItemPlanComponent],
  bootstrap: [PfepSummaryComponent]
})
export class PfepSummaryModule {}
