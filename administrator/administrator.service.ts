import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
export interface Todo {
  DataTypes: any[];
  DataTypeKeyValues: any[];
}

@Injectable()
export class AdministrativeService {
  private baseUrl: string = environment.api;
  OrgFacilitiesListUrl = `${this.baseUrl}User/GetFilterDefaults`;
  SaveDefaultSelectedUrl = `${this.baseUrl}User/SaveFilterDefault`;

  RoleDetailsUrl = `${this.baseUrl}User/GetRoles`;
  SearachUserDetailsUrl = `${this.baseUrl}User/GetUserDetails`;
  SaveUserDetailsUrl = `${this.baseUrl}User/SaveUserDetails`;
  DeleteUserDetailsUrl = `${this.baseUrl}User/Delete`;
  GetWarehouseList = `${this.baseUrl}HomeDashboard/GetWarehouseList`;
  IsValidUser = `${this.baseUrl}User/IsValidUser`;
  GetAllOrganizations = `${this.baseUrl}Common/GetAllSegments`;

  constructor(private http: HttpClient, private toastr: ToastrService) {
  }
  defaultData: object;
  private messageSource = new BehaviorSubject(this.defaultData);
  currentMessage = this.messageSource.asObservable();
  changeMessage(data: object) {
    this.messageSource.next(data);
  }
  getUserDetails() {
    return {
      'access_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjI3NDAyNCIsInJvbGUiOlsiUEZFUCBTUEVDSUFMSVNUIiwiUEZFUCBNQU5BR0VNRU5UIEZBQ0lMSVRZIiwiVEFDVElDQUwgQlVZRVIiLCJBRE1JTklTVFJBVE9SIl0sIm5iZiI6MTU0NjU5Njk1NSwiZXhwIjoxNTQ2NTk4NzU1LCJpYXQiOjE1NDY1OTY5NTV9.04-6eg7PIxoJPP-YErf_yFS2Ekl_PI_WvTuOx18VKAU',
      'token_type': 'bearer',
      'expires_in': 1799,
      'user_name': 'U274766',
      'roles': ['PFEP SPECIALIST', 'PFEP MANAGEMENT FACILITY', 'TACTICAL BUYER', 'BUSINESS ADMINISTRATOR'],
      'facility_id': 'STH001',
      'facility_desc': 'OSHKOSH CORPORATION DEFENSE SOUTH PLANT ',
      'org_id': 'DEF',
      'org_desc': 'Defense',
      'work_center_id': 'S621',
      'work_center_desc': 'Capsule Station 1.5 Sub',
      '.issued': 'Fri, 04 Jan 2019 10:15:55 GMT',
      '.expires': 'Fri, 04 Jan 2019 10:45:55 GMT'
    };
  }

  getFilterDefaults(param): Observable<any> {
    return this.http.get<any[]>(this.OrgFacilitiesListUrl + `?userId=${param}`);
  }
  PostDefaultValues(data) {
    return this.http.post<any[]>(this.SaveDefaultSelectedUrl, data);
  }
  getAllRoleDetails() {
    return this.http.get<any[]>(this.RoleDetailsUrl);
  }
  SearchUserDetails(data) {
    return this.http.post<any[]>(this.SearachUserDetailsUrl, data);
  }
  SaveUserDetails(data) {
    return this.http.post<any[]>(this.SaveUserDetailsUrl, data);
  }
  DeleteUserDetails(data) {
    return this.http.post<any[]>(this.DeleteUserDetailsUrl, data);
  }

  getBranchDropDownList(value) {
    return this.http.get(`${this.GetWarehouseList}?Segment=${value}`);
  }
  checkValidUser(value) {
    return this.http.get(`${this.IsValidUser}?userId=${value}`);
  }
  getConfigDefaults() {
    return this.http.get(`assets/jsons/configuration.json`);
  }

  getConfigDefaultAlerts() {
    return this.http.get(`${this.baseUrl}User/GetAdminConfigAlerts`);
  }
  getAllOrganizations() {
    return this.http.get(`${this.baseUrl}Common/GetAllSegments`);
  }

  getConfigDetails(type) {
    return this.http.get(`${this.baseUrl}User/GetAlertConfigDetails?DataType=${type}`);
  }

  saveConfigDetails(post) {
    return this.http.post(`${this.baseUrl}User/SaveAlertConfigDetails`, post);
  }

  deleteConfigDetails(post) {
    return this.http.post(`${this.baseUrl}User/DeleteAlertConfigDetails`, post);
  }
  getAllOrg() {
    return this.http.get(`${this.baseUrl}PackageCatalog/GetORGList`);

  }



}
