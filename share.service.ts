import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

class itemPlanIp {
  isChild: boolean;
  parentScreenPath: string;
  planIdFromParent: number;
  selectedRecord: object;
}

interface BroadcastEvent {
  key: any;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})

export class SharedService {
  private readonly _eventBus: BehaviorSubject<BroadcastEvent>;
  private baseUrl: string = environment.api;
  singleRackData: any = {};
  ipToDemandDashBoard: any = {};
  ipToPackagingCalc: object = {};
  cbReqDataFromItemPlanDetail: object = {};
  isHierarchy: Subject<any> = new Subject();
  createCopy: Subject<any> = new Subject();
  singelRacksvg: any = {};
  routeAttachedSubject: Subject<any> = new Subject();
  ipToItemPlanDetail: itemPlanIp = {
    isChild: false,
    parentScreenPath: '',
    planIdFromParent: 0,
    selectedRecord: {}
  };
  // PFEP Summary variables
  ipToPfepSummary: any = {};
  ipToMFCR: any = {};
  ipToSingleRack: any = {};

  constructor(private http: HttpClient) {
    this._eventBus = new BehaviorSubject<BroadcastEvent>({ key: 'test', data: 'test' });
  }

  broadcast(key: any, data?: any): void {
    this._eventBus.next({ key, data });
  }

  on<T>(key: any): Observable<T> {
    return this._eventBus.asObservable().pipe(
      filter((event: any) => event.key === key),
      map((event: any) => event.data as T));
  }

  setPouData = data => this.singleRackData = data;
  getPouData = () => this.singleRackData || {};
  setDemandDashBoardIP = ip => this.ipToDemandDashBoard = ip;
  getIpFromPackagingCalculator = () => this.ipToDemandDashBoard || {};
  getWildCardDropDownValues(data) {
    return this.http.get(`${this.baseUrl}${data}`
    );
  }
  getWildCardTableData(url, data) {
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  setPackagingCalcIps = data => {
    this.ipToPackagingCalc = { ...data };
  }
  getPackagingCalcIp = () => this.ipToPackagingCalc;

  setItemPlanIp = data => this.ipToItemPlanDetail = data;
  getItemPlanIp = () => this.ipToItemPlanDetail;
  setCbReqData = data => this.cbReqDataFromItemPlanDetail = { ...data };
  getCbReqData = () => this.cbReqDataFromItemPlanDetail;

  // MFCR methods

  setMFCRIp = data => this.ipToMFCR = data;
  getMFCRIp = () => this.ipToMFCR || {};

  // Single Rack  methods

  setSingleRackIp = data => this.ipToSingleRack = data;
  getSingleRackIp = () => this.ipToSingleRack || {};

  setSingelRacksvg = data => this.singelRacksvg = { ...data };

  getSingelRacksvg = () => ({ ...this.singelRacksvg }) || {};


  //PFEP Summary methods

  setPfepSummaryIp = data => this.ipToPfepSummary = data;
  getPfepSummaryIp = () => this.ipToPfepSummary || {};

  getHierArchy() {
    return this.isHierarchy.asObservable();
  }

  getBreadCrumbCopy() {
    return this.createCopy.asObservable();
  }

  // routeAttached Observables

  getRouteAttachedSubject = () => this.routeAttachedSubject;
  routeAttached = screenData => {
    this.routeAttachedSubject.next(screenData);
  }

  buildTotalRecordsString = (totalPages, totalRecords, rows, page) => {
    let recordsString = '';
    if (totalPages === 1) {
      recordsString = `Displaying total ${totalRecords} record(s)`;
    } else {
      recordsString = `Displaying ${rows * (page - 1) +
        1} - ${Math.min(rows * page, totalRecords)} records of
      ${totalRecords} records in ${totalPages} pages`;
    }

    return recordsString;
  }

}
