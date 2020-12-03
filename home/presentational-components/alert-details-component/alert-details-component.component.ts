import {
  Component,
  OnInit,
  Input,
  ViewEncapsulation,
  Output,
  EventEmitter,
  OnChanges,
  ViewChild
} from '@angular/core';
import * as constants from '../../constants';
import {
  exportToExcel,
  buildExportData
} from '../../../../utils/excel-functions';
import moment from 'moment';
import { HomeModuleService } from '../../home-module.service';
import { SearchCriteriaComponent } from '../../presentational-components/search-criteria/search-criteria.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'pfep-alert-details-component',
  templateUrl: './alert-details-component.component.html',
  styleUrls: ['./alert-details-component.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AlertDetailsComponent implements OnInit, OnChanges {
  @ViewChild(SearchCriteriaComponent)
  searchCriteriaComponent: SearchCriteriaComponent;
  @Input() dropDownOptions: Array<object> = [];
  @Input() tableData: Array<Object> = [];
  @Input() title: string;
  @Input() tableColumns: Array<object>;
  @Input() tableKey: Array<string>;
  @Input() dropDownData: object = {};
  @Input() currentScreen = '';
  @Input() initialSearchCriteria = {};
  @Input() dataEdited = false;
  @Input() dataFetching = false;

  @Output() navigateLinkClicked = new EventEmitter();
  @Output() criteriaChanged = new EventEmitter();
  @Output() recordEdited = new EventEmitter();

  searchInputs = {
    inputs: this.currentScreen ? constants.alertDetailsInputs[this.currentScreen] : [],
    dropDowns: this.currentScreen ? constants.alertDetailsDropDowns[this.currentScreen] : [],
    wildCards: this.currentScreen ? JSON.parse(JSON.stringify(constants.alertDetailsWildCards[this.currentScreen])) : []
  };
  tableHeight = '500px';
  showSnoozeCalendar = false;
  snoozeUntilDate: any = new Date();
  minDate = new Date();
  rowSelectedIdx: number;
  uniqueKey: string;
  selectedRecordData: any = {};
  selectedDate: any = '';
  snoozeDateValue = '';
  sortMode = 0;
  moment = moment;
  snoozeEnabled: boolean = false;

  constructor(
    public homeService: HomeModuleService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.tableHeight =
      this.calculateHeight('.alert-details-component-table') + 'px';
  }

  ngOnChanges(changes) {
    if(changes.currentScreen) {
      this.resetSearchInputs();
    }
    if (this.initialSearchCriteria) {
      this.buildSearchForm(this.initialSearchCriteria);
    }
    // this.tableHeight =
    //   this.calculateHeight('.alert-details-component-table') + 'px';
  }

  resetSearchInputs = () => {
    this. searchInputs = {
      inputs: this.currentScreen ? constants.alertDetailsInputs[this.currentScreen] : [],
      dropDowns: this.currentScreen ? constants.alertDetailsDropDowns[this.currentScreen] : [],
      wildCards: this.currentScreen ? JSON.parse(JSON.stringify(constants.alertDetailsWildCards[this.currentScreen])) : []
    };
  }

  buildSearchForm = sC => {
    // TODO: find a better way to do this
    const { inputs, dropDowns, wildCards } = this.searchInputs;

    // Inputs

    inputs.forEach(ip => {
      ip['valueToSet'] = sC[ip.name];
    });

    // Drop downs
    dropDowns.forEach(dd => {
      dd.options = this.dropDownData[dd.APIMap] ? this.dropDownData[dd.APIMap] :dd.options;
      dd['valueToSet'] = sC[dd.name];
    });

    wildCards.forEach(wC => {
      const wildCardSelectedData =
        wC.wildCardConfig.isMultiSelect ? sC[constants.wildCardCollectionKeys[wC.name]] : sC[wC.name] || '' ;
      wC.wildCardConfig.selectedData = wC.wildCardConfig.isMultiSelect ? [...wildCardSelectedData] : wildCardSelectedData;
    });

    this.searchInputs = { inputs, dropDowns, wildCards };
  }

  selectedSegment = event => {
    this.homeService.getWarehouseListData(event).subscribe((data: any) => {
      this.searchInputs.dropDowns[1] = {
        ...this.searchInputs.dropDowns[1],
        options: data,
        valueToSet: ''
      };
      this.searchInputs.wildCards.map((wC, idx) => {
        this.searchInputs.wildCards[idx] = { ...this.searchInputs.wildCards[idx] };
        this.searchInputs.wildCards[idx].wildCardConfig.selectedData = this.searchInputs.wildCards[idx].wildCardConfig.isMultiSelect ?  [] : '';
      })
      this.searchCriteriaComponent.resetCriteria(
        'FACILITY_ID',
        'WORK_CENTER_ID',
        'ITEM_ID'
      );
    });
  }

  calculateHeight = identifier => {
    const $el = document.querySelector(identifier);
    if (!$el) {
      return;
    }
    const rect = $el.getBoundingClientRect();
    const $routeContainer = document.querySelector('.route-content');
    const paddingTop = window
      .getComputedStyle($routeContainer, null)
      .getPropertyValue('padding-top')
      .slice(0, -2);
    const calculatedHeight = Math.round(
      Math.min(
        window.screen.availHeight,
        window.innerHeight,
        window.screen.height
      ) -
        (window.pageYOffset + rect.top + Number(paddingTop) + 60)
    );

    return calculatedHeight < 350 ? 350 : calculatedHeight;
  }

  onCriteriaChange = criteria => {
    this.criteriaChanged.emit(this.getEffectiveSearchCriertia(criteria));
  }

  sortTable = (column, type) => {
    this.sortMode = this.sortMode === 0 ? 1 : this.sortMode;
    switch (type) {
      case 'date':
        this.sortColumnByDate(column);
    }
    this.sortMode = this.sortMode * -1;
  }

  sortColumnByDate = col => {
    this.tableData.sort((a, b) => {
      const time1 = moment(a[col]).unix() * 1000;
      const time2 = moment(b[col]).unix() * 1000;
      return this.sortMode === 1 ? time1 - time2 : time2 - time1;
    });
  }

  handleSnooze = e => {
    this.snoozeEnabled = e.checked;
    this.criteriaChanged.emit(this.getEffectiveSearchCriertia(this.initialSearchCriteria));
  }

  getEffectiveSearchCriertia = criteria => ({...criteria, snoozed: this.snoozeEnabled});

  formatDate = date => {
    return moment(date).format('MM-DD-YYYY');
  }

  exportExcel = () => {
    this.homeService
      .exportExcel(
        {
          ...this.initialSearchCriteria,
          EFF_FROM_DATE: null,
          EFF_TO_DATE: null
        },
        this.currentScreen
      )
      .subscribe(res => {
        if (res['StatusType'].toUpperCase() === 'SUCCESS') {
          // window.location.href = res['FilePath'];
          window.open(res['FilePath'], '_blank');
        } else if (res['StatusType'].toUpperCase() === 'FAILURE') {
          this.displayMessage('danger', res['Message']);
        }
      });
  }

  checkBoxClicked = (event, field, recordData) => {
    if (field === 'SNOOZE_IND') {
      this.prepareSnoozeData(event, field, recordData);
      recordData.HOT_IND = false;
      this.snoozeDateValue = recordData.SNOOZE_UNTIL_DATE;
      if (!event.target.checked) {
        this.prepareEditedData(event, field, recordData);
      }
    } else {
      recordData.SNOOZE_IND = false;
      this.prepareEditedData(event, field, recordData);
    }
  }

  navigateToScreen = (e, field, value, record) => {
    e.preventDefault();
    let communicationData = {};
    switch (this.currentScreen) {
      case constants.pfepERPAlert:
      case constants.pfepShortage: 
        communicationData = {
          planIdFromParent: value,
          parentScreenPath: `/home/${
            constants.pathScreenParamMap[this.currentScreen]
          }`,
          isChild: true,
          selectedRecord: record
        };
        break;

      case constants.pfepRequired:
        communicationData = {
          parent: '/home/pfep-required',
          replaceParent: false,
          data: {
            ORG_ID: record['ORG_ID'],
            ITEM_ID: record['ITEM_ID']
          }
        }
        break;

      default:
      communicationData = {};
      break;
    }

    if (Object.keys(communicationData).length > 0) {
      this.navigateLinkClicked.emit(communicationData);
    }
  }

  prepareEditedData = (event, field, recordData, isSnooze = false) => {
    const { index, uniqueKey } = this.fetchIndex(recordData);
    this.rowSelectedIdx = index;
    this.uniqueKey = uniqueKey;
    const altField = field === 'HOT_IND' ? 'SNOOZE_IND' : 'HOT_IND';
    const alteredFields = {
      [field]: event.target.checked,
      [altField]: recordData[altField] === true ? false : recordData[altField]
    };
    if (isSnooze && event.target.checked) {
      alteredFields[constants.snoozeUntilDate] = this.formatDate(
        this.snoozeUntilDate
      );
    } else {
      alteredFields[constants.snoozeUntilDate] = '';
    }
    this.snoozeUntilDate = '';
    this.tableData[index] = { ...this.tableData[index], ...alteredFields };
    this.recordEdited.emit({
      [uniqueKey]: this.tableData[index]
    });
  }

  prepareSnoozeData = (event, field, recordData) => {
    if (event.target.checked) {
      this.showSnoozeCalendar = true;
    }

    this.selectedRecordData = { event, field, recordData };
  }

  calendarClosed = () => {
    this.selectedDate = '';
  }

  dateSelected = e => {
    this.selectedDate = e;
  }

  saveDate = () => {
    this.showSnoozeCalendar = false;
    this.snoozeUntilDate = this.selectedDate;
    this.selectedDate = '';
    const { event, field, recordData } = this.selectedRecordData;
    this.prepareEditedData(event, field, recordData, true);
  }

  fetchIndex = recordData => {
    let index = -1,
      uniqueKey = '';
    if (this.tableKey.length > 0) {
      index = this.tableData.findIndex(rec => {
        const match = [];
        let currentKey = '';
        this.tableKey.forEach(key => {
          if (rec[key] === recordData[key]) {
            match.push(true);
            currentKey += recordData[key];
          }
        });
        if (this.tableKey.length === match.length) {
          uniqueKey = currentKey;
          return true;
        }
      });
    } else {
      index = this.tableData.indexOf(recordData);
    }

    return { index, uniqueKey };
  }

  displayMessage = (type, message) => {
    type === 'danger'
      ? this.toastr.error(message)
      : this.toastr.success(message, '', { disableTimeOut: false });
  }
}
