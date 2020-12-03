import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpResponse,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as constants from './constants';

const httpHeaders = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class HomeModuleService {
  private baseUrl: string = environment.api;

  missingDataScreenParam = '';
  alertDetailScreenParam = '';
  alertDetailSearch: any = {};


  constructor(private http: HttpClient) { }

  // route data functions

  /* Missing data screens */

  setMissingDataScreenParam = param => (this.missingDataScreenParam = param);
  getMissingDataScreenParam = () => this.missingDataScreenParam;

  /* alert detail screens */

  setAlertDetailScreenParam = (param, searchData) => {
    (this.alertDetailScreenParam = param),
      (this.alertDetailSearch = searchData);
  }
  getAlertDetailScreenParam = () =>
    this.alertDetailScreenParam || '';
  getAlertDetailSearchData = () => {
    if (Object.keys(this.alertDetailSearch).length > 0) {
      const { ORG_ID, FACILITY_ID, WorkCenterList, EFF_FROM_DATE, EFF_TO_DATE, DISCREPANCY_TYPE } = this.alertDetailSearch;
      const searchCriteria = { ORG_ID, FACILITY_ID, WorkCenterList };
      if(this.alertDetailScreenParam === 'pfepERPAlert') {
        searchCriteria['DISCREPANCY_TYPE'] = DISCREPANCY_TYPE || '';
      }
      const date = { EFF_FROM_DATE, EFF_TO_DATE };
      return { searchCriteria, date };
    } else {
      return {};
    }
  }

  // fetch Segment values for selected data

  getWarehouseListData = (value) => {
    return this.http.get(`${this.baseUrl}HomeDashboard/GetWarehouseList?Segment=${value}`);
  }

  getUserBasedOptions = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const work_center_id_list = JSON.parse(currentUser.work_center_id_list);
    return {
      'ORG_ID': currentUser ? currentUser.org_id : '',
      'FACILITY_ID': currentUser ? currentUser.facility_id : '',
      [constants.wildCardCollectionKeys['WORK_CENTER_ID']]: (currentUser && work_center_id_list) ? work_center_id_list.map(obj => ({ WORK_CENTER_ID: obj })) : []
    };
  }

  getOnWarehouseDropDownData = () => {
    const getData: any = {
      'ORG_ID': 'DEF'
    };
    return this.http.post(`${this.baseUrl}HomeDashboard/GetWarehouseList`, JSON.stringify(getData));
  }

  getOnLoadDashboardGraphData = (postData) => {

    return this.http.post(`${this.baseUrl}HomeDashboard/HomeDashboardLoad`, postData, httpHeaders);
  }

  getSearchDashboardData = (postData) => {

    return this.http.post(`${this.baseUrl}HomeDashboard/HomeDashboardLoad`, postData, httpHeaders);
  }


  getOnLoadDashboardData = () => {
    const postData = {
      Org_Id: 'DEF',
      Facility_Id: 'STH001',
      Item_Id: '',
      Supplier: ''
    };
    return this.http.post(
      `${this.baseUrl}HomeDashboard/GetWeightAndDimensionList`,
      postData,
      httpHeaders
    );
  }

  getWeightsDimensionsData = postData => {
    return this.http.post(
      `${this.baseUrl}HomeDashboard/GetWeightAndDimensionList`,
      postData,
      httpHeaders
    );
  }

  getPackageDetailData = postData => {
    
    return this.http.post(
      `${this.baseUrl}HomeDashboard/GetAllPackingLists`,
      postData,
      httpHeaders
    );
  }

  saveWeightsDimensionsData = postData => {
    postData = {
      weightAndDimensionDetails: [...postData]
    };
    return this.http.post(
      `${this.baseUrl}HomeDashboard/SaveWeightAndDimension`,
      postData,
      httpHeaders
    );
  }

  savePackageDetailData = postData => {
    postData = {
      packagingDetails: [...postData]
    };
    return this.http.post(
      `${this.baseUrl}HomeDashboard/SavePackagingDetails`,
      postData,
      httpHeaders
    );
  }

  // required screen functions

  savePFEPRequiredData = (data, searchCriteria) => {
    const postData = {
      WORK_CENTER_ID: null,
      Segment: null,
      Warehouse: null,
      pfepRequired: null,
      pfepRequiredSaveEntities: [...data]
    };

    return this.http.post(
      `${this.baseUrl}HomeDashboard/SaveRequiredAlerts`,
      postData
    );
  }

  getPFEPRequiredData = (searchCriteria, loadDates = { EFF_FROM_DATE: null, EFF_TO_DATE: null }, PageSize, PageIndex, cb) => {


    const postData = {
      ...searchCriteria,
      ...loadDates,
      PageSize,
      PageIndex
    };

    this.http
      .post(
        `${this.baseUrl}HomeDashboard/GetAllPFfepRequiredLists`,
        postData
      )
      .subscribe(res => {
        cb({
          dropDowns: { Segment: res['Segment'], Warehouse: res['Warehouse'] },
          tableData: res['pfepRequired'] || [],
          totalPages: res['TotalPageCount'],
          totalRecords: res['TotalCount'],
          page: res['PageIndex'],
          rows: res['PageSize']
        });
      });
  }

  // pfep shortage screen functions

  getPFEPShortageData = (searchCriteria, loadDates = { EFF_FROM_DATE: null, EFF_TO_DATE: null }, PageSize, PageIndex, cb) => {


    const postData = {
      ...searchCriteria,
      ...loadDates,
      PageSize,
      PageIndex
    };

    this.http
      .post(
        `${this.baseUrl}HomeDashboard/GetPFEPShortageAlertList`,
        postData
      )
      .subscribe(res => {
        cb({
          dropDowns: { Segment: res['segment'], Warehouse: res['warehouse'] },
          tableData: res['PFEPShortages'] || [],
          totalPages: res['TotalPageCount'],
          totalRecords: res['TotalCount'],
          page: res['PageIndex'],
          rows: res['PageSize']
        });
      });
  }

  savePFEPShortageData = (data, searchCriteria) => {
    const postData = {
      WorkCenterList: null,
      PFEPShortages: [...data]
    };

    return this.http.post(
      `${this.baseUrl}HomeDashboard/UpdatePFEPShortageAlert`,
      postData
    );
  }

  // MOQ Ceiling functions

  getMOQCeilingData = (searchCriteria, loadDates = { EFF_FROM_DATE: null, EFF_TO_DATE: null }, PageSize, PageIndex, cb) => {

    const postData = {
      ...searchCriteria,
      ...loadDates,
      PageSize,
      PageIndex
    };

    this.http
      .post(
        `${this.baseUrl}HomeDashboard/GetMOQCeilingAlertList`,
        postData
      )
      .subscribe(res => {
        cb({
          dropDowns: { Segment: res['segment'], Warehouse: res['warehouse'] },
          tableData: res['moqCeilingAlert'] || [],
          totalPages: res['TotalPageCount'],
          totalRecords: res['TotalCount'],
          page: res['PageIndex'],
          rows: res['PageSize']
        });
      });
  }

  saveMOQCeilingData = (data, searchCriteria) => {
    const postData = {
      moqCeilingAlert: [...data],
      segment: [
        {
          ORG_ID: searchCriteria['ORG_ID'],
          IsSelected: true
        }
      ],
      warehouse: [
        {
          FACILITY_ID: searchCriteria['FACILITY_ID'],
          IsSelected: true
        }
      ]
    };

    return this.http.post(`${this.baseUrl}HomeDashboard/SaveMOQCeilingAlert`, postData);
  }



  // Demand Gap functions

  getDemandGapData = (searchCriteria, loadDates = { EFF_FROM_DATE: null, EFF_TO_DATE: null }, PageSize, PageIndex, cb) => {


    const postData = {
      ...searchCriteria,
      ...loadDates,
      PageSize,
      PageIndex
    };

    this.http
      .post(
        `${this.baseUrl}HomeDashboard/GetAllDemandGapLists`,
        postData
      )
      .subscribe(res => {
        cb({
          dropDowns: { Segment: res['Segment'], Warehouse: res['Warehouse'] },
          tableData: res['pfepDemandGaps'] || [],
          totalPages: res['TotalPageCount'],
          totalRecords: res['TotalCount'],
          page: res['PageIndex'],
          rows: res['PageSize']
        });
      });
  }

  saveDemandGapData = (data, searchCriteria) => {

    const postData = {
      WORK_CENTER_ID: null,
      Segment: null,
      Warehouse: null,
      pfepDemandGaps: null,
      pfepDemandGapSaveEntities: [...data]
    };

    return this.http.post(
      `${this.baseUrl}HomeDashboard/SaveDemandGapDetails`,
      postData
    );
  }

  // PFEP ERP functions

  getPFEPERPData = (searchCriteria, loadDates = { EFF_FROM_DATE: null, EFF_TO_DATE: null }, PageSize, PageIndex, cb) => {

    const postData = {
      ...searchCriteria,
      ...loadDates,
      PageSize,
      PageIndex
    };

    this.http
      .post(
        `${this.baseUrl}HomeDashboard/GetpfepERPAlertList`,
        postData
      )
      .subscribe(res => {
        cb({
          dropDowns: { Segment: res['Segment'], Warehouse: res['Warehouse'] },
          tableData: res['ERPAlert'] || [],
          totalPages: res['TotalPageCount'],
          totalRecords: res['TotalCount'],
          page: res['PageIndex'],
          rows: res['PageSize']
        });
      });

  }



  savePFEPERPData = (data) => {
    const postData = {
      ERPAlert: [...data],
      Segment: null,
      Warehouse: null
    };

    return this.http.post(`${this.baseUrl}HomeDashboard/UpdatePfepERPList`, postData);
  }


  getSearchFieldData = urlString  => {
    return this.http.get(`${this.baseUrl + urlString}`);
  }

  exportExcel = (searchCriteria, selectedStack) => {
    const postData = {
      'DataType': '',
      'PackagingDetailMissingSearchEntity': 'null',
      'WeightAndDimensionSearchEntity': 'null',
      'AlertsSearchEntity': 'null'
    };

    postData['DataType'] = constants.exportPostDataKeys[selectedStack]['dataType'];
    postData[constants.exportPostDataKeys[selectedStack]['key']] = searchCriteria;

    return this.http.post(`${this.baseUrl}HomeDashboard/ExportExcel`, postData);
  }

  getSingleRecordData = (postData) => {
    return this.http.post(`${this.baseUrl}ItemPlanDetail/GetAlertDetails`, postData);
  }
}
