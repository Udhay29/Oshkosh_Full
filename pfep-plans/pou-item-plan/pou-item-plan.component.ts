import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { SharedService } from "src/app/shared/services/share.service";
import { Router, ActivatedRoute } from "@angular/router";
import { rowFetchPostDataKeys } from '../pfep-plans.component';

@Component({
  selector: "pfep-pou-item-plan",
  templateUrl: "./pou-item-plan.component.html",
  styleUrls: ["./pou-item-plan.component.scss"]
})
export class PouItemPlanComponent implements OnInit {
  @Input() data;
  @Input() feilds;
  @Input() isEditable;
  @Output() rowClick = new EventEmitter<any>();
  selectedDataRow: any = {};

  constructor(
    public shareService: SharedService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {}
  onRowSelect(data) {
    this.rowClick.emit(data);
  }
  navigateToPou(data) {
    const itemPlanObj = {
      planIdFromParent: data.ITEM_PLAN_ID,
      parentScreenPath: "/plans",
      isChild: true,
      selectedRecord: data
    };
    this.shareService.setItemPlanIp({ ...itemPlanObj });
    this.router.navigate(["/item-plan-detail"]);
  }
}
