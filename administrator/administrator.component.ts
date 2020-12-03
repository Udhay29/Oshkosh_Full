import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdministrativeService } from '../administrator/administrator.service';
import { ToastrService } from 'ngx-toastr';
import { planninParameterColumns } from './constants';
import { CoreServices } from 'src/app/core/services/core.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ConfirmationService } from 'primeng/api';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'pfep-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdministratorComponent implements OnInit {
  ip_form: FormGroup;
  user_form: FormGroup;
  selectedSearchItem: any;
  searchCriteria: any;
  Roles = [];
  showSearch = false;
  displayDialog = false;
  invalidUserFlag = false;
  serachResults: any = [];
  configTypes: any = [];
  rowSelected: any;
  showTable: any;
  Facilities: any = [];
  postData = [];
  Organizantions = [];
  Oshkosh_Id = '';
  invalidUserMsg = '';
  userDefaultErrorMsg = '';
  userDefaultErrorMsgFlag = false;
  selctedRecord = [];
  configDetails = [];
  Org_Id = '';
  Facility_Id = '';
  Work_Center_Id = '';
  workCenter_status = false;
  col: any;
  multiRoles = [];
  onChangeFacility: any = [];
  UpdatedUsers: any = [];
  isAdmin = false;
  submitted = false;
  editAccess = false;
  currentUser: any;
  set_workcenter: any = '';
  userAccessAdmin = 'USER ACCESS ADMINISTRATOR';
  selecteddropDownValue = { 'FIELD_NAME': 'WORK_CENTER_ID' };
  workCenter: any = {
    serviceUrl: {
      dropdown: 'WildcardSearch/GetFields?fieldName=WORK_CENTER_ID',
      table: 'WildcardSearch/GetDropdownValuesWorkCenter'
    },
    tableFields: [
      { header: 'ID', field: 'WORK_CENTER_ID' },
      { header: 'Description', field: 'WORK_CENTER_DESC' }
    ],
    label: 'Work Center',
    isMultiSelect: true,
    selectedData: [],
    options: [],
    modelName: 'WORK_CENTER_ID',
    styleclass: 'col-md-2',
    dependentData: ''
  };
  columnsUnderGroup = planninParameterColumns.columns;
  selectedConfigType: any;
  userOrganizantionsList: { ORG_ID: any; }[];
  AllOrganizantions: Object;
  AllOrganizantionsList: { ORG_ID: any; }[];
  defaultselecteddropDownValue = { 'FIELD_NAME': 'WORK_CENTER_ID' };
  work_center_id_list = [];
  isBusinessAdmin: boolean;
  invalidRoles: any;
  enableCheckAll: any;
  hasEdit: boolean = false;


  constructor(fb: FormBuilder, public administrativeService: AdministrativeService, private toastr: ToastrService, private modalService: ModalService,
    private coreServices: CoreServices, private route: ActivatedRoute, private auth: AuthService,
    private confirmationService: ConfirmationService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.work_center_id_list = JSON.parse(this.currentUser.work_center_id_list);
    // const OrgId = this.currentUser.org_id;
    // this.userOrganizantionsList = [{ORG_ID: OrgId}];
    // const facilityId = this.currentUser.facility_id;
    // this.Facilities = [{FACILITY_ID: facilityId}];

    this.ip_form = fb.group({
      ORG_ID: [this.currentUser['org_id'], false],
      FACILITY_ID: [this.currentUser['facility_id'], false],
      emailopt: [this.currentUser['emailopt'], false],
      // WORK_CENTER_ID: [this.work_center_id_list, false],
      OSHKOSH_ID: [this.currentUser['user_name'], false]
    });
    this.workCenter.selectedData = (this.work_center_id_list) ? this.work_center_id_list.map(obj => ({ WORK_CENTER_ID: obj })) : [];
    this.workCenter.options = this.work_center_id_list.map(obj => ({ WORK_CENTER_ID: obj }));
    this.user_form = fb.group({
      OSHKOSH_ID: [null, false],
      USER_ROLE: [null, false],
      OrgId: [null, false]
    });
  }

  ngOnInit() {
    document.execCommand('ClearAuthenticationCache');
    const routeRoles = this.route.snapshot.data.roles;
    // this.isAdmin = this.coreServices.checkAccess(routeRoles);

    const isUserAdmin = this.route.snapshot.data.roles.All;
    const isBusinessAdmin = this.route.snapshot.data.roles.Partial;
    this.isAdmin = this.coreServices.checkAccess(isUserAdmin);
    this.isBusinessAdmin = this.coreServices.checkAccess(isBusinessAdmin);
    this.subscribeToValueChanges();

    if (this.isAdmin) {
      this.createUserObject();
      this.administrativeService.getAllRoleDetails()
        .subscribe(res => {
          this.Roles = res;
          this.multiRoles = this.Roles.map(obj => ({ APP_ROLE_DESC: obj, APP_ROLE_NAME: obj }));
        });
    } else if (this.isBusinessAdmin) {
      this.getConfigTypes();
    }
    this.administrativeService.getFilterDefaults(this.currentUser['user_name'])
      .subscribe(res => {
        if (res.StatusType === "FAILURE") {
          this.displayMessage('danger', res.Message);
          return;
        }
        this.Facilities = res.FACILITIES;
        this.userOrganizantionsList = res.ORGANIZATIONS.map(obj => ({ ORG_ID: obj.ORG_ID }));
        this.workCenter.dependentData = {
          ORG_ID: this.ip_form.value.ORG_ID,
          FACILITY_ID: this.ip_form.value.FACILITY_ID,
          WorkCenterList: ''
        };
      });
    this.administrativeService.getAllOrganizations()
      .subscribe((res: any) => {
        this.AllOrganizantionsList = res.map(obj => ({ ORG_ID: obj }));
      });
    this.administrativeService.currentMessage.subscribe(data => (this.selectedSearchItem = data));
  }

  wildCardChangeEvent(data) {
    this.ip_form.markAsDirty();
    this.workCenter.selectedData = data.selectedData;
    this.hasEdit = true;
  }
  createUserObject() {
    this.col = { OSHKOSH_USER_ID: null, APP_ROLES: [] };
  }

  editRecord = rec => {
    this.col = rec;
    this.displayDialog = true;
  }

  showPopUp() {
    this.displayDialog = true;
  }



  deleteUsers() {
    if (this.selctedRecord.length > 0) {
      const post = this.selctedRecord.map(obj => obj.OSHKOSH_USER_ID);
      this.administrativeService.DeleteUserDetails(post)
        .subscribe(res => {
          console.log(res);
          this.selctedRecord = [];
          this.searchRoleDetails();
          this.toastr.success('Deleted successfully', '', { disableTimeOut: false });
        });
    }
  }

  searchSaveDefault(data) {
    data['WORK_CENTER_ID_LIST'] = this.workCenter.selectedData.map(obj => obj.WORK_CENTER_ID);
    if ((data.ORG_ID && data.ORG_ID.length) && (data.FACILITY_ID && data.FACILITY_ID.length)) {
      this.selectedSearchItem = false;
      this.administrativeService.PostDefaultValues(data)
        .subscribe(res => {
          if (res['StatusType'] === 'SUCCESS') {
            this.displayMessage('success', 'Data Saved Sucessfully');
            this.hasEdit = false;
            this.auth.load();
          } else {
            this.displayMessage('danger', res['Message']);
          }
        });
    } else {
      this.displayMessage('danger', 'Enter Valid Data');
    }
  }

  displayMessage = (type, message) => {
    type === 'success' ? this.toastr.success(message, '', { disableTimeOut: false }) : this.toastr.error(message);
  }

  createRolesSegmentObj(post) {
    post.forEach(obj => {
      obj.APP_ROLES = obj.APP_ROLES.map(eve => eve.APP_ROLE_NAME);
      obj.ORG_ID_LIST = obj.ORG_ID.map(eve => eve.ORG_ID);
    });
    return post;
  }


  addUser(form) {
    this.submitted = true;
    if (form.valid) {
      const addData = [];
      addData.push(JSON.parse(JSON.stringify(this.col)));
      const post = this.createRolesSegmentObj(addData);
      this.saveuser(post, form);
      this.displayDialog = false;
      // this.createUserObject();
      this.submitted = false;
    }
  }

  async checkValidUser() {
    if (this.col.OSHKOSH_USER_ID) {
      const response = await this.administrativeService.checkValidUser(this.col.OSHKOSH_USER_ID).toPromise();
      if (response['StatusType'] === 'FAILURE') {
        this.invalidUserMsg = response['Message'];
        this.invalidUserFlag = true;
      } else {
        this.invalidUserFlag = false;
        this.invalidUserMsg = '';
      }
    }
  }

  async checkUser() {
    this.administrativeService.getFilterDefaults(this.ip_form.value.OSHKOSH_ID)
      .subscribe(data => {
        if (data['StatusType'] === 'SUCCESS') {
          this.userDefaultErrorMsg = '';
          this.userDefaultErrorMsgFlag = false;
          const selectedOrg = data.ORGANIZATIONS.find(obj => obj.IsSelected);
          const selectedFacility = data.FACILITIES.find(obj => obj.IsSelected);
          this.userOrganizantionsList = data.ORGANIZATIONS.map(obj => ({ ORG_ID: obj.ORG_ID }));
          this.ip_form.controls['ORG_ID'].setValue(selectedOrg !== undefined ? selectedOrg.ORG_ID : null);
          this.ip_form.controls['FACILITY_ID'].setValue(selectedFacility !== undefined ? selectedFacility.FACILITY_ID : null);
          this.set_workcenter = data.WORK_CENTER_ID_LIST;
          this.workCenter.dependentData = {
            ORG_ID: this.ip_form.value.ORG_ID,
            FACILITY_ID: this.ip_form.value.FACILITY_ID,
            WorkCenterList: ''
          };
        } else {
          this.userDefaultErrorMsg = data['Message'];
          this.userDefaultErrorMsgFlag = true;
        }
      });
  }



  editRow(index) {
    this.serachResults[index]['modified'] = true;
    this.serachResults[index]['ORG_ID'] = this.serachResults[index]['ORG_ID_LIST'].map(obj => ({ ORG_ID: obj, }));
  }

  rowSegmentChanged(index) {
    this.serachResults[index]['ORG_ID_LIST'] = this.serachResults[index]['ORG_ID'].map(obj => obj.ORG_ID);
  }

  updateUsers() {
    const modifiedUsers = this.serachResults.filter(obj => obj.modified);
    const users = this.createRolesSegmentObj(JSON.parse(JSON.stringify(modifiedUsers)));
    this.saveuser(users);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngDoCheck() {
    this.UpdatedUsers = this.serachResults.filter(obj => obj.modified);
  }

  checkRolesValidation(post) {
    this.invalidRoles = post.some(e => e.APP_ROLES.length > 1 && e.APP_ROLES.includes(this.userAccessAdmin));
  }

  saveuser(users, form?) {
    this.checkRolesValidation(users);
    if (users.length > 0 && !this.invalidRoles) {
      this.administrativeService.SaveUserDetails(users)
        .subscribe((res: any) => {
          if (res.StatusType !== 'FAILURE') {
            form ? form.reset({}) : null;
            this.searchRoleDetails('save');
            this.auth.load();
          }
          this.parseResponse(res);
        });
    } else {
      !this.invalidRoles ? this.displayMessage('danger', 'Update any user to Save changes') : null;
    }
  }

  parseResponse = res => {
    let type = res['StatusType'] === 'SUCCESS' ? 'success' : 'danger';
    let msg = res['Message'];
    if (res['Message'].indexOf('is not found') > -1) {
      type = 'danger';
      msg = res['StatusType'] === 'SUCCESS'
        ? 'One or more User ID\'s were invalid. Valid User details have been saved successfully'
        : 'One or more User ID\'s were invalid. Please enter valid data.';
    }
    this.displayMessage(type, msg);
  }

  searchRoleDetails(save?) {
    this.selctedRecord = [];
    if ((this.user_form.value.OSHKOSH_ID && this.user_form.value.OSHKOSH_ID.length) ||
      (this.user_form.value.OrgId && this.user_form.value.OrgId.length) ||
      (this.user_form.value.USER_ROLE && this.user_form.value.USER_ROLE.length)
    ) {
      this.selectedSearchItem = false;
      this.searchCriteria = {
        OshkoshID: this.user_form.value.OSHKOSH_ID,
        UserRole: this.user_form.value.USER_ROLE,
        OrgId: this.user_form.value.OrgId
      };
      this.administrativeService.SearchUserDetails(this.searchCriteria)
        .subscribe(res => {
          this.serachResults = res;
          this.enableCheckAll = this.serachResults.some(e => e.OSHKOSH_USER_ID === this.currentUser.user_name);
          this.showTable = true;
        });
    } else {
      if (save !== 'save') {
        this.toastr.error('Enter Valid Data');
      }
    }
  }

  onChangeSegment(event) {
    const segment = event.target.value;
    this.ip_form.controls['FACILITY_ID'].setValue(null);
    this.administrativeService.getBranchDropDownList(segment)
      .subscribe(data => (this.Facilities = data));
    this.workCenterInit();
  }

  setEmailOpt(event) {
    const emailopt = event.target.checked;
    this.ip_form.controls['emailopt'].setValue(emailopt);

  }

  setWorkcenter() {
    this.workCenter = {
      serviceUrl: {
        dropdown: 'WildcardSearch/GetFields?fieldName=WORK_CENTER_ID',
        table: 'WildcardSearch/GetDropdownValuesWorkCenter'
      },
      tableFields: [
        { header: 'ID', field: 'WORK_CENTER_ID' },
        { header: 'Description', field: 'WORK_CENTER_DESC' }
      ],
      label: 'Work Center',
      isMultiSelect: true,
      selectedData: this.set_workcenter === '' ? [] : this.set_workcenter,
      options: [],
      modelName: 'WORK_CENTER_ID',
      styleclass: 'col-md-2',
      dependentData: {
        ORG_ID: this.ip_form.value.ORG_ID,
        FACILITY_ID: this.ip_form.value.FACILITY_ID,
        WorkCenterList: []
      }
    };
  }


  workCenterInit() {
    this.workCenter = {
      serviceUrl: {
        dropdown: 'WildcardSearch/GetFields?fieldName=WORK_CENTER_ID',
        table: 'WildcardSearch/GetDropdownValuesWorkCenter'
      },
      tableFields: [
        { header: 'ID', field: 'WORK_CENTER_ID' },
        { header: 'Description', field: 'WORK_CENTER_DESC' }
      ],
      label: 'Work Center',
      isMultiSelect: true,
      selectedData: this.set_workcenter === '' ? [] : this.set_workcenter,
      options: [],
      modelName: 'WORK_CENTER_ID',
      styleclass: 'col-md-2',
      dependentData: {
        ORG_ID: this.ip_form.value.ORG_ID,
        FACILITY_ID: '',
        WorkCenterList: ''
      }
    };
  }

  reset() {
    this.ip_form.reset();
  }

  confirmDelete() {
    this.confirmationService.confirm({
      message: 'Do you want to delete the user(s)?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteUsers();
      },
      reject: () => {
        // this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'You have rejected' }];
      }
    });
  }


  subscribeToValueChanges = () => {
    this.ip_form.valueChanges
      .subscribe(val => {
        this.hasEdit = true;
      });
  }

  isValueChanged(eve) {
    this.hasEdit = true;
  }

  canDeactivate = () => {
    this.hasEdit = (this.hasEdit || this.UpdatedUsers.length !== 0 || this.selctedRecord.length > 0) ? true : false;
    if (this.hasEdit) {
      this.modalService.open();
      return this.modalService.getConfirmationSubject();
    }
    return true;

  }

  //  configuration section
  getConfigTypes() {
    this.administrativeService.getConfigDefaultAlerts()
      .subscribe(data => {
        this.configTypes = data;
      });
  }

  deleteConfig(eve) {
    this.coreServices.showLoader();
    this.administrativeService.deleteConfigDetails(eve)
      .subscribe((data: any) => {
        this.coreServices.hideLoader();
        this.displayMessage('success', data.Message);
        this.configChanged(this.selectedConfigType);
      }, () => this.coreServices.hideLoader());
  }

  saveorupdateAlertConfig(eve) {
    this.coreServices.showLoader();
    this.administrativeService.saveConfigDetails(eve)
      .subscribe((data: any) => {
        this.coreServices.hideLoader();
        this.hasEdit = false;
        this.displayMessage('success', data.Message);
        this.configChanged(this.selectedConfigType);
      }, () => this.coreServices.hideLoader());
  }


  configChanged(eve) {
    this.selectedConfigType = eve;
    this.coreServices.showLoader();
    this.administrativeService.getConfigDetails(eve)
      .subscribe((data: any) => {
        this.configDetails = data;
        this.coreServices.hideLoader();
      });
  }

  ngAfterViewInit() {
    this.hasEdit = false;
  }

}
