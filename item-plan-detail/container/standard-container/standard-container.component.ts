import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import * as constants from '../../constants';
import { ItemPlanDetailService } from '../../item-plan-detail.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'pfep-standard-container',
  templateUrl: './standard-container.component.html',
  styleUrls: ['./standard-container.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StandardContainerComponent implements OnInit, OnChanges {

  constructor(private itemPlanDetailService: ItemPlanDetailService) { }
  standardContainersColumns: Array<any> = constants.standardContainersColumns;
  containerValues: Array<any> = [];
  rackColumns: Array<any> = constants.standardContainerRackColumns;
  racks: Array<any> = [];
  showCustomContainerPopup = false;
  customContainers: any = [];
  custContainerSearch = '';
  containerCode: string = constants.containerCode;
  containerId: string = constants.containerId;
  ctrDimHeight = constants.ctrDimHeight;
  ctrDimWidth = constants.ctrDimWidth;
  ctrDimLength = constants.ctrDimLength;
  selectedCustContainer = '';
  custCtrSearchEmpty = false;
  fitment_qty_values = {};
  Object: any = Object;
  enableFitment = false;
  containerOrder = [];
  reOrderContainerPopup = false;
  ctrOrderChanged = false;
  reOrderAccess = false;

  @Input() containerData = {};
  @Input() containerToSelect = '';
  @Input() fitmentSaveFields = {};
  @Input() isEditable = false;
  @Output() isEdited = new EventEmitter<any>();
  @Input() containerSelected: Function = () => { };
  @Input() customContainerSelected: Function = () => { };

  ngOnInit() {
    this.containerValues = this.containerData[constants.standardContainers];
    this.containerValues.forEach(val => {
      this.fitment_qty_values[val[this.containerId]] =
        val[constants.fitmentQty];
    });
    this.racks = this.containerData[constants.standardRacks];
    this.reOrderAccess = this.itemPlanDetailService.getReOrderAccess();
    this.setCtrOrder();
  }

  ngOnChanges(changes) {
    this.containerValues =
      changes.containerData.currentValue[constants.standardContainers];
    this.racks = changes.containerData.currentValue[constants.standardRacks];
    setTimeout(() => {
      if (this.containerValues !== null) {
        this.selectRecCtrByDefault();
      }
    });
    this.setCtrOrder();
  }

  selectRecCtrByDefault = () => {
    const recCtr = this.containerValues.filter(
      ctr => ctr[constants.containerId] === this.containerToSelect
    )[0];
    if (recCtr) {
      this.selectContainer(recCtr);
    }
  }
  selectCustContainer = () => {
    this.showCustomContainerPopup = false;
    this.customContainerSelected(this.selectedCustContainer);
  }

  changed(param) {
    this.isEdited.emit(true);
    this.selectedCustContainer = param;
  }

  searchForContainers = () => {
    this.custCtrSearchEmpty = false;
    this.itemPlanDetailService
      .searchForContainers({ [this.containerCode]: this.custContainerSearch })
      .subscribe(res => {
        this.customContainers = res.body['SearchRecords'];
        this.custCtrSearchEmpty =
          res.body['StatusType'] === 'SUCCESS'
            ? !this.customContainers || this.customContainers.length === 0
              ? true
              : false
            : true;
      });
  }

  selectContainer = containerValue => {
    this.isEdited.emit(true);
    this.containerSelected('standard', containerValue);
  }

  custCtrSearchChange = e => {
  }

  stdCtrIpChanged = (e, key, containerId) => {
    const value = e.target.value.trim();
    if (key === constants.fitmentQty && value) {
      if (value === '.') {
        this.fitment_qty_values[containerId] = null;
        e.target.value = null;
      } else {
        if (value.indexOf('.') > -1) {
          this.fitment_qty_values[containerId] = parseFloat(value);
        } else {
          this.fitment_qty_values[containerId] = parseInt(value);
        }
      }
    }
    if (this.fitment_qty_values[containerId]) { this.enableFitment = true; }
  }

  saveFitmentValues = () => {
    let fitmentSaveValues = {};
    const prepareFitmentPostData = () => {
      const obj = {};
      for (const ctr in this.fitment_qty_values) {
        obj[ctr] = {
          [constants.containerId]: ctr,
          [constants.fitmentQty]: this.fitment_qty_values[ctr]
        };
      }
      fitmentSaveValues = { ...obj };
    };

    const postData = this.fitmentSaveFields;
    prepareFitmentPostData();
    postData['CONTAINER_USAGE_DETAILS'] = Object.values(fitmentSaveValues);
    this.itemPlanDetailService.saveFitmentValues(postData).subscribe(res => {
      let type = 'error',
        msg = 'Unable to save. Please try again.';
      if (res.status === 200) {
        type = res.body['StatusType'] === 'SUCCESS' ? 'success' : 'error';
        msg =
          res.body['Message'] ||
          (type === 'success'
            ? 'Saved successfully'
            : 'Unable to save. Please try again.');

        if (type === 'success') {
          this.enableFitment = false;
        }
      }
      this.itemPlanDetailService.displayMessage(type, msg);
    });
  }

  changeCtrOrder = () => {
    this.reOrderContainerPopup = true;
  }

  reOrderPopUpClose = () => {
    this.reOrderContainerPopup = false;
    this.setCtrOrder();
  }

  reOrderCtrs = () => {
    const sortedCtrs = [...Object.assign([], this.containerValues).sort(this.sortCtrs)];
    const buildPostData = () => {
      const postData = { [constants.ctrSID]: [], ...this.itemPlanDetailService.getOrgBranchValues() }
      postData[constants.ctrSID] = sortedCtrs.map(ctr => ctr[constants.ctrSID]);
      return postData;
    }

    this.itemPlanDetailService.saveContainerOrder(buildPostData()).subscribe(res => {
      if (res.status === 200 && res.body && res.body['StatusType'] !== 'FAILURE') {
        this.containerValues = [...sortedCtrs];
        this.sortRacks();
        this.reOrderContainerPopup = false;
        this.itemPlanDetailService.displayMessage('success', 'Containers Re-Ordered Successfully');
      } else {
        this.itemPlanDetailService.displayMessage('error', 'Saving Containers Order has Failed. Please try again.');
      }
    });
  }

  sortRacks = () => {
    this.racks.forEach(rack => {
      rack[constants.rackDetails] = [...rack[constants.rackDetails].sort(this.sortCtrs)];
    });
  }

  sortCtrs = (a, b) => {
    return this.containerOrder.indexOf(a[constants.containerId]) - this.containerOrder.indexOf(b[constants.containerId]);
  }

  orderChanged = e => {
    moveItemInArray(this.containerOrder, e.previousIndex, e.currentIndex);
  }

  setCtrOrder = () => {
    this.containerOrder = this.containerValues.map(ctr => ctr[constants.containerId]);
  }


}
