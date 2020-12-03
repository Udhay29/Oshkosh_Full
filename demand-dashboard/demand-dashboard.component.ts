import {
  Component,
  OnInit,
  ChangeDetectorRef,
  EventEmitter,
  Input,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { DemandDashboardService } from './demand-dashboard-service';
import { setFutureDate } from '../../utils/date-utils';
import { ToastrService } from 'ngx-toastr';
import { DemandDashboardUtilService } from './demand-dashboard.utils';
import tableConstants from './demand_dashboard_constants';
import { SharedService } from './../../shared/services/share.service';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CoreServices } from 'src/app/core/services/core.service';
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ModalService } from 'src/app/core/services/modal.service';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'pfep-demand-dashboard',
  templateUrl: './demand-dashboard.component.html',
  styleUrls: ['./demand-dashboard.component.scss'],
  providers: [ConfirmationService],
  encapsulation: ViewEncapsulation.None
})
export class DemandDashboardComponent implements OnInit {
  tableFields: any = tableConstants['tableKeyFields'];
  futureDateInvalid: Boolean = false;
  display: Boolean = false;
  graphChanged = false;
  fieldSearch: string;
  index = null;
  fieldDropDownValues: any = new EventEmitter();
  @Input() selectedLookupValue;
  @Input() selectedWorkCenterData;
  @ViewChild(Table) dt: Table;
  workCenter: any = {
    serviceUrl: {
      dropdown: 'WildcardSearch/GetFields?fieldName=WORK_CENTER_ID',
      table: 'WildcardSearch/GetDropdownValuesWorkCenter'
    },
    tableFields: [
      { header: 'ID', field: 'WORK_CENTER_ID' },
      { header: 'Description', field: 'WORK_CENTER_DESC' }
    ],
    label: 'Work Center',
    isMultiSelect: true,
    selectedData: [],
    options: [],
    modelName: 'WORK_CENTER_ID',
    styleclass: 'col-md-2',
    dependentData: ''
  };

  branch: any = {
    serviceUrl: {
      dropdown: 'WildcardSearch/GetFields?fieldName=FACILITY_ID',
      table: 'WildcardSearch/GetDropdownValuesWarehouse'
    },
    tableFields: [
      { header: 'ID', field: 'FACILITY_ID' },
      { header: 'Description', field: 'FACILITY_DESC' }
    ],
    label: 'Branch',
    isMultiSelect: false,
    selectedData: '',
    modelName: 'FACILITY_ID',
    styleclass: 'col-md-2'
  };

  itemNumber: any = {
    serviceUrl: {
      dropdown: 'WildcardSearch/GetFields?fieldName=ITEM_ID',
      table: 'WildcardSearch/GetDropdownValues'
    },
    tableFields: [
      { header: 'ID', field: 'ITEM_ID' },
      { header: 'Description', field: 'ITEM_DESC' }
    ],
    label: 'Item Number',
    isMultiSelect: false,
    selectedData: '',
    modelName: 'ITEM_ID',
    styleclass: 'col-md-2',
    dependentData: ''
  };

  date = {
    fromDate: new Date(),
    toDate: setFutureDate()
  };

  onLoadDemandLists: any = [];

  fromDate: Date;

  toDate: Date;
  branchValue: any;

  selectedFromDate: Date;

  selectedToDate: Date;

  itemIdLookUpConfig: any;
  workCenterLookUpConfig: any;
  branchLookUpConfig: any;
  branchLookupData: any;
  itemNumberLookupData = [{}];
  workCenterLookupData: any;
  lookupsearch: any;
  selectedItemLookUpValue: any;
  selectedBranchLookUpValues: any;
  value: any;
  workCenterValue: any;
  demandSearchList: any = [];
  newWorkCenter: any = [];
  showGraph: Boolean = false;
  gType = 'Daily';
  graphdata = { Graph: [] };
  selectedRow: any;
  RectDates: any;
  selectedRowCopy: any;
  demandSearchListCopy: any;
  maximumToDate: Date = setFutureDate();
  minimumFromDate: Date = new Date();
  tableGrid: Boolean = false;
  isEditable: Boolean = false;
  yearRange: string = new Date() + ':' + (new Date().getFullYear() + 1);
  errorMessage: any;
  showAlert = false;
  branchdefaultselecteddropDownValue = { 'FIELD_NAME': 'FACILITY_ID' };
  workcenterdefaultselecteddropDownValue = { 'FIELD_NAME': 'WORK_CENTER_ID' };
  itemdefaultselecteddropDownValue = { 'FIELD_NAME': 'ITEM_ID' };
  fromItemDetails: boolean;
  hasEdits: any;
  rowsPerPage = 10;
  page = 1;
  recordsToDisplay: any = [];
  stopPageChangeEvent: boolean = false;
  recordsString: string = '';
  onLoadData:any = {};

  @ViewChild(Paginator) paginator: Paginator;

  constructor(
    public demandDashboardService: DemandDashboardService,
    private toastr: ToastrService,
    private demandDashboardUtilService: DemandDashboardUtilService,
    public sharedService: SharedService,
    public confirmationService: ConfirmationService,
    private coreServices: CoreServices,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private modalService: ModalService,
  ) { }
  onLoad: any;
  onLoadPackagingData: any;
  onLoadItemId: any;
  onLoadBranchId: any;
  onLoadWorkCenterId: any;
  routerConfig: any;
  ngOnInit() {
    const routeRoles = this.route.snapshot.data.roles;
    this.isEditable = this.coreServices.checkAccess(routeRoles);
    this.itemIdLookUpConfig = {
      lookUpConfig: {
        dropdownFieldName: 'ITEM_ID',
        isMultiple: 'single',
        isDisable: false
      },
      label: 'Item Number'
    };
    this.workCenterLookUpConfig = {
      lookUpConfig: {
        dropdownFieldName: 'WORK_CENTER_ID',
        isMultiple: 'multiple',
        isDisable: true
      },
      label: 'Work Center'
    };
    this.branchLookUpConfig = {
      lookUpConfig: {
        dropdownFieldName: 'FACILITY_ID',
        isMultiple: 'single',
        isDisable: false
      },
      label: 'Branch'
    };
    this.onLoad = false;
    this.onLoadPackagingData = this.sharedService.getIpFromPackagingCalculator();
    this.sharedService.isHierarchy.next(this.onLoadPackagingData);
    this.fromItemDetails = Object.keys(this.onLoadPackagingData).length === 0;
    this.sharedService.setDemandDashBoardIP({});
    this.onLoadItemId = this.onLoadPackagingData.ITEM_ID;
    this.onLoadBranchId = this.onLoadPackagingData.FACILITY_ID;
    if (this.onLoadPackagingData.TGTWorkCenterList) {
      this.onLoadPackagingData.TGTWorkCenterList.forEach(data => { this.onLoadWorkCenterId = data.TGT_WORK_CENTER_ID; });
    }
    if (this.onLoadPackagingData && this.onLoadPackagingData !== undefined) {
      this.onLoadDemandData(this.onLoadPackagingData);
    }
  }

  async onLoadDemandData(data) {
    if (data && data['ITEM_ID'] !== undefined) {
      this.onLoadData = data;
      this.branch.selectedData = data.FACILITY_ID;
      const fromDate = this.transformDate(this.date.fromDate);
      const toDate = this.transformDate(this.date.toDate);
      // this.date.fromDate = null;
      // this.date.toDate = null;
      this.coreServices.showLoader();
      this.onLoadDemandLists = await this.demandDashboardService.onLoadDemandList(data, fromDate, toDate).toPromise();
      this.coreServices.hideLoader();
      
      this.demandSearchList = this.onLoadDemandLists ? this.onLoadDemandLists : null;
      this.demandSearchListCopy = JSON.parse(JSON.stringify(this.demandSearchList));
      this.tableGrid = true;
      this.determineRowsAndPage();
    }
  }

  displayMessage(
    type = 'danger',
    message = 'Unknown Error occured. Please try again.'
  ) {
    type === 'danger'
      ? this.toastr.error(message)
      : this.toastr.success(message, '', { disableTimeOut: false });
  }

  checkFromDate(date) {
    this.selectedFromDate = date;
  }

  checkToDate(date) {
    this.selectedToDate = date;
  }

  getFieldDropDownValues(fieldSearch) {
    // console.log(fieldSearch);
    this.fieldSearch = fieldSearch;
    this.demandDashboardService
      .getDropdownValuesforFields(this.fieldSearch)
      .subscribe(data => (this.fieldDropDownValues = data));
  }

  lookup(data) {
    const selectedValue = data[0];
    const enteredValue = data[1];
    switch (this.fieldSearch) {
      case 'ITEM_ID':
        this.itemID(selectedValue, enteredValue);
        break;
      case 'WORK_CENTER_ID':
        this.workCenterID(selectedValue, enteredValue);
        break;
      case 'FACILITY_ID':
        this.branchID(selectedValue, enteredValue);
    }
  }

  itemID(selectedValue, enteredValue) {
    if (selectedValue) {
      this.demandDashboardService
        .getItemNumberDataOnLookup(selectedValue, enteredValue)
        .subscribe((data: any) => (this.itemNumberLookupData = data));
    }
  }
  workCenterID(selectedValue, enteredValue) {
    if (selectedValue) {
      this.demandDashboardService
        .getWorkcenterDataOnLookup(selectedValue, enteredValue)
        .subscribe(data => (this.workCenterLookupData = data));
    }
  }
  branchID(selectedValue, enteredValue) {
    if (selectedValue) {
      this.demandDashboardService
        .getBranchDataOnLookup(selectedValue, enteredValue)
        .subscribe(data => (this.branchLookupData = data));
    }
  }

  onSearchItem(data) {
    // console.log(data)
    this.selectedItemLookUpValue = data.selectedItemLookUpValue;
  }

  onSearchBranch(data) {
    // console.log(data);
    this.selectedBranchLookUpValues = data.selectedLookupValue;
  }

  wildCardChangeEvent(data) {
    this.workCenterValue = [];
    if(this.onLoadData && this.onLoadData['ITEM_ID']) {
      this.itemNumber = Object.assign({}, this.itemNumber, {selectedData: this.onLoadData['ITEM_ID']});
      delete this.onLoadData['ITEM_ID'];
    } else {
      this.itemNumber = {
        serviceUrl: {
          dropdown: 'WildcardSearch/GetFields?fieldName=ITEM_ID',
          table: 'WildcardSearch/GetDropdownValues'
        },
        tableFields: [
          { header: 'ID', field: 'ITEM_ID' },
          { header: 'Description', field: 'ITEM_DESC' }
        ],
        label: 'Item Number',
        isMultiSelect: false,
        selectedData: '',
        modelName: 'ITEM_ID',
        styleclass: 'col-md-2',
        dependentData: {
          ORG_ID: '',
          FACILITY_ID: this.selectedBranchLookUpValues,
          WorkCenterList: data.selectedData
        }
      };
    }
    if (data.selectedData !== undefined) {
      data.selectedData.forEach(data => {
        // data['TGT_WORK_CENTER_ID']= data['WORK_CENTER_ID'];
        this.workCenterValue.push(data);
      });
      this.newWorkCenter = this.workCenterValue.map(function (elm) {
        return { TGT_WORK_CENTER_ID: elm['WORK_CENTER_ID'] };
      });
    }

    this.itemNumber.dependentData = {
      ORG_ID: '',
      FACILITY_ID: this.workCenter.dependentData.FACILITY_ID,
      WorkCenterList: data.selectedData
    };
  }

  branchChangeEvent(data) {
    if (data.modelName === 'FACILITY_ID') {
      if(this.onLoadData && this.onLoadData['TGTWorkCenterList']){
        this.workCenter = Object.assign({}, this.workCenter, {selectedData: [{WORK_CENTER_ID:this.onLoadData['TGTWorkCenterList'][0].TGT_WORK_CENTER_ID}]});
        delete this.onLoadData['TGTWorkCenterList'];
      } else {
        this.workCenter = {
          serviceUrl: {
            dropdown: 'WildcardSearch/GetFields?fieldName=WORK_CENTER_ID',
            table: 'WildcardSearch/GetDropdownValuesWorkCenter'
          },
          tableFields: [
            { header: 'ID', field: 'WORK_CENTER_ID' },
            { header: 'Description', field: 'WORK_CENTER_DESC' }
          ],
          label: 'Work Center',
          isMultiSelect: true,
          selectedData: [],
          options: [],
          modelName: 'WORK_CENTER_ID',
          styleclass: 'col-md-2',
          dependentData: {
            ORG_ID: '',
            FACILITY_ID: data.selectedData,
            WorkCenterList: []
          }
        };
        this.itemNumber = {
          serviceUrl: {
            dropdown: 'WildcardSearch/GetFields?fieldName=ITEM_ID',
            table: 'WildcardSearch/GetDropdownValues'
          },
          tableFields: [
            { header: 'ID', field: 'ITEM_ID' },
            { header: 'Description', field: 'ITEM_DESC' }
          ],
          label: 'Item Number',
          isMultiSelect: false,
          selectedData: '',
          modelName: 'ITEM_ID',
          styleclass: 'col-md-2',
          dependentData: {
            ORG_ID: '',
            FACILITY_ID: data.selectedData,
            WorkCenterList: []
          }
        };
      }

      this.selectedBranchLookUpValues = data.selectedData;
    }
  }
  itemNumberChangeEvent(data) {
      this.selectedItemLookUpValue = data.selectedData;
  }

  transformDate(date) {
    const d = new Date(date);
    return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');
  }

  validateDate() {
    if (this.date.fromDate === null || this.date.toDate === null) {
      this.displayMessage('danger', 'Please Enter Date For Search');
    }
  }

  onSearchDemandList() {
    this.onLoad = false;
    this.validateDate();
    const post = {
      ITEM_ID: this.selectedItemLookUpValue ? this.selectedItemLookUpValue : this.onLoadItemId,
      TGTWorkCenterList: this.newWorkCenter ? this.newWorkCenter : this.onLoadWorkCenterId,
      FACILITY_ID: this.selectedBranchLookUpValues ? this.selectedBranchLookUpValues : this.onLoadBranchId,
      EFF_FROM_DATE: this.date.fromDate ? this.transformDate(this.date.fromDate) : null,
      EFF_TO_DATE: this.date.toDate ? this.transformDate(this.date.toDate) : null
    };

    if (this.date.fromDate !== null && this.date.toDate !== null) {
      this.coreServices.showLoader();
      this.demandDashboardService.getSearchDataBasedOnLookUp(post)
        .subscribe(data => {
          this.demandSearchList = data;
          this.demandSearchListCopy = JSON.parse(JSON.stringify(this.demandSearchList));
          this.resetValues();
          this.resetToFirstPage();
          this.determineRowsAndPage();
          this.selectedRow = {};
          this.selectedRowCopy = {};
          this.index = null;
          this.coreServices.hideLoader();
        });
      this.tableGrid = true;
    } else {
      this.demandSearchList = [];
      this.demandSearchListCopy = [];
      this.determineRowsAndPage();
    }
  }

  resetValues = () => {
    this.showGraph = false;
    this.graphdata = { Graph: [] };
    this.selectedRow = {};
    this.RectDates = {};
    this.selectedRowCopy = {};
    this.showAlert = false;
    this.hasEdits = false;
    this.onLoadData = {};
  }

  trackTableRow = (idx, item) => item['ITEM_ID'];

  determineRowsAndPage = () => {
    if(this.demandSearchList.length > 0) {
      const startIndex = ((this.page - 1) * this.rowsPerPage);
      const endIndex = (this.page * this.rowsPerPage) - 1;
      this.recordsToDisplay = this.demandSearchList.slice(startIndex, endIndex + 1);
    } else {
      this.page = 1;
      this.rowsPerPage = 10;
      this.recordsToDisplay = [];
    }
    const totalPages = Math.floor(this.demandSearchList.length /this.rowsPerPage) + (this.demandSearchList.length %this.rowsPerPage > 0 ? 1 : 0);
    this.recordsString = this.sharedService.buildTotalRecordsString(
                              typeof totalPages === 'number'
                              ? totalPages : 0,
                              this.demandSearchList.length,
                              this.rowsPerPage, this.page
                          );
  }

  pageChanged =  event => {
    if(!this.stopPageChangeEvent) {
      if(this.index !== undefined && this.index !== null && this.demandSearchList[this.index].modified) {
        //calculating the index of the row in current page;
        this.confirm1({index : this.getPageRowIndexOnPageChange(event)}, true);
       }

      this.page = event.page + 1;

      if(this.rowsPerPage !== event.rows) {
        this.page = 1;
        this.resetToFirstPage();
      }

      this.rowsPerPage = event.rows;
      this.determineRowsAndPage();
      this.selectedRow = {};
    }
  }

  //getting the index of a row in displayRows when page CHnage is triggered
  getPageRowIndexOnPageChange = event => {
    const idx = this.index - ((event.page) * event.rows);
    return idx < event.rows ? idx : -1;
  }
  // getting the index of a row in displayRows using the rows index in total rows
  getPageRowIndex = () => {
   const idx =  this.index - ((this.page - 1) * this.rowsPerPage);
   return idx < this.rowsPerPage ? idx : -1;
  }
  // getting the index of a row in total rows using the rows index in page rows
  getOverallRowIndex = pageRowIdx => ((this.page - 1) * this.rowsPerPage) + pageRowIdx;

  resetToFirstPage = () => {
    this.stopPageChangeEvent = true;
    this.paginator.changePage(0);
    this.stopPageChangeEvent = false;
  }

  onEditRow(data) {
    const index = this.getOverallRowIndex(data.index);
    if (!this.graphChanged || (this.index === index || this.index === null)) {
      this.index = index;
      this.selectedRowCopy = Object.assign({}, this.demandSearchList[index]);
      if(!this.isEmpty(this.recordsToDisplay[data.index].DAILY_USAGE_OVERRIDE)) {
        const floatVal:any  = parseFloat(this.recordsToDisplay[data.index].DAILY_USAGE_OVERRIDE);
        this.recordsToDisplay[data.index].DAILY_USAGE_OVERRIDE = isNaN(floatVal) ? '' : floatVal;
      }
      this.selectedRow = this.recordsToDisplay[data.index];
      this.showGraph = false;
      this.gType = 'Daily';
      this.getGraphData(this.selectedRowCopy);
      this.demandSearchList[index]['modified'] = true;
    } else {
      this.confirm1(data);
    }
  }

  isEmpty = val => [null, undefined ,''].indexOf(val) > -1

  navigateToParent() {
    this.router.navigate([this.onLoadData.parentRoute]);
  }

  saveResults(row?) {
    const post = this.demandDashboardUtilService.buildSaveData(
      this.selectedRowCopy,
      this.RectDates
    );
    this.demandDashboardService.saveDemandLists(post)
      .subscribe((data: any) => {
        this.graphChanged = false;
        const errorKey = data.StatusType !== 'FAILURE' ? 'success' : 'danger';
        this.displayMessage(errorKey, data.Message);
        this.demandSearchList[this.index] = {...this.selectedRowCopy};
        this.demandSearchListCopy[this.index] = {...this.selectedRowCopy};
        if (row) {
          this.onEditRow(row);
        } else {
          this.demandSearchList[this.index].modified = false;
        }
        if (!this.fromItemDetails) {
          this.location.back();
        }
      });
  }

  async getGraphData(selectedRow, gDates?) {
    const postData = this.demandDashboardUtilService.buildRowData(selectedRow, this.date.fromDate, this.date.toDate, gDates);
    this.coreServices.showLoader();
    const graphdata = await this.demandDashboardService.getRowGraphData(postData).toPromise();
    this.coreServices.hideLoader();
    this.errorMessage = graphdata.Message;
    this.showAlert = this.errorMessage === '' || this.errorMessage === null ? false : true;
    this.selectedRowCopy = this.demandDashboardUtilService.buildLegendData(this.selectedRowCopy, graphdata);
    this.selectedRow.AVRG_DAILY_USAGE = this.selectedRowCopy.AVRG_DAILY_USAGE;
    this.selectedRow.PEAK_DAILY_USAGE = this.selectedRowCopy.PEAK_DAILY_USAGE;
    this.RectDates = this.demandDashboardUtilService.rectDates(graphdata);
    this.graphdata = this.demandDashboardUtilService.buildGraphData(graphdata);
    this.onLoad = true;
    this.showGraph = true;
  }

  buildGraph(gData) {
    this.gType = gData.graphType;
    this.graphdata = this.demandDashboardUtilService.changeGraphData(gData);
  }

  rectDemandChanged(eve) {
    // console.log('hitted', eve);
    this.graphChanged = true;
    this.RectDates = eve;
    this.getGraphData(this.selectedRowCopy, this.RectDates);
  }

  optChanged(eve,idx) {
    if(!this.isEmpty(eve)){
    let floatVal:any  = parseFloat(eve);
    floatVal = isNaN(floatVal) ? '' : floatVal;
    this.selectedRowCopy.DAILY_USAGE_OVERRIDE = floatVal;
    this.recordsToDisplay[idx].DAILY_USAGE_OVERRIDE = floatVal;
    this.graphChanged = true;
  }
}

  confirm1(data, pageChange?) {
    this.confirmationService.confirm({
      message: 'Do you want to save the changes?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if(pageChange) {
          this.saveResults();
          return;
        }
        this.saveResults(data);
      },
      reject: () => {
        // this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
        this.graphChanged = false;
        this.demandSearchList[this.index] = JSON.parse(
          JSON.stringify(this.demandSearchListCopy[this.index])
        );

        if(data.index >= 0 && pageChange) {
          this.recordsToDisplay[data.index]  = {...this.demandSearchList[this.index]};
        }

        if(!pageChange) {
          if(this.getPageRowIndex() >= 0) { 
            this.recordsToDisplay[this.getPageRowIndex()] = {...this.demandSearchList[this.index]};
          }
          this.onEditRow(data);
        }
      }
    });
  }

  hideDialog() {
    this.showAlert = false;
  }


  canDeactivate = () => {

    if (this.graphChanged) {
      this.modalService.open();
      return this.modalService.getConfirmationSubject();
    }

    return true;

  }


}
