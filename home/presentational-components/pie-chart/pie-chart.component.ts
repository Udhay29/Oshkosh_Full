import { Component, OnInit, Input } from "@angular/core";
import * as constants from '../../constants';

@Component({
  selector: "pfep-pie-chart",
  templateUrl: "./pie-chart.component.html",
  styleUrls: ["./pie-chart.component.scss"]
})
export class PieChartComponent implements OnInit {
  @Input() data: any;
view=[300,300]

  name: any;
  value: any;
  pieGraphData: any;
  showLabels = false;
  explodeSlices = false;
  doughnut = false;
  showLegend = true;
  noDataMsg = constants.noDataMsgGraph;
  colorScheme = {
    domain: ["#076589 ", "#968827", "#7bc175", "#BB1C59", "#C4E34B", "#C65D0B"]
  };
  constructor() {}

  ngOnInit() {}
}
