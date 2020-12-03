import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  DoCheck,
  AfterViewInit
} from '@angular/core';

import * as constants from '../../constants';

class SearchCriteriaInput {
  inputs: Array<SearchInput>;
  dropDowns: Array<SearchDropDown>;
  wildCards: Array<any>;
}

class SearchInput {
  name: string;
  className: string;
  placeHolder: string;
  type: string;
  required = false;
  order = 0;
  valueToSet = '';
}

class SearchDropDown {
  name: string;
  className: string;
  defaultOption: string;
  options: Array<Object>;
  displayValueKey: string;
  valueKey: string;
  required = false;
  order = 0;
  valueToSet: string = undefined;
}

@Component({
  selector: 'pfep-home-search-criteria',
  templateUrl: './search-criteria.component.html',
  styleUrls: ['./search-criteria.component.scss']
})
export class SearchCriteriaComponent implements OnInit, OnChanges, DoCheck, AfterViewInit {
  @Input() searchInputs: SearchCriteriaInput;
  @Input() defaultselecteddropDownValue;
  @Output() criteria = new EventEmitter<Object>();
  @Output() selectedSegment = new EventEmitter();
  @Output() criteriaChange = new EventEmitter();

  invalidFields = {};
  totalFields = {};
  changeChecked = false;

  constructor() { }

  ngOnInit() {


  }

  ngOnChanges(changes) {
    const current = changes.searchInputs.currentValue;
    if (current.dropDowns.length === 0 && changes.searchInputs.firstChange) {
      const wildCards = [...this.searchInputs.wildCards];
      wildCards.forEach(wC => {
        wC.wildCardConfig.selectedData = wC.wildCardConfig.isMultiSelect ? [] : '';
      });
      this.searchInputs.wildCards = wildCards;
    }

  }

  ngOnDestroy() {
    this.searchInputs = { inputs: [], dropDowns: [], wildCards: [] };
  }

  ngDoCheck() {
    if (this.searchInputs.dropDowns.length > 0 && !this.changeChecked) {
      this.changeChecked = true;
      const totalEle = [...this.searchInputs.inputs, ...this.searchInputs.dropDowns, ...this.searchInputs.wildCards];
      totalEle.forEach(ele => {
        if (!this.totalFields[ele['name']] && ele['valueToSet'] !== undefined) {
          this.totalFields[ele['name']] = ele['valueToSet'];
        }

        if (ele.wildCardConfig && ele.wildCardConfig.isMultiSelect) {
          this.totalFields[constants.wildCardCollectionKeys[ele.name]] = [...ele.wildCardConfig.selectedData];
        }
      });
    }
  }

  ngAfterViewInit() {

  }

  ddChanged = (e, name) => {
    const { value } = e.target;
    if (name === 'ORG_ID' || name === 'FACILITY_ID') {
      this.homeWildCardDependentConfig(name, value);
    } else if (name === 'WorkCenterList') {
      this.homeWildCardDependentConfig('ORG_ID', (this.totalFields['ORG_ID']) ? this.totalFields['ORG_ID'] : '');
      this.homeWildCardDependentConfig('FACILITY_ID', (this.totalFields['FACILITY_ID']) ? this.totalFields['FACILITY_ID'] : '');
    }
    if ([null, '', undefined, 'null'].indexOf(value) > -1) {
      this.invalidFields[name] = true;
      this.totalFields[name] = value;
    } else {
      this.totalFields[name] = value;
      this.invalidFields[name] = false;
    }
    if (this.selectedSegment && name === 'ORG_ID') {
      this.selectedSegment.emit(value);
    }

    this.criteriaChange.emit({field: name, value});
  }
  
  homeWildCardDependentConfig(name, value) {
    this.searchInputs.wildCards.map(wC => {
      if(wC.wildCardConfig.dependentData) {
        wC.wildCardConfig.dependentData[name]= (value === 'null') ? '' : value;
        if(name === 'ORG_ID' && wC.wildCardConfig.dependentData['FACILITY_ID']) {
          wC.wildCardConfig.dependentData['FACILITY_ID'] = '';
        }
      }
    })

  }
  wildCardChangeEvent = e => {
    const modelName = constants.wildCardCollectionKeys[e['modelName']] || e['modelName'];
    this.ddChanged({ target: { value: e.selectedData } }, modelName);
  }

  resetCriteria = (...rest) => {
    rest.forEach(attr => {
      this.totalFields[attr] = '';
    });
  }

  ipChanged = (e, name) => {
    const { value } = e.target;
    this.totalFields[name] = value;
    if ([null, '', undefined, 'null'].indexOf(value) > -1) {
      this.totalFields[name] = null;
    }

    this.criteriaChange.emit({field: name, value});
  }

  searchClicked = value => {
    if (this.validateSearch()) { this.criteria.emit(this.totalFields); }
  }

  validateSearch = () => {
    this.invalidFields = {};
    [...this.searchInputs.inputs,
    ...this.searchInputs.dropDowns,
    ...this.searchInputs.wildCards
    ].forEach(ip => {
      if (([null, '', undefined, 'null'].indexOf(this.totalFields[ip.name]) > -1) && ip.required) {
        this.invalidFields[ip.name] = true;
      }
    });

    return Object.keys(this.invalidFields).length === 0;
  }


}
