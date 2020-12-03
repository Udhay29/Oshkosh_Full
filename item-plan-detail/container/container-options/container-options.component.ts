import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { ItemPlanDetailService, formatDate } from '../../item-plan-detail.service';
import * as constants from '../../constants';
import * as moment from 'moment';

// TODO: remove this  mockdata referenece
// import mockData from '../../jsons.json';

@Component({
  selector: 'pfep-container-options',
  templateUrl: './container-options.component.html',
  styleUrls: ['./container-options.component.scss']
})
export class ContainerOptionsComponent implements OnInit, OnChanges {
  constructor(private itemPlanDetailService: ItemPlanDetailService) { }
  containerData = {};
  showContainerTypes = false;
  conatinersToDisplay = '';
  containerToSelect = { type: '', containerValue: '' };

  @Input() APIoptions = {};
  @Input() disableExecuteBtn = true;
  @Input() enableSave = false;
  @Input() disableChangeHistory = true;
  @Input() fitmentSaveFields = {};
  @Input() isEditable: Boolean;
  @Input() rcButtonsExist: Boolean;
  @Output() isValueChange = new EventEmitter<any>();
  @Input() navigateBackOptions = { navigateBack: () => { }, displayCancelBtn: false };
  @Input() saveFn = () => { };
  @Input() requestChangeFn = () => { }
  @Input() changeHistoryFn = () => { }
  @Input() cancelRequestFn = () => { }
  @Input() updateItemValuesOnExecute = detail => { };
  @Input() containerSelected = (t, v) => { };
  @Input() resetSelection = () => { };
  ngOnInit() {
  }

  ngOnChanges(changes) {
  }

  formatDate = (date: string) => {
    return date ? formatDate(date, true) : '';
  }

  calculateContainerOptions = () => {
    this.fetchContainerData(false, '');
  }

  customContainerSelected = code => {
    this.fetchContainerData(true, code);
    this.resetSelection();
    this.containerSelected('standard', { [constants.containerId]: code });
  }

  valueUpdated(eve) {
    this.isValueChange.emit(eve);
  }

  displayContainerLabels = () => {
    this.conatinersToDisplay = '';
    const recommendedContainers = [];
    const racks = [
      { type: 'standard', data: this.containerData[constants.standardRacks] },
      {
        type: constants.bulkSelectValue,
        data: this.containerData[constants.bulkRacks]
      }
    ];

    const constructCtrLabel = (type, ctrArr) => {
      this.conatinersToDisplay +=
        type === 'standard'
          ? (this.conatinersToDisplay += ctrArr.join(' |  '))
          : ctrArr[0];
    };

    racks.forEach(rackType => {
      if (rackType.data && this.conatinersToDisplay === '') {
        rackType.data.forEach(rack => {
          if (rack[constants.rackDetails]) {
            rack[constants.rackDetails].forEach(detail => {
              if (detail['COLOR'] === 'GREEN') {
                rackType.type === 'standard'
                  ? recommendedContainers.push(
                    `  ${rack[constants.rackName]} - ${
                    detail[constants.containerId]
                    }`
                  )
                  : recommendedContainers.push(detail[constants.containerId]);
                this.containerToSelect = {
                  type: rackType.type,
                  containerValue: detail[constants.containerId]
                };
                this.updateItemValuesOnExecute({
                  [constants.containerCode]: detail[constants.containerId],
                  [constants.pickFacingQnty]: detail[constants.pickface]
                });
              }
            });
          }
        });
      }
      if (recommendedContainers.length !== 0) {
        constructCtrLabel(rackType.type, recommendedContainers);
      }
    });
  }

  // containerSelectedFn = (type, value) => {
  //   this.containerSelected(type, value);
  //   this.buildRecCtrString(type, value);
  // }

  // buildRecCtrString = (type, value) => {
  //   const ctrCode = value[constants.containerId];
  //   const str = '';
  //   let recommendedContainers = [];
  //   const racks = type === 'standard' ?  this.containerData[constants.standardRacks] : this.containerData[constants.bulkRacks];

  //   const constructCtrLabel = (type, ctrArr) => {
  //     this.conatinersToDisplay += (type==='standard') ? this.conatinersToDisplay += ctrArr.join(' |  ') : ctrArr[0];
  //   }

  //   racks.forEach(rackType => {
  //     if(rackType) {
  //       rackType.forEach(rack => {
  //         if(rack[constants.rackDetails]) {
  //           rack[constants.rackDetails].forEach(detail => {
  //             if(detail[constants.containerId] === 'ctrCode') {
  //               (type === 'standard') ? recommendedContainers.push(`  ${rack[constants.rackName]} - ${detail[constants.containerId]}`) : recommendedContainers.push(detail[constants.containerId]);
  //               this.containerToSelect = {type: rackType.type, containerValue:detail[constants.containerId] }
  //             }
  //           })
  //         }
  //       })
  //     }
  //   });
  // }

  fetchContainerData = (includeContainer, code) => {
    const postData = this.constructExecutePostData();
    const APIoptions = includeContainer
      ? { ...postData, [constants.containerCode]: code }
      : { ...postData };
    this.itemPlanDetailService.fetchContainerData(APIoptions).subscribe(res => {
      if (res.status === 200) {
        this.containerData = { ...res.body };
        // TODO: remove this mock data
        //  if(!includeContainer) this.containerData = { ...mockData.execute };
        this.displayContainerLabels();
        this.showContainerTypes = true;
      } else {
        this.itemPlanDetailService.displayMessage('danger', res.statusText);
      }
    });
  }

  constructExecutePostData = () => {
    const postData = {};
    constants.executePostDataKeys.forEach(key => {
      if (key === constants.presentationTypeKey) {
        postData[key] = this.APIoptions[constants.presentation];
        return;
      }
      postData[key] = this.APIoptions[key];
    });
    return postData;
  }

  viewHistory = (e, isDisabled) => {
    e.preventDefault();
    if (!isDisabled) {
      this.changeHistoryFn();
    }
  }

  hideContainerTypes = () => {
    this.showContainerTypes = false;
    this.conatinersToDisplay = '';
  }
}
