import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import * as constants from '../pfep-summary-constants';

@Component({
  selector: 'pfep-details-component',
  templateUrl: './details-component.component.html',
  styleUrls: ['./details-component.component.scss']
})
export class DetailsComponentComponent implements OnInit, OnChanges {

  constructor() { }
  selectedBranch = '';
  branchValues: Array<object> = [];
  branchDDKey: string = constants.branchDDKey;
  attributeDetails: Array<object> = constants.attributeDetails;
  attributeValuesKey: string = constants.attributeValuesKey;
  emptyDetailsAttributes: Array<string> = constants.emptyDetailsAttributes;
  multiValuedFields: object = constants.multiValuedFields;
  editableFields: Array<string> = constants.editableFields;
  itemDesc: string = constants.itemDesc;
  dimensionValues: object = {
    [constants.pfepLength]: null,
    [constants.pfepWidth]: null,
    [constants.pfepHeight]: null,
    [constants.pfepWeight]: null
  };

  @Input() details = {};
  @Input() isEditable = false;
  @Input() invalid = false;
  @Output() public hasEdited = new EventEmitter<any>();
  @Output() public isValidForm = new EventEmitter<any>();
  @Input() branchSelected = branch => { };

  ngOnInit() {
    this.parseDDValues(this.details[constants.branchDDKey]);
    this.setDimensionValues(this.details[constants.attributeValuesKey]);
  }

  ngOnChanges(changes) {
    if (changes.details.currentValue) {
      this.parseDDValues(changes.details.currentValue[constants.branchDDKey]);
      this.setDimensionValues(
        changes.details.currentValue[constants.attributeValuesKey]
      );
    }
  }

  setDimensionValues = details => {
    if (details) {
      for (const dimension in this.dimensionValues) {
        this.dimensionValues[dimension] = details[dimension] || null;
      }
    }
  }


  attributeValueChanged = (e, field) => {
    this.invalid = false;
    if (this.dimensionValues[field] !== '.') {
      const parsedValue = parseFloat(this.dimensionValues[field]);
      this.dimensionValues[field] = (this.dimensionValues[field] && !isNaN(parsedValue)) ? e : '';
    }
    // this.invalid = Object.keys(this.dimensionValues).every(k => this.dimensionValues[k] === '.');
    this.invalid = Object.values(this.dimensionValues).indexOf('.') >= 0;
    this.isValidForm.emit(this.invalid);

    this.hasEdited.emit();
  }

  branchChanged = e => {
    this.branchSelected(e);
  }

  parseDDValues = (arr = []) => {
    if (arr.length > 0) {
      let defaultValue = '';
      this.branchValues = arr.map(val => {
        if (val.IsSelected) {
          defaultValue = val[constants.branch];
        }
        return { label: val[constants.branch], value: val[constants.branch] };
      });
      this.selectedBranch = defaultValue || null;
    } else {
      this.branchValues = [];
    }
  }

  getSaveData = () => {
    return { ...this.dimensionValues };
  }
}
