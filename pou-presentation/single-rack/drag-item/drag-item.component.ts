import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag } from '@angular/cdk/drag-drop';
import { FormGroup, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import * as singleRackConstants from '../single-rack-constants';
import { SharedService } from "./../../../../shared/services/share.service";
import { SingleRackService } from '../single-rack.service';


@Component({
  selector: 'pfep-drag-item',
  templateUrl: './drag-item.component.html',
  styleUrls: ['./drag-item.component.scss']
})
export class DragItemComponent implements OnInit {
  selectedArr: String[];
  replaceValue: String;
  flagString: String = '';
  flag: boolean;
  addItem: {};
  indexNo: number;
  addItemFlag: boolean;
  errMsgFlag: boolean;
  s1WidthHeight: any;
  s2WidthHeight: any;
  s3WidthHeight: any;
  addIndex: number;
  maxWidth: number = 600;
  remnWidth: number[];
  filteredDatas: any[];
  swapArray: number[];
  selectedItem: any;
  idxNo: number;
  fullValue: any;
  addRackItem: any;
  lastItem: any[];
  selectbox: FormGroup;
  shelfCount: any;
  shelfHeight: any;
  shelfName: any;
  chkItemExistFlag: boolean;
  ctrWidthScaleFt = singleRackConstants.ctrWidthScaleFt;
  //TODO: chanhe this according to UOM
  uomConversion = 12;
  saveEnable: any;
  fullValHandStack: any;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    public sharedService: SharedService,
    private singleRackService: SingleRackService) {
    this.flag = true;
    this.errMsgFlag = false;
    this.addItemFlag = false;
    this.filteredDatas = [];
    this.swapArray = [];
    this.remnWidth = [];
    this.lastItem = [];
  }

  @Input() pocDetails: any;
  @Input() set addRackCont(value) {
    if (value) {
      this.addRackItem = value;
    }
  }
  @Output('CallFrPart') CallFrPart: EventEmitter<any> = new EventEmitter();
  @Output() ctrAdded = new EventEmitter();
  @Output() generateSvg = new EventEmitter();
  @Output() eblAddRckBtn = new EventEmitter();
  @Output() rmvDisable = new EventEmitter();


  ngOnChanges(changes) {
    if ('pocDetails' in changes && changes.pocDetails.currentValue !== undefined &&
      changes.pocDetails.currentValue.WorkCenterRack.WorkCenterRackItems !== null
    ) {
      this.singleRackService.addWidthKey(changes.pocDetails.currentValue.WorkCenterRack.WorkCenterRackItems);
      this.singleRackService.addWidthKeyHandStack(changes.pocDetails.currentValue.WorkCenterRack['LEFT_ITEMS']);
      this.singleRackService.addWidthKeyHandStack(changes.pocDetails.currentValue.WorkCenterRack['RIGHT_ITEMS']);
      this.filteredDatas = [...changes.pocDetails.currentValue.WorkCenterRack.WorkCenterRackItems];
      this.saveEnable = JSON.parse(JSON.stringify(this.filteredDatas));
      this.fullValue = changes.pocDetails.currentValue;
      this.fullValHandStack = JSON.parse(JSON.stringify(this.fullValue));
      this.getMaxHeightPerShelf();
      this.shelfName = this.fullValue['WorkCenterRack']['MasterRack']['STORAGE_UNIT_TYPE'];
      this.remWidth();
      this.filteredDatas.forEach((value, index) => {
        this.swapArray.push(index);
      });
    } else if ('pocDetails' in changes && changes.pocDetails.currentValue !== undefined &&
      changes.pocDetails.currentValue.WorkCenterRack.WorkCenterRackItems === null) {
      this.filteredDatas = [];
    }
  }
  ngOnInit() {

  }

  getHandStackItems = () => {
    return { rightItems: this.fullValue['WorkCenterRack']['RIGHT_ITEMS'], leftItems: this.fullValue['WorkCenterRack']['LEFT_ITEMS'] }
  }

  getShelfsvg() {
    const rackValues: any = JSON.parse(JSON.stringify(this.fullValue));
    rackValues.WorkCenterRackItems = JSON.parse(JSON.stringify(this.filteredDatas));
    this.sharedService.setSingelRacksvg(rackValues);
    this.generateSvg.emit(true);
  }
  addKeyForReqFrame() {
    const fd = JSON.parse(JSON.stringify(this.filteredDatas));
    fd.forEach((data, idx) => {
      data.RackItems.forEach((itm, index) => {
        if (typeof itm.IP_STORAGE_UNIT_SID === "undefined") {
          itm.IP_STORAGE_UNIT_SID = 0;
        }
        itm.PLCMNT_LEVEL = idx + 1;
        itm.DISPLAY_ORDER = index + 1;
        itm.PLCMNT_SIDE = null;
      });
    });
    this.filteredDatas = fd;
    this.handStackPlacement('LEFT_ITEMS', 'LEFT');
    this.handStackPlacement('RIGHT_ITEMS', 'RIGHT');
  }

  handStackPlacement(data, side) {
    this.fullValue['WorkCenterRack'][data].forEach(item => {
      item['PLCMNT_SIDE'] = side;
    });
  }

  addHandStack(data) {
    if (this.addRackItem && (this.addRackItem['PRESENTATION_TYPE'] === 'Hand Stack' ||
      this.addRackItem['PRESENTATION_TYPE'] === 'Bag') && (this.fullValue['WorkCenterRack'][data] !== undefined && this.fullValue['WorkCenterRack'][data].length < 20)) {
      this.fullValue['WorkCenterRack'][data].push(this.addRackItem);
      this.CallFrPart.emit();
      this.addRackItem = null;
      this.ctrAdded.emit();
    } else {
      this.toastr.error(this.determineHandStackFitementCause(data));
    }
  }

  determineHandStackFitementCause = data => {

    if (!this.addRackItem) {
      return 'No Item selected.';
    }

    if (this.addRackItem['PRESENTATION_TYPE'] !== 'Hand Stack') {
      return `Item can't be added to Hand Stack`;
    }

    if (this.fullValue['WorkCenterRack'][data].length >= 20) {
      return `Hand Stack exceeds the limit 20`;
    }

  }


  getMaxHeightPerShelf() {
    const rollerHeight = (this.fullValue['WorkCenterRack']['MasterRack']['ROLLERS'] === 'Yes') ? this.fullValue['WorkCenterRack']['MasterRack']['ROLLER_HEIGHT'] : 0;
    const rackHt = this.fullValue['WorkCenterRack']['MasterRack']['UNIT_HEIGHT'] - 15;
    this.shelfHeight = (rackHt / this.fullValue['WorkCenterRack']['WorkCenterRackItems'].length) -
      (this.fullValue['WorkCenterRack']['MasterRack']['SHELF_HEIGHT'] + rollerHeight) - 4;
  }

  getNoOfShelf(data: number) {
    if (this.checkIfItemsExist()) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to remove all items from the shelf?',
        header: 'Confirmation',
        accept: () => {
          this.removeAllItemsInShelf(data);
          this.getMaxHeightPerShelf();
          this.swapArray = [];
          this.filteredDatas.forEach((value, index) => {
            this.swapArray.push(index);
          });
        },
        reject: () => {
          // this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
        }
      });
    } else {
      this.removeAllItemsInShelf(data);
      this.getMaxHeightPerShelf();
    }
  }

  dragStart = () => {
    //debugger;
  }

  checkIfItemsExist() {
    this.filteredDatas.some(data => {
      this.chkItemExistFlag = data['RackItems'].length > 0;
      return data['RackItems'].length > 0;
    })
    return this.chkItemExistFlag;
  }
  removeAllItemsInShelf(data: number) {
    this.filteredDatas = [];
    if (this.filteredDatas.length === 0) {
      for (let i = 0; i < data; i++) {
        this.filteredDatas.push({ 'RackItems': [] });
      }
    }
    this.fullValue['WorkCenterRack']['LEFT_ITEMS'] = [];
    this.fullValue['WorkCenterRack']['RIGHT_ITEMS'] = [];
    this.remWidth();
    this.swapArrayIndex();
    const shelfData = { ...this.pocDetails };
    shelfData.WorkCenterRack.WorkCenterRackItems = this.filteredDatas;
    shelfData.WorkCenterRack['ACTL_NBR_SHELVES'] = data;
    this.sharedService.setSingelRacksvg(shelfData);
    this.generateSvg.emit(true);
    this.rmvDisable.emit();
  }
  dropHandStack(event: CdkDragDrop<any[]>) {
    const outerWidth = this.fullValue['WorkCenterRack']['MasterRack']['UNIT_INNER_WIDTH'];
    this.dragHandStackFunction(event, outerWidth, this.shelfHeight);
  }
  dragHandStackFunction(event: CdkDragDrop<any[]>, width: any, height: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (this.dropCndtHandStack(event)) {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
        this.remWidth();
      } else {
        const errTxt = event.container.data.length >= 20 ? `Hand Stack exceeds the limit 20` :
          `Item can't fit to this HandStack`;
        this.toastr.error(errTxt);
      }

    }
  }
  dropCndtHandStack(event: CdkDragDrop<any[]>) {
    if ((event.item.data['PRESENTATION_TYPE'] === 'Hand Stack' ||
      event.item.data['PRESENTATION_TYPE'] === 'Bag') && event.container.data.length < 20) {
      return true;
    } else {
      return false;
    }
  }
  drop(event: CdkDragDrop<any[]>) {
    const outerWidth = this.fullValue['WorkCenterRack']['MasterRack']['UNIT_INNER_WIDTH'];
    this.dragFunction(event, outerWidth, this.shelfHeight);
  }

  dragFunction(event: CdkDragDrop<any[]>, width: any, height: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (this.checkWidthHeight(event, width, height) && this.dropCndt(event)) {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
        this.remWidth();
      } else {
        this.determineCauseOnDrop(event, width, height);
        // const errTxt = event.item.data['PRESENTATION_TYPE'] === 'Bin' ? `Item can't fit to this hand stack` : 
        // `Item can't fit to this shelf`;
        // this.toastr.error(errTxt);
      }

    }
  }
  determineCauseOnDrop(event, width, height) {
    if (!this.dropCndt(event)) {
      const errTxt = event.item.data['PRESENTATION_TYPE'] === 'Bin' ? `Item can't fit to this hand stack` :
        `Item can't fit to this shelf`;
      this.toastr.error(errTxt);
    } else if (!this.checkWidthHeight(event, width, height)) {
      switch (true) {
        case event.item.data['height'] > height:
          this.toastr.error(`Item can't fit to this shelf. Height of the container exceeds Shelf height`);
          break;
        case event.item.data['height'] === null || event.item.data['width'] === null:
          this.toastr.error(`Width or height not specified for this item`);
          break;
        default:
          this.toastr.error(`Item can't fit to this shelf. Container Width exceeds empty space`);
          break;
      }
    }

  }
  dropCndt(event) {
    if ((event.item.data['PRESENTATION_TYPE'] === 'Bin' && event.container.orientation === 'horizontal') ||
      (event.item.data['PRESENTATION_TYPE'] === 'Hand Stack') ||
      (event.item.data['PRESENTATION_TYPE'] === 'Bag' && event.container.orientation === 'vertical')) {
      return true;
    } else {
      return false;
    }
  }
  remWidth() {
    this.lastItem = [];
    this.filteredDatas.forEach((value, key) => {
      this.lastItem.push({
        'width': Number((this.fullValue['WorkCenterRack']['MasterRack']['UNIT_INNER_WIDTH'] - this.sumWidth(value['RackItems'])).toFixed(2)),
        'IS_EMPTY_ITEM_PLCMNT': true
      });

    });
  }

  sumWidth(arr: any) {
    let a = 0;
    arr.forEach(data => {
      if (data['IS_EMPTY_ITEM_PLCMNT'] === false) {
        a += data.width;
      }
    })
    return a;
  }

  checkWidthHeight(event: any, width: number, height: number) {
    let rackWidth = 0;
    event.container.data.forEach(data => {
      rackWidth += data.width
    })
    rackWidth += event.item.data['width'];
    if (rackWidth > width || event.item.data['height'] > height || event.item.data['width'] === null ||
      event.item.data['height'] === null
    ) {
      return false;
    } else {
      return true;
    }
  }
  delete(event: any, idx: number, index: number) {
    event.stopPropagation();
    var addWdthAftDel = 0;
    const rmItem = JSON.parse(JSON.stringify(this.filteredDatas[idx]['RackItems'][index]));
    const inx = this.getAllIndexes(this.filteredDatas[idx]['RackItems'], this.filteredDatas[idx]['RackItems'][index]);
    for (let i = inx.length - 1; i >= 0; i--) {
      addWdthAftDel += this.filteredDatas[idx]['RackItems'][inx[i]]['width'];
      this.filteredDatas[idx]['RackItems'].splice(inx[i], 1);
    }
    const addWidth = addWdthAftDel +
      this.lastItem[idx]['width'];
    this.lastItem[idx]['width'] = Number(addWidth.toFixed(2));
    this.eblAddRckBtn.emit(rmItem);
  }
  deleteStack(event: any, stack: string, index: number, item: any) {
    event.stopPropagation();
    this.fullValue['WorkCenterRack'][stack].splice(index, 1);
    this.eblAddRckBtn.emit(item);
  }
  getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i + 1)) != -1) {
      indexes.push(i);
    }
    return indexes;
  }
  noReturnPredicate(item: CdkDrag<any[]>) {
    return true;
  }
  swap(event: any, idx: number, item: any, i: number) {
    event.stopPropagation();
    this.swapArray = [];
    this.swapArray.push(idx);
    this.selectedItem = {};
    this.selectedItem = item;
    this.indexNo = i;
    this.idxNo = idx;
  }
  toggleSwap(index: number, idx: number, item: any) {
    const chkWidth1 = item['width'] + this.lastItem[idx]['width'] >=
      this.filteredDatas[this.idxNo]['RackItems'][this.indexNo]['width'];
    const chkWidth2 = this.filteredDatas[this.idxNo]['RackItems'][this.indexNo]['width'] +
      this.lastItem[this.idxNo]['width'] >= item['width'];
    if (chkWidth1 && chkWidth2) {
      this.filteredDatas[this.idxNo]['RackItems'].splice(this.indexNo, 1, item);
      this.filteredDatas[idx]['RackItems'].splice(index, 1, this.selectedItem);
      this.swapArrayIndex();
      this.remWidth();
    } else {
      this.toastr.error(`Width exceeded, can't swap`);
    }
  }
  swapArrayIndex() {
    this.swapArray = [];
    this.filteredDatas.forEach((value, index) => {
      this.swapArray.push(index);
    });
  }

  addContainer(idx: number) {
    if (this.addRackItem) {
      if ((this.addRackItem['width'] !== null && this.addRackItem['height'] !== null) && this.lastItem[idx]['width']
        >= (this.addRackItem['width'] * this.addRackItem['PICK_FACING_QNTY']) &&
        this.heightTypeCheck() && this.addRackItem['PRESENTATION_TYPE'] !== 'Bag') {
        const balWidth = this.lastItem[idx]['width']
          - (this.addRackItem['width'] * this.addRackItem['PICK_FACING_QNTY']);
        this.lastItem[idx]['width'] = Number(balWidth.toFixed(2));
        for (let i = 0; i < this.addRackItem['PICK_FACING_QNTY']; i++) {
          this.filteredDatas[idx]['RackItems'].push(this.addRackItem);
        }
        this.CallFrPart.emit();
        this.addRackItem = null;
      } else {
        this.toastr.error(this.determineCause(idx));
      }
      this.ctrAdded.emit();
    } else {
      this.toastr.error('No Item selected.');
    }
  }

  determineCause = idx => {

    if (typeof this.addRackItem === 'undefined' || (Object.keys(this.addRackItem).length === 0 && this.addRackItem.constructor === Object)){
      return 'No Item selected.';
    }

    if (this.addRackItem['PRESENTATION_TYPE'] === 'Bag') {
      return `Item can't fit to this shelf.`;
    }

    if (this.addRackItem['width'] === null || this.addRackItem['height'] === null) {
      return `Width or height not specified for this item`;
    }

    if (this.lastItem[idx]['width'] < (this.addRackItem['width'] * this.addRackItem['PICK_FACING_QNTY'])) {
      return `Item can't fit to this shelf. Container Width exceeds empty space`;
    }

    if (!this.heightTypeCheck()) {
      return `Item can't fit to this shelf. Height of the container exceeds Shelf height`;
    }


  }

  heightTypeCheck() {
    switch (this.shelfName) {
      case 'Shelf':
        if (this.addRackItem['height'] <= this.shelfHeight) {
          return true;
        } else {
          return false;
        }
    }
  }
}

