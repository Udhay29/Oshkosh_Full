import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray
} from '@angular/forms';
import * as constants from './constants';
import { ToastrService } from 'ngx-toastr';
import { ItemPlanDetailService, formatDate } from './item-plan-detail.service';
import { DatePipe } from '@angular/common';
import { SharedService } from '../../shared/services/share.service';
import { CoreServices } from '../../core/services/core.service';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Dialog } from 'primeng/dialog';

import * as moment from 'moment';
import { ContainerOptionsComponent } from './container/container-options/container-options.component';
import { RequestChangeComponent } from './request-change/request-change.component';
import { ModalService } from 'src/app/core/services/modal.service';

class itemPlanIp {
  isChild: boolean;
  parentScreenPath: string;
  planIdFromParent: number;
  selectedRecord: object;
  navigateUrl?: boolean;
}

@Component({
  selector: 'pfep-item-plan-detail',
  templateUrl: './item-plan-detail.component.html',
  styleUrls: ['./item-plan-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ItemPlanDetailComponent implements OnInit, OnDestroy {
  wildCardLookUpConfig: Array<any> = constants.wildCardLookUpConfig;
  planCodesColumns: Array<object> = constants.planCodesColumns;
  selectedItemPlan: any = {};
  workCenter: string = constants.workCenter;
  itemId: string = constants.itemId;
  itemPlanId: string = constants.itemPlanId;
  statusDropDownValues: any;
  itemPlanDetails: any;
  searchInvalid = false;
  planStatus: any;
  itemPlanCodes: any = [];
  showModal: Boolean;
  columns: any;
  createPlanAttributes: Array<any> = constants.createPlanAttributes;
  createPlanMandatoryAttrs: Array<string> = constants.createPlanMandatoryAttrs;
  createMFPList = [];
  planFetchData: any = {
    itemPlanId: null,
    taskId: null
  };
  createPlanData: any = {
    [constants.MFPDDKey]: '',
    [constants.effectiveDate]: '',
    [constants.expireDate]: ''
  };
  showCreatePopup = false;
  showCreateError = false;
  createStatus: any = {
    error: false,
    saving: false
  };
  createCancelClicked = false;
  itemPlanFormFields: any;
  itemPlanAttributes = constants.itemPlanAttributes;
  multiValueFieldsmap = constants.multiValueFieldsmap;
  erpFields = constants.erpFields;
  allEditableFields = constants.allEditableFields;
  editableFieldsMap = constants.editableFieldsMap;
  presentation = constants.presentation;
  presentationTypeKey = constants.presentationTypeKey;
  binSelectValue = constants.binSelectValue;
  bulkSelectValue = constants.bulkSelectValue;
  equivalentFieldsMap = constants.equivalentFieldsMap;
  showDetails = false;
  isDisable: Boolean;
  presentationTypes: any;
  orientationTypes: any;
  doNotPlan: any;
  dropDownvalues: any = {};
  ip_details: any;
  details: any = {};
  disableSelectBtn = true;
  displayOnLoadtext = true;
  invalidFields = [];
  fetchingDetails = false;
  parentIp: itemPlanIp;
  wildCardLookUpConfigCopy: any;
  searchCriteria: any = {
    PLAN_STATUS_CODE: '',
    [constants.branchDDKey]: '',
    [constants.itemId]: '',
    [constants.workCenterDDKey]: ''
  };
  unEqualRelatedFields: Array<string> = [];
  parentHasPlanId = true;
  itemPlanStatusDDKey: string = constants.itemPlanStatusDDKey;
  isEditable = false;

  calculationAPIoptions: any = {
    [constants.itemId]: '',
    [constants.branchDDKey]: '',
    [constants.workCenterDDKey]: '',
    [constants.itemPlanId]: '',
    [constants.containerQty]: '',
    [constants.pid]: 0,
    [constants.effectiveDate]: '',
    [constants.expireDate]: ''
  };
  selectedContainer = { container: {}, type: {} };
  fitmentSaveFields = {};
  showConfirmationPopup = false;
  warningMsg = '';
  warningPopupDetails = [];
  warningPopupNavData = {};
  navigateFromWarning = false;
  searchFieldResults = {};
  currentSuperMarketInd = 'N';
  currentWarningType = '';
  containerERPCode = '';
  erpDemandNotAvailable = false;
  copyStateActive = false;
  copyStatePlanIdBackup = '';
  showRequestChangePopup: boolean = false;
  requestChangeValues: any = {};
  fieldsToDisableForReq = [];
  mfcrIdAPIKey = constants.mfcrIdAPIKey;
  changeRequestId: any = null;
  showChangeReqId: boolean = false;
  requestChangeError: boolean = false;

  @ViewChild(ContainerOptionsComponent) conatinerOptions: ContainerOptionsComponent;
  @ViewChild(RequestChangeComponent) requestChangeComp: RequestChangeComponent;
  @ViewChild(Dialog) dialog: Dialog
  hasEdit: boolean;

  constructor(
    public fb: FormBuilder,
    public itemPlanDetailService: ItemPlanDetailService,
    private toastr: ToastrService,
    public datePipe: DatePipe,
    public sharedService: SharedService,
    public coreService: CoreServices,
    public router: Router,
    private route: ActivatedRoute,
    private modalService: ModalService
  ) {
    this.buildForm();
  }

  ngOnInit() {
    const routeRoles = this.route.snapshot.data.roles;
    this.isEditable = this.coreService.checkAccess(routeRoles);
    this.itemPlanDetailService.setReOrderAccess(this.coreService.checkRole(constants.businessAdmin));
    this.parentIp = this.sharedService.getItemPlanIp();
    this.sharedService.isHierarchy.next(this.parentIp);
    // this.subscribeToValueChanges();s
    this.wildCardLookUpConfig.forEach(wC => {
      wC.selectedData = (this.parentIp.isChild) ? this.parentIp.selectedRecord[wC.modelName] : '';
    });

    this.wildCardLookUpConfigCopy = JSON.parse(
      JSON.stringify(this.wildCardLookUpConfig)
    );


    const statusDDValues = this.itemPlanDetailService.getItemPlanStatus();
    const presentationDDValues = this.itemPlanDetailService.getPresentationTypeValues();
    const orientationDDValues = this.itemPlanDetailService.getOrientationTypeValues();
    const doNotPlanDDValues = this.itemPlanDetailService.getDoNotPlanValues();
    const kitTypeValues = this.itemPlanDetailService.getKitTypeValues();
    const superMarketIdValues = this.itemPlanDetailService.getSuperMarketIdValues();

    forkJoin([
      statusDDValues,
      presentationDDValues,
      orientationDDValues,
      doNotPlanDDValues,
      kitTypeValues,
      superMarketIdValues
    ]).subscribe(responses => {
      this.parseDDValues(
        constants.itemPlanStatusDDKey,
        'statusDropDownValues',
        constants.itmPlanStatus,
        responses[0]
      );
      this.parseDDValues(
        constants.presentationTypeKey,
        'presentationTypes',
        constants.presentation,
        responses[1]
      );
      this.parseDDValues(
        constants.orientationDDKey,
        'orientationTypes',
        constants.orientation,
        responses[2]
      );
      this.parseDDValues(
        constants.doNotPlanDDKey,
        'doNotPlan',
        constants.doNotPlan,
        responses[3]
      );
      this.parseDDValues(
        constants.kitTypeDDKey,
        'kitType',
        constants.kitType,
        responses[4]
      );
      this.parseDDValues(
        constants.superMarketIdDDKey,
        'superMarketId',
        constants.superMarketId,
        responses[5]
      );
      this.disableOnLoadFields();
      this.fetchDetails();
    });
  }

  parseDDValues = (key, variable, ddObjVariable, values) => {
    if (values) {
      this[variable] = [
        ...values.map(val => ({ [key]: val, IsSelected: false }))
      ];
      this.dropDownvalues[ddObjVariable] = this[variable];
    } else {
      this.dropDownvalues[ddObjVariable] = null;
    }
  }

  fetchDetails = () => {
    if (this.parentIp.isChild || this.parentIp.navigateUrl) {
      if (!this.parentIp.planIdFromParent) {
        this.parentHasPlanId = false;
        /* this.itemPlanDetailService
          .getSuperMarketIdValues(
            this.parentIp.selectedRecord[constants.branch]
          )
          .subscribe(res => {
            if (Array.isArray(res)) {
              this.parseDDValues(
                constants.superMarketIdDDKey,
                'superMarketId',
                constants.superMarketId,
                res
              );
            }
          }); */
        this.showCreatePopup = true;
        this.showCreateError = false;
        this.getCreateDropDowns();
      } else {
        this.getItemIdData(true, this.parentIp.planIdFromParent);
      }
      this.sharedService.setItemPlanIp({
      });
    }
  }

  buildSearchFieldResults = () => {
    Object.keys(constants.searchFields).forEach(
      field => (this.searchFieldResults[field] = [])
    );
  }

  buildForm = () => {
    this.ip_details = this.fb.group(constants.formInputFields);
  }

  disableOnLoadFields = () => {
    let fieldsToDisable = [
      ...this.allEditableFields,
      ...constants.disabledFields
    ];
    if (!this.isEditable) {
      fieldsToDisable = Object.keys(constants.formInputFields);
    }
    fieldsToDisable.forEach(field => {
      this.ip_details.controls[field].disable();
    });
  }

  reqChangesFieldsToDisable = () => {
    const presentation = this.getDDValue(
      this.ip_details.controls[constants.presentation].value,
      constants.presentationTypeKey
    );
    /*const presentationFields = presentation ? constants.presentationTypeFields[presentation] : []; */
    this.fieldsToDisableForReq = this.checkCndtnlFields(
      constants.requestChangeFields,
      presentation, this.ip_details.value);

    this.fieldsToDisableForReq.forEach(field => {
      if (this.ip_details.controls[field]) {
        this.ip_details.controls[field].disable();
      }
    });

  }


  checkCndtnlFields = (arr, presentation, details) => {
    switch (presentation) {
      case constants.kitSelectValue:
        if (constants.conditionalFields[constants.kitSelectValue].value === this.getDDValue(details[constants.kitType], constants.typeDropDown[constants.kitType])) {
          arr = [...constants.conditionalFields[constants.kitSelectValue].fields.map(field => field.formControlName), ...arr];
        }
        break;

      default:
        arr = [...arr];
    }

    return arr;
  }

  checkForValueEquality = () => {
    /*  this.unEqualRelatedFields = Object.keys(constants.formInputFields).filter(
      field => {
        if (
          field === constants.containerCode ||
          field === constants.erpContainer
        ) {
          const valueToCompare =
            this.containerERPCode ||
            this.ip_details.controls[constants.containerCode].value;
          return (
            valueToCompare !==
            this.ip_details.controls[constants.erpContainer].value
          );
        } else {
          return (
            constants.equivalentFieldsMap[field] &&
            this.ip_details.controls[field].value !==
            this.ip_details.controls[constants.equivalentFieldsMap[field]]
              .value
          );
        }
      }
    ); */
    const constraintsForEquality =
      constants.equivalentFieldsMap[
      this.getDDValue(
        this.ip_details.controls[constants.presentation].value,
        constants.presentationTypeKey
      )
      ];
    this.unEqualRelatedFields = [];
    if (constraintsForEquality && typeof constraintsForEquality === 'object') {
      this.unEqualRelatedFields = Object.keys(constraintsForEquality).filter(
        fieldToCheck => {
          if (constraintsForEquality[fieldToCheck].value) {
            // compare with values in an Array
            return constraintsForEquality[fieldToCheck].value.indexOf(this.ip_details.controls[fieldToCheck].value) === -1;

          } else if (constraintsForEquality[fieldToCheck].field) {
            // compare with field
            return this.compareFields(
              fieldToCheck,
              constraintsForEquality[fieldToCheck].field
            );
          }
        }
      );
    }
  }

  compareFields = (field, compareField) => {
    if (field === constants.containerCode || field === constants.erpContainer) {
      const valueToCompare =
        this.containerERPCode ||
        this.ip_details.controls[constants.containerCode].value;
      return (
        valueToCompare !==
        this.ip_details.controls[constants.erpContainer].value
      );
    } else {
      return (
        this.ip_details.controls[field].value !==
        this.ip_details.controls[compareField].value
      );
    }
  }

  displayCancelBtn = () => {
    return !!this.parentIp.parentScreenPath && ['/mfcr', '/pou/single-rack'].indexOf(this.parentIp.parentScreenPath) === -1;
  }

  copyItemPlan = () => {
    this.copyStateActive = !this.copyStateActive;
    if (this.copyStateActive) {
      this.fieldsToDisableForReq = [];
      this.copyStatePlanIdBackup = this.ip_details.controls[constants.itemPlanId].value;
      constants.copyPlanClearFields.forEach(field => {
        if (this.ip_details.controls[field]) {
          this.ip_details.controls[field].setValue('');
        }
      });
      this.disableFieldsBasedOnPresentation();
      this.hasEdited();
    } else {
      this.reqChangesFieldsToDisable();
      this.getItemIdData(false, this.copyStatePlanIdBackup);
    }
    this.resolveCnditnlEditable();
    this.determineInvalidFields();
  }

  routeAttached = () => {

    if (Object.keys(this.sharedService.getItemPlanIp()).length > 0) {
      this.fetchDetails();
      this.parentIp = this.sharedService.getItemPlanIp();
      this.sharedService.isHierarchy.next(this.parentIp);
    } else {
      this.getItemIdData(false, '');
    }

    this.sharedService.isHierarchy.next({ back: true, backurl: this.router.url });
  }

  ddValueChange = (value, field, ddKey) => {
    if (value !== 'null') {
      this.hasEdited();
    }
    const ddvalues = this.ip_details.controls[field].value;

    ddvalues.forEach(opt => {
      opt.IsSelected = false;
      if (opt[ddKey] === value.trim()) {
        opt.IsSelected = true;
      }
    });
    this.ip_details.controls[field].setValue(ddvalues);
    if (field === constants.presentation) {
      this.disableFieldsBasedOnPresentation();
      this.checkForValueEquality();
      this.calculationAPIoptions[constants.presentation] = value.trim();
    }

    if (field === constants.kitType) {
      this.resolveCnditnlEditable();
      if (value.trim() === constants.cwoKitSelectValue) {
        this.ip_details.controls[constants.containerQty].setValue('variable');
        // hardcoding since only two fields are to be toggled
        this.changeFieldsState(
          [constants.containerQty, constants.containerCode],
          'disable'
        );
      } else if (value.trim() === constants.masterKitSelectValue) {
        if (
          this.ip_details.controls[constants.containerQty].value === 'variable'
        ) {
          this.ip_details.controls[constants.containerQty].setValue('');
        }
        // hardcoding since only two fields are to be toggled
        this.changeFieldsState(
          [constants.containerQty, constants.containerCode],
          'enable'
        );
      }
    }

    if (field === constants.MFP) {
      this.setMFPRelatedValues();
    }

    if (field === constants.branch) {
      this.getMFPList();
      this.getWorkCenterList();
    }

    this.resetDisabledDDValues();
    this.determineInvalidFields();
  }

  linkClicked = (e, field) => {
    e.preventDefault();
    switch (field) {
      case constants.wCRackID:
        this.navigateToSingleRack();
        break;
    }
  }

  getMFPList = () => {
    this.coreService.showLoader();
    this.itemPlanDetailService.getMFPList(
      this.ip_details.controls[constants.orgId].value,
      this.getDDValue(this.ip_details.controls[constants.branch].value, constants.typeDropDown[constants.branch])).subscribe(res => {
        this.dropDownvalues[constants.MFP] = res;
        this.ip_details.controls[constants.MFP].setValue(res);
        this.coreService.hideLoader();
      });
  }

  getWorkCenterList = () => {
    this.coreService.showLoader();
    this.itemPlanDetailService.getWorkCenterList(
      this.ip_details.controls[constants.orgId].value,
      this.getDDValue(this.ip_details.controls[constants.branch].value, constants.typeDropDown[constants.branch])).subscribe(res => {
        this.dropDownvalues[constants.workCenter] = res;
        this.ip_details.controls[constants.workCenter].setValue(res);
        this.coreService.hideLoader();
      });
  }
  changeFieldsState = (fieldsArr, state) => {
    fieldsArr.map(field => {
      this.ip_details.controls[field][state]();
    });
  }

  ipChanged = field => {
    this.hasEdited();
    this.convertToType(field);
    this.isFieldInvalid(field);
    const presentationValue = this.getDDValue(
      this.ip_details.controls[constants.presentation].value,
      constants.presentationTypeKey
    );
    if (
      presentationValue &&
      constants.equivalentFieldsMap[presentationValue] &&
      constants.equivalentFieldsMap[presentationValue][field]
    ) {
      this.checkForValueEquality();
    }
    if (field === constants.pid || constants.containerQty) {
      this.calculationAPIoptions[field] = this.ip_details.controls[field].value;
    }
  }

  convertToType = field => {
    if (constants.numberFields.indexOf(field) > -1) {
      const value = this.ip_details.controls[field].value;
      if (typeof value !== 'number' && !this.emptyField(value, '')) {
        this.ip_details.controls[field].setValue(parseInt(value));
      }
      return;
    }
    if (constants.floatFields.indexOf(field) > -1) {
      const value = this.ip_details.controls[field].value;
      if (value === '.') {
        this.ip_details.controls[field].setValue(null);
        return;
      }
      if (typeof value !== 'number' && !this.emptyField(value, '')) {
        this.ip_details.controls[field].setValue(parseFloat(value));
      }
      return;
    }
  }

  onDateChange = (value, field) => {
    // const date = new Date(
    //   value.getTime() - value.getTimezoneOffset() * 60 * 1000
    // );
    this.ip_details.controls[field].setValue(value);
    this.calculationAPIoptions[field] = value;
  }

  onDateClose = field => {
    this.hasEdited();
    this.isFieldInvalid(field);
  }

  isFieldInvalid = field => {
    if (
      this.resolveCndtnalMandatory([
        ...constants.allEditableFields,
        ...constants.mandatoryFields
      ]).indexOf(field) > -1
    ) {
      const idx = this.invalidFields.indexOf(field);
      if (idx !== -1) {
        this.invalidFields.splice(idx, 1);
      }
      if (
        this.ip_details.controls[field] &&
        this.emptyField(
          this.ip_details.controls[field].value,
          Array.isArray(this.ip_details.controls[field].value)
            ? constants.typeDropDown[field]
            : ''
        )
      ) {
        this.invalidFields.push(field);
        /* const getPresenType = this.ip_details.controls[constants.presentation].value.filter(opt => opt.IsSelected)
        if (!this.copyStateActive && getPresenType[0] && getPresenType[0][constants.presentationTypeKey] === 'Kit') {
          this.invalidFields.forEach((value, index) => {
            if (value.toString() === 'KIT_TYPE') {
              this.invalidFields.splice(index, 1);
            }
          })
        } */
      }
    }
  }

  getDDValue = (arr, key) => {
    if (arr) {
      const displayOption = arr.filter(opt => opt.IsSelected);
      return displayOption[0] ? displayOption[0][key] : '';
    }
  }

  disableFieldsBasedOnPresentation = () => {
    if (this.isEditable) {
      const presentationFields = this.getPresentationBasedFields();
      constants.allEditableFields.forEach(fieldValue => {
        if (presentationFields.indexOf(fieldValue) > -1) {
          this.ip_details.controls[fieldValue].enable();
        } else {
          if (!constants.typeDropDown[fieldValue]) {
            this.ip_details.get(fieldValue).setValue(null);
          }
          this.ip_details.get(fieldValue).disable();
        }
      });
    }
  }

  disablePlanStatus = val => {
    const statusVal = this.getDDValue(
      this.ip_details.controls['ItemPlanStatus'].value,
      constants.itemPlanStatusDDKey
    );
    if (
      statusVal &&
      constants.planStatusDisabledOpts[statusVal.toUpperCase()] &&
      constants.planStatusDisabledOpts[statusVal.toUpperCase()].indexOf(
        val.toUpperCase()
      ) > -1
    ) {
      return true;
    }
    return false;
  }

  wildCardChangeEvent(data) {
    this.searchCriteria[data.modelName] = data.selectedData;
    if (data.modelName === 'FACILITY_ID') {
      this.wildCardLookUpConfigInit([1, 2]);
      this.wildCardLookUpConfig[1].dependentData = {
        ORG_ID: '',
        FACILITY_ID: data.selectedData.FACILITY_ID,
        WORK_CENTER_ID: ''
      };
      this.wildCardLookUpConfig[2].dependentData = {
        ORG_ID: '',
        FACILITY_ID: this.wildCardLookUpConfig[1].dependentData.FACILITY_ID,
        WORK_CENTER_ID: ''
      };

      this.searchCriteria['WORK_CENTER_ID'] = [];
      this.searchCriteria['ITEM_ID'] = '';
    } else if (data.modelName === 'WORK_CENTER_ID') {
      this.wildCardLookUpConfigInit([2]);
      this.wildCardLookUpConfig[2].dependentData = {
        ORG_ID: '',
        FACILITY_ID: this.wildCardLookUpConfig[1].dependentData.FACILITY_ID,
        WORK_CENTER_ID: data.selectedData.WORK_CENTER_ID
      };

      this.searchCriteria['ITEM_ID'] = '';
    }
  }
  wildCardLookUpConfigInit(data) {
    data.forEach(element => {
      this.wildCardLookUpConfig[element] = JSON.parse(
        JSON.stringify(this.wildCardLookUpConfigCopy[element])
      );
    });
  }
  changeStatus = event => {
    this.searchCriteria['PLAN_STATUS_CODE'] = event.target.value.trim();
  }

  rowClickFn = (event, selected) => {
    this.planFetchData = {
      itemPlanId: selected ? event.data[constants.itemPlanId] : null,
      taskId: selected ? event.data[constants.taskId] : null
    };
    this.disableSelectBtn = selected ? false : true;
    if (selected) {
      this.selectedItemPlan = {};
    }
  }

  determineInvalidFields = () => {
    let presentaionFields = [
      ...this.resolveCndtnalMandatory([
        ...this.getPresentationBasedFields(),
        ...constants.mandatoryFields
      ])
    ];
    if (!this.copyStateActive) {
      const fieldsToIgnore = (constants.presentationTypeFields[this.getDDValue(
        this.ip_details.controls[constants.presentation].value,
        constants.presentationTypeKey
      )] || []).map(field => field.formControlName);

      presentaionFields = presentaionFields.filter(field => constants.requestChangeFields.indexOf(field) === -1);
    }
    this.invalidFields = [];
    presentaionFields.forEach(field => {
      this.isFieldInvalid(field);
    });
  }

  getPresentationBasedFields = () => {
    this.resolveCnditnlEditable();
    return (
      this.editableFieldsMap[
      this.getDDValue(
        this.ip_details.controls[constants.presentation].value,
        constants.presentationTypeKey
      )
      ] || []
    );
  }

  emptyField = (value, ddKey) => {
    if (Array.isArray(value)) {
      value = this.getDDValue(value, ddKey);
    }
    return [null, '', undefined].indexOf(value) > -1;
  }

  searchClicked = () => {
    this.emptyField(this.searchCriteria[constants.workCenterDDKey], '') &&
      this.emptyField(this.searchCriteria[constants.itemId], '')
      ? (this.searchInvalid = true)
      : this.search();
  }

  search = () => {
    this.searchInvalid = false;
    this.coreService.showLoader();
    this.itemPlanDetailService
      .searchUsingWorkCenter(this.searchCriteria)
      .subscribe(data => {
        this.itemPlanCodes = data;
        if (this.itemPlanCodes && this.itemPlanCodes.length > 0) {
          this.showModal = true;
          this.disableSelectBtn = true;
          this.columns = [{ header: 'Item Plan Code' }];
        } else {
          this.itemPlanDetailService.displayMessage(
            'error',
            'No Item plans found for this search.'
          );
        }
        this.coreService.hideLoader();
      });

    this.parentIp = {
      isChild: false,
      parentScreenPath: '',
      planIdFromParent: null,
      selectedRecord: {}
    };
  }

  prepareForDataFetch = () => {
    this.fetchingDetails = true;
    this.displayOnLoadtext = false;
    this.showModal = false;
    this.showDetails = false;
  }

  getItemIdData = (navigatedFromScreen, id) => {
    if (navigatedFromScreen) {
      this.planFetchData = {
        itemPlanId: id,
        taskId: ''
      };
    }
    this.prepareForDataFetch();
    this.selectedItemPlan = {};
    this.changeRequestId = null;
    // this.parentIp.planIdFromParent = true;
    this.itemPlanCodes = [];
    this.itemPlanDetailService
      .getItemPlanByItemPlanId(this.planFetchData)
      .subscribe(res => {
        if (res.status === 200 && res.body !== null) {
          this.buildForm();
          this.disableOnLoadFields();
          setTimeout(() => {
            this.hasEdit = false;
            this.populateForm(res.body, true);
          }, 500);

        } else {
          this.fetchingDetails = false;
          this.displayOnLoadtext = true;
          this.showDetails = false;
          this.itemPlanDetailService.displayMessage(
            'error',
            'Error fetching Data. Please try again.'
          );
        }
      });
  }

  showMFCRId = (mfcrSID) => {
    this.showChangeReqId = false;
    if (['', undefined, null].indexOf(mfcrSID) === -1) {
      this.showChangeReqId = true;
      this.changeRequestId = mfcrSID;
    }
  }

  populateForm = (details, isDataFromDB) => {
    this.showMFCRId(details[constants.mfcrIdAPIKey]);
    this.itemPlanDetailService.setOrgBranchValues(details[constants.orgId], details[constants.branchDDKey]);
    details = this.checkForWCRack(details);
    Object.keys(details).forEach(field => {
      let value = details[field];
      if (constants.dateFields.indexOf(field) > -1 && value) {
        value = new Date(value);
      }
      if (
        (value !== null || value !== undefined) &&
        this.ip_details.controls[field]
      ) {
        this.ip_details.controls[field].setValue(value);
      }
    });
    this.containerERPCode = details[constants.containerERPCode] || '';
    this.currentSuperMarketInd = details[constants.superMarketInd] || 'N';
    //this.checkDDOptions();
    //this.setDDOptions(isDataFromDB);
    this.disableFieldsBasedOnPresentation();

    this.reqChangesFieldsToDisable();
    this.determineInvalidFields();
    this.checkForValueEquality();
    this.constructAPIoptions();
    this.setFitmentSaveValues();
    this.displayNoDemandText(details);
    if (this.conatinerOptions) {
      this.conatinerOptions.hideContainerTypes();
    }
    this.showDetails = true;
    this.fetchingDetails = false;
    this.displayOnLoadtext = false;
    this.copyStateActive = false;
  }

  checkForWCRack = details => {
    const presentation = this.getDDValue(
      this.ip_details.controls[constants.presentation].value,
      constants.presentationTypeKey
    );
    const ignoreTypes = [constants.bulkSelectValue, constants.kitSelectValue];
    if (ignoreTypes.indexOf(presentation) === -1) {
      details[constants.wCRackID] = this.emptyField(details[constants.wCRackID], '') ? constants.assignRackText : details[constants.wCRackID];
    } else {
      details[constants.wCRackID] = null;
    }

    return details;
  }

  checkDDOptions = () => {
    for (const dd in constants.typeDropDown) {
      if (
        (!this.dropDownvalues[dd] || this.dropDownvalues[dd].length === 0) &&
        this.ip_details.controls[dd].value
      ) {
        this.dropDownvalues[dd] = [...this.ip_details.controls[dd].value];
      }
    }
  }

  setDDOptions = isDataFromDB => {
    for (const dd in constants.typeDropDown) {
      if (!this.ip_details.controls[dd].value || !isDataFromDB) {
        this.ip_details.controls[dd].setValue([...this.dropDownvalues[dd]]);
      } else if (isDataFromDB) {
        //this.dropDownvalues[dd] = [...this.ip_details.controls[dd].value];
      }
    }
  }

  formatDates(data) {
    const dateFields = ['EFFECTIVE_DATE', 'EXPIRE_DATE'];
    dateFields.forEach(field => {
      data[field] = formatDate(data[field], true);
    });
    return data;
  }

  updateItemValuesOnExecute = values => {
    const fieldsToUpdate = ['CONTAINER_CODE', 'PICK_FACING_QNTY'];
    fieldsToUpdate.forEach(field => {
      if (this.ip_details.controls[field]) {
        this.ip_details.controls[field].setValue(values[field]);
      }
    });
  }

  displayNoDemandText = details => {
    const reducedValue = constants.erpEmptyFields.reduce((acc, field) => {
      return acc + (this.emptyField(details[field], '') ? '' : details[field]);
    }, '');

    this.erpDemandNotAvailable = reducedValue === '';
  }

  isDisabled = () => {
    if (this.ip_details.controls[this.presentation].value !== null) {
      return (
        ['Bin', 'Bulk'].indexOf(
          this.getDDValue(
            this.ip_details.controls[this.presentation].value,
            this.presentationTypeKey
          )
        ) === -1
      );
    } else {
      return false;
    }
  }

  navigateToDemand = e => {
    e.preventDefault();
    this.sharedService.setDemandDashBoardIP({
      [constants.itemId]: this.ip_details.controls[constants.itemId].value,
      TGTWorkCenterList: [
        {
          TGT_WORK_CENTER_ID: this.getDDValue(this.ip_details.controls[constants.workCenter].value, constants.workCenterDDKey)
        }
      ],
      [constants.branchDDKey]: this.getDDValue(this.ip_details.controls[constants.branch].value, constants.branchDDKey),
      isChild: true,
      parentRoute: '/item-plan-detail'

    });
    this.router.navigate(['/demand']);
  }

  navigateToSingleRack = () => {
    let singleRackIp: any = {
      [constants.branchDDKey]: this.getDDValue(this.ip_details.controls[constants.branch].value, constants.branchDDKey),
      [constants.workCenterDDKey]: this.getDDValue(this.ip_details.controls[constants.workCenter].value, constants.workCenterDDKey),
      [constants.wCRackID]: this.ip_details.controls[constants.wCRackID].value === constants.assignRackText ? null : this.ip_details.controls[constants.wCRackID].value,
      [constants.wCRackSID]: this.ip_details.controls[constants.wCRackSID].value
    };
    if (this.parentIp.parentScreenPath !== '/pou/single-rack') {
      singleRackIp = { ...singleRackIp, isChild: true, parentScreenPath: '/item-plan-detail' }
    } else {
      singleRackIp = { ...singleRackIp, setUrl: true, backurl: '/pou/single-rack' };
    }
    this.sharedService.setSingleRackIp(singleRackIp);
    this.router.navigate(['pou/single-rack']);
  }

  navigateToMFCR = (changeRequestId?) => {
    let mfcrSearchCriteria: any = {};
    mfcrSearchCriteria[constants.workCenterDDKey] = [];
    // had to assign each value individually because of the difference in keys from ip_details
    mfcrSearchCriteria[constants.branchDDKey] = this.getDDValue(this.ip_details.controls[constants.branch].value, constants.branchDDKey);
    mfcrSearchCriteria[constants.workCenterDDKey].push(
      { 'WORK_CENTER_ID': this.getDDValue(this.ip_details.controls[constants.workCenter].value, constants.workCenterDDKey) });
    mfcrSearchCriteria[constants.itemId] = this.ip_details.controls[constants.itemId].value;
    mfcrSearchCriteria[constants.itemPlanId] = this.ip_details.controls[constants.itemPlanId].value;
    mfcrSearchCriteria[constants.mfcrIdAPIKey] = changeRequestId;

    if (this.parentIp.parentScreenPath !== '/mfcr') {
      mfcrSearchCriteria = { ...mfcrSearchCriteria, isChild: true, parentScreenPath: '/item-plan-detail' }
    } else {
      mfcrSearchCriteria = { ...mfcrSearchCriteria, setUrl: true, backurl: '/mfcr' };
    }

    this.sharedService.setMFCRIp(mfcrSearchCriteria);
    this.router.navigate([`/mfcr`]);
  }

  containerSelected = (type, container) => {
    this.selectedContainer = { container, type };
    this.ip_details.controls[constants.containerCode].setValue(
      container[constants.containerId]
    );
    if (
      type === constants.bulkSelectValue &&
      this.getDDValue(
        this.ip_details.controls[constants.presentation].value,
        constants.presentationTypeKey
      ) !== constants.bulkSelectValue
    ) {
      this.ddValueChange(
        type,
        this.presentation,
        constants.presentationTypeKey
      );

      this.constructAPIoptions();
    }
    this.determineInvalidFields();
  }

  constructAPIoptions = () => {
    const postDataKeys = [
      constants.pid,
      constants.presentation,
      constants.itemId,
      constants.itemPlanId,
      constants.branch,
      constants.workCenter,
      constants.effectiveDate,
      constants.expireDate,
      constants.containerQty
    ];
    postDataKeys.forEach(key => {
      const value = this.ip_details.controls[key].value;
      this.calculationAPIoptions[key] = constants.typeDropDown[key]
        ? this.getDDValue(value, constants.typeDropDown[key])
        : value;
    });
  }

  getSaveData = () => {
    // if (this.attributeValues[constants.supermarketInd] === 'Y') {
    //   postData[constants.supermarketFt] = this.attributeValues[
    //     constants.supermarketFt
    //   ];
    // }

    const itemDetails = this.formatDates(this.ip_details.value);

    [...constants.itemPlanAttributes].forEach(
      ({ formControlName: field }) => {
        if (this.ip_details.controls[field]) {
          itemDetails[field] = this.ip_details.controls[field].value;
        }
        // 'variable' is just adisplay value, not to save in DB
        if (
          field === constants.containerQty &&
          itemDetails[field] === 'variable'
        ) {
          itemDetails[field] = null;
        }
      }
    );

    const ContainerDetails = [];
    if (Object.keys(this.selectedContainer.container).length > 0) {
      ContainerDetails.push(this.selectedContainer.container);
    }

    return {
      ...itemDetails,
      ContainerDetails
    };
  }

  save = confirmation => {
    const postData = this.getSaveData();
    this.itemPlanDetailService
      .saveItemPlanDetail({
        ...postData,
        [constants.warning_containerCode]:
          this.currentWarningType === constants.warning_containerCode &&
          confirmation
      })
      .subscribe(res => {
        this.currentWarningType === '';
        this.hasEdit = false;
        this.feedbackSaveRes(res, postData);
      });
  }

  navigateBack = () => this.router.navigateByUrl(this.parentIp.parentScreenPath);

  feedbackSaveRes = (res, postData) => {
    let type = '',
      msg = '',
      title = '';

    switch (res['StatusType']) {
      case 'SUCCESS':
        type = 'success';
        msg = 'Details succesfully updated';
        if (this.copyStateActive) {
          this.ip_details.controls[constants.itemPlanId].setValue(res['ITEM_PLAN_ID']);
          this.copyStateActive = false;
          if (!this.parentIp.isChild) {
            msg = 'Plan created successfully.';
          }
        }
        if (this.parentIp.isChild) {
          if (this.parentIp.parentScreenPath.search('pfep-summary') > -1) {
            this.setPfepSummaryIp({
              [constants.orgId]: this.ip_details.controls[constants.orgId].value, [constants.itemId]: this.ip_details.controls[constants.itemId].value
            }, false)
          } else {
            this.setCbReqData({
              ...res,
              [constants.orgId]: postData[constants.orgId]
            });
          }
          this.router.navigate([this.parentIp.parentScreenPath]);
        }
        break;

      case 'WARNING':
        if (res['ERROR_TYPE']) {
          this.handleWarningRes(res);
        } else {
          this.itemPlanDetailService.displayMessage('error', 'Error saving data. Please try again.')
        }
        break;

      case 'ERROR':
      case 'FAILURE':
        type = 'error';
        msg = res['Message'];
        title = 'Failed To Save';
        break;

      default:
        type = 'info';
        msg = res['Message'];
        break;
    }
    if (type !== '') {
      this.itemPlanDetailService.displayMessage(type, msg, title);
    }
  }

  handleWarningRes = res => {
    if (res['ERROR_TYPE'] === constants.warning_plannedInWC_errorKey) {
      this.itemPlanDetailService.displayMessage('error', res['Message']);
      return;
    }
    this.showConfirmationDialog(res);
    this.currentWarningType =
      res['ERROR_TYPE'] &&
        res['ERROR_TYPE'] === constants.warning_containerCode_errorKey
        ? constants.warning_containerCode
        : '';
  }

  setCbReqData = data => {
    const postData = {};
    [
      constants.itemId,
      constants.itemPlanId,
      constants.workCenterDDKey,
      constants.branchDDKey,
      constants.orgId,
      constants.taskId
    ].map(key => {
      let value = data[key];
      if (constants.typeDropDown[key]) {
        if (Array.isArray(value)) {
          postData[constants.typeDropDown[key]] = this.getDDValue(data[key], constants.typeDropDown[key]);
        }
      } else {
        postData[key] = data[key];
      }
    });
    this.sharedService.setCbReqData({ data: { ...postData }, parentScreenPath: this.parentIp.parentScreenPath });
  }

  setPfepSummaryIp = (data, replaceParent) => {
    this.sharedService.setCbReqData({});
    this.sharedService.setPfepSummaryIp({ data, replaceParent });
  }

  resetSelection = () => {
    this.selectedContainer = { container: {}, type: {} };
  }

  setFitmentSaveValues = () => {
    this.fitmentSaveFields = {
      [constants.itemId]: this.ip_details.controls[constants.itemId].value,
      [constants.branchDDKey]: this.getDDValue(this.ip_details.controls[constants.branch].value, constants.typeDropDown[constants.branch]),
      [constants.itemPlanId]: this.ip_details.controls[constants.itemPlanId].value
    };
  }

  showConfirmationDialog = resData => {
    this.warningPopupNavData = { [constants.orgId]: this.ip_details.controls[constants.orgId].value, [constants.itemId]: resData[constants.itemId] };
    this.warningMsg = resData['Message'] + '\n  Do you want to proceed ?';
    this.warningPopupDetails = [...resData[constants.warningDetailsKey]];
    this.showConfirmationPopup = true;
  }

  warningPopupNavigation = e => {
    e.preventDefault();
    this.showConfirmationPopup = false;
    this.navigateFromWarning = true;
    /* setTimeout(() => {
    }, 1); */

  }

  warningPopUpClose = () => {
    if (this.navigateFromWarning) {
      this.setPfepSummaryIp(this.warningPopupNavData, true);
      this.sharedService.isHierarchy.next({ setUrl: true, backurl: '/pfep-summary' });
      this.router.navigate([constants.pfepSummaryScreenPath]);
      this.navigateFromWarning = false;
    }
    this.warningPopupNavData = {};
    this.warningMsg = '';
    this.warningPopupDetails = [];
  }

  /* searchFieldFetch = (field, value, fromIp) => {
    this.itemPlanDetailService
      .getSearchFieldData(
        constants.searchFields[field]['key'],
        constants.searchFields[field]['API'],
        {
          mtrlFlowPlanID: value,
          orgID: fromIp
            ? this.parentIp.selectedRecord[constants.orgId]
            : this.ip_details.controls[constants.orgId].value,
          facilityID: fromIp
            ? this.parentIp.selectedRecord[constants.branch]
            : this.ip_details.controls[constants.branch].value
        }
      )
      .subscribe(res => {
        const results = res as Array<any>;
        if (!res || (Array.isArray(res) && res.length === 0)) {
          this.itemPlanDetailService.displayMessage(
            'error',
            'There are no results with the current term'
          );
        }
        this.searchFieldResults[field] = this.alterSearchFieldResults(
          [...results],
          constants.searchFields[field]['key'],
          constants.searchFields[field]['displaykey'],
          constants.searchFields[field]['displayOrder']
        );
      });
  }
  searchFieldOptSelected = (field, value) => {
    if (value === this.ip_details.controls[field].value) {
      this.searchFieldResults[field] = [...[]];
      return;
    }
    if (field === constants.MFP) {
      this.setMFPRelatedValues();
    }
    this.isFieldInvalid(field);
    this.hasEdited();
  }

  searchfieldBlurred = (key, e) => {
    if (e === 'unset') {
      this.invalidFields.push(key);
      this.hasEdited();
    } else {
      this.isFieldInvalid(key);
    }
  }

  searchfieldEmptied = field => {
    this.isFieldInvalid(field);
    this.hasEdited();
  }

  searchfieldTyping = field => {
    // this.removeFromInvalid(field);
  }

  alterSearchFieldResults = (results, key, displayKey, displayOrder) => {
    results = results.map(res => {
      const opt = { displayValue: '', value: '' };
      if (displayOrder) {
        opt.displayValue = `${res[key]}`;
        displayOrder.map(field => {
          if (field === constants.superMarketInd) {
            opt.displayValue += ' - ' + (res[field] ? res[field] : 'N');
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
  } */

  setMFPRelatedValues = () => {
    const postData = {};
    [
      constants.itemId,
      constants.branch,
      constants.workCenter,
      constants.MFP,
      constants.itemPlanId,
      constants.orgId
    ].map(key => {
      const { value } = this.ip_details.controls[key]
      postData[Array.isArray(value) ? constants.typeDropDown[key] : key] = Array.isArray(value)
        ? this.getDDValue(value, constants.typeDropDown[key])
        : this.ip_details.controls[key].value;
    });
    this.itemPlanDetailService.fetchIntervalsByMFP(postData).subscribe(res => {
      if (res.status === 200) {
        if (!res.body || res.body['StatusType'] === 'FAILURE') {
          let type = 'error',
            msg = '';
          msg = res.body['Message'] || 'Unable to fetch intervals.';
          this.itemPlanDetailService.displayMessage(type, msg);
          return;
        }
        for (const field in res.body) {
          if (constants.formInputFields[field]) {
            this.ip_details.controls[field].setValue(res.body[field]);
          }
        }
        this.currentSuperMarketInd = res.body[constants.superMarketInd] || 'N';
        this.disableFieldsBasedOnPresentation();
        this.determineInvalidFields();
        this.resetDisabledDDValues();
      }
    });
  }

  resolveCnditnlEditable = () => {
    this.editableFieldsMap = Object.assign(
      {},
      { ...constants.editableFieldsMap }
    );

    // SuperMarketId
    for (const presentationValue in this.editableFieldsMap) {
      const idx = this.editableFieldsMap[presentationValue].indexOf(
        constants.superMarketId
      );
      if (idx === -1 && this.currentSuperMarketInd === 'Y') {
        this.editableFieldsMap[presentationValue].push(constants.superMarketId);
      } else if (idx > -1 && this.currentSuperMarketInd === 'N') {
        this.editableFieldsMap[presentationValue].splice(idx, 1);
      }
    }

    // Kit TYpe editable fields

    const presentation = this.getDDValue(
      this.ip_details.controls[constants.presentation].value,
      constants.presentationTypeKey
    );

    const kitValue = this.getDDValue(
      this.ip_details.controls[constants.kitType].value,
      constants.typeDropDown[constants.kitType]
    );

    if (presentation === constants.kitSelectValue) {
      [constants.containerQty, constants.containerCode].map(field => {
        const idx = this.editableFieldsMap[presentation].indexOf(field);
        if (idx > -1 && kitValue === constants.cwoKitSelectValue) {
          this.editableFieldsMap[presentation].splice(idx, 1);
        } else if (idx === -1 && kitValue === constants.masterKitSelectValue) {
          this.editableFieldsMap[presentation].push(field);
        }
      });
    }

    // copy plan editable fields
    for (const presentationValue in this.editableFieldsMap) {
      constants.copyPlanEditableFields.forEach(field => {
        const idx = this.editableFieldsMap[presentationValue].indexOf(field);
        if (idx === -1 && this.copyStateActive) {
          this.editableFieldsMap[presentationValue].push(field);
        } else if (idx > -1 && !this.copyStateActive) {
          this.editableFieldsMap[presentationValue].splice(idx, 1);
        }
      })
    }


  }

  resolveCndtnalMandatory = mandatoryFieldsArr => {
    const mandatoryFields = [...mandatoryFieldsArr];

    const checkAndRemoveField = field => {
      const idx = mandatoryFields.indexOf(field);
      if (idx > -1) {
        mandatoryFields.splice(idx, 1);
      }
    };

    // Supermarket Id field
    checkAndRemoveField(constants.superMarketId);
    if (this.currentSuperMarketInd === 'Y') {
      mandatoryFields.push(constants.superMarketId);
    }

    // Kit Type field

    const presentation = this.getDDValue(
      this.ip_details.controls[constants.presentation].value,
      constants.presentationTypeKey
    );
    if (!this.copyStateActive && presentation === constants.kitSelectValue) {
      checkAndRemoveField(constants.containerCode);
    }
    // checkAndRemoveField(constants.kitType);

    return mandatoryFields;
  }

  resetDisabledDDValues = () => {
    const resetDDValues = field => {
      const newValue = this.ip_details.controls[field].value.map(opt => {
        opt.IsSelected = false;
        return opt;
      });
      this.ip_details.controls[field].setValue(
        newValue
      );
    };

    for (const field in constants.typeDropDown) {
      if (
        field === constants.superMarketId &&
        this.currentSuperMarketInd === 'N'
      ) {
        resetDDValues(field);
        return;
      }

      if (field != constants.presentation && field != constants.MFP) {
        if (
          constants.allEditableFields.indexOf(field) > -1 &&
          this.getPresentationBasedFields().indexOf(field) === -1 &&
          constants.cndtnlEditableFields.indexOf(field) === -1
        ) {
          resetDDValues(field);
        }
      }
    }
  }

  // Create Plan functions

  /* createPlanSearchFieldOptSelected = (field, value) => {
    if (value === this.createPlanData[field]) {
      this.searchFieldResults[field] = [...[]];
      return;
    }

    this.createPlanData[field] = value;
    this.hasEdited();
  }

  createPlanSearchfieldBlurred = (field, e) => {
    if (e === 'unset') {
      this.createPlanData[field] = '';
      this.hasEdited();
    }
  }

  createPlanSearchfieldEmptied = field => {
    this.createPlanData[field] = '';
    this.hasEdited();
  }

  createPlanSearchfieldTyping = field => {
    // this.removeFromInvalid(field);
  } */
  getCreateDropDowns = () => {
    this.coreService.showLoader();
    for (const dd in constants.createPlanDDAPIMap) {
      switch (dd) {
        case constants.MFPDDKey:
          this.itemPlanDetailService.getMFPList(this.parentIp.selectedRecord[constants.orgId], this.parentIp.selectedRecord[constants.branchDDKey]).subscribe((res: any) => {
            this.coreService.hideLoader();
            this.createMFPList = res;
          });
      }
    }
  }

  createPlanDDValueChange = (e, field) => {
    this.createPlanData[field] = e.target.value;
    this.hasEdited();
  }

  createDateSelected = e => {
    this.hasEdited();
  }

  createPlan = () => {
    const postData = {};
    [
      constants.itemId,
      constants.orgId,
      constants.branchDDKey,
      constants.workCenterDDKey,
      constants.supplyingLocationDDKey,
      constants.MFPDDKey,
      constants.effectiveDate,
      constants.expireDate
    ].map(field => {
      postData[field] =
        this.createPlanData[field] || this.parentIp.selectedRecord[field];
    });
    this.showCreateError = true;
    this.createStatus = {
      error: false,
      saving: true
    };
    this.itemPlanDetailService
      .getCreatedItemPlanData(postData)
      .subscribe(res => {
        if (
          res.status === 200 &&
          res.body !== null &&
          res.body['StatusType'] === 'SUCCESS'
        ) {
          this.resetAllValues();
          this.hasEdit = false;
          this.populateForm(res.body['ItemPlanResponse'], true);
          this.planFetchData = {
            itemPlanId: res.body['ItemPlanResponse'][constants.itemPlanId],
            taskId: ''
          };
          if (this.parentIp.isChild) {
            this.setCbReqData({
              ...res.body['ItemPlanResponse']
            });
          }
          this.showCreatePopup = false;
          this.showCreateError = false;
          this.createStatus = {
            error: false,
            saving: false
          };
        } else {
          this.createStatus = {
            error: true,
            saving: false
          };
        }
      });
  }

  resetAllValues = (shouldRedirect?) => {
    this.createPlanData = {
      [constants.MFPDDKey]: '',
      [constants.effectiveDate]: '',
      [constants.expireDate]: ''
    };

    this.searchFieldResults = {};
    this.hasEdit = false;
    if (shouldRedirect) {
      this.createCancelClicked = true;
    }
  }

  allCreateValuesPresent = () => {
    let isEmpty = false;
    constants.createPlanMandatoryAttrs.forEach(field => {
      if (this.emptyField(this.createPlanData[field], '') && !isEmpty) {
        isEmpty = true;
      }
    });
    return isEmpty;
  }

  createPopUpClosed = () => {
    if (this.createCancelClicked) {
      this.createCancelClicked = false;
      this.createStatus = {
        error: false,
        saving: false
      };
      this.router.navigate([this.parentIp.parentScreenPath]);
      this.parentIp = {
        isChild: false,
        parentScreenPath: '',
        planIdFromParent: 0,
        selectedRecord: {}
      };
    }
  }

  requestChangeClicked = () => {
    for (const field of constants.requestChangeFields) {
      if (this.ip_details.controls[field]) {
        if (constants.typeDropDown[field]) {
          this.requestChangeValues[field] = [...this.ip_details.controls[field].value].map(opt => ({ ...opt }));
        } else {
          this.requestChangeValues[field] = this.ip_details.controls[field].value;
        }
      }
    }
    this.requestChangeValues = { ...this.requestChangeValues, [constants.itemPlanId]: this.ip_details.controls[constants.itemPlanId].value };
    this.showRequestChangePopup = true;
  }

  progressChangeRequest = () => {
    const { formValues: values, changedFields } = this.requestChangeComp.getChangedRequestValues();
    if (Object.keys(changedFields).length === 0) {
      this.requestChangeError = true;
      return;
    }
    this.coreService.showLoader();
    this.itemPlanDetailService.saveChangeRequest(values).subscribe(res => {
      this.requestChangeError = false;
      let status = 'error', msg = 'Error submitting Change Request. Please try again later.';
      if (res.status === 200) {
        if (res.body && res.body['StatusType'] === 'SUCCESS') {
          status = 'success';
          msg = res.body['Message'];
          this.showRequestChangePopup = false;
          this.showMFCRId(res.body[constants.mfcrIdAPIKey]);
        } else {
          msg = res.body['Message'] || msg;
        }
      }
      this.itemPlanDetailService.displayMessage(status, msg);
      this.coreService.hideLoader();
    });
  }

  cancelChangeReq = () => {
    const postData = {
      [constants.mfcrIdAPIKey]: this.changeRequestId,
      'STATUS': 'Canceled'
    };
    this.coreService.showLoader();
    this.itemPlanDetailService.cancelChangeRequest(postData).subscribe(res => {
      let status = 'error', msg = 'Error cancelling Change Request. Please try again later.';
      if (res.status === 200) {
        if (res.body && res.body['StatusType'] === 'SUCCESS') {
          status = 'success';
          msg = res.body['Message'];
          this.getItemIdData(false, '');
        } else {
          msg = res.body['Message'] || msg;
        }
      }
      this.itemPlanDetailService.displayMessage(status, msg);
      this.coreService.hideLoader();
    });
  }

  requestChangeCancelClicked = () => {
    this.showRequestChangePopup = false;
    this.requestChangeError = false;
  }

  requestChangeClosed = () => {
    this.requestChangeValues = {};
    this.showRequestChangePopup = false;
    this.requestChangeError = false;
  }

  ngAfterViewInit() {
    this.hasEdit = false;
  }

  ngOnDestroy() {
    this.dialog.ngOnDestroy();
    this.showCreatePopup = false;
    this.showRequestChangePopup = false;
  }

  canDeactivate = () => {
    this.dialog.ngOnDestroy();
    this.showCreatePopup = false;
    this.showConfirmationPopup = false;
    this.showRequestChangePopup = false;
    this.hideIfMaskPresent();
    if (this.hasEdit && this.isEditable) {
      this.modalService.open();
      return this.modalService.getConfirmationSubject();
    }
    return true;
  }
  hideIfMaskPresent = () => {
    //checking for any unclosed masks. Couldn't find a better way;
    const masks = document.querySelectorAll('.ui-widget-overlay.ui-dialog-mask');
    if (masks && masks.length > 0) {
      Array.from(masks).forEach(mask => {
        if (mask['style']) {
          mask['style']['display'] = 'none';
        }
      })
    }
    const body = <HTMLElement>document.querySelector('body.ui-overflow-hidden');
    if (body) {
      body.style.overflow = 'unset';
    }
  }

  hasEdited = (eve?) => {
    this.hasEdit = true;
  }
}
