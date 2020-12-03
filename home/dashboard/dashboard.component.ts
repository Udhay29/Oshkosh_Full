import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { HomeModuleService } from '../home-module.service';
import { SearchCriteriaComponent } from '../presentational-components/search-criteria/search-criteria.component';
import { Router } from '@angular/router';
import { SharedService } from '../../../shared/services/share.service';
import {
  homeScreenPath,
  missingDataScreenPath,
  dashboardWilCards,
  pathScreenParamMap,
  wildCardCollectionKeys,
  discrepancyTypeKey
} from '../constants';
import { DashboardUtilsService } from '../dashboad-utils';
import {
  formatDate,
  getDateLimit,
  setFromDate
} from '../../../utils/date-utils';
import { ToastrService } from 'ngx-toastr';
import { CoreServices } from 'src/app/core/services/core.service';

@Component({
  selector: 'pfep-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  @ViewChild(SearchCriteriaComponent) searchCriteriaComponent: SearchCriteriaComponent;

  searchInputs: any = {
    inputs: [],
    dropDowns: [],
    wildCards: []
  };

  date = {
    fromDate: setFromDate(new Date()),
    toDate: new Date()
  };
  minimumToDate: Date = getDateLimit('toDate', this.date.fromDate);
  maximumFromDate: Date = getDateLimit('fromDate', this.date.toDate);
  showGraph = false;
  moq_alert_graphs: any;
  required_alert_graphs: any;
  erp_alert_graphs: any;
  shortage_alert_graphs: any;
  approved_plan: any;
  disparate_metrics: any;
  screenPath: any;
  demandGap: any;
  date3: any;
  userOptions: any = {};
  missingDateValues = {
    PackagingDetail: null,
    WeightDimension: null
  }
  Approvals = {
    PastDueApprovals: null
  }
  searchObject = {
    ORG_ID: null,
    FACILITY_ID: null,
    [wildCardCollectionKeys['WORK_CENTER_ID']]: [{ 'WORK_CENTER_ID': null }],
    EFF_FROM_DATE: formatDate(this.date.fromDate),
    EFF_TO_DATE: formatDate(this.date.toDate)
  };

  constructor(
    private dashboardUtilsService: DashboardUtilsService,
    private homeService: HomeModuleService,
    public router: Router,
    public _coreServices: CoreServices,
    private toastr: ToastrService,
    public SharedService: SharedService
  ) { }

  ngOnInit() {
    this.userOptions = this.homeService.getUserBasedOptions();

    this.buildSearchObject(
      this.userOptions.ORG_ID,
      this.userOptions.FACILITY_ID,
      this.userOptions.WorkCenterList
    );
    const data = {
      ...this.userOptions,
      EFF_FROM_DATE: formatDate(this.date.fromDate),
      EFF_TO_DATE: formatDate(this.date.toDate)
    };
    this.getGraphData(data);
  }

  buildSearchObject = (segment, warehouse, workCenter) => {
    this.searchObject = {
      ORG_ID: segment,
      FACILITY_ID: warehouse,
      [wildCardCollectionKeys['WORK_CENTER_ID']]: workCenter,
      EFF_FROM_DATE: formatDate(this.date.fromDate),
      EFF_TO_DATE: formatDate(this.date.toDate)
    };
  }

  onDateToSelection = limit => {
    if (limit === 'toDate') {
      this.maximumFromDate = getDateLimit('fromDate', this.date[limit]);
    } else {
      this.minimumToDate = getDateLimit('toDate', this.date[limit]);
    }
    // console.log(this.date);
  }

  getGraphData(postData) {
    this._coreServices.showLoader();
    this.homeService.getOnLoadDashboardGraphData(postData).subscribe(data => {
      this._coreServices.hideLoader();
      this.getOnLoadDashboardGraphData(data);
      this.buildDropDowns(data);
    });
  }


  selectedSegment(event) {

    this.homeService.getWarehouseListData(event).subscribe(data => {
      this.searchInputs.dropDowns[1] = { ...this.searchInputs.dropDowns[1], options: data, valueToSet: '' };
      this.searchInputs.wildCards[0] = { ...this.searchInputs.wildCards[0] };
      this.searchInputs.wildCards[0].wildCardConfig.selectedData = [];
      this.searchCriteriaComponent.resetCriteria('FACILITY_ID', 'WORK_CENTER_ID');
    });
  }

  buildDropDowns = data => {
    // hard coding this, because dashoard has only one input
    const wildCardInput = JSON.parse(JSON.stringify(dashboardWilCards));
    this.searchInputs.wildCards.push(...wildCardInput);
    const wildCardSelectedData = this.userOptions.WorkCenterList;
    this.searchInputs.wildCards[0].wildCardConfig.selectedData = [...wildCardSelectedData];

    const segmentValue = this.userOptions.ORG_ID,
      wareHouseValue = this.userOptions.FACILITY_ID;
    this.searchInputs.dropDowns.push(
      this.getDropDown(
        'ORG_ID',
        'dashboard-segment-dropdown',
        'Segment',
        'ORG_ID',
        'ORG_ID',
        data.Segment,
        segmentValue,
        1
      )
    );
    this.searchInputs.dropDowns.push(
      this.getDropDown(
        'FACILITY_ID',
        'dashboard-warehouse-dropdown',
        'Branch',
        'FACILITY_ID',
        'FACILITY_ID',
        data.Warehouse,
        wareHouseValue,
        2
      )
    );
  }

  getDefaultDropDownValues = data => {
    function getValue(ddKey, optKey) {
      return data[ddKey].filter(opt => {
        if (opt.IsSelected) { return opt[optKey]; }
      })[0][optKey];
    }
    return {
      segmentValue: getValue('Segment', 'ORG_ID'),
      wareHouseValue: getValue('Warehouse', 'FACILITY_ID')
    };
  }

  getDropDown = (
    name,
    className,
    defaultOption,
    displayValueKey,
    valueKey,
    options,
    valueToSet,
    order
  ) => {
    return {
      name,
      className,
      defaultOption,
      displayValueKey,
      valueKey,
      options,
      valueToSet,
      order
    };
  }

  selectedGraph(eve) {
    const screenPath = this.dashboardUtilsService.setScreenName(typeof eve === 'string' ? eve : eve.screen);
    this.router.navigate([
      `${homeScreenPath}/${pathScreenParamMap[screenPath]}`
    ]);
    this.setDataInService(screenPath, eve);
  }

  setDataInService(title, eve?) {
    this.homeService.setAlertDetailScreenParam(title, (eve && typeof eve !== 'string') ? {...this.searchObject, [discrepancyTypeKey]: eve.series} : this.searchObject);
  }

  setMissingData = data => { };

  searchCriteria = Criteria => {
    if (this.date.fromDate !== null || this.date.toDate === null) {
      this.showGraph = false;
      this._coreServices.showLoader();
      this.buildSearchObject(
        Criteria.ORG_ID,
        Criteria.FACILITY_ID,
        Criteria.WorkCenterList
      );
      this.userOptions.FACILITY_ID = Criteria.FACILITY_ID;
      this.userOptions.ORG_ID = Criteria.ORG_ID;

      this.homeService
        .getSearchDashboardData(this.searchObject)
        .subscribe(data => {
          this._coreServices.hideLoader();
          this.getOnLoadDashboardGraphData(data);
        });
    } else {
      this.toastr.error('Enter Valid Data');
    }
  }

  criteriaSelected = ({field, value}) => {
    if(field === 'FACILITY_ID') {
      this.searchInputs.wildCards[0] = { ...this.searchInputs.wildCards[0] };
      this.searchInputs.wildCards[0].wildCardConfig.selectedData = [];
      this.searchCriteriaComponent.resetCriteria('WORK_CENTER_ID');
    }

    if(field === 'ORG_ID') {
      this.selectedSegment(value);
    }
  }

  maxFromDate() {
    return this.date.toDate !== null ? this.date.toDate : new Date();
  }

  missingDataTileClicked = tile => {
    if (tile === 'PastDueApprovals'){
      this.navigateToMfcrScreen();
      return;
    }
    this.homeService.setMissingDataScreenParam(tile);
    this.setDataInService(tile);
    this.router.navigate([`${homeScreenPath}/${missingDataScreenPath}`]);
  } 

  navigateToMfcrScreen = () => {
    const mfcrSearchFilters = {
      parentScreen:'/home',
      isChild: true,
      FACILITY_ID:this.searchObject.FACILITY_ID,
      WORK_CENTER_IDS: this.searchObject.WorkCenterList
    };
    this.SharedService.setMFCRIp(mfcrSearchFilters);
    this.router.navigate(['/mfcr']);
  }

  getOnLoadDashboardGraphData = res => {
    this.missingDateValues['PackagingDetail'] = res['PackagingDetail'];
    this.missingDateValues['WeightDimension'] = res['WeightDimension'];
    this.Approvals['PastDueApprovals'] = res['PastDueApprovals'];
    this.demandGap = res['DemandGap'];
    this.shortage_alert_graphs = this.dashboardUtilsService.constructGraphJson(
      res['ShortageAlertGraphs'],
      'PFEP Over/Under Planned'
    );
    this.moq_alert_graphs = this.dashboardUtilsService.constructGraphJson(
      res['MOQAlertGraphs'],
      'MOQ Ceiling'
    );
    this.required_alert_graphs = this.dashboardUtilsService.constructGraphJson(
      res['RequiredAlertGraphs'],
      'PFEP Required'
    );
    this.erp_alert_graphs = this.dashboardUtilsService.constructERPAlertGraphJson(
      res['ERPAlertGraphs'],
      'ERP Discrepancy Alert'
    );
    this.approved_plan = this.dashboardUtilsService.constructGraphJson(
      res['ApprovedMetrics'],
      '% Parts On Approved Plan'
    );
    this.disparate_metrics = this.dashboardUtilsService.constructGraphJson(
      res['DisparateMetrics'],
      '% Parts On Disparate Plan'
    );
    this.showGraph = true;
  }
}
