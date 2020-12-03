// presentational component for showing the alert graphs

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as constants from '../../constants';
import {
  single,
  multi,
  MOQSingle,
  MOQMulti,
  REQSingle,
  REQMulti
} from './data';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  graphData = [];
  noDataMsg = constants.noDataMsgGraph;
  @Output() selectedGraphAlert = new EventEmitter();

  @Input() moqAlertGraphs = [];
  @Input() demandGap: any;
  @Input() requiredAlertGraphs = [];
  @Input() shortageAlertGraphs = [];
  @Input() erpAlertGraphs = [];
  // shortageAlerts: any = { single, multi };
  // MOQAlerts: any = { MOQSingle, MOQMulti };
  // RequiredAlerts: any = { REQSingle, REQMulti };

  constructor() { }

  ngOnInit() {
    this.graphData.push(this.shortageAlertGraphs.reverse(), this.moqAlertGraphs.reverse(), this.requiredAlertGraphs.reverse(), this.erpAlertGraphs);
  }

  selectedGraph(eve) {
    this.selectedGraphAlert.emit(eve);

  }


}
