// presentational component for showing the metrics graphs

import { Component, OnInit, Input } from '@angular/core';
import { multi,multi1,singlePie} from './data';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent implements OnInit {
  groupGraph = [];
  pieGraph = [];
  @Input() approved_plan:any=[];
  @Input() disparate_metrics:any=[];

  constructor() { }

  ngOnInit() {
    this.groupGraph.push(this.approved_plan,this.disparate_metrics);
  }

}
