import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';
import { AdministrativeService } from '../../administrator.service';
import { NgForm } from '@angular/forms';
import { AbcConfig } from '../../model/abc-config';
import { PfepShortage } from '../../model/pfep-shortage';
import { DemandGap } from '../../model/demand-gap';
import { HomeModuleService } from 'src/app/modules/home/home-module.service';

@Component({
  selector: 'pfep-add-configuration',
  templateUrl: './add-configuration.component.html',
  styleUrls: ['./add-configuration.component.scss']
})
export class AddConfigurationComponent implements OnInit, OnChanges {
  configDetails: any;
  @Input() display;
  @Input() configurationFields;
  @Input() type;
  @Output() displayChange = new EventEmitter();
  @Output() addConfig = new EventEmitter();
  @Input() resultArray;
  fromCharCode: Number = 65;
  object: any;
  orgIdList = [];
  maximumPercent: Number;
  isInValidPercent: Boolean = false;
  piecePercent: Boolean = false;
  isMinorMax: boolean;

  constructor(
    private adminService: AdministrativeService,
    private homeService: HomeModuleService
  ) { }

  ngOnInit() {
    console.log(this.resultArray);
    console.log(this.configurationFields, 'feilds');
  }

  setObject(key) {
    switch (key) {
      case 'PFEP_SHORTAGE':
        this.object = new PfepShortage();
        break;
      case 'DEMAND_GAPS':
        this.object = new DemandGap();
        break;
      case 'ABC_CODE_DETERMINATION':
        this.object = new AbcConfig();
        break;
    }
  }

  ngOnChanges() {
    this.setObject(this.type);
    this.getCode();
    this.getAllOrgId();

    console.log(this.configurationFields, 'feilds');
  }

  getFacilitybyOrg(orgid) {
    this.homeService.getWarehouseListData(orgid).subscribe((res: any) => {
      this.configurationFields[1].options = res;
    });
  }

  getAllOrgId() {
    this.adminService.getAllOrg().subscribe((res: any) => {
      this.configurationFields[0].options = res;
    });
  }

  save(configurationForm: NgForm) {
    const post = {
      DataType: this.type,
      DESCRIPTION: this.object
    };
    // this.adminService.saveConfigDetails(post).subscribe((data) => console.log(data));
    this.addConfig.emit(post);
    this.onClose();
  }

  getCode() {
    if (this.type === 'ABC_CODE_DETERMINATION') {
      if (this.object.FACILITY_ID && this.object.ORG_ID) {
        const codeKey = this.resultArray.filter(
          obj =>
            obj.ORG_ID === this.object.ORG_ID &&
            obj.FACILITY_ID === this.object.FACILITY_ID
        ).length;
        this.object.ABC_CODE = String.fromCharCode(this.fromCharCode + codeKey);
      }
    }
  }
  clearFields(col) {
    if (col.key === 'ORG_ID' || col.key === 'FACILITY_ID') {
      if (col.key === 'ORG_ID') {
        this.getFacilitybyOrg(this.object.ORG_ID);
      }
      this.object.PERCENT_EXTENDED_COST = null;
      this.object.PIECE_PRICE = null;
    } else if (col.key === 'METHODOLOGY' && this.object.METHODOLOGY === 'P') {
      this.object.PERCENT_EXTENDED_COST = null;
    } else if (col.key === 'METHODOLOGY' && this.object.METHODOLOGY === 'E') {
      this.object.PIECE_PRICE = null;
    }
    this.getCode();
    if (this.type === 'ABC_CODE_DETERMINATION') {
      this.setMethodology(col);
    }
  }

  setMethodology(col) {
    const codeKey = this.resultArray.find(
      obj =>
        obj.ORG_ID === this.object.ORG_ID &&
        obj.FACILITY_ID === this.object.FACILITY_ID
    );
    if (codeKey) {
      this.object.METHODOLOGY = codeKey.METHODOLOGY;
      this.configurationFields[3].disable = true;
    } else {
      this.configurationFields[3].disable = false;
    }
  }

  calculateMax(col, numberType) {
    if (this.object[col.key] && col.type === 'number') {
      const value =
        numberType === 'integer'
          ? parseInt(this.object[col.key])
          : parseFloat(this.object[col.key]);
      this.object[col.key] = !isNaN(value) ? value : '';
    }
    if (
      this.type === 'ABC_CODE_DETERMINATION' &&
      (col.key === 'PERCENT_EXTENDED_COST' || col.key === 'PIECE_PRICE')
    ) {
      const selectedArr = this.resultArray.filter(
        obj =>
          obj.ORG_ID === this.object.ORG_ID &&
          obj.FACILITY_ID === this.object.FACILITY_ID
      );
      if (col.key === 'PERCENT_EXTENDED_COST') {
        this.maximumPercent =
          selectedArr.length > 0 ? this.sumOfCost(selectedArr) : 0;
        this.isInValidPercent =
          +this.object.PERCENT_EXTENDED_COST + +this.maximumPercent > 100;
      }
      if (selectedArr.length && col.key === 'PIECE_PRICE') {
        if (
          +this.object.PIECE_PRICE >
          selectedArr[selectedArr.length - 1].PIECE_PRICE
        ) {
          this.piecePercent = true;
        } else {
          this.piecePercent = false;
        }
      }
    }
    this.isMinorMax =
      +this.object[col.key] < col.min || +this.object[col.key] > col.max;
    this.object = { ...this.object };
  }

  sumOfCost(arr) {
    return arr
      .map(item => parseInt(item.PERCENT_EXTENDED_COST))
      .reduce((prev, next) => prev + next);
  }

  onClose() {
    this.displayChange.emit(false);
  }
}
