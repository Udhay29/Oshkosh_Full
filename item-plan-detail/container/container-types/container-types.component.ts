import { Component, OnInit, ViewEncapsulation, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import * as constants from '../../constants';

@Component({
  selector: 'pfep-container-types',
  templateUrl: './container-types.component.html',
  styleUrls: ['./container-types.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContainerTypesComponent implements OnInit, OnChanges {

  constructor() { }

  standardContainerData = {
    [constants.standardContainers]: [],
    [constants.standardRacks]: []
  };

  bulkContainerData = {
    [constants.bulkContainers]: [],
    [constants.bulkRacks]: []
  };
  bulkSelectValue = constants.bulkSelectValue;
  @Output() isValueUpdated = new EventEmitter<any>();
  @Input() containerData = {};
  @Input() isEditable = false;
  @Input() containerToSelect: any = {};
  @Input() fitmentSaveFields = {};

  shouldShowBulkCtrHeading = true;
  @Input() containerSelected: Function = () => { };
  @Input() customContainerSelected: Function = () => { };

  ngOnInit() {
    this.standardContainerData = {
      [constants.standardContainers]: this.containerData[constants.standardContainers] || [],
      [constants.standardRacks]: this.containerData[constants.standardRacks] || []
    };

    this.bulkContainerData = {
      [constants.bulkContainers]: this.containerData[constants.bulkContainers] || [],
      [constants.bulkRacks]: this.containerData[constants.bulkRacks] || []
    };
    this.shouldShowBulkCtrHeading = this.showBulkHeading();
  }

  ngOnChanges(changes) {
    if (changes.containerData) {
      this.standardContainerData = {
        [constants.standardContainers]: changes.containerData.currentValue[constants.standardContainers],
        [constants.standardRacks]: changes.containerData.currentValue[constants.standardRacks]
      };

      this.bulkContainerData = {
        [constants.bulkContainers]: changes.containerData.currentValue[constants.bulkContainers],
        [constants.bulkRacks]: changes.containerData.currentValue[constants.bulkRacks]
      };
      this.shouldShowBulkCtrHeading = this.showBulkHeading();
    }
  }

  showBulkHeading = () => {
    const tempVar = this.standardContainerData[constants.standardContainers];
    return (tempVar === null || tempVar.length === 0);
  }

  isValueChanged(eve) {
    this.isValueUpdated.emit(eve);
  }


}
