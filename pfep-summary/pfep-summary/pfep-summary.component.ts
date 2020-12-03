import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import * as constants from '../pfep-summary-constants';
import { PfepSummaryService, formatDate } from '../pfep-summary-service';
import { SharedService } from '../../../shared/services/share.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CoreServices } from '../../../core/services/core.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { exportToExcel, buildExportData } from '../../../utils/excel-functions';
import { DetailsComponentComponent } from '../details-component/details-component.component';
import { UpStreamItemPlanComponent } from '../up-stream-item-plan/up-stream-item-plan.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'pfep-pfep-summary',
  templateUrl: './pfep-summary.component.html',
  styleUrls: ['./pfep-summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PfepSummaryComponent implements OnInit {
  defaultSearchCriteria: object = {};
  dropDownValues: object = {};
  searchCriteria: object = {
    [constants.segment]: '',
    [constants.itemId]: ''
  };
  searchFields: Array<object> = [...constants.searchFields];
  itemDesc: string = constants.itemDesc;
  details: any = {};
  branchDDKey: string = constants.branchDDKey;
  attributeValuesKey: string = constants.attributeValuesKey;
  fieldsEmpty: Array<string> = [];
  itemPlanFields: Array<object> = constants.itemPlanFields;
  upStreamPlanFields: Array<object> = constants.upStreamPlanFields;
  pouItemPlanDetailsKey: string = constants.pouItemPlanDetailsKey;
  upStreamPlansDetailsKey: string = constants.upStreamPlansDetailsKey;
  segment: string = constants.segment;
  isEditable = false;
  hasEdits = false;
  invalid = false;
  createNewPlan = false;
  ipFromParent: any = { ipPresent: false, parent: '' };

  @ViewChild(DetailsComponentComponent)
  detailsComponent: DetailsComponentComponent;
  @ViewChild(UpStreamItemPlanComponent)
  upStreamPlansComp: UpStreamItemPlanComponent;
  valid: boolean;

  constructor(
    private summaryService: PfepSummaryService,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,
    private coreService: CoreServices,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    const routeRoles = this.route.snapshot.data.roles;
    this.isEditable = this.coreService.checkAccess(routeRoles);
    constants.searchFields.map(field => {
      this.searchCriteria[field.key] = '';
    });
    this.summaryService.getOrgIds().subscribe(res => {
      if (res.status === 200 && Array.isArray(res.body)) {
        this.prepareDDValues(res.body, constants.segment);
      } else {
        this.summaryService.displayMessage(
          'error',
          res.body && res.body['Message']
            ? res.body['Message']
            : 'Unable to fetch Segment Values. Please try again after sometime.'
        );
      }
    });

    this.checkForIpAndFetch(true);
    // to set segment by default
    const segmentValue = JSON.parse(localStorage.getItem('currentUser')).org_id;
    if (this.searchCriteria[constants.segment] === '' && segmentValue)  {
      this.searchCriteria[constants.segment] = segmentValue;
      this.changeWCDependedntData(segmentValue, constants.segment);

    }
  }

  prepareDDValues = (arr, key) => {
    this.dropDownValues[key] = arr.map(val => this.buildDDOption(val, val));
  }

  buildDDOption = (label, value) => ({ label, value });

  checkDDValues = () => {
    const sgmnt = constants.segment;
    if (!this.isEmptyOrInvalid(this.searchCriteria[sgmnt])) {
      if (this.isEmptyOrInvalid(this.dropDownValues[sgmnt])) {
        this.dropDownValues[sgmnt] = [this.buildDDOption(this.searchCriteria[sgmnt], this.searchCriteria[sgmnt])]
      } else if (this.dropDownValues[sgmnt].indexOf(this.searchCriteria[sgmnt]) === -1) {
        this.dropDownValues[sgmnt].push(this.buildDDOption(this.searchCriteria[sgmnt], this.searchCriteria[sgmnt]));
      }
    }
  }

  checkForIpAndFetch = (flag?) => {
    const {data: pfepSummaryIp = {}, parent, replaceParent} = this.sharedService.getPfepSummaryIp();
    this.sharedService.setPfepSummaryIp({});
    if (
      !this.isEmptyOrInvalid(pfepSummaryIp[constants.segment]) &&
      !this.isEmptyOrInvalid(pfepSummaryIp[constants.itemId])
    ) {
      if(flag){
      this.sharedService.isHierarchy.next({ isChild: true });
      }
      this.searchCriteria = { ...pfepSummaryIp };
      this.checkDDValues();
      const effParent = replaceParent ? '' : (parent ? parent : (this.ipFromParent.parent || '')) ;
      this.ipFromParent = { ipPresent: true, parent: effParent };
      this.setIptoSearchFields();
      this.searchClicked();
    } else {
      this.ipFromParent = { ipPresent: false, parent: '' };
      this.resetSearchFields();
    }
  }

  setIptoSearchFields = () => {
    const idx = this.searchFields.findIndex(
      sF => sF['key'] === constants.itemId
    );
    if (idx > -1) {
      this.searchFields[idx] = { ...this.searchFields[idx] };
      this.searchFields[idx]['config']['selectedData'] = this.searchCriteria[
        constants.itemId
      ];
      this.searchFields[idx]['config']['dependentData'] = {
        ...{ [constants.segment]: this.searchCriteria[constants.segment] }
      };
    }
  }

  resetSearchFields = () => {
    this.searchFields.forEach((sF, idx) => {
      this.searchCriteria[sF['key']] = '';
      if (sF['key'] === constants.itemId) {
        this.searchFields[idx] = { ...this.searchFields[idx] };
        this.searchFields[idx]['config']['selectedData'] = '';
        this.searchFields[idx]['config']['dependentData'] = {};
      }

    });
  }

  wildCardChangeEvent = (e, field) => {
    this.searchCriteria[e.modelName] = e.selectedData;
  }
  searchDDChanged = (e, field) => {
    if (field === constants.segment) {
      this.changeWCDependedntData(e.value, field);
    }
  }

  changeWCDependedntData = (value, field) => {
    this.searchFields[1] = { ...this.searchFields[1] };
    this.searchFields[1]['config']['dependentData'] = {
      ...{ [field]: value.trim() }
    };

  }

  searchClicked = () => {
    this.checkForInvalid();
    if (this.fieldsEmpty.length === 0) {
      this.coreService.showLoader();
      this.summaryService.fetchDetails(this.searchCriteria).subscribe(res => {
        if (res.status === 200 && res.body) {
          this.details = { ...res.body };
          this.details[constants.pouItemPlanDetailsKey] = [
            ...this.formatDateFields(
              this.details[constants.pouItemPlanDetailsKey],
              constants.pouItemPlanDetailsKey
            )
          ];
          // this.exportDataToExcel();
        } else {
          this.summaryService.displayMessage(
            'error',
            res.body && res.body['Message']
              ? res.body['Message']
              : 'Unable to fetch details. Please try again after sometime.'
          );
        }
        this.coreService.hideLoader();
      });
    }
  }

  isEmptyOrInvalid = value => {
    if ([null, undefined, ''].indexOf(value) > -1) {
      return true;
    }

    if (Array.isArray(value)) {
      return value.length === 0;
    }
    if (typeof value === 'object') {
      return Object.keys(value).length === 0;
    }

    return false;
  }

  formatDateFields = (arr, tableName) => {
    let resultantArray = [];
    return [
      ...(resultantArray = arr.map(rec => {
        return this.formatRecDates(rec, tableName);
      }))
    ];
  }

  formatRecDates = (rec, tableName) => {
    constants.dateFields[tableName].forEach(field => {
      rec[field] = rec[field] ? formatDate(rec[field], true) : rec[field];
    });
    return { ...rec };
  }

  checkForInvalid = () => {
    this.fieldsEmpty = [];
    for (const field in this.searchCriteria) {
      if (!this.searchCriteria[field]) {
        this.fieldsEmpty.push(field);
      }
    }
  }

  branchSelected = ({ value }) => {
    this.coreService.showLoader();
    const postData = { ...this.searchCriteria, [constants.branch]: value };
    this.summaryService.fetchDetailsByBranch(postData).subscribe(res => {
      if (res.status === 200) {
        this.details = this.alterIpToDetailsComp(res.body, value);
      } else {
        this.summaryService.displayMessage(
          'error',
          res.body && res.body['Message']
            ? res.body['Message']
            : 'Unable to fetch details. Please try again after sometime.'
        );
      }
      this.coreService.hideLoader();
    });
  }

  alterIpToDetailsComp = (data, branch) => {
    const ddValues = this.details[constants.branchDDKey].map(branchDetail => ({
      ...branchDetail,
      IsSelected: branchDetail[constants.branch] === branch
    }));

    return {
      ...this.details,
      [constants.branchDDKey]: [...ddValues],
      [constants.attributeValuesKey]: data ? { ...data } : null
    };
  }

  onClickPouItemPlan = data => {
    const itemPlanObj = {
      planIdFromParent: data[constants.itemPlanId],
      parentScreenPath: '/pfep-summary',
      isChild: true,
      selectedRecord: {
        ...data,
        [constants.segment]: this.searchCriteria[constants.segment]
      }
    };
    this.createNewPlan = this.isEmptyOrInvalid(data[constants.itemPlanId]);
    this.sharedService.setItemPlanIp({ ...itemPlanObj });
    this.router.navigate(['/item-plan-detail']);
  }

  prepareUpStreamPostData = saveData => {
    saveData.forEach(record => {
      // converting Number fields
      constants.upStreamPlansNumberFields.forEach(key => {
        const value = record[key];
        if (value && typeof value === 'string') {
          record[key] = Number(record[key]);
        }
      });
    });

    return saveData;
  }

  isSaveEnable(eve) {
    this.invalid = eve;
  }

  save = () => {
    const upStreamSaveData = this.upStreamPlansComp.getSaveData();
    this.valid = upStreamSaveData.every(e => e.CONTAINER_QTY !== '.') ;
    if (this.valid) {
      const detailsSaveData = this.detailsComponent.getSaveData();
      const upStreamPlansSaveData = this.prepareUpStreamPostData(
        upStreamSaveData
      );

      const postData = {
        ...this.searchCriteria,
        ...detailsSaveData,
        [constants.upStreamPlansSaveKey]: [...upStreamPlansSaveData]
      };

      this.summaryService.saveUpStreamItemPlans(postData).subscribe(res => {
        if (
          res.status === 200 &&
          res.body &&
          res.body['StatusType'] === 'SUCCESS'
        ) {
          this.hasEdits = false;
          this.summaryService.displayMessage(
            'success',
            'Details saved Succesfully'
          );
          if (this.ipFromParent.parent) {
            this.router.navigate([this.ipFromParent.parent]);
          }
          this.ipFromParent = { ipPresent: false, parent: '' };

        } else {
          this.summaryService.displayMessage(
            'error',
            res.body && res.body['Message']
              ? res.body['Message']
              : 'Unable to save. Please try again after sometime.'
          );
        }
      });
    }
  }

  routeAttached = () => {
    this.sharedService.isHierarchy.next({ back: true, backurl: this.router.url });
    const postData = { ...this.sharedService.getCbReqData()['data'] };
    if (Object.keys(postData).length > 0) {
      this.sharedService.setCbReqData({});
      this.summaryService.getSingleRecordData(postData).subscribe(res => {
        if (res.status === 200) {
          this.updateRowData(res.body);
        } else {
          this.createNewPlan = false;
          this.summaryService.displayMessage(
            'error',
            'Failed to update item plan record. Please refresh to get latest data'
          );
        }
      });
    } else if (Object.keys(this.sharedService.getPfepSummaryIp()).length > 0) {
      this.checkForIpAndFetch(false);
    }
  }

  updateRowData = updatedRec => {
    const idx = this.details[this.pouItemPlanDetailsKey].findIndex(rec => {
      let isMatch = true;
      constants.rowFetchPostDataKeys.forEach(key => {
        if (this.createNewPlan && key === constants.itemPlanId) {
          return;
        }
        if (updatedRec[key] !== rec[key] && isMatch) {
          isMatch = false;
        }
      });
      return isMatch;
    });
    this.createNewPlan = false;
    // this adjustment needs to be done on UI only for this API call
    const workCenterDesc = updatedRec[constants.workCenterDesc];
    updatedRec[constants.workCenterDesc] =  updatedRec[constants.pfepWorkCenterDesc];
    updatedRec[constants.supplyingLocation] = workCenterDesc;

    
    this.details[this.pouItemPlanDetailsKey][idx] = this.formatRecDates(
      updatedRec,
      constants.pouItemPlanDetailsKey
    );
  }

  changesMade = e => {
    this.hasEdits = true;
  }

  canDeactivate = () => {
    if (this.hasEdits && this.isEditable) {
      this.modalService.open();
      return this.modalService.getConfirmationSubject();
    }

    return true;
  }

  // exportDataToExcel = () => {
  //   constants.exportToExcelData.forEach(table => {
  //     const dataToExport = buildExportData(
  //       this.details[table.dataToExport] || [],
  //       table.tableColumns,
  //       table.headerKey,
  //       table.valueKey,
  //       table.droDownAPIKey
  //     );

  //     exportToExcel(dataToExport, table.fileName + '.xlsx', []);
  //   });
  // }

  exportDataToExcel = () => {
    let blob;
    const wb = { SheetNames: [], Sheets: {} };

    constants.exportToExcelData.forEach(table => {
      const workSheet = XLSX.read(
        this.prepareTable(this.details[table.dataToExport], table.tableColumns),
        { type: 'binary' }
      ).Sheets.Sheet1;
      wb.SheetNames.push(table.fileName);
      wb.Sheets[table.fileName] = workSheet;
    });

    blob = new Blob(
      [this.s2ab(XLSX.write(wb, { bookType: 'xlsx', type: 'binary' }))],
      {
        type: 'application/octet-stream'
      }
    );
    XLSX.writeFile(wb, 'Pfep Summary.xlsx');
  }
  s2ab = s => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) && 0xff;
    }
    return buf;
  }

  prepareTable = (data, header) => {
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
}
