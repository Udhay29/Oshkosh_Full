import {
  Component,
  ViewEncapsulation,
  OnInit,
  AfterContentInit,
  ViewChild
} from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HomeModuleService } from '../../home-module.service';
import * as constants from '../../constants';
import { ToastrService } from 'ngx-toastr';
import { SearchCriteriaComponent } from '../../presentational-components/search-criteria/search-criteria.component';
import {
  exportToExcel,
  buildExportData
} from '../../../../utils/excel-functions';
import { CoreServices } from 'src/app/core/services/core.service';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'pfep-missing-data-tables',
  templateUrl: './missing-data-tables.component.html',
  styleUrls: ['./missing-data-tables.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MissingDataTablesComponent implements OnInit, AfterContentInit {
  @ViewChild(SearchCriteriaComponent)
  searchCriteriaComponent: SearchCriteriaComponent;

  searchInputs: any = {
    [constants.weightsDimensions]: {
      inputs: constants.weightsDimensionsInputs,
      dropDowns: [],
      wildCards: constants.weightsDimensionsWildCards
    },
    [constants.packageDetail]: {
      inputs: constants.packageDetailInputs,
      dropDowns: [],
      wildCards: []
    }
  };
  searchCriteria: object = {};
  mDtabsList: Array<object> = [];
  selectedStack: string;
  tableData: Array<object> = [];
  columns: Array<object> = [];
  groupedColumns: object = {};
  tableHeight: Number = 500;
  dataFetching: Boolean = false;
  tableKey = '';
  dataToSave: object = {
    [constants.weightsDimensions]: {},
    [constants.packageDetail]: {}
  };
  selectableRows = false;
  saveEnabled = false;
  completeData = {
    [constants.weightsDimensions]: [],
    [constants.packageDetail]: []
  };
  rows = {
    [constants.weightsDimensions]: 10,
    [constants.packageDetail]: 10
  };
  totalRecords = {
    [constants.weightsDimensions]: 0,
    [constants.packageDetail]: 0
  };
  page = {
    [constants.weightsDimensions]: 1,
    [constants.packageDetail]: 1
  };
  totalpages = {
    [constants.weightsDimensions]: 0,
    [constants.packageDetail]: 0
  };
  saveInProgress = false;
  initialSearchCriteria: any = {};
  hidePaginator = true;
  recordsString = '';

  constructor(
    public homeService: HomeModuleService,
    private toastr: ToastrService,
    public _coreServices: CoreServices,
    public modalService: ModalService,
    public router: Router
  ) {}

  ngOnInit() {
    this.mDtabsList = constants.missingTableTabsList;
    this.selectedStack = this.homeService.getMissingDataScreenParam();
    this.initialSearchCriteria = this.homeService.getAlertDetailSearchData();
    if(this.checkForCriteria()) {
      if (!this.selectedStack) {
        this.selectedStack = constants.weightsDimensions;
      }
      this.selectableRows = true;
      this.setTableKey(this.selectedStack);
      this.searchCriteriaChanged(
        this.initialSearchCriteria.searchCriteria,
        this.selectedStack,
        true
      );
    }
  }

  ngAfterContentInit() {
    this.tableHeight = this.calculateHeight('.missing-data-table');
  }

  checkForCriteria = () => {
    const sC = this.initialSearchCriteria;
    if (
      typeof sC === 'object' &&
      sC !== null &&
      Object.prototype.toString.call(sC) !== '[object Array]' &&
      Object.keys(sC).length === 0
    ) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }

  setTableKey = stack => {
    this.tableKey = constants.uniqueKeys[this.selectedStack];
  }

  getInputsMap(stack) {
    const { inputs, dropDowns, wildCards } = JSON.parse(
      JSON.stringify(constants.inputsMap[stack])
    );
    wildCards.forEach(wC => {
      const isMultiSelect = wC.wildCardConfig.isMultiSelect;
      wC.wildCardConfig.selectedData = isMultiSelect ? [] : '';
    });
    return { inputs, dropDowns, wildCards };
  }

  buildCriteriaForDataFetch = criteria => {
    return {
      ...criteria,
      PageIndex: this.page[this.selectedStack],
      PageSize: this.rows[this.selectedStack]
    };
  }
  buildSearchForm = (data, stack) => {
    // TODO: find a better way to do this
    const { inputs, dropDowns, wildCards } = this.getInputsMap(stack);

    // Inputs
    inputs.forEach(ip => {
      if (this.searchCriteria[this.selectedStack]) {
        ip['valueToSet'] = this.searchCriteria[this.selectedStack][ip.name];
      }
    });

    // Drop downs
    dropDowns.forEach(dd => {
      dd.options = data[dd.APIMap];
      dd['valueToSet'] = this.searchCriteria[this.selectedStack][dd.name];
    });

    wildCards.forEach(wC => {
      const isMultiSelect = wC.wildCardConfig.isMultiSelect;
      const key = isMultiSelect
        ? constants.wildCardCollectionKeys[wC.name]
        : wC.name;
      wC.wildCardConfig.selectedData = isMultiSelect ? [] : '';

      for(let field in wC.wildCardConfig.dependentData) {
        if(this.searchCriteria[this.selectedStack][field]) {
          wC.wildCardConfig.dependentData[field] = this.searchCriteria[this.selectedStack][field];
        }
      } 

      const wildCardConfig = Object.assign(wC.wildCardConfig);
      
      if (this.searchCriteria[this.selectedStack][key]) {
        wildCardConfig.selectedData = this.searchCriteria[this.selectedStack][
          key
        ];
      }
      if (wildCardConfig.selectedData) {
        wC.wildCardConfig.selectedData = wildCardConfig.selectedData;
      }
    });
    this.searchInputs[stack] = { inputs, dropDowns, wildCards };
  }

  buildTableColumns = stack => {
    this.columns = constants.paramTableColumnsMap[stack].columns;
    this.groupedColumns =
      constants.paramTableColumnsMap[stack].groupedColumns || {};
  }

  buildTable = (stack, data) => {
    this.buildTableColumns(this.selectedStack);
    this.completeData[this.selectedStack] =
      data[constants.paramAPIMap[this.selectedStack]] || [];
    // if(this.completeData[this.selectedStack].length > 0) this.completeData[this.selectedStack] = this.completeData[this.selectedStack].slice(0,10);
  }

  buildPaginator = (res, stack) => {
    this.totalRecords[stack] = res['TotalCount'];
    this.totalpages[stack] = res['TotalPageCount'];
  }

  buildTotalRecordsString = () => {
    this.recordsString = '';
    if (this.totalpages[this.selectedStack] === 1) {
      this.recordsString = `Displaying total ${
        this.totalRecords[this.selectedStack]
      } record(s)`;
    } else {
      this.recordsString = `Displaying ${this.rows[this.selectedStack] *
        (this.page[this.selectedStack] - 1) +
        1} - ${Math.min(
        this.rows[this.selectedStack] * this.page[this.selectedStack],
        this.totalRecords[this.selectedStack]
      )} records of
      ${this.totalRecords[this.selectedStack]} records in ${
        this.totalpages[this.selectedStack]
      } pages`;
    }
  }

  selectedSegment(event) {
    this.homeService.getWarehouseListData(event).subscribe(data => {
      this.resetDependentSearchCriteria(data, 'ORG_ID');
    });
  }

  resetDependentSearchCriteria = (data, key) => {
    const dropDowns = [...this.searchInputs[this.selectedStack].dropDowns];
    const wildCards = [...this.searchInputs[this.selectedStack].wildCards];

    const criteriaToReset = [];
    dropDowns.forEach((dd, idx) => {
      if (dd.dependentChange && dd.dependentChange.indexOf(key) > -1) {
        dd.options = data;
        dd.valueToSet = '';
        criteriaToReset.push(dd.valueKey);
        this.searchInputs[this.selectedStack].dropDowns[idx] = { ...dd };
      }
    });

    wildCards.forEach((wC, idx) => {});
    // this.searchInputs.dropDowns[1] = { ...this.searchInputs.dropDowns[1], options: data, valueToSet: '' };
    // this.searchInputs
    // this.searchInputs.wildCards[0].wildCardConfig.selectedData = [];
    this.searchCriteriaComponent.resetCriteria.apply(this, criteriaToReset);
  }

  fetchData = (postData, criteriaChanged) => {
    this._coreServices.showLoader();
    this.dataFetching = true;
    this.homeService[constants.paramGetFunctionMap[this.selectedStack]](
      postData
    ).subscribe(res => {
      this._coreServices.hideLoader();
      this.dataFetching = false;
      this.hidePaginator = false;
      if (criteriaChanged) {
        this.dataToSave[this.selectedStack] = {};
      }
      this.buildSearchForm(res, this.selectedStack);
      this.buildTable(this.selectedStack, res);
      this.buildPaginator(res, this.selectedStack);
      this.buildTotalRecordsString();
      this.updateEditedRecords();
    });
  }

  updateEditedRecords = () => {
    const currentRecords = [...this.completeData[this.selectedStack]];
    // this.dataToSave[this.selectedStack]
    if (Object.keys(this.dataToSave[this.selectedStack]).length > 0) {
      currentRecords.forEach((rec, index) => {
        const reckey = rec[this.tableKey];
        if (this.dataToSave[this.selectedStack][reckey]) {
          this.completeData[this.selectedStack][index] = {
            ...this.dataToSave[this.selectedStack][reckey]
          };
        }
      });
    }
    // this.completeData[this.selectedStack] = [...currentRecords];
  }

  fetchPageData = e => {
    this.pageChangeHanlder(e);
  }

  pageChangeHanlder = e => {
    this.rows[this.selectedStack] = e.rows;
    this.page[this.selectedStack] = e.page + 1;
    const search = this.searchCriteria[this.selectedStack]
      ? this.searchCriteria[this.selectedStack]
      : this.initialSearchCriteria.searchCriteria;
    this.searchCriteriaChanged(search, this.selectedStack, false);
  }

  calculateHeight = identifier => {
    const $el = document.querySelector(identifier);
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
        (window.pageYOffset + rect.top + Number(paddingTop) + 240)
    );

    return calculatedHeight < 350 ? 350 : calculatedHeight;
  }

  /* getWindowHeight = () => {
    const $d = document;
    return $d.compatMode && $d.compatMode === "CSS1Compat"
      ? $d.documentElement.clientHeight
      : $d.body.clientHeight;
  }; */

  onTabClick = selectedTab => {
    this.tabClickHandler(selectedTab);
  }

  tabClickHandler = selectedTab => {
    this.hidePaginator = true;
    this.selectedStack = selectedTab;
    this.selectableRows = true;
    this.setTableKey(this.selectedStack);
    if (Object.keys(this.dataToSave[this.selectedStack]).length === 0) {
      const search = this.searchCriteria[this.selectedStack]
        ? this.searchCriteria[this.selectedStack]
        : this.initialSearchCriteria.searchCriteria;
      this.searchCriteriaChanged(search, this.selectedStack, true);
    } else {
      this.buildTableColumns(this.selectedStack);
      this.hidePaginator = false;
    }
    this.buildTotalRecordsString();
  }

  searchCriteriaChanged = (criteria, stack, criteriaChanged) => {
    this.searchCriteria[stack] = criteria;
    this.fetchData(
      this.buildCriteriaForDataFetch(this.searchCriteria[stack]),
      criteriaChanged
    );
  }

  onEdit = editedData => {
    this.dataToSave[this.selectedStack] = {
      ...this.dataToSave[this.selectedStack],
      ...editedData.data
    };
    this.completeData[this.selectedStack][editedData.index] =
      editedData.data[editedData.key];
    if (!this.saveEnabled) {
      this.saveEnabled = true;
    }
  }

  saveData = () => {
    const stacksToSave = Object.keys(this.dataToSave).filter(stack =>
      Object.keys(this.dataToSave[stack]).length > 0 ? true : false
    );
    const successResponses = [];
    let resCounter = 0;
    this.saveInProgress = true;
    stacksToSave.forEach(stack => {
      this.homeService[constants.paramSaveFunctionMap[stack]](
        Object.values(this.dataToSave[stack])
      ).subscribe(res => {
        this.saveInProgress = false;
        resCounter++;
        let errMsg = constants.saveErrorMessage;
        if (res.StatusType === 'SUCCESS') {
          successResponses.push(true);
        } else {
          errMsg = res['Message'];
        }
        if (successResponses.length === stacksToSave.length) {
          this.resetSaveData();
          this.displayMessage('success', constants.saveSuccessMessage);
        } else if (resCounter === stacksToSave.length) {
          this.displayMessage('danger', errMsg);
        }
      });
    });
  }

  resetSaveData = () => {
    this.saveEnabled = false;
    this.dataToSave = {
      [constants.weightsDimensions]: {},
      [constants.packageDetail]: {}
    };
  }

  exportExcel = () => {
    this.homeService
      .exportExcel(this.searchCriteria[this.selectedStack], this.selectedStack)
      .subscribe(res => {
        if (res['StatusType'].toUpperCase() === 'SUCCESS') {
          // window.location.href = res['FilePath'];
          window.open(res['FilePath'], '_blank');
        } else if (res['StatusType'].toUpperCase() === 'FAILURE') {
          this.displayMessage('danger', res['Message']);
        }
      });
    // const dataToExport = buildExportData(
    //   this.completeData[this.selectedStack],
    //   constants.paramTableColumnsMap[this.selectedStack],
    //   constants.tableKey,
    //   constants.valueKey,
    //   constants.droDownAPIKey
    // );
    // exportToExcel(
    //   dataToExport,
    //   constants.exporFileNames[this.selectedStack] + '.xlsx',
    //   []
    // );
  }

  displayMessage = (type, message) => {
    type === 'danger'
      ? this.toastr.error(message)
      : this.toastr.success(message, '', { disableTimeOut: false });
  }

  canDeactivate = () => {
    let hasEdits = false;

    for (const stack in this.dataToSave) {
      if (Object.keys(this.dataToSave[stack]).length > 0) {
        hasEdits = true;
      }
    }

    if (hasEdits) {
      this.modalService.open();
      return this.modalService.getConfirmationSubject();
    }

    return true;
  }
}
