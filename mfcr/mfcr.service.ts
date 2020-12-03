import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MfcrService {

  constructor(public http: HttpClient,  private toastr: ToastrService) { }
  private baseUrl: string = environment.api;

  getPlanStatus() {
    return this.http.get(`${this.baseUrl}Common/GetDropDownValues?type=MFCRRequestStatus&value=`);
  }

  getSearchResult(postdata) {
    return this.http.post(`${this.baseUrl}WorkFlow/SearchResult`,postdata);
  }

  getGridViewDD() {
    return this.http.get(`${this.baseUrl}Common/GetDropDownValues?type=MFCR Approval Group&value=`);
  }

  ApproveRequest(postdata) {
    return this.http.post(`${this.baseUrl}WorkFlow/SaveApprovelStatus`,postdata);
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
    type !== 'error' ? this.toastr.success(message, '', { disableTimeOut: false }) : this.toastr.error(message, "");
  }

  getMfcrItemPlanDet(data) {
    return this.http.post(`${this.baseUrl}WorkFlow/GetItemPlanMFCRRequestData`,data)
  }

  ExportToExcel(data) {
    return this.http.post(`${this.baseUrl}WorkFlow/ExportExcel`,data)
  }
}
