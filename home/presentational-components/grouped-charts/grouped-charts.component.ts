import { Component, OnInit, Input } from '@angular/core';
import * as constants from '../../constants';

@Component({
  selector: 'pfep-grouped-charts',
  templateUrl: './grouped-charts.component.html',
  styleUrls: ['./grouped-charts.component.scss']
})
export class GroupedChartsComponent implements OnInit {
  @Input() data: any;
  view = [350, 250];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = '% Parts';
  showGridLines = false;

  transform: string;
  colorScheme = {
    domain: ['#7cd275', '#968827']
  };
  customColors = [
    { 'name': 'Approved', 'value': '#7CE375' },
    { 'name': 'Not Approved', 'value': '#999999' },
    { 'name': 'Yes', 'value': '#7CE375' },
    { 'name': 'No', 'value': '#999999' },
  ];
  noDataMsg = constants.noDataMsgGraph;
  constructor() { }

  ngOnInit() {

    if (this.data.label === '% Parts On Approved Plan') {
      this.data.forEach(data => {
        data['series'].forEach(data => {
          data.name && (data.name === 'Approved_Percentage') ? data.name = 'Approved' : null;
          data.name && (data.name === 'Not_Approved_Percentage') ? data.name = 'Not Approved' : null;
        });
        return data;
      });
    }
    if (this.data.label === '% Parts On Disparate Plan') {
      this.data.forEach(data => {
        data['series'].forEach(data => {
          data.name && (data.name === 'Disparate_Percentage') ? data.name = 'Yes' : null;
          data.name && (data.name === 'Not_Disparate_Percentage') ? data.name = 'No' : null;
        });
        return data;
      });
    }
  }

}
