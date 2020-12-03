import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberOnlyDirective } from './number/numberonly.directive';
import { ExportExcelDirective } from './exportExcel/export-excel.directive';
import { DisableControlDirective } from './disableField/disable-control.directive';
import { ElementDisabledDirective } from './disableField/disabled.directive';
import { ElementFocusDirective } from './focusField/focus.directive';
import { AlphaNumericDirective } from './alphaNumeric/alphaNumeric.directive';
import { CustomMaxDirective } from './customMax/custom-max.directive';
import { CustomMinDirective } from './customMin/custom-min.directive';

@NgModule({
   imports: [
      CommonModule
   ],
   declarations: [
      NumberOnlyDirective,
      ExportExcelDirective,
      AlphaNumericDirective,
      DisableControlDirective,
      ElementDisabledDirective,
      ElementFocusDirective,
      CustomMaxDirective,
      CustomMinDirective
   ],
   exports: [
      NumberOnlyDirective,
      ExportExcelDirective,
      AlphaNumericDirective,
      CustomMaxDirective,
      CustomMinDirective
   ]
})
export class DirectivesModule { }
