import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ItemPlanDetailService } from '../item-plan-detail.service';
import * as constants from '../constants';

@Component({
  selector: 'pfep-request-change',
  templateUrl: './request-change.component.html',
  styleUrls: ['./request-change.component.scss']
})
export class RequestChangeComponent implements OnInit, OnChanges {

  @Input() itemDetails = {};
  @Output() hasEdited = new EventEmitter();

  requestChangeDetails: any = {};
  requestChangeFields = constants.requestChangeFields;
  requestChangeFormFields = constants.requestChangeFormFields;
  requestChangeAttrs = [];
  requestChangeMandatoryFields = constants.requestChangeMandatoryFields;
  invalidFields = [];

  constructor(
    public fb: FormBuilder,
    public itemPlanDetailService: ItemPlanDetailService
  ) {
    //this.buildForm();
  }

  ngOnInit() {
    if (Object.keys(this.itemDetails).length > 0) {
      this.buildForm(this.itemDetails);
      this.populateForm(this.itemDetails);
    }
  }

  ngOnChanges(changes) {
    if (changes.itemDetails.currentValue && Object.keys(changes.itemDetails.currentValue).length > 0) {
      this.buildForm(changes.itemDetails.currentValue);
      this.populateForm(changes.itemDetails.currentValue);
    }
  }

  buildForm = details => {
    const presentation = this.getDDValue(details[constants.presentation], constants.typeDropDown[constants.presentation]);
    const formFieldsBasedOnPresentation = this.checkCndtnlFields(constants.presentationTypeFields[presentation] || [], presentation, details);
    this.requestChangeDetails = this.fb.group(constants.requestChangeFormFields);
    // TODO: change requestChangeAttrs here
    this.requestChangeAttrs = [...constants.requestChangeAttrs];
    this.requestChangeAttrs.splice(1, 0, ...formFieldsBasedOnPresentation);
  }

  checkCndtnlFields = (arr, presentation, details) => {
    switch (presentation) {
      case constants.kitSelectValue:
        if (constants.conditionalFields[constants.kitSelectValue].value === this.getDDValue(details[constants.kitType], constants.typeDropDown[constants.kitType])) {
          arr = [...constants.conditionalFields[constants.kitSelectValue].fields, ...arr];
        }
        break;

      default:
        arr = [...arr];
    }

    return arr;
  }

  populateForm = details => {
    Object.keys(details).forEach(field => {
      let value = Array.isArray(details[field]) ? JSON.parse(JSON.stringify(details[field])) : details[field];
      if (
        (value !== null || value !== undefined) &&
        this.requestChangeDetails.controls[field]
      ) {
        this.requestChangeDetails.controls[field].setValue(value);
      }
    });

    this.checkFormValidity();
  }

  checkFormValidity = () => {
    this.invalidFields = [];
    this.requestChangeAttrs.forEach(({ formControlName: field }) => this.isFieldInvalid(field));
  }

  ipChanged = field => {
    if (this.requestChangeDetails.controls[field].value !== 'null') {
      this.hasEdited.emit();
    }
    this.convertToType(field);
    this.isFieldInvalid(field);
  }

  ddValueChange = (value, field, ddKey) => {
    if (value !== 'null') {
      this.hasEdited.emit();
    }

    const presentation = this.getDDValue(this.itemDetails[constants.presentation], constants.typeDropDown[constants.presentation]);

    const ddvalues = this.requestChangeDetails.controls[field].value;

    ddvalues.forEach(opt => {
      opt.IsSelected = false;
      if (opt[ddKey] === value.trim()) {
        opt.IsSelected = true;
      }
    });
    this.requestChangeDetails.controls[field].setValue(ddvalues);

    // empty the current presentation fields and the change the type
    if (field === constants.presentation) {
      const formFieldsBasedOnPresentation = constants.presentationTypeFields[presentation] || [];
      formFieldsBasedOnPresentation.forEach(({ formControlName: fieldToChange }) => {
        if (constants.typeDropDown[fieldToChange]) {
          const ddValues = this.requestChangeDetails.controls[fieldToChange].value;

          ddValues.forEach(opt => {
            opt.IsSelected = false;
          });
          this.requestChangeDetails.controls[fieldToChange].setValue(ddValues);
        } else {
          this.requestChangeDetails.controls[fieldToChange].setValue('');
        }
      });
      const formValue = this.requestChangeDetails.value;
      this.buildForm(this.requestChangeDetails.value);
      this.populateForm(formValue);
    }

    if (field === constants.kitType) {
      const formValue = this.requestChangeDetails.value;
      this.buildForm(this.requestChangeDetails.value);
      this.populateForm(formValue);
    }


    this.isFieldInvalid(field);

  }

  getChangedRequestValues = () => {
    const formValues = { [constants.itemPlanId]: this.itemDetails[constants.itemPlanId] };
    this.requestChangeAttrs.forEach(({ formControlName: field }) => { formValues[field] = this.requestChangeDetails.controls[field].value });
    return { formValues, changedFields: this.determineChangedFields() };
  }

  determineChangedFields = () => {
    const changedFields = {};
    this.requestChangeAttrs.forEach(({ formControlName: field }) => {
      let hasChanged = false;
      if (Array.isArray(this.itemDetails[field])) {
        hasChanged = this.getDDValue(this.itemDetails[field], constants.typeDropDown[field]) !== this.getDDValue(this.requestChangeDetails.controls[field].value, constants.typeDropDown[field])
      } else {
        if (this.emptyField(this.itemDetails[field], '') && this.emptyField(this.requestChangeDetails.controls[field].value, '')) {
          hasChanged = false;
        } else {
          hasChanged = this.itemDetails[field] !== this.requestChangeDetails.controls[field].value;
        }
      }

      if (hasChanged) {
        changedFields[field] = this.requestChangeDetails.controls[field].value;
      }
    });
    return changedFields;
  }

  isFieldInvalid = field => {
    const presentation = this.getDDValue(this.requestChangeDetails.controls[constants.presentation].value, constants.typeDropDown[constants.presentation]);
    const presentationBasedFields = constants.presentationTypeFields[presentation].map(({ formControlName }) => formControlName) || [];
    let formFieldsBasedOnPresentation = this.checkCndtnlFields(presentationBasedFields, presentation, this.requestChangeDetails.value) || [];
    if (formFieldsBasedOnPresentation[0] && typeof formFieldsBasedOnPresentation[0] === 'object') {
      formFieldsBasedOnPresentation = formFieldsBasedOnPresentation.map(({ formControlName }) => formControlName);
    }
    if (
      [...constants.requestChangeMandatoryFields, ...formFieldsBasedOnPresentation].indexOf(field) > -1
    ) {
      const idx = this.invalidFields.indexOf(field);
      if (idx !== -1) {
        this.invalidFields.splice(idx, 1);
      }
      if (
        this.requestChangeDetails.controls[field] &&
        this.emptyField(
          this.requestChangeDetails.controls[field].value,
          Array.isArray(this.requestChangeDetails.controls[field].value)
            ? constants.typeDropDown[field]
            : ''
        )
      ) {
        this.invalidFields.push(field);
      }
    }
  }

  getDDValue = (arr, key) => {
    if (arr) {
      const displayOption = arr.filter(opt => opt.IsSelected);
      return displayOption[0] ? displayOption[0][key] : '';
    }
  }

  saveChangeRequest = () => {

  }

  convertToType = field => {
    if (constants.requestChangeNumberFields.indexOf(field) > -1) {
      const value = this.requestChangeDetails.controls[field].value;
      if (typeof value !== 'number' && !this.emptyField(value, '')) {
        this.requestChangeDetails.controls[field].setValue(parseInt(value));
      }
      return;
    }
    if (constants.requestChangeFloatFields.indexOf(field) > -1) {
      const value = this.requestChangeDetails.controls[field].value;
      if (value === '.') {
        this.requestChangeDetails.controls[field].setValue(null);
        return;
      }
      if (typeof value !== 'number' && !this.emptyField(value, '')) {
        this.requestChangeDetails.controls[field].setValue(parseFloat(value));
      }
      return;
    }
  }

  emptyField = (value, ddKey) => {
    if (Array.isArray(value)) {
      value = this.getDDValue(value, ddKey);
    }
    return [null, '', undefined].indexOf(value) > -1;
  }

}
