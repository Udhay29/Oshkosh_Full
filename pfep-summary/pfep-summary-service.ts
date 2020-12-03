import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import * as constants from './pfep-summary-constants';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class PfepSummaryService {
  private baseUrl: string = environment.api;
  constructor(private http: HttpClient, private toastr: ToastrService) { }

  getOrgIds = () => {
    return this.http.get(`${this.baseUrl}Common/GetSegmentsByUserId`, {
      observe: 'response'
    });
  }

  fetchDetails = postData =>
    this.http.post(`${this.baseUrl}PFEPSummary/GetDetails`, postData, {
      observe: 'response'
    })

  fetchDetailsByBranch = postData =>
    this.http.post(
      `${this.baseUrl}PFEPSummary/GetBranchPlantDetails`,
      postData,
      { observe: 'response' }
    )

  fetchMFPListByBranch = (orgId, branch) =>
    this.http.get(
      `${this.baseUrl}Common/GetMaterialFlowPlans?orgId=${orgId}&facilityId=${branch}&mtrlFlowPlanId=null`,
      { observe: 'response' }
    )

  saveUpStreamItemPlans = postData =>
    this.http.post(`${this.baseUrl}PFEPSummary/SaveUpstreamDetails`, postData, {
      observe: 'response'
    })

  getSingleRecordData = postData =>
    this.http.post(
      `${this.baseUrl}ItemPlanDetail/GetItemFlowRecordDetails`,
      postData,
      { observe: 'response' }
    )

  getSearchFieldData = (field, API, postData) => {
    switch (field) {
      case constants.MFP:
        return this.http.get(
          `${this.baseUrl + API}?mtrlFlowPlanID=${
          postData.mtrlFlowPlanID
          }&orgID=${postData.orgID}&facilityID=${postData.facilityID}`
        );
        break;
    }
  }

  displayMessage(
    type = 'error',
    message = 'Unknown Error occured. Please try again.',
    title = ''
  ) {
    if (title) {
      type !== 'error' ? this.toastr.success(message, title, { disableTimeOut: false }) : this.toastr.error(message, title);
      return;
    }
    type !== 'error' ? this.toastr.success(message, '', { disableTimeOut: false }) : this.toastr.error(message);
  }
}

export const formatDate = (date, withoutTime) => {
  if (date !== null && date !== undefined && date !== '') {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear(),
      hours = '' + d.getHours(),
      minutes = '' + d.getMinutes(),
      seconds = '' + d.getSeconds();

    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }
    if (hours.length < 2) { hours = '0' + hours; }
    if (minutes.length < 2) { minutes = '0' + minutes; }
    if (seconds.length < 2) { seconds = '0' + seconds; }

    return `${[month, day, year].join('-')}${
      withoutTime ? '' : '  ' + [hours, minutes, seconds].join(':')
      }`;
  } else {
    return '';
  }
};
