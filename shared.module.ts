import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { ContextMenuModule } from 'primeng/contextmenu';
import { AutoCompleteModule } from 'primeng/autocomplete';
import {RadioButtonModule} from 'primeng/radiobutton';
//shared components
import { SelectComponent } from './components/select/select.component';
import { TabListComponent } from './components/tab-list/tab-list.component';
import { LookUpFieldComponent } from './components/look-up-field/look-up-field.component';
import { WildCardLookupComponent } from './components/wild-card-lookup/wild-card-lookup.component';
import { SearchFieldComponent } from './components/search-field/search-field.component';
import {TooltipModule} from 'primeng/tooltip';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    TableModule,
    DialogModule,
    MultiSelectModule,
    CalendarModule,
    ContextMenuModule,
    AutoCompleteModule,
    RadioButtonModule,
    TooltipModule
  ],
  declarations: [TabListComponent, SelectComponent, LookUpFieldComponent, WildCardLookupComponent, SearchFieldComponent],
  exports: [TabListComponent, SelectComponent, LookUpFieldComponent, WildCardLookupComponent, SearchFieldComponent]
})
export class SharedModule { }
