

import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { AdministrativeService } from '../administrator.service';
import { CoreServices } from 'src/app/core/services/core.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'pfep-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  headings = [];
  tableData = [];
  selectedRecord = [];
  result = [];
  selectedArr = [];
  selectedArrCode = [];
  configType: any = null;
  maximumPercent: any = null;
  display: Boolean = false;
  isInValidPercent: Boolean = false;
  @Output() deleteRecord = new EventEmitter<any>();
  @Output() saveorUpdt = new EventEmitter<any>();
  @Output() changedConfig = new EventEmitter<any>();
  @Output() isEdited = new EventEmitter<any>();
  @Input() configDetails: any;
  @Input() hasEdit: any;
  configJSONDetails: any;
  @Input() configTypes = [];
  piecePercent: Boolean = false;
  isMinorMax: boolean;
  isInvalid: boolean;
  sortMode = undefined;
  first: any;
  @ViewChild('configTableForm') ngForm: NgForm;
  constructor(private administrativeService: AdministrativeService, private coreServices: CoreServices) { }

  ngOnInit() {
    this.administrativeService.getConfigDefaults()
      .subscribe((data: any) => {
        this.configJSONDetails = data;
      });
    this.ngForm.form.valueChanges.subscribe(x => {
      this.isValueChanged(true);
    });
  }

  isValueChanged(eve) {
    this.isEdited.emit(eve);
  }

  ngOnChanges() {
    if (this.configType !== null) {
      this.tableData = JSON.parse(JSON.stringify(this.configDetails['AlertConfigList']));
      this.result = this.groupBy(this.tableData, function (item) {
        return [item.ORG_ID, item.FACILITY_ID];
      });
      this.selectedRecord = [];
      this.first = 0;
    }
  }

  configChanged() {
    this.isInValidPercent = false;
    this.isMinorMax = false;
    this.piecePercent = false;
    this.isInvalid = false;
    this.onDialogClose(false);
    this.selectedArr = [];
    this.headings = this.configJSONDetails[this.configType];
    this.changedConfig.emit(this.configType);
    this.sortMode = undefined;
  }
  pageChange(e) {
    this.first = e.first;
  }

  disableCheckBox(col) {
    this.selectedArrCode = this.tableData.filter(obj => obj.ORG_ID === col.ORG_ID && obj.FACILITY_ID === col.FACILITY_ID).map(obj => obj.ABC_CODE);
    const flag = this.selectedArrCode[this.selectedArrCode.length - 1] !== col.ABC_CODE;
    return flag;
  }



  isDisabled(col, config) {
    return (col.isEdit && (col.type === 'number' || col.type === 'integer') && (this.configType === 'PFEP_SHORTAGE' || this.configType === 'DEMAND_GAPS' ||
      (this.configType === 'ABC_CODE_DETERMINATION' && ((col.key === 'PIECE_PRICE' && config['METHODOLOGY'] === 'P')
        || (col.key === 'PERCENT_EXTENDED_COST' && config['METHODOLOGY'] === 'E')))));
  }

  add() {
    this.display = true;
  }

  onDialogClose(event) {
    this.display = event;
  }

  modelUpdated(index) {
    this.tableData[index].modified = true;
  }

  deleteRow() {
    const post = {
      DataType: 'ABC_CODE_DETERMINATION',
      SID: this.selectedRecord.map(obj => obj.ABC_CODE_DETERMINATION_SID)
    };
    this.deleteRecord.emit(post);
  }

  checkEdit() {
    const isTableEdited = this.tableData.filter(obj => obj.modified);
    return isTableEdited.length === 0 ? true : false;
  }

  Save() {
    const post = {
      DataType: this.configType,
      DESCRIPTION: this.tableData.filter(obj => obj.modified)
    };
    // console.log(post);
    this.SaveOrUpdateConfig(post);
  }

  SaveOrUpdateConfig(post) {
    this.saveorUpdt.emit(post);
  }

  groupBy(array, f) {
    const groups = {};
    array.forEach(function (o) {
      const group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    });
  }

  calculateMax(colModel, col) {
    if (this.configType === 'ABC_CODE_DETERMINATION') {
      this.selectedArr = this.tableData.filter(obj => obj.ORG_ID === colModel.ORG_ID && obj.FACILITY_ID === colModel.FACILITY_ID);
      colModel.invalid = false;
      if (col.key === 'PERCENT_EXTENDED_COST') {
        this.maximumPercent = this.sumOfCost(this.selectedArr);
        this.isInValidPercent = this.maximumPercent > 100;
      }
      if (this.selectedArr.length && col.key === 'PIECE_PRICE') {
        this.piecePercent = !this.checkPiecePercent(this.selectedArr.map(e => e.PIECE_PRICE));
      }
    }
    this.isMinorMax = +colModel[col.key] < col.min || +colModel[col.key] > col.max;
  }

  checkPiecePercent(a) {
    return a.slice(1).map((e, i) => e < +a[i]).every(x => x);
  }

  sumOfCost(arr) {
    return arr.map(item => parseInt(item.PERCENT_EXTENDED_COST)).reduce((prev, next) => prev + next);
  }

  ngDoCheck() {
    if (this.configType === 'ABC_CODE_DETERMINATION') {
      const errorlength = this.tableData.filter(obj => obj.invalid === true);
      this.isInvalid = errorlength.length > 0 ? true : false;
    }
  }

  clearFields(col) {
    this.selectedArr = this.tableData.filter(obj => obj.ORG_ID === col.ORG_ID && obj.FACILITY_ID === col.FACILITY_ID);
    this.piecePercent = false;
    if (col.METHODOLOGY === 'P') {
      this.selectedArr.forEach(obj => {
        obj.PERCENT_EXTENDED_COST = null;
        obj.METHODOLOGY = 'P';
        obj.modified = true;
        obj.invalid = true;
      });
    } else {
      this.selectedArr.forEach(obj => {
        obj.PIECE_PRICE = null;
        obj.METHODOLOGY = 'E';
        obj.modified = true;
        obj.invalid = true;
      });
    }

  }

  onSort(event, field) {
    this.sortMode = !this.sortMode;
    if (this.sortMode) {
      this.tableData.sort(function (a, b) {
        if(isNaN(Number(a[field])) || isNaN(Number(b[field]))){
          if (a[field] < b[field]) { return -1; }
          if (a[field] > b[field]) { return 1; }
          return 0;
        }else {
          if (parseInt(a[field]) < parseInt(b[field])) { return -1; }
          if (parseInt(a[field]) > parseInt(b[field])) { return 1; }
          return 0;
        }
      });
    } else {
      this.tableData.sort(function (a, b) {
        if(isNaN(Number(a[field])) || isNaN(Number(b[field]))){
          if (a[field] < b[field]) { return 1; }
          if (a[field] > b[field]) { return -1; }
          return 0;
        }else {
          if (parseInt(a[field]) < parseInt(b[field])) { return 1; }
          if (parseInt(a[field]) > parseInt(b[field])) { return -1; }
          return 0;
        }
      });
    }
  }



}
