import { PfepPlanService } from './pfep-plans.service';
import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import ipConstants from '../pfep-plans/pfep-plans-fields';
import { CoreServices } from 'src/app/core/services/core.service';
import { async } from 'q';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/shared/services/share.service';
import { ModalService } from 'src/app/core/services/modal.service';


export const rowFetchPostDataKeys = [
  'WORK_CENTER_ID',
  'ITEM_ID',
  'ITEM_PLAN_ID',
  'FACILITY_ID'
];

@Component({
  selector: 'pfep-pfep-plans',
  templateUrl: './pfep-plans.component.html',
  styleUrls: ['./pfep-plans.component.scss']
})
export class PfepPlansComponent implements OnInit {
  ifsSearchFields: any = ipConstants['searchFields'];
  ifsTableFields: any = ipConstants['tableItems'];
  searchCriteria: any = {
    PLAN_STATUS_CODE: '',
    FACILITY_ID: '',
    ITEM_ID: '',
    WorkCenterList: []
  };
  selectedSearchItem: any;
  selectedItemPlan: any;
  submitted: any;
  srData: any = [];
  ipData: any = [];
  upData: any = [];
  pfepData: any = [];
  submitStatus = false;
  wildCardLookUpConfig: any;
  statusDropDown: any = [];
  statusDdconfig: object = { selectedValue: '', cssClass: 'form-control' };
  isEditable: Boolean = false;
  wildCardLookUpConfigCopy: any;
  rowClickedDetail: any = null;
  workCenter = 'WORK_CENTER_ID';
  itemId = 'ITEM_ID';
  searchInvalid = false;
  selectedOrgId = '';
  hasEdit: any;

  constructor(
    public ItemflowService: PfepPlanService,
    private toastr: ToastrService,
    public coreService: CoreServices,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private modalService: ModalService
  ) { }
  ngOnInit() {
    const routeRoles = this.route.snapshot.data.roles;
    this.isEditable = this.coreService.checkAccess(routeRoles);
    this.getItemStatus();
    this.wildCardLookUpConfig = [
      {
        serviceUrl: {
          dropdown: 'WildcardSearch/GetFields?fieldName=FACILITY_ID',
          table: 'WildcardSearch/GetDropdownValuesWarehouse'
        },
        tableFields: [
          { header: 'ID', field: 'FACILITY_ID' },
          { header: 'Description', field: 'FACILITY_DESC' }
        ],
        label: '',
        labelText:'Branch',
        isMultiSelect: false,
        selectedData: '',
        modelName: 'FACILITY_ID',
        styleclass: 'col-md-2',
        defaultselecteddropDownValue: { 'FIELD_NAME': 'FACILITY_ID' }
      },
      {
        serviceUrl: {
          dropdown: 'WildcardSearch/GetFields?fieldName=WORK_CENTER_ID',
          table: 'WildcardSearch/GetDropdownValuesWorkCenter'
        },
        tableFields: [
          { header: 'ID', field: 'WORK_CENTER_ID' },
          { header: 'Description', field: 'WORK_CENTER_DESC' }
        ],
        label: '',
        labelText:'WorkCenter',
        isMultiSelect: true,
        selectedData: [],
        options: [],
        modelName: 'WORK_CENTER_ID',
        styleclass: 'col-md-2',
        dependentData: '',
        defaultselecteddropDownValue: { 'FIELD_NAME': 'WORK_CENTER_ID' }
      },
      {
        serviceUrl: {
          dropdown: 'WildcardSearch/GetFields?fieldName=ITEM_ID',
          table: 'WildcardSearch/GetDropdownValues'
        },
        tableFields: [
          { header: 'ID', field: 'ITEM_ID' },
          { header: 'Description', field: 'ITEM_DESC' }
        ],
        label: '',
        labelText:'Item Number',
        isMultiSelect: false,
        selectedData: '',
        modelName: 'ITEM_ID',
        styleclass: 'col-md-2',
        dependentData: '',
        defaultselecteddropDownValue: { 'FIELD_NAME': 'ITEM_ID' }

      }
    ];
    this.wildCardLookUpConfigCopy = JSON.parse(JSON.stringify(this.wildCardLookUpConfig));
  }
  async getItemStatus() {
    this.coreService.showLoader();
    this.statusDropDown = await this.ItemflowService.getItemStatus().toPromise();
    this.coreService.hideLoader();
  }
  statusOnChange(data) {
    this.searchCriteria['PLAN_STATUS_CODE'] = data;
  }
  wildCardChangeEvent(data) {
    this.searchCriteria[
      data.modelName === 'WORK_CENTER_ID' ? 'WorkCenterList' : data.modelName
    ] = data.selectedData;

    if (data.modelName === 'FACILITY_ID') {
      this.wildCardLookUpConfigInit([1, 2]);
      this.wildCardLookUpConfig[1].dependentData = {
        ORG_ID: '',
        FACILITY_ID: data.selectedData,
        WORK_CENTER_ID: ''
      };
      this.wildCardLookUpConfig[2].dependentData = {
        ORG_ID: '',
        FACILITY_ID: this.wildCardLookUpConfig[1].dependentData.FACILITY_ID,
        WorkCenterList: []
      };

      this.searchCriteria['WorkCenterList'] = [];
      this.searchCriteria['ITEM_ID'] = '';
    } else if (data.modelName === 'WORK_CENTER_ID') {
      this.wildCardLookUpConfigInit([2]);
      this.wildCardLookUpConfig[2].dependentData = {
        ORG_ID: '',
        FACILITY_ID: this.wildCardLookUpConfig[1].dependentData.FACILITY_ID,
        WorkCenterList: data.selectedData
      };

      this.searchCriteria['ITEM_ID'] = '';
    }
  }
  wildCardLookUpConfigInit(data) {
    data.forEach(element => {
      this.wildCardLookUpConfig[element] = JSON.parse(JSON.stringify(this.wildCardLookUpConfigCopy[element]));
    });
  }

  checkSearchValidityAndSearch = () => {
    if ((this.searchCriteria['WorkCenterList'] && this.searchCriteria['WorkCenterList'].length === 0) && !this.searchCriteria[this.itemId]) {
      this.searchInvalid = true;
    } else {
      this.searchInvalid = false;
      this.searchItemPlan();
    }
  }
  searchItemPlan() {

    this.submitStatus = false;

    for (const key in this.searchCriteria) {
      if (
        this.searchCriteria &&
        this.searchCriteria[key] &&
        this.searchCriteria[key].length
      ) {
        this.submitStatus = true;
      }
    }
    if (this.submitStatus) {
      this.ipData = [];
      this.upData = [];
      this.srData = [];
      this.pfepData = [];
      this.coreService.showLoader();
      this.ItemflowService.getSearchResults(this.searchCriteria).subscribe(
        resp => {
          if (resp) { this.srData = resp; }
          this.coreService.hideLoader();
        }
      );
    } else {
      this.toastr.error('Enter Valid Data');
    }
  }
  onClickSearchResult(data) {
    this.selectedSearchItem = data;
    this.coreService.showLoader();
    this.selectedOrgId = data['ORG_ID'];
    this.ItemflowService.getDisplayItemPlans(data).subscribe(res => {
      // res['UpstreamItemPlanResults'].forEach(element => {
      //       element['EFFECTIVE_DATE'] = new Date(element['EFFECTIVE_DATE']);
      //       element['EXPIRY_DATE'] = new Date(element['EXPIRY_DATE']);
      //     });
      this.ipData =
        res['PouItemPlanResults'] == null ? [] : res['PouItemPlanResults'];
      this.upData =
        res['UpstreamItemPlanResults'] == null
          ? []
          : res['UpstreamItemPlanResults'];
      this.pfepData =
        res['ItemFlowRequiredResults'] == null
          ? []
          : res['ItemFlowRequiredResults'];
      this.coreService.hideLoader();
    });
  }
  saveUpStreamDate(data) {
    if (data.length > 0) {
      const saveObj = {
        PouItemPlanResults: [],
        UpstreamItemPlanResults: data
      };
      this.coreService.showLoader();
      this.ItemflowService.saveUpStreamPlans(saveObj).subscribe(res => {
        this.coreService.hideLoader();
        res['StatusType'] === 'SUCCESS'
          ? this.toastr.success(res['Message'], '', { disableTimeOut: false })
          : this.toastr.error(res['Message']);
      });
    } else {
      this.toastr.error('Please Edit The Data To Save');
    }
  }

  routeAttached = () => {
    const postData = { ...this.sharedService.getCbReqData()['data'] };
    if (Object.keys(postData).length > 0) {
      this.sharedService.setCbReqData({});
      this.ItemflowService.getSingleRecordData(postData).subscribe(res => {
        if (res.status === 200) {
          this.updateRowData(res.body);
        } else {
          this.toastr.error('Failed to update item plan record. Please refresh to get latest data');
        }
      });
    }
  }

  updateRowData = updatedRec => {
    const idx = this.ipData.findIndex(rec => {
      let isMatch = true;
      rowFetchPostDataKeys.forEach(key => {
        if (updatedRec[key] !== rec[key] && isMatch) {
          isMatch = false;
        }
      });
      return isMatch;
    });

    this.ipData[idx] = { ...updatedRec };
  }

  generateItemFlowExcel() {
    let blob,
      wb = { SheetNames: [], Sheets: {} };
    const ws1 = XLSX.read(
      this.prepareTable(this.srData, this.ifsTableFields.searchResultFields),
      { type: 'binary' }
    ).Sheets.Sheet1;
    wb.SheetNames.push('SearchResults');
    wb.Sheets['SearchResults'] = ws1;

    const ws2 = XLSX.read(
      this.prepareTable(this.ipData, this.ifsTableFields.itemPlanFields),
      { type: 'binary' }
    ).Sheets.Sheet1;
    wb.SheetNames.push('ItemPlan');
    wb.Sheets['ItemPlan'] = ws2;

    const ws3 = XLSX.read(
      this.prepareTable(this.upData, this.ifsTableFields.upStreamPlanFields),
      { type: 'binary' }
    ).Sheets.Sheet1;
    wb.SheetNames.push('Upstream');
    wb.Sheets['Upstream'] = ws3;

    const ws4 = XLSX.read(
      this.prepareTable(this.pfepData, this.ifsTableFields.pfepRequiredFields),
      { type: 'binary' }
    ).Sheets.Sheet1;
    wb.SheetNames.push('PFEPrequired');
    wb.Sheets['PFEPrequired'] = ws4;

    // console.log(ws1); console.log(ws2); console.log(wb);
    blob = new Blob(
      [this.s2ab(XLSX.write(wb, { bookType: 'xlsx', type: 'binary' }))],
      {
        type: 'application/octet-stream'
      }
    );
    XLSX.writeFile(wb, 'itemflow.xlsx');
    // saveAs(blob, "test.xlsx");
  }
  s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) && 0xff;
    }
    return buf;
  }
  prepareTable(data, header) {
    const html = [];
    html.push('<html>');
    html.push('<table>');
    html.push('<tr>');
    header.forEach(function (d) {
      html.push('<td style=font-weight:bold>' + d['title'] + '</td>');
    });
    html.push('</tr>');
    data.forEach(function (element, index) {
      html.push('<tr>');
      //  for (let ele in element) {
      header.forEach(function (d) {
        if (element[d.field] !== undefined) {
          html.push('<td>' + element[d.field] + '</td>');
        }
      });
      // }
    });
    html.push('</tr>');
    html.push('</table>');
    html.push('</html>');
    return html.join(' ');
  }

  isModified(eve) {
    this.hasEdit = eve;
  }

  canDeactivate = () => {

    if (this.hasEdit) {
      this.modalService.open();
      return this.modalService.getConfirmationSubject();
    }

    return true;

  }

}
