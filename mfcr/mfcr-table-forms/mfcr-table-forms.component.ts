import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as constants from "../constant";
import { MfcrService } from "../mfcr.service";
import { CoreServices } from '../../../core/services/core.service';
import { SharedService } from '../../../shared/services/share.service';
import { Router, ActivatedRoute } from '@angular/router'


@Component({
  selector: 'pfep-mfcr-table-forms',
  templateUrl: './mfcr-table-forms.component.html',
  styleUrls: ['./mfcr-table-forms.component.scss']
})
export class MfcrTableFormsComponent implements OnInit, OnChanges {

  constructor(public mfcrService: MfcrService, public coreService: CoreServices, public sharedService: SharedService, private router: Router) { }

  @Input() mfcrDataList;
  @Input() itemPlanDetailFn;
  formTableKeysValues: any;
  ItemPlanDetails: any;
  showForm: boolean = false;
  @Output() rowClick = new EventEmitter<any>();
  sendItemPlanDet: any;
  pageCount: any;
  @Output() pagination = new EventEmitter<any>();


  ngOnInit() {
    this.formTableKeysValues = constants.formTableKeysValues;
  }

  ngOnChanges(changes) {
    if (changes.mfcrDataList) {
      this.pageCount = 0;
    }
    // if(this.mfcrDataList.SearchRecords.length == 0) {
    this.showForm = false;
    // }
  }

  getItemPlanDetails(data) {

    this.sendItemPlanDet = data;
    this.coreService.showLoader();
    const requestdata = {
      ITEM_PLAN_ID: data.ITEM_PLAN_ID,
      MFCR_SID: data.MFCR_SID
    }
    this.mfcrService.getMfcrItemPlanDet(requestdata).subscribe(response => {

      this.ItemPlanDetails = response;
      this.showForm = true;
    });
    this.coreService.hideLoader();
  }

  pageChange(e) {
    this.pageCount = e.page;
    this.pagination.emit(e);
  }


}
