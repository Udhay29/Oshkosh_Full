import { Component, OnInit, Input } from '@angular/core';
import * as constants from '../constants';

@Component({
  selector: 'pfep-plan-aligment',
  templateUrl: './plan-aligment.component.html',
  styleUrls: ['./plan-aligment.component.scss']
})
export class PlanAligmentComponent implements OnInit {

  @Input() msg: string = '';
  @Input() tableData: any = [];

  warningDetailsColumns= constants.warningDetailsColumns;

  constructor() { }

  ngOnInit() {
  }

}
