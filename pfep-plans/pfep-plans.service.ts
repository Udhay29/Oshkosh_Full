import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import constants from './pfep-plans-fields';
@Injectable({
  providedIn: 'root'
})
export class PfepPlanService {
  private baseUrl: string = environment.api;
  constructor(private http: HttpClient) {

  }
  defaultData: object;
  private messageSource = new BehaviorSubject(this.defaultData);
  currentMessage = this.messageSource.asObservable();
  changeMessage(data: object) {
    this.messageSource.next(data);
  }

  getSearchResults(data) {
    return this.http.post(`${this.baseUrl}ItemFlowSummary/DisplayItemResults`, data);
  }
  getDisplayItemPlans(data) {
    return this.http.post(`${this.baseUrl}ItemFlowSummary/DisplayItemPlans`, data);
  }
  getItemStatus = () => {
    return this.http.get(`${this.baseUrl}ItemFlowSummary/GetItemPlanStatus`);
  }
  saveUpStreamPlans(data){
    return this.http.post(`${this.baseUrl}ItemFlowSummary/SaveUpstreamDetails`, data);
  }

  fetchMFPListByBranch = (orgId, branch) =>
    this.http.get(
      `${this.baseUrl}Common/GetMaterialFlowPlans?orgId=${orgId}&facilityId=${branch}&mtrlFlowPlanId=null`,
      { observe: 'response' }
    )

  getSingleRecordData = postData => {
    return this.http.post(`${this.baseUrl}ItemPlanDetail/GetItemFlowRecordDetails`, postData, {observe: 'response'});
  }

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
}
