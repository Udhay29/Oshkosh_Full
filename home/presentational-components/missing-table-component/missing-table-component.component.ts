/****
 * presentational component for prime ng table in missing-data
 *
 * Sample Input Format:
 *
  columns = [{displayName: "First", value: "first"},{displayName: "Second", value: "second"},{displayName: "Third", value: "third"}];
  groupedColumns = {
    "second": [{displayName: "2-1", value: "2-1"},{displayName: "2-2", value: "2-2"},{displayName: "2-3", value: "2-3"}],
    "third": [{displayName: "3-1", value: "3-1"},{displayName: "3-2", value: "3-2"},{displayName: "3-3", value: "3-3"}]
  }
  data = [{
    "first" :1,
    "2-1": 2,
    "2-2": 3,
    "2-3":4,
    "3-1": 5,
    "3-2": 6,
    "3-3": 7
  }]
 ****/

import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  ViewEncapsulation,
  EventEmitter,
  ViewChild
} from '@angular/core';
import * as constants from '../../constants';
import { HomeModuleService } from '../../home-module.service';
import { NumberOnlyDirective } from '../../../../shared/directives/number/numberonly.directive';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'pfep-missing-table-component',
  templateUrl: './missing-table-component.component.html',
  styleUrls: ['./missing-table-component.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MissingTableComponent implements OnInit, OnChanges {
  @Input() data: Array<Object> = [];
  @Input() groupedColumns: Object;
  @Input() columns: Array<String>;
  @Input() height: Number = 500;
  @Input() uniqueKey = '';
  @Input() selectableRows = false;
  @Input() selectedStack = '';
  @Input() searchCriteria = {};
  @ViewChild('f1') ngForm: NgForm;

  @Output() recordEdited = new EventEmitter();
  editedRecord = false;

  totalColumns = [];
  columnsUnderGroup = [];
  groupedColumnsPresent: Boolean = false;
  tableHeight: String = '500px';
  recordToEdit = {};
  selectedRecord = {};
  showEditModal = false;
  dataToSave = {};
  ddValues = {};
  searchFieldResults = {};
  editedValuesInvalid = [];
  editPopUpNames = constants.editPopUpNames;
  highWidthCols = constants.weightsDimensionsHighWidthCols;

  constructor(public homeService: HomeModuleService) { }

  ngOnInit() {
    this.buildTable();
    this.buildSearchFieldResults();
  }

  ngOnChanges(changes) {
    if (changes.data && changes.data.currentValue) {
      this.data = [...changes.data.currentValue];
      this.buildTable();
    }
    this.showEditModal = false;
  }

  buildSearchFieldResults = () => {
    const searchFieldsMap = constants.searchFieldsMap[this.selectedStack];
    if (
      typeof searchFieldsMap === 'object' &&
      searchFieldsMap !== null &&
      Object.prototype.toString.call(searchFieldsMap) !== '[object Array]' &&
      Object.keys(searchFieldsMap).length > 0
    ) {
      Object.keys(searchFieldsMap).forEach(
        field => (this.searchFieldResults[field] = [])
      );
    }
  }

  buildTable = () => {
    if (this.data && this.data.length > 0) {
      this.deriveColumns();
      this.tableHeight = this.height + 'px';
    }
  }

  deriveColumns = () => {
    (this.totalColumns = []), (this.columnsUnderGroup = []);
    this.totalColumns = [...this.columns];
    if (Object.keys(this.groupedColumns).length > 0) {
      Object.keys(this.groupedColumns).forEach(col => {
        this.totalColumns.splice(this.getColIndex(this.totalColumns, col), 1);
        this.columnsUnderGroup = [
          ...this.columnsUnderGroup,
          ...this.groupedColumns[col]
        ];
      });
      this.totalColumns = [...this.totalColumns, ...this.columnsUnderGroup];
    }
    this.groupedColumnsPresent =
      Object.keys(this.groupedColumns).length > 0 ? true : false;
  }

  getColIndex(columns, colInPoint) {
    let idx;
    columns.forEach((col, i) => {
      if (
        (typeof colInPoint === 'string' && colInPoint === col.value) ||
        (typeof colInPoint === 'object' && colInPoint.value === col.value)
      ) {
        idx = i;
      }
    });
    return idx;
  }

  // Edit records

  onRowSelect = event => {
    this.recordToEdit = { ...event.data };
    this.showEditModal = true;
  }

  onRowUnselect = () => {
    this.recordToEdit = {};
  }

  trackByFn = (idx, col) => col.value;

  ddValueChanged = (e, key, valueKey) => {
    this.ddValues[key] = { value: e.target.value.trim(), valueKey };
  }

  saveData = () => {
    if (this.ngForm.form.valid) {
      this.editedValuesInvalid = [];
      const checkDropDownValues = idx => {
        Object.keys(this.ddValues).forEach(field => {
          this.data[index][field].forEach(opt => {
            opt.IsSelected =
              opt[this.ddValues[field].valueKey] === this.ddValues[field].value
                ? true
                : false;
          });
        });
        this.data[idx] = { ...this.data[idx] };
      };

      // Currently we dont need index.
      const index =
        this.uniqueKey !== ''
          ? this.data.findIndex(
            rec => rec[this.uniqueKey] === this.selectedRecord[this.uniqueKey]
          )
          : this.data.indexOf(this.selectedRecord);
      checkDropDownValues(index);
      this.ddValues = {};
      this.data[index] = this.recordToEdit;
      this.data = [...this.data];
      this.dataToSave = {};
      this.dataToSave[this.recordToEdit[this.uniqueKey]] = this.recordToEdit;
      const dataToEmit = {
        data: this.dataToSave,
        key: this.recordToEdit[this.uniqueKey],
        index
      };
      this.recordEdited.emit(dataToEmit);
      this.showEditModal = false;
    }
  }

  fetchDropDownValue = (opts, valueKey) => {
    const value = opts.filter(opt => opt.IsSelected === true);
    return value.length === 0 ? '' : value[0][valueKey];
  }

  editPopUpClosed = () => {
    this.recordToEdit = {};
    this.editedValuesInvalid = [];
  }

  alterSearchFieldResults = (results, displayKey, key) => {
    results = results.map(res => {
      const opt = { displayValue: '', value: '' };
      opt.displayValue = `${res[key]} - ${res[displayKey]}`;
      opt.value = res[key];
      return opt;
    });
    return [...results];
  }

  searchFieldFetch = (field, value) => {
    this.homeService
      .getSearchFieldData(this.getPostDataString(field, value))
      .subscribe(res => {
        const results = res as Array<any>;
        this.searchFieldResults[field] = this.alterSearchFieldResults(
          [...results],
          constants.searchFieldsMap[this.selectedStack][field]['displaykey'],
          constants.searchFieldsMap[this.selectedStack][field]['key']
        );
      });
  }

  getPostDataString = (field, value) => {
    switch (field) {
      case 'CONTAINER_SUPPLIER':
        return `${
          constants.searchFieldsMap[this.selectedStack][field]['API']
          }?Value=${value}&OrgId=${this.searchCriteria['ORG_ID']}`;
    }
  }
  searchFieldOptSelected = (field, value) => {
    this.removeFromInvalid(field);
    if (value === this.recordToEdit[field]) {
      this.searchFieldResults[field] = [...[]];
      return;
    }
    this.recordToEdit[field] = value;
    this.recordToEdit = { ...this.recordToEdit };
  }

  searchfieldBlurred = (key, e) => {
    if (e === 'unset') {
      this.editedValuesInvalid.push(key);
    } else {
      this.removeFromInvalid(key);
    }
  }

  searchfieldEmptied = field => {
    this.removeFromInvalid(field);
  }

  searchfieldTyping = field => {
    // this.removeFromInvalid(field);
  }

  removeFromInvalid = field => {
    const invalidIdx = this.editedValuesInvalid.indexOf(field);
    if (invalidIdx > -1) {
      this.editedValuesInvalid.splice(invalidIdx);
    }
  }
}
