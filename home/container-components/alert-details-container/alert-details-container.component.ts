import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeModuleService } from '../../home-module.service';
import { SharedService } from '../../../../shared/services/share.service';
import { Router } from '@angular/router';
import * as constants from '../../constants';
import { ToastrService } from 'ngx-toastr';
import { CoreServices } from 'src/app/core/services/core.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'pfep-alert-details-container',
  templateUrl: './alert-details-container.component.html',
  styleUrls: ['./alert-details-container.component.scss']
})
export class AlertDetailsContainerComponent implements OnInit {
  tableData: Array<object> = [];
  currentScreen = '';
  title = '';
  columns: Array<object> = [];
  tableKey: Array<string> = [];
  dataToSave: object = {};
  saveEnabled = false;
  dropDownData: object = {};
  searchCriteria: any = {
    WorkCenterList: [{ WORK_CENTER_ID: null }],
    ORG_ID: null,
    FACILITY_ID: null,
    snoozed: false
  };
  dataFetching = false;
  rows = 10;
  totalRecords = 10;
  page = 1;
  totalPages = 1;
  hidePaginator = true;
  recordsString = '';
  stopPageChangeEvent = false;

  @ViewChild(Paginator) paginator: Paginator;

  constructor(
    private homeService: HomeModuleService,
    private toastr: ToastrService,
    public sharedService: SharedService,
    public router: Router,
    public _coreServices: CoreServices,
    public modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadData();
    this.subscribeToRouteSubject();
  }

  subscribeToRouteSubject = () => {
    this.sharedService.getRouteAttachedSubject().subscribe(screenData => {
      if(constants.alertScreenPaths.indexOf(screenData) > -1 && this.currentScreen &&  screenData === constants.pathScreenParamMap[this.currentScreen]) {
        this.routeAttached();
      }
    })
  }

  loadData() {
    this.currentScreen = this.homeService.getAlertDetailScreenParam();
    const criteria = this.homeService.getAlertDetailSearchData();
    this.homeService.setAlertDetailScreenParam('', {});
    this.fetchData({...criteria.searchCriteria, snoozed: false} || {});
  }

  fetchData = criteria => {
    if (this.checkForCriteria(criteria)) {
      this.searchCriteria = { ...criteria };
      const date = { ...criteria.date };
      // this.dataFetching = true;
      this._coreServices.showLoader();
      this.homeService[constants.alertDetailGetFunctionMap[this.currentScreen]](
        this.searchCriteria,
        date,
        this.rows,
        this.page,
        res => {
          // this.dataFetching = false;
          this._coreServices.hideLoader();
          this.columns = constants.alertDetailsColumnMap[this.currentScreen];
          this.dropDownData = res.dropDowns;
          this.setTotalCounts(res, true);
          this.tableData = res.tableData;
          this.tableKey = constants.alertDetailsTableKeys[this.currentScreen];
          this.title = constants.alertScreenTitles[this.currentScreen];
        }
      );
    }

  }

  checkForCriteria = criteria => {
    const sC = {...criteria};
    if(sC.snoozed !== undefined)  delete sC.snoozed;
    if (
      typeof sC === 'object' &&
      sC !== null &&
      Object.prototype.toString.call(sC) !== '[object Array]' &&
      Object.keys(sC).length === 0
    ) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }

  setTotalCounts = ({ totalPages, totalRecords, page, rows }, pageChange) => {
    this.rows = rows;
    this.page = page;
    this.totalPages = totalPages;
    this.totalRecords = totalRecords;
    this.hidePaginator = totalPages && totalPages > 1 ? false : true;
    this.buildTotalRecordsString();
    if (!pageChange) {
      this.stopPageChangeEvent = true;
      if(this.paginator) this.paginator.changePage(0);
      this.stopPageChangeEvent = false;
    }
  }

  buildTotalRecordsString = () => {
    this.recordsString = '';
    if (this.totalPages === 1) {
      this.recordsString = `Displaying total ${this.totalRecords} record(s)`;
    } else {
      this.recordsString = `Displaying ${this.rows * (this.page - 1) +
        1} - ${Math.min(this.rows * this.page, this.totalRecords)} records of
      ${this.totalRecords} records in ${this.totalPages} pages`;
    }
  }

  onCriteriaChange = (criteria, preserveEdits = false, pageChange = false) => {
    this.searchCriteria = criteria;
    this.dataFetching = true;
    this.homeService[constants.alertDetailGetFunctionMap[this.currentScreen]](
      this.searchCriteria,
      undefined,
      this.rows,
      pageChange ? this.page : 1,
      res => {
        this.dataFetching = false;
        this.tableData = res.tableData;
        this.setTotalCounts(res, pageChange);
        if (preserveEdits) {
          this.updateEditedRecords();
        } else {
          this.dataToSave = {};
        }
      }
    );
  }

  onPageChange = e => {
    this.rows = e.rows;
    this.page = e.page + 1;
    if (!this.stopPageChangeEvent) {
      this.onCriteriaChange(this.searchCriteria, true, true);
    }
  }

  updateEditedRecords = () => {
    const currentRecords = [...this.tableData];
    if (Object.keys(this.dataToSave).length > 0) {
      currentRecords.forEach((rec, index) => {
        const reckey = this.getRowKey(rec);
        if (this.dataToSave[reckey]) {
          this.tableData[index] = { ...this.dataToSave[reckey] };
        }
      });
    }
    // this.completeData[this.selectedStack] = [...currentRecords];
  }

  routeAttached = () => {
    //this.sharedService.isHierarchy.next({ back: true, backurl: this.router.url });
    const postData = {
      ...this.sharedService.getCbReqData()['data'],
      DATA_TYPE: constants.singleRecAPIParam[this.currentScreen]
    };
    if (Object.keys(postData).length > 1) {
      this.sharedService.setCbReqData({});
      this.homeService.getSingleRecordData(postData).subscribe(res => {
        if (res['StatusType'] === 'SUCCESS') {
          this.updateRowData(res['AlertDetail']);
        } else {
          this.displayMessage('danger', res['Message']);
        }
      });
    }
  }

  updateRowData = res => {
    const tableIdx = this.tableData.findIndex(rec => {
      const recData = this.getRowKey(rec);
      const resData = this.getRowKey(res);
      return resData === recData;
    });
    this.tableData[tableIdx] = { ...res };
  }

  getRowKey = row => {
    let recData = '';
    this.tableKey.forEach(key => {
      recData += row[key];
    });
    return recData;
  }

  navigateToScreen = data => {
    switch (this.currentScreen) {
      case constants.pfepERPAlert:
      case constants.pfepShortage: 
        this.navigateToItemPlan(data);
        break;

        case constants.pfepRequired:
          this.navigateToPfepSummary(data);
          break;
    }
  }

  navigateToItemPlan = data => {
    this.sharedService.setItemPlanIp({ ...data });
    this.router.navigate(['/item-plan-detail']);
  }

  navigateToPfepSummary = data => {
    this.sharedService.setPfepSummaryIp({...data});
    this.router.navigate(['/pfep-summary']);
  }

  recordEdited = data => {
    this.dataToSave = { ...this.dataToSave, ...data };
    if (Object.keys(this.dataToSave).length > 0) {
      this.saveEnabled = true;
    }
  }

  saveData = () => {
    const saveData = Object.values(this.dataToSave);
    this.homeService[constants.saveAlertDetailMap[this.currentScreen]](
      saveData,
      this.searchCriteria
    ).subscribe(res => {
      if (res.StatusType === 'SUCCESS') {
        this.dataToSave = {};
        this.saveEnabled = false;
        this.fetchData(this.searchCriteria);
        this.displayMessage('success', constants.saveSuccessMessage);
      } else {
        this.displayMessage('danger', constants.saveErrorMessage);
      }
    });
  }

  displayMessage = (type, message) => {
    type === 'danger'
      ? this.toastr.error(message)
      : this.toastr.success(message, '', { disableTimeOut: false });
  }

  canDeactivate = () => {
    let hasEdits = false;

    if (Object.keys(this.dataToSave).length > 0) {
      hasEdits = true;
    }

    if (hasEdits) {
      this.modalService.open();
      return this.modalService.getConfirmationSubject();
    }

    return true;
  }
}
