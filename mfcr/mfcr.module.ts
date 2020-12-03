import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MfcrComponent } from './mfcr.component';
import { MfcrRoutingModule } from "./mfcr-routing.module";
import { SharedModule } from './../../shared/shared.module';
import { TableModule } from 'primeng/table';
import {PaginatorModule} from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { MfcrTableFormsComponent } from './mfcr-table-forms/mfcr-table-forms.component';
import { MfcrPlanDetailComponent } from './mfcr-plan-detail/mfcr-plan-detail.component';

@NgModule({
  imports: [
    CommonModule,
    MfcrRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    TooltipModule,
    DialogModule,
    PaginatorModule
  ],
  declarations: [MfcrComponent, MfcrTableFormsComponent, MfcrPlanDetailComponent]
})
export class MfcrModule { }
