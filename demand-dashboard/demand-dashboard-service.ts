import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DemandDashboardUtilService } from './demand-dashboard.utils';
import { environment } from '../../../environments/environment';

@Injectable()
export class DemandDashboardService {
  private baseUrl: string = environment.api;

  getFieldsOfItemNumberUrl =
    `${this.baseUrl}WildcardSearch/GetFields`;

  itemNumberPopupSearchUrl =
    `${this.baseUrl}WildcardSearch/GetDropdownValues`;

  branchPopupSearchUrl =
    `${this.baseUrl}WildcardSearch/GetDropdownValuesWorkCenter`;

  workCenterPopupSearchUrl =
    `${this.baseUrl}WildcardSearch/GetDropdownValuesWorkCenter`;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {
  }

  // getRowGraphData(post?): Observable<any> {
  //   return this.http.get('assets/jsons/graph.json');
  // }

  getRowGraphData(post): Observable<any> {
    // console.log(post);
    return this.http.post(`${this.baseUrl}DemandDashboard/GetGraphs`, post);
  }

  onLoadDemandList(data, fromDate, toDate) {
    if (data && data !== undefined && data.ITEM_ID !== null) {
      data.EFF_FROM_DATE = fromDate;
      data.EFF_TO_DATE = toDate;
      return this.http.post(`${this.baseUrl}DemandDashboard/GetDemandSearchList`, data);
    }
  }

  getDropdownValuesforFields(fieldSearch) {
    if (fieldSearch === 'ITEM_ID') {
      return this.http.get(
        `${this.baseUrl}WildcardSearch/GetFields?fieldName=${fieldSearch}`
      );
    }
    if (fieldSearch === 'WORK_CENTER_ID') {
      return this.http.get(
        `${this.baseUrl}WildcardSearch/GetFields?fieldName=${fieldSearch}`
      );
    }
    if (fieldSearch === 'FACILITY_ID') {
      return this.http.get(
        `${this.baseUrl}WildcardSearch/GetFields?fieldName=${fieldSearch}`
      );
    }
  }

  getItemNumberDataOnLookup(selectedValue, enteredValue) {
    let post = {};
    if (selectedValue.FIELD_NAME === 'ITEM_ID') {
      post = {
        ITEM_ID: enteredValue,
        ORG_ID: null
      };
      console.log(post, 'finaldata');
    } else if (selectedValue.FIELD_NAME === 'ORG_ID') {
      post = {
        ITEM_ID: null,
        ORG_ID: enteredValue
      };
      console.log(post, 'finaldata');
    }
    return this.http.post(
      `${this.baseUrl}WildcardSearch/GetDropdownValues`,
      post
    );
  }
  getWorkcenterDataOnLookup(selectedValue, enteredValue) {
    let post = {};
    if (selectedValue.FIELD_NAME === 'WORK_CENTER_ID') {
      post = {
        WORK_CENTER_ID: enteredValue,
        ORG_ID: null,
        FACILITY_ID: null
      };
    } else if (selectedValue.FIELD_NAME === 'ORG_ID') {
      post = {
        WORK_CENTER_ID: null,
        ORG_ID: enteredValue,
        FACILITY_ID: null
      };
    } else if (selectedValue.FIELD_NAME === 'FACILITY_ID') {
      post = {
        WORK_CENTER_ID: null,
        ORG_ID: null,
        FACILITY_ID: enteredValue
      };
    }
    return this.http.post(
      `${this.baseUrl}WildcardSearch/GetDropdownValuesWorkCenter`,
      post
    );
  }

  getBranchDataOnLookup(selectedValue, enteredValue) {
    let post = {};
    if (selectedValue.FIELD_NAME === 'FACILITY_ID') {
      post = {
        FACILITY_ID: enteredValue,
        ORG_ID: null
      };
    } else if (selectedValue.FIELD_NAME === 'ORG_ID') {
      post = {
        FACILITY_ID: null,
        ORG_ID: enteredValue
      };
    }

    return this.http.post(
      `${this.baseUrl}WildcardSearch/GetDropdownValuesWarehouse`,
      post
    );
  }

  getSearchDataBasedOnLookUp(postData) {
    return this.http.post(
      `${this.baseUrl}DemandDashboard/GetDemandSearchList`,
      postData
    );
  }

  transformDate(date) {
    const d = new Date(date);
    return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');
  }

  saveDemandLists(data) {
    return this.http.post(
      `${this.baseUrl}DemandDashboard/SaveDemandDetails`,
      data
    );
  }
}
