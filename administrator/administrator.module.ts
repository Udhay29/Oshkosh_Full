import { AdministratorRoutingModule } from './administrator-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministratorComponent } from './administrator.component';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdministrativeService } from './administrator.service';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { SharedModule } from '../../shared/shared.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ConfigurationComponent } from './configuration/configuration.component';
import { AddConfigurationComponent } from './configuration/add-configuration/add-configuration.component';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AccordionModule } from 'primeng/accordion';


@NgModule({
  imports: [
    CommonModule,
    AdministratorRoutingModule,
    DialogModule,
    CheckboxModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    SharedModule,
    ConfirmDialogModule,
    DirectivesModule,
    DropdownModule,
    InputSwitchModule,
    AccordionModule
  ],
  declarations: [AdministratorComponent, ConfigurationComponent, AddConfigurationComponent],
  providers: [AdministrativeService, ConfirmationService]
})
export class AdministratorModule {
  constructor() {
    console.log('Administrator Module loaded');
  }
}
