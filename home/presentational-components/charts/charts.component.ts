// presentational component for showing the alert graphs

import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit, OnDestroy } from '@angular/core';
import * as constants from '../../constants';

@Component({
  selector: 'charts-alerts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() data: any;
  @Output() selectedGraph = new EventEmitter();
  labels = ['PFEP Over/Under Planned', 'MOQ Ceiling', 'PFEP Required'];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  showYAxisLabel = false;
  showGridLines = false;
  transform: string;
  colorScheme = {
    domain: ['#04B0F8', '#FFFE03', '#FFAE03', '#FB0103']
  };
  customColors = [
      {'name': 'BP New', 'value': '#04B0F8'},
      {'name': '<2 Weeks', 'value': '#FFFE03'},
      {'name': '2-4 Weeks', 'value': '#FFAE03'},
      {'name': '>4 Weeks', 'value': '#FB0103'}
  ];
  noDataMsg = constants.noDataMsgGraph;
  seriesSelected = '';
  erpAlertLabel = 'ERP Discrepancy Alert';

  constructor() {}

  ngOnInit() {
    // Date transformation in Ascending order.
    this.transform = `translate(500,-794)`;
  }

  ngAfterViewInit() {
    this.registerClickEvents();
  }

  barClicked = (e, screen) => {
    if(screen === this.erpAlertLabel) {
      this.seriesSelected = e.series;
    }
  }

  onSelect(eve) {
    if(eve === this.erpAlertLabel) {
      setTimeout(() => {
        this.selectedGraph.emit({screen: eve, series: this.seriesSelected});
        this.seriesSelected = '';
      }, 300);
      return;
    };
    this.selectedGraph.emit(eve);
  }

  registerClickEvents = () => {
    Array.from(this.getERPAlertTicks()).forEach(tick => {
      tick.removeEventListener('click', this.clickEventHandler);
      tick.addEventListener('click', this.clickEventHandler);
    });
  }

  clickEventHandler = e => {
    const { innerHTML: textContent } = e.currentTarget.children[0];
    if(constants.discrepancyTypesArr.includes(textContent.trim().toUpperCase())) {
      this.seriesSelected = textContent.trim();
    }
  }

  getERPAlertTicks = () => {
    return document.querySelectorAll('.card.ERP.Discrepancy.Alert g.x.axis g.tick');
  }

  ngOnDestroy() {
    Array.from(this.getERPAlertTicks()).forEach(tick => {
      tick.removeEventListener('click', this.clickEventHandler);
    });
  }
}
