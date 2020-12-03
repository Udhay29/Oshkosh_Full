import { Component, OnInit, ViewChild } from '@angular/core';
import * as constants from './constant';
import { MfcrService } from './mfcr.service';
import { MfcrTableFormsComponent } from './mfcr-table-forms/mfcr-table-forms.component';
import { CoreServices } from '../../core/services/core.service';
import { SharedService } from '../../shared/services/share.service';
import { Router, ActivatedRoute } from '@angular/router';

declare let jsPDF: any;
declare let html2canvas: any;

@Component({
  selector: 'pfep-mfcr',
  templateUrl: './mfcr.component.html',
  styleUrls: ['./mfcr.component.scss']
})
export class MfcrComponent implements OnInit {
  wildCardLookupConfig: Array<any> = Object.assign([], [...constants.wildCardLookUpConfig]);
  itemId: string = constants.itemId;
  searchInvalid = false;
  searchCriteria: any = {
    MFCR_STATUS: '',
    FACILITY_ID: '',
    ITEM_ID: '',
    WORK_CENTER_IDS: '',
    ITEM_PLAN_ID: '',
    ASSIGNED_TO: '',
    APPROVAL_GROUP_NAME: '',
    PageSize: '10',
    PageIndex: '1'
  }
  wildCardLookUpConfigCopy: any;
  gridViewDataDD: any;
  statusDropDownValues: any;
  itemPlanStatusDDKey: string = constants.itemPlanStatusDDKey;
  searchResult: any;
  showGrid: boolean = false;
  mfcrIp: any = {};

  @ViewChild(MfcrTableFormsComponent) tableComp: MfcrTableFormsComponent


  constructor(public mfcrService: MfcrService, public coreService: CoreServices, public sharedService: SharedService, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.mfcrService.getPlanStatus().subscribe(response => {
      this.statusDropDownValues = response;
    });
    this.mfcrService.getGridViewDD().subscribe(response => {
      this.gridViewDataDD = response;
    });
    this.wildCardLookupConfig = Object.assign([], [...constants.wildCardLookUpConfig]);
    this.checkForInput();
  }

  parseDDValues = (res, key) => {
    if (res) {
      this.statusDropDownValues = [
        ...res.map(val => ({ [key]: val, IsSelected: false }))
      ];
    }
  }

  wildCardChangeEvent(data) {
    this.searchInvalid = false;
    this.searchCriteria[
      data.modelName === 'WORK_CENTER_ID' ? 'WORK_CENTER_IDS' : data.modelName
    ] = data.selectedData;
    console.log(this.searchCriteria);

    if (data.modelName === constants.branch) {
      const mfcrWcIp = (this.mfcrIp[constants.workCenterDDKey] ? this.mfcrIp[constants.workCenterDDKey] : '');

      if (mfcrWcIp) {
        this.wildCardLookupConfig[1] = {
          ...this.wildCardLookupConfig[1], selectedData: mfcrWcIp,
          dependentData: {
            [constants.segment]: '',
            [constants.branch]: data.selectedData,
            [constants.workCenter]: ''
          }
        }
        this.searchCriteria[constants.workCenterDDKey] = mfcrWcIp;
        //delete this.mfcrIp[constants.workCenter];
        return;
      }

      this.wildCardLookUpConfigInit([1, 2]);

      this.wildCardLookupConfig[1] = {
        ...this.wildCardLookupConfig[1],
        dependentData: {
          [constants.segment]: '',
          [constants.branch]: data.selectedData,
          [constants.workCenter]: ''
        }
      }

      this.wildCardLookupConfig[2] = {
        ...this.wildCardLookupConfig[2],
        dependentData: {
          [constants.segment]: '',
          [constants.branch]: this.wildCardLookupConfig[1].dependentData[constants.branch],
          [constants.workCenter]: ''
        }
      }

      // this.searchCriteria[constants.workCenter] = '';
      // this.searchCriteria[constants.itemId] = '';
    } else if (data.modelName === constants.workCenter) {
      const mfcrItemIdIp = (this.mfcrIp[constants.itemId] ? this.mfcrIp[constants.itemId] : '');

      if (mfcrItemIdIp) {
        this.wildCardLookupConfig[2] = {
          ...this.wildCardLookupConfig[2], selectedData: mfcrItemIdIp,
          dependentData: {
            [constants.segment]: '',
            [constants.branch]: this.wildCardLookupConfig[1].dependentData[constants.branch],
            [constants.workCenter]: this.wildCardLookupConfig[1].selectedData ? this.wildCardLookupConfig[1].selectedData : ''
          }
        };
        this.searchCriteria[constants.itemId] = mfcrItemIdIp;
        //delete this.mfcrIp[constants.itemId];
        return;
      }

      this.wildCardLookUpConfigInit([2]);

      this.wildCardLookupConfig[2] = {
        ...this.wildCardLookupConfig[2],
        dependentData: {
          [constants.segment]: '',
          [constants.branch]: this.wildCardLookupConfig[1].dependentData[constants.branch],
          [constants.workCenter]: this.wildCardLookupConfig[1].selectedData ? this.wildCardLookupConfig[1].selectedData : ''
        }
      }
    }
  }

  wildCardLookUpConfigInit(data) {
    data.forEach(element => {
      this.wildCardLookupConfig[element] = JSON.parse(JSON.stringify(this.wildCardLookUpConfigCopy[element]));
    });
  }

  getDDValue = (arr, key) => {
    if (arr) {
      const displayOption = arr.filter(opt => opt.IsSelected);
      return displayOption[0] ? displayOption[0][key] : '';
    }
  }

  checkForInput = () => {
    this.mfcrIp = this.sharedService.getMFCRIp();
    this.sharedService.setMFCRIp({});
    this.wildCardLookUpConfigCopy = JSON.parse(JSON.stringify(this.wildCardLookupConfig));
    if (Object.keys(this.mfcrIp).length > 0) {
      this.sharedService.isHierarchy.next(this.mfcrIp);
      this.wildCardLookupConfig[0].selectedData = this.mfcrIp[constants.branch];
      this.searchCriteria[constants.branch] = this.mfcrIp[constants.branch];

      setTimeout(() => {
        this.search(this.mfcrIp[constants.mfcdSID], true);
      }, 500);
    } else {
      this.wildCardLookupConfig[0] = { ...this.wildCardLookupConfig[0], selectedData: '' };
    }
  }

  emptyField = (value, ddKey) => {
    if (Array.isArray(value)) {
      value = this.getDDValue(value, ddKey);
    }
    return [null, '', undefined].indexOf(value) > -1;
  }

  searchClicked = () => {
    this.emptyField(this.searchCriteria[constants.branch], '') && this.emptyField(this.searchCriteria[constants.MFCRStatusCode], '')
      && this.emptyField(this.searchCriteria[constants.assignedTo], '') && this.searchCriteria[constants.workCenterDDKey].length === 0
      && this.emptyField(this.searchCriteria[constants.itemId], '')
      ? (this.searchInvalid = true)
      : this.search();
  }

  search(mfcrSID?, naviagtedFromParent?) {
    this.searchInvalid = false;
    this.searchCriteria.ASSIGNED_TO = this.searchCriteria.ASSIGNED_TO.trim();
    this.searchResultData(mfcrSID || '',naviagtedFromParent);

  }

  searchResultData(mfcrSID?, naviagtedFromParent?) {
    //this.searchCriteria[constants.workCenter] = '';
    this.coreService.showLoader();
    if(naviagtedFromParent) {
      this.searchCriteria['CALL_FROM'] = this.mfcrIp.parentScreen === '/home' ? 'HOME' : '';
    }

    this.mfcrService.getSearchResult(this.searchCriteria).subscribe(response => {

      this.searchResult = response;
      delete this.searchCriteria['CALL_FROM'];
      if(!naviagtedFromParent) {
        this.mfcrIp = {};
      }
      if (this.searchResult.StatusType === 'SUCCESS') {
        if (this.searchResult && this.searchResult.SearchRecords.length > 0) {
          this.showGrid = true;
          // allowing some time for the compoenen tto be built before calling it's function
          if (mfcrSID) {
            setTimeout(() => {
              const recData = this.searchResult.SearchRecords.filter(rec => rec[constants.mfcdSID] === mfcrSID)
              if (recData.length > 0) { this.tableComp.getItemPlanDetails(recData[0]); }
            });
          }
        }
      } else {
        this.mfcrService.displayMessage(
          'error',
          this.searchResult.Message
        );

      }
      this.coreService.hideLoader();
    });
  }

  changeStatus(event) {
    this.searchInvalid = false;
    this.searchCriteria['MFCR_STATUS'] = event.target.value.trim();
  }

  changeGridValue(event) {
    this.searchCriteria['APPROVAL_GROUP_NAME'] = event.target.value;
    this.searchResultData();
  }

  routeAttached = () => {
    this.checkForInput();
  }

  changePage(e) {
    this.searchCriteria.PageIndex = e.page + 1;
    this.searchCriteria.PageSize = e.rows;
    this.searchResultData();
  }

  itemDetailFn = data => {

    let req = {};
    // if (!this.isFromItemFlow) { this.dataOpened[constants.workCenterId] =  this.workCenterId; }

    if (this.mfcrIp.parentScreenPath !== '/item-plan-detail') {
      req = { isChild: true, parentScreenPath: '/mfcr' }
    } else {
      req = { setUrl: true, backurl: '/item-plan-detail', isChild: false, parentScreenPath: '', navigateUrl: true };
    }
    this.sharedService.setItemPlanIp({
      ...data, ...req
    });
    this.router.navigate(["/item-plan-detail"]);
  };

  exportToExcel() {
    this.mfcrService.ExportToExcel(this.searchCriteria).subscribe(res => {
      if(res['StatusType'] ==='SUCCESS') {
        window.open(res['FilePath'],'_blank');
      } else {
        this.mfcrService.displayMessage('error',res['Message'])
      }
    });
  }


}
