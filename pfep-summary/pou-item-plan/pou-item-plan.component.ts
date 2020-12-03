import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "pfep-pou-item-plan",
  templateUrl: "./pou-item-plan.component.html",
  styleUrls: ["./pou-item-plan.component.scss"]
})
export class PouItemPlanComponent implements OnInit {
  @Input() data;
  @Input() feilds;
  @Input() isEditable;
  @Input() exportEnabled = false;
  @Input() exportExcel = () => {};
  @Output() rowClick = new EventEmitter<any>();
  selectedDataRow: any = {};

  constructor() {}
  ngOnInit() {}

  navigateToItemPlan(data) {
   this.rowClick.emit(data);
  }
}
