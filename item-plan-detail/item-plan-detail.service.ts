import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import * as constants from './constants';

@Injectable({
  providedIn: 'root'
})
export class ItemPlanDetailService {
  private baseUrl: string = environment.api;

  constructor(public http: HttpClient, private toastr: ToastrService) { }

  presentationType = 'PRESENTATION_TYPE';
  orientationValue = 'ORIENTATION';
  doNotPlan = 'DO_NOT_PLAN';
  kitType = 'KIT_TYPE';
  superMarketId = 'SUPERMARKET_ID';
  reOrderAccessPresent: boolean = false;
  orgBranchValues = { [constants.orgId]: '', [constants.branchDDKey]: '' };

  displayMessage(
    type = 'error',
    message = 'Unknown Error occured. Please try again.',
    title = ''
  ) {
    if (title) {
      type !== 'error' ? this.toastr.success(message, title, { disableTimeOut: false }) : this.toastr.error(message, title);
      return;
    }
    type !== 'error' ? this.toastr.success(message, '', { disableTimeOut: false }) : this.toastr.error(message, "");
  }

  setReOrderAccess = access => this.reOrderAccessPresent = access || false;
  getReOrderAccess = () => this.reOrderAccessPresent || false;

  setOrgBranchValues = (orgId, branch) => this.orgBranchValues = { [constants.orgId]: orgId, [constants.branchDDKey]: branch };
  getOrgBranchValues = () => this.orgBranchValues;

  getItemPlanStatus() {
    return this.http.get(`${this.baseUrl}POUSingleRack/GetItemPlanStatus`);
  }

  getPresentationTypeValues() {
    return this.http.get(
      `${this.baseUrl}ItemPlanDetail/GetDropdownList?Value=${
      this.presentationType
      }`
    );
  }

  getOrientationTypeValues() {
    return this.http.get(
      `${this.baseUrl}ItemPlanDetail/GetDropdownList?Value=${
      this.orientationValue
      }`
    );
  }

  getDoNotPlanValues() {
    return this.http.get(
      `${this.baseUrl}ItemPlanDetail/GetDropdownList?Value=${this.doNotPlan}`
    );
  }

  getKitTypeValues() {
    return this.http.get(
      `${this.baseUrl}ItemPlanDetail/GetDropdownList?Value=${this.kitType}`
    );
  }

  getMFPList(orgId, branch) {
    return this.http.get(
      `${this.baseUrl}Common/GetMaterialFlowPlans?orgId=${orgId}&facilityId=${branch}&mtrlFlowPlanId=null`
    );
  }

  getWorkCenterList = (orgId, branch) => {
    return this.http.get(
      `${this.baseUrl}Common/GetWorkCenterList?orgId=${orgId}&facilityId=${branch}&workcenterId=null`
    );

  }

  getSuperMarketIdValues(branch = '') {
    return this.http.get(
      `${this.baseUrl}ItemPlanDetail/GetDropdownList?Value=${this.superMarketId}&Branch=${branch}`
    );
  }

  searchUsingWorkCenter = postData => {
    return this.http.post(
      `${this.baseUrl}ItemPlanDetail/GetSerachItemPlanDetails`,
      postData
    );
  }

  getItemPlanByItemPlanId = postData => {
    return this.http.get(
      `${this.baseUrl}ItemPlanDetail/GetItemPlanByItemPlanID?itemPlanId=${
      postData['itemPlanId']
      }&taskId=${postData['taskId'] || ''}`,
      { observe: 'response' }
    );
  }

  getCreatedItemPlanData = postData => {
    return this.http.post(`${this.baseUrl}ItemPlanDetail/Create`, postData, { observe: 'response' });

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

  saveItemPlanDetail = postData => {
    return this.http.post(
      `${this.baseUrl}ItemPlanDetail/SaveItemPlanDetails`,
      postData
    );
  }

  getExecuteContainerDetails = postData => {
    return this.http.post(
      `${this.baseUrl}POUSingleRack/GetExecuteContainerSelection`,
      postData,
      { observe: 'response' }
    );
  }

  // packaging calculator
  searchForContainers = postData => {
    return this.http.post(
      `${this.baseUrl}WildcardSearch/GetContainerValues`,
      postData,
      { observe: 'response' }
    );
  }

  saveFitmentValues = postData => {
    return this.http.post(
      `${this.baseUrl}PackagingCalculator/SaveFITMIT`,
      postData,
      { observe: 'response' }
    );
  }

  fetchContainerData = postData => {
    // postData = {
    //   FACILITY_ID: "1020103",
    //   ITEM_ID: "1001193182",
    //   ITEM_PLAN_ID: 11756,
    //   PID: 0,
    //   PRESENTATION_TYPE: "Bin",
    //   WORK_CENTER_ID: "102010334M25"}
    return this.http.post(
      `${this.baseUrl}PackagingCalculator/Execute`,
      postData,
      { observe: 'response' }
    );
  }

  fetchIntervalsByMFP = postData => {
    return this.http.post(
      `${this.baseUrl}PackagingCalculator/CalculateIntervals`,
      postData,
      { observe: 'response' }
    );
  }

  saveChangeRequest = postData => {
    return this.http.post(
      `${this.baseUrl}WorkFlow/CreateMFCRRequest`,
      postData,
      { observe: 'response' }
    );
  }

  cancelChangeRequest = postData => {
    return this.http.post(
      `${this.baseUrl}WorkFlow/SaveApprovelStatus`,
      postData,
      { observe: 'response' }
    );
  }

  saveContainerOrder = postData => {
    return this.http.post(
      `${this.baseUrl}PackagingCalculator/SaveContainerOrder`,
      postData,
      { observe: 'response' }
    );
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

    return `${[month, day, year].join('/')}${
      withoutTime ? '' : '  ' + [hours, minutes, seconds].join(':')
      }`;
  } else {
    return '';
  }
};