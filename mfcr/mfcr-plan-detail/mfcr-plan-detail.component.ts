import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as constant from '../constant';
import { SharedService } from '../../../shared/services/share.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MfcrService } from "../mfcr.service";
import { CoreServices } from '../../../core/services/core.service';


@Component({
  selector: 'pfep-mfcr-plan-detail',
  templateUrl: './mfcr-plan-detail.component.html',
  styleUrls: ['./mfcr-plan-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MfcrPlanDetailComponent implements OnInit, OnChanges {

  constructor(public sharedService: SharedService, public mfcrService: MfcrService, private router: Router, private changeDetector: ChangeDetectorRef, public coreService: CoreServices) {

  }

  FormValues: any;
  @Input() getItemPlan: any;
  @Input() itemPlanDetailFn: any = () => { };
  multiValueFields: any;
  itemPlanValues: any;
  erpFormValues: any;
  @Output() triggerTblRowData = new EventEmitter<any>();
  @Input() rowData: any;
  // mockRes: any;
  ApproveTableColumns: Array<any> = [];
  disableButtons: boolean = false;

  ngOnInit() {
    this.FormValues = constant.itemPlanDataFormLabel;
    this.multiValueFields = constant.multiValueFields;
    // this.itemPlanValues = constant.itemPlanLabel;
    this.erpFormValues = constant.erpValuesLabel;
    // this.mockRes = constant.mockResponse;
    this.ApproveTableColumns = constant.ApproverTblCol;
  }

  ngOnChanges() {
    if (this.getItemPlan.MFCRItemPlanData.PROPOSED_DATA.PRESENTATION_METHOD != null) {
      const selectedPresType = this.getItemPlan.MFCRItemPlanData.PROPOSED_DATA.PRESENTATION_METHOD.filter(data => data.IsSelected);
      if (selectedPresType.length != 0) {
        if (selectedPresType[0].PRESENTATION_TYPE === 'Bin' || selectedPresType[0].PRESENTATION_TYPE === 'Bulk') {
          this.itemPlanValues = constant.presentationTypeBin_bulk;
        } else if (selectedPresType[0].PRESENTATION_TYPE === 'Bag') {
          this.itemPlanValues = constant.presentationTypeBag;
        } else if (selectedPresType[0].PRESENTATION_TYPE === 'Hand Stack') {
          this.itemPlanValues = constant.presentationTypeHandStack;
        } else if (selectedPresType[0].PRESENTATION_TYPE === 'Kit') {
          this.itemPlanValues = Object.assign([], [...constant.presentationTypeKit]);
        }
      }
    }
    if (this.getItemPlan.REVIEW_APPROVALS != null) {
      const revStatus = this.getItemPlan.REVIEW_APPROVALS.filter(val => val.STATUS === 'InProgress');
      if (revStatus.length != 0) {
        this.disableButtons = false;
      }
      else {
        this.disableButtons = true;
      }
    }else {
      this.disableButtons = true;
    }


  }
  getDDSelectValue = (arr, key, flag) => {
    if (arr) {
      const displayOption = arr.filter(opt => opt.IsSelected);
      if (displayOption.length != 0) {
        // const duplicateItemPlanValues = this.itemPlanValues  
        if (key === 'KIT_TYPE' && displayOption[0][key] !== 'MASTER KIT' && flag && this.itemPlanValues[2].field == 'CONTAINER_CODE') {
          this.itemPlanValues.splice(2, 1);
          this.changeDetector.detectChanges();
          //  this.itemPlanValues = Object.assign([], [this.itemPlanValues]);
          console.log(this.itemPlanValues)
        }

      }
      return displayOption[0] ? displayOption[0][key] : '';
    }
    return '';
  }

  navigateToItemPlanDet() {
    const itemPlanObj = {
      planIdFromParent: this.rowData[constant.itemPlanId],
      parentScreenPath: '/mfcr',
      isChild: true,
      selectedRecord: {
        ...this.rowData,
        // [constants.segment]: this.searchCriteria[constants.segment]
      }
    };
    this.itemPlanDetailFn({ ...itemPlanObj });
  }

  editRow(index) {
    this.getItemPlan.REVIEW_APPROVALS[index]['isEdit'] = true;
  }

  ApproveRequest() {
    let approvalReq = {};
    this.getItemPlan.REVIEW_APPROVALS.filter(val => {
      if (val.STATUS === 'InProgress') {
        approvalReq = {
          MFCR_SID: this.rowData[constant.mfcdSID],
          MFCR_APPROVAL_TASK_SID: val.MFCR_APPROVAL_TASK_SID,
          STATUS: 'Approved',
          NOTES: val.NOTES
        }
        this.coreService.showLoader();
        this.mfcrService.ApproveRequest(approvalReq).subscribe(res => {
          if (res['StatusType'] == 'SUCCESS') {
            this.mfcrService.displayMessage(
              'success',
              res['Message']
            );
            this.triggerTblRowData.emit(this.rowData);
            this.disableButtons = true;
          } else {
            this.mfcrService.displayMessage(
              'error',
              res['Message']
            );
          }
          this.coreService.hideLoader();
        })
      }

    })
  }

  RejectRequest() {
    let approvalReq = {};
    this.getItemPlan.REVIEW_APPROVALS.filter(val => {

      if (val.STATUS === 'InProgress') {
        if (val.NOTES != null) {
          if (val.NOTES.trim() != '') {
            approvalReq = {
              MFCR_SID: this.rowData[constant.mfcdSID],
              MFCR_APPROVAL_TASK_SID: val.MFCR_APPROVAL_TASK_SID,
              STATUS: 'Rejected',
              NOTES: val.NOTES
            }
            this.coreService.showLoader();
            this.mfcrService.ApproveRequest(approvalReq).subscribe(res => {
              if (res['StatusType'] == 'SUCCESS') {
                this.mfcrService.displayMessage(
                  'success',
                  res['Message']
                );
                this.triggerTblRowData.emit(this.rowData);
                this.disableButtons = true;
              } else {
                this.mfcrService.displayMessage(
                  'error',
                  res['Message']
                );
              }
              this.coreService.hideLoader();
            })
          }
        }
        else {
          this.mfcrService.displayMessage(
            'error',
            'Please Enter Notes'
          );
        }
      }
    })
  }

  cellClikedToEdit = (e, col, rowData) => {
    if (!col.isEdit || e.srcElement.className.includes('form-control')) {
      e.stopPropagation();
      return;
    }
  }

}
