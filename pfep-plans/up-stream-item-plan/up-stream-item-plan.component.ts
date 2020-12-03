import {
  Component,
  OnInit,
  Input,
  ViewChild,
  SimpleChanges,
  OnChanges,
  Output, EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import constants from '../pfep-plans-fields';
import { PfepPlanService } from '../pfep-plans.service';
import { CoreServices } from '../../../core/services/core.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'pfep-up-stream-item-plan',
  templateUrl: './up-stream-item-plan.component.html',
  styleUrls: ['./up-stream-item-plan.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UpStreamItemPlanComponent implements OnInit {
  @Input() data;
  @Input() feilds;
  @Input() isEditable;
  @Input() orgId;
  @Output() public save = new EventEmitter<any>();
  @Output() public isEdited = new EventEmitter<any>();
  // @Output() rowClick = new EventEmitter<any>();
  selectedDataRow: any = {};
  maxDate = new Date();
  showSnoozeCalendar = false;
  searchFieldResults = {};
  valid: any;
  requiredUpStreamPlansFields = constants.requiredUpStreamPlansFields;
  ddValues: any = {
    [constants.MFP]: []
  };

  constructor(private pfepPlansService: PfepPlanService, public toastr: ToastrService, public coreService: CoreServices) { }
  ngOnInit() {
    if (!this.isEditable) {
      this.feilds.forEach(field => {
        field.isEdit = false;
      });
    }
  }
  saveUpstream() {
    this.valid = this.data.every(e => e.CONTAINER_QTY !== '.');
    if (this.valid) {
      const saveObj = [];
      this.data.forEach(element => {
        if (element['isEdit']) {
          saveObj.push(element);
        }
      });
      this.save.emit(saveObj);
    }
  }
  displayError(data, field) {
    return (data['EXPIRE_DATE'] === null && field === 'EFFECTIVE_DATE') ? true : false;
  }
  editRow(index) {
    if (this.data[index]) {
      this.data[index]['isEdit'] = true;
      this.isEdited.emit(true);
    }
  }

  focusItem(data) {
    console.log('me', data);
  }
  formatDate(data) {
    if (data !== '') {
      return new Date(data);

    } else {
      return '';
    }
  }

  cellClikedToEdit = (e, col, rowData) => {
    if(!col.isEdit || e.srcElement.className.includes('form-control')) {
      e.stopPropagation();
      return;
    }

    if(col.field === constants.MFP) {
      this.coreService.showLoader();
      this.pfepPlansService.fetchMFPListByBranch(this.orgId, rowData['FACILITY_ID']).subscribe(res => {
        if(res.status === 200 && res.body ) {
          this.ddValues[constants.MFP] = res.body;
          if(this.ddValues[constants.MFP].length === 0) {
            this.toastr.error("No Material Flow Plans found");
          }
        } else {
          this.toastr.error('Failed to fetch MFP List');
        }

        this.coreService.hideLoader();
      })
    }
  }

  ddChanged = (e, field, rowData) => {
    this.setValueToRow(rowData, field, e.target.value);
  }

  // Search field related functions



  searchFieldFetch = (field, value, rowData) => {
    this.pfepPlansService
      .getSearchFieldData(
        constants.searchFieldAttributes[field]['key'],
        constants.searchFieldAttributes[field]['API'],
        {
          mtrlFlowPlanID: value,
          orgID: this.orgId,
          facilityID: rowData['FACILITY_ID']
        }
      )
      .subscribe(res => {
        const results = res as Array<any>;
        if (!res || (Array.isArray(res) && res.length === 0)) {
          this.toastr.error('There are no results with the current term');
        }
        this.searchFieldResults[field] = this.alterSearchFieldResults(
          [...results],
          constants.searchFieldAttributes[field]['key'],
          constants.searchFieldAttributes[field]['displaykey'],
          constants.searchFieldAttributes[field]['displayOrder']
        );
      });
  }
  searchFieldOptSelected = (field, rowData, value) => {
    if (value === this.data[field]) {
      this.searchFieldResults[field] = [...[]];
      return;
    }
    this.setValueToRow(rowData, field, value);
  }

  searchfieldBlurred = (key, rowData, e) => {
    if (e === 'unset') {
      this.setValueToRow(rowData, key, '');
    } else {
      //this.removeFromInvalid(key);
    }
  }

  searchfieldEmptied = field => {
    // Plcaeholder function to add code if needed later

  }

  searchfieldTyping = field => {
    // Plcaeholder function to add code if needed later
  }

  alterSearchFieldResults = (results, key, displayKey, displayOrder) => {
    results = results.map(res => {
      const opt = { displayValue: '', value: '' };
      if (displayOrder) {
        opt.displayValue = `${res[key]}`;
        displayOrder.map(field => {
          if (field === constants.superMarketInd) {
            opt.displayValue += ' - ' + (res[field] ? 'Y' : 'N');
            return;
          }
          opt.displayValue += ' - ' + res[field];
        });
      } else {
        opt.displayValue = `${res[key]} - ${res[displayKey]}`;
      }
      opt.value = res[key];
      return { ...opt };
    });
    return [...results];
  }

  setValueToRow = (row, field, value) => {
    let idx = this.getRowIndex(row);
    this.data[idx][field] = value;
    this.editRow(idx);

  }

  isFieldInvalid = (field, row) => row[field] ? false : true;

  removeFromInvalid = field => {
    // Plcaeholder function to add code if needed later
  }

  getRowIndex = row => {
    return this.data.findIndex(rec => {
      let isEqual = true;
      constants.upStreamPlanUniqueFields.forEach(field => {
        if (row[field] !== rec[field] && isEqual) {
          isEqual = false;
        }
      });
      return isEqual;
    })
  }
}
