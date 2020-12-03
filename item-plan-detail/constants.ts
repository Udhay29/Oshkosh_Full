import { Validators } from '@angular/forms';

export const businessAdmin = 'BUSINESS ADMINISTRATOR';
export const erpContainer = 'ERP_CONTAINER_CODE';
export const erpKanbanCards = 'ERP_KNBN_CARDS_NBR';
export const erpCtrSize = 'ERP_CONTAINER_SIZE';
export const containerERPCode = 'CONTAINER_ERP_CODE';
export const QHS = 'HANDSTACK_SPACE_QUANTITY';
export const QPB = 'BAG_QUANTITY';
export const QBPH = 'BAGS_PER_HOOK_QUANTITY';
export const kitType = 'KIT_TYPE';
export const masterKitID = 'MASTER_KIT_ID';
// export const kitAllowance = 'KIT_SPACE_ALLOWANCE';
export const linesideQueue = 'LINE_SIDE_QUEUE_QTY';
export const lineside = 'LINESIDE_REQUIREMENT';
export const MFP = 'MATERIAL_FLOW_PLANS';
export const MFPDesc = 'MFP_DESC';
export const HSL = 'HANDSTACK_SPACE_LENGTH';
export const HSW = 'HANDSTACK_SPACE_WIDTH';
export const HSH = 'HANDSTACK_SPACE_HEIGHT';
export const KSL = 'KIT_SPACE_LENGTH';
export const KSW = 'KIT_SPACE_WIDTH';
export const KSH = 'KIT_SPACE_HEIGHT';
export const itemId = 'ITEM_ID';
export const workCenter = 'WORKCENTERS';
export const branch = 'BRANCHES';
export const containerCode = 'CONTAINER_CODE';
export const presentation = 'PRESENTATION_METHOD';
export const pickFacingQnty = 'PICK_FACING_QNTY';
export const ADU = 'ADU';
export const pid = 'PID';
export const AID = 'AID';
export const presentationTypeKey = 'PRESENTATION_TYPE';
export const itemPlanId = 'ITEM_PLAN_ID';
export const itemDesc = 'ITEM_DESC';
export const effectiveDate = 'EFFECTIVE_DATE';
export const expireDate = 'EXPIRE_DATE';
export const orgId = 'ORG_ID';
export const supplyingLocation = 'SUPPLYING_LOCATIONS';
export const stockingType = 'STOCKING_TYPE';
export const taskId = 'TASK_ID';
export const containerQty = 'CONTAINER_QTY';
export const HRPQ = 'HDS_REORDER_POINT_QTY';
export const HPQ = 'HDS_REORDER_QTY';
export const orientation = 'CONTAINER_ORIENTATION';
export const itmPlanStatus = 'ItemPlanStatus';
export const doNotPlan = 'DO_NOT_PLAN';
export const IH = 'ITEM_HEIGHT';
export const IL = 'ITEM_LENGTH';
export const IW = 'ITEM_WIDTH';
export const DUO = 'DAILY_USAGE_OVERRIDE';
export const ECW = 'EMPTY_CONTAINER_WEIGHT';
export const superMarketId = 'SUPERMARKET_ID';
export const superMarketIdDDKey = 'SUPERMARKET_VALUE';
export const replenishCycles = 'REPLENISH_CYCLE_BY_DAYS';
export const superMarketInd = 'SUPERMARKET_IND';
export const replenishmentMethod = 'REPLENISHMENT_METHOD_CODE';
export const plannedInWC = 'PLANNED_IN_WC_ID';
export const SPQ = 'STANDARD_PACK_QUANTITY';
export const superMarketQueue = 'SUPERMARKET_QUEUE';
export const masterKitSelectValue = 'MASTER KIT';
export const cwoKitSelectValue = 'CWO KIT';
export const supplierCtr = 'ERP_LVL_ONE_CONTAINER';
export const ctrSID = 'CONTAINER_SID';

export const ctrDimHeight = 'CONTAINER_IN_HEIGHT';
export const ctrDimWidth = 'CONTAINER_IN_WIDTH';
export const ctrDimLength = 'CONTAINER_IN_LENGHT';

export const orientationDDKey = 'ORIENTATION';
export const itemPlanStatusDDKey = 'ITEM_PLAN_STATUS';
export const doNotPlanDDKey = 'DO_NOT_PLAN';
export const kitTypeDDKey = 'KIT_TYPE';
export const branchDDKey = 'FACILITY_ID';
export const workCenterDDKey = 'WORK_CENTER_ID';
export const supplyingLocationDDKey = 'SUPPLYING_LOCATION';
export const MFPDDKey = 'MTRL_FLOW_PLAN_ID';
export const wCRackID = 'WC_STORAGE_UNIT_ID';
export const wCRackSID = 'WC_STORAGE_UNIT_SID';
export const assignRackText = 'Assign to Rack';
export const dateFormat = 'MM/DD/YYYY';

export const warning_containerCode = 'ALLOW_DIFFERENT_CONTAINER';
export const warning_containerCode_errorKey = 'DIFFERENT_CONTAINER';
export const warning_containerQty = 'ALLOW_EXCESS_QUANTITY';
export const warning_containerQty_errorKey = 'EXCEEDS_INVENTORY_CEILING';
export const warning_plannedInWC_errorKey = 'PLANNED_WC';

export const wildCardLookUpConfig = [
  {
    serviceUrl: {
      dropdown: 'WildcardSearch/GetFields?fieldName=FACILITY_ID',
      table: 'WildcardSearch/GetDropdownValuesWarehouse'
    },
    tableFields: [
      { header: 'ID', field: 'FACILITY_ID' },
      { header: 'Description', field: 'FACILITY_DESC' }
    ],
    label: '',
    labelText: 'Branch',
    isMultiSelect: false,
    selectedData: '',
    modelName: 'FACILITY_ID',
    styleclass: 'col-md-2',
    defaultselecteddropDownValue: { FIELD_NAME: 'FACILITY_ID' }
  },
  {
    serviceUrl: {
      dropdown: 'WildcardSearch/GetFields?fieldName=WORK_CENTER_ID',
      table: 'WildcardSearch/GetDropdownValuesWorkCenter'
    },
    tableFields: [
      { header: 'ID', field: workCenterDDKey },
      { header: 'Description', field: 'WORK_CENTER_DESC' }
    ],
    label: '',
    labelText: 'Work Center',
    isMultiSelect: false,
    selectedData: '',
    options: [],
    modelName: workCenterDDKey,
    styleclass: 'col-md-2',
    dependentData: '',
    defaultselecteddropDownValue: { FIELD_NAME: 'WORK_CENTER_ID' }
  },
  {
    serviceUrl: {
      dropdown: 'WildcardSearch/GetFields?fieldName=ITEM_ID',
      table: 'WildcardSearch/GetDropdownValues'
    },
    tableFields: [
      { header: 'ID', field: itemId },
      { header: 'Description', field: 'ITEM_DESC' }
    ],
    label: '',
    labelText: 'Item Number',
    isMultiSelect: false,
    selectedData: '',
    modelName: itemId,
    styleclass: 'col-md-2',
    dependentData: '',
    defaultselecteddropDownValue: { FIELD_NAME: 'ITEM_ID' }
  }
];

export const planCodesColumns = [
  { header: 'Item Plan Code', APIMap: itemPlanId },
  { header: 'Part Number', APIMap: itemId },
  { header: 'Work Center', APIMap: workCenterDDKey },
  { header: 'Supplying Location', APIMap: supplyingLocationDDKey },
  { header: 'Task Id', APIMap: taskId }
];

export const formInputFields = {
  [itemPlanId]: [null],
  [itemId]: [null],
  [itemDesc]: [null],
  [orgId]: [null],
  [branch]: [null],
  [workCenter]: [null],
  [supplyingLocation]: [null],
  [MFP]: [null],
  [containerCode]: [null],
  [containerQty]: [null],
  [linesideQueue]: [null],
  LINESIDE_REQUIREMENT: [null],
  [pickFacingQnty]: [null],
  [stockingType]: [null],
  [taskId]: [null],
  [ADU]: [null],
  [AID]: [null],
  [pid]: [null],
  [plannedInWC]: [null],
  [QHS]: [null],
  [DUO]: [null],
  [HRPQ]: [null],
  [HPQ]: [null],
  [IL]: [null],
  [IW]: [null],
  [IH]: [null],
  [DUO]: [null],
  [ECW]: [null],
  [kitType]: [null],
  [QPB]: [null],
  [QBPH]: [null],
  [presentation]: [null],
  [orientation]: [null],
  [itmPlanStatus]: [null],
  [doNotPlan]: [null],
  [effectiveDate]: [null],
  [expireDate]: [null],
  [HSL]: [null],
  [HSW]: [null],
  [HSH]: [null],
  [erpContainer]: [null],
  [erpKanbanCards]: [null],
  [erpCtrSize]: [null],
  [ctrDimHeight]: [null],
  [ctrDimLength]: [null],
  [ctrDimWidth]: [null],
  [supplierCtr]: [null],
  [SPQ]: [null],
  [ctrSID]: [null],
  [superMarketId]: [null],
  [replenishCycles]: [null],
  [replenishmentMethod]: [null],
  [wCRackID]: [null],
  [wCRackSID]: [null]
};

export const createPlanAttributes = [
  {
    title: 'Material Flow Plan',
    type: 'dropDown',
    formControlName: MFPDDKey,
    valueKey: MFPDesc
  },
  {
    title: 'Effective Date',
    type: 'date',
    key: effectiveDate,
    formControlName: effectiveDate
  },
  {
    title: 'Expire Date',
    type: 'date',
    key: expireDate,
    formControlName: expireDate
  }
];

export const createPlanDDAPIMap = {
  [MFPDDKey]: 'getMFPList'
}

export const createPlanMandatoryAttrs = [MFPDDKey, effectiveDate];

export const itemPlanAttributes = [
  { title: 'Item Plan Id', type: 'text', formControlName: itemPlanId },
  { title: 'Item Number', type: 'text', formControlName: itemId },
  { title: 'Item Dimensions', type: 'multi', key: 'itemDims' },
  { title: 'Description', type: 'text', formControlName: itemDesc },
  { title: 'Organization', type: 'text', formControlName: orgId },
  { title: 'Facility', type: 'dropdown', formControlName: branch, key: branch, ddKey: branchDDKey },
  { title: 'WorkCenter', type: 'dropdown', formControlName: workCenter, key: workCenter, ddKey: workCenterDDKey },
  {
    title: 'Supplying Location',
    type: 'dropdown',
    key: supplyingLocation,
    formControlName: supplyingLocation,
    ddKey: supplyingLocationDDKey
  },
  {
    title: 'Material Flow Plan',
    type: 'dropdown',
    key: MFP,
    formControlName: MFP,
    ddKey: MFPDDKey,
    valueKey: MFPDesc
  },
  {
    title: 'Supermarket Id',
    type: 'supermarket-id-dropdown',
    key: superMarketId,
    formControlName: superMarketId,
    ddKey: superMarketIdDDKey
  },
  {
    title: 'Presentation Method',
    type: 'dropdown',
    key: presentation,
    formControlName: presentation,
    ddKey: presentationTypeKey
  },
  { title: 'POU Container', type: 'text', formControlName: containerCode },
  {
    title: 'POU Container Qty.',
    type: 'number',
    formControlName: containerQty
  },
  {
    title: '# of Cards',
    type: 'number',
    formControlName: linesideQueue
  },
  { title: 'Pick facings', type: 'number', formControlName: pickFacingQnty },
  {
    title: 'Orientation',
    type: 'dropdown',
    key: orientation,
    formControlName: orientation,
    ddKey: orientationDDKey
  },
  {
    title: 'Item Plan Status',
    type: 'item-plan-dropdown',
    key: itmPlanStatus,
    formControlName: itmPlanStatus,
    ddKey: itemPlanStatusDDKey
  },
  {
    title: 'Work Center Rack ID',
    type: 'link',
    key: wCRackID,
    formControlName: wCRackID
  },
  {
    title: 'Effective Date',
    type: 'date',
    key: effectiveDate,
    formControlName: effectiveDate
  },
  {
    title: 'Expire Date',
    type: 'date',
    key: expireDate,
    formControlName: expireDate
  },
  { title: 'Stocking Type', type: 'text', formControlName: stockingType },
  { title: 'Task ID', type: 'text', formControlName: taskId },
  { title: 'PID', type: 'text', formControlName: pid },
  { title: 'ADU', type: 'text', formControlName: ADU },
  { title: 'AID', type: 'text', formControlName: AID },
  { title: 'Daily Usage Override', type: 'text', formControlName: DUO },
  {
    title: 'Replenishment Cycle',
    type: 'number',
    formControlName: replenishCycles
  },
  {
    title: 'Replenishment Method',
    type: 'text',
    formControlName: replenishmentMethod
  },
  {
    title: 'Planned In WC',
    type: 'text',
    formControlName: plannedInWC
  },
  {
    title: 'Do Not Plan',
    type: 'dropdown',
    key: doNotPlan,
    formControlName: doNotPlan,
    ddKey: doNotPlanDDKey
  },
  {
    title: 'Kit Type',
    type: 'dropdown',
    key: kitType,
    formControlName: kitType,
    ddKey: kitType
  },
  { title: 'Handstack Space', type: 'multi', key: 'handStack' },
  {
    title: 'Handstack Space Qty.',
    type: 'number',
    formControlName: QHS
  },
  { title: 'Reorder Point (Qty)', formControlName: HRPQ, type: 'number' },
  { title: 'Reorder Quantity', formControlName: HPQ, type: 'number' },
  { title: 'Bag Qty', type: 'number', formControlName: QPB },
  {
    title: 'Bags Per Loop',
    type: 'number',
    formControlName: QBPH
  }
];



export const erpFields = [
  {
    title: 'POU Container',
    type: 'text',
    formControlName: erpContainer
  },
  {
    title: '# Of Kanban Cards',
    type: 'text',
    formControlName: erpKanbanCards
  },
  {
    title: 'ERP POU Container Qty',
    type: 'text',
    formControlName: erpCtrSize
  },
  {
    title: 'Supplier Container',
    type: 'text',
    formControlName: supplierCtr
  },
  {
    title: 'Supplier SPQ',
    type: 'text',
    formControlName: SPQ
  },
  { title: 'POU Container  Dimensions', type: 'multi', key: 'ctrDims' },
  {
    title: 'Empty Container Weight',
    type: 'text',
    formControlName: ECW
  }
];

export const multiValueFieldsmap = {
  handStack: [
    { title: 'L', type: 'number', formControlName: HSL },
    { title: 'W', type: 'number', formControlName: HSW },
    { title: 'H', type: 'number', formControlName: HSH }
  ],
  kitSpace: [
    { title: 'L', type: 'number', formControlName: KSL },
    { title: 'W', type: 'number', formControlName: KSW },
    { title: 'H', type: 'number', formControlName: KSH }
  ],
  itemDims: [
    { title: 'L', type: 'number', formControlName: IL },
    { title: 'W', type: 'number', formControlName: IW },
    { title: 'H', type: 'number', formControlName: IH }
  ],
  ctrDims: [
    { title: 'L', type: 'number', formControlName: ctrDimLength },
    { title: 'W', type: 'number', formControlName: ctrDimWidth },
    { title: 'H', type: 'number', formControlName: ctrDimHeight }
  ]
};

export const numberFields = [
  itemPlanId,
  containerQty,
  linesideQueue,
  pickFacingQnty,
  replenishCycles,
  SPQ,
  HRPQ,
  HPQ,
  QPB,
  QBPH
];

export const floatFields = [
  HSL,
  HSW,
  HSH,
  IL,
  IW,
  IH,
  ctrDimLength,
  ctrDimWidth,
  ctrDimHeight,
  QHS
];

export const searchFields = {
  [MFP]: {
    API: 'ItemPlanDetail/GetMaterialFlowPlans',
    key: MFP,
    displayOrder: [MFPDesc, replenishCycles, superMarketInd]
  }
};

export const bulkSelectValue = 'Bulk';
export const binSelectValue = 'Bin';
const handStackSelectValue = 'Hand Stack';
const bagSelectValue = 'Bag';
export const kitSelectValue = 'Kit';
const callSelectValue = 'Call';

export const editableFieldsMap = {
  [binSelectValue]: [containerCode, containerQty, MFP, linesideQueue],
  [handStackSelectValue]: [QHS, HSL, HSH, HSW, MFP, HRPQ, HPQ],
  [bagSelectValue]: [QPB, QBPH, MFP],
  [kitSelectValue]: [
    kitType,
    MFP
  ],
  [bulkSelectValue]: [linesideQueue, containerQty, MFP, containerCode],
  [callSelectValue]: [linesideQueue, MFP]
};

export const allEditableFields = [
  containerCode,
  containerQty,
  QHS,
  QPB,
  MFP,
  presentation,

  HSL,
  HSW,
  HSH,
  HRPQ,
  HPQ,
  kitType,
  QBPH,
  linesideQueue,
  lineside,
  superMarketId,
  branch,
  workCenter,
  supplyingLocation
];

export const disabledFields = [
  // containerCode,
  // containerQty,
  // QHS,
  // QPB,
  // QBPH,
  // HRPQ,
  // HPQ,
  // kitType,

  itemPlanId,
  itemId,
  itemDesc,
  orgId,
  stockingType,
  taskId,
  AID,
  pid,
  ADU,
  DUO,
  replenishCycles,
  replenishmentMethod,
  IL,
  IW,
  IH
];
export const copyPlanEditableFields = [branch, workCenter, supplyingLocation, MFP, presentation];
export const copyPlanClearFields = [itemPlanId, stockingType, taskId, pid, ADU, AID, DUO];
export const cndtnlEditableFields = [superMarketId, branch, workCenter, supplyingLocation];

export const mandatoryFields = [
  MFP,
  effectiveDate,
  presentation,
  itmPlanStatus
];

export const planStatusDisabledOpts = {
  PLANNING: ['ARCHIVED'],
  ARCHIVED: ['ACTIVE'],
  ACTIVE: []
};

export const dateFields = [effectiveDate, expireDate];

export const executeContainerValues = [
  itemId,
  workCenter,
  branch,
  containerCode,
  presentation,
  pickFacingQnty,
  pid
];

export const typeDropDown = {
  [branch]: branchDDKey,
  [workCenter]: workCenterDDKey,
  [supplyingLocation]: supplyingLocationDDKey,
  [MFP]: MFPDDKey,
  [presentation]: presentationTypeKey,
  [orientation]: orientationDDKey,
  [itmPlanStatus]: itemPlanStatusDDKey,
  [doNotPlan]: doNotPlanDDKey,
  [kitType]: kitTypeDDKey,
  [superMarketId]: superMarketIdDDKey
};

/* export const equivalentFieldsMap = {
  [containerCode]: erpContainer,
  [linesideQueue]: erpKanbanCards,
  [containerQty]: erpCtrSize,
  [erpContainer]: containerCode,
  [erpKanbanCards]: linesideQueue,
  [erpCtrSize]: containerQty
}; */

export const equivalentFieldsMap = {
  [handStackSelectValue]: {
    [erpCtrSize]: { field: QHS },
    [QHS]: { field: erpCtrSize },
    [erpContainer]: { value: ['HDS', 'SBX'] }
  },
  /* [kitSelectValue]: {
    [erpContainer]: {value: 'K'},
    [linesideQueue]: {field: erpKanbanCards},
    [containerQty]: {field: erpCtrSize},
    [erpKanbanCards]: {field: linesideQueue},
    [erpCtrSize]: {field: containerQty}
  }, */
  [bagSelectValue]: {
    [erpContainer]: { value: ['B'] },
    [QPB]: { field: erpCtrSize },
    [erpCtrSize]: { field: QPB },
    [erpKanbanCards]: { field: QBPH },
    [QBPH]: { field: erpKanbanCards }
  },
  [binSelectValue]: {
    [containerCode]: { field: erpContainer },
    [linesideQueue]: { field: erpKanbanCards },
    [containerQty]: { field: erpCtrSize },
    [erpContainer]: { field: containerCode },
    [erpKanbanCards]: { field: linesideQueue },
    [erpCtrSize]: { field: containerQty }
  },
  [bulkSelectValue]: {
    [containerCode]: { field: erpContainer },
    [linesideQueue]: { field: erpKanbanCards },
    [containerQty]: { field: erpCtrSize },
    [erpContainer]: { field: containerCode },
    [erpKanbanCards]: { field: linesideQueue },
    [erpCtrSize]: { field: containerQty }
  }
}

export const erpEmptyFields = [erpContainer, erpKanbanCards, erpCtrSize];

// Packaging calculator constants

export const executePostDataKeys = [itemId, branch, itemPlanId, workCenter, pid, presentationTypeKey];

export const standardContainers = 'STANDARD_CONTAINERS';
export const bulkContainers = 'BULK_CONTAINERS';
export const standardRacks = 'STANDARD_RACKS';
export const bulkRacks = 'BULK_RACKS';
export const rackDetails = 'RACK_DETAILS';
export const rackName = 'RACK_NAME';

export const containerId = 'CONTAINER_ID';
const maxDensity = 'MAX_DENSITY';
const fillCapacity = 'FILL_CAPACITY';
const grossWeight = 'GROSS_WEIGHT';
export const fitmentQty = 'FITMIT_QNTY';

export const standardContainersColumns = [
  { title: 'ID', APIMap: containerId },
  { title: 'Max. Density', APIMap: maxDensity },
  { title: 'Fill Capacity (lbs)', APIMap: fillCapacity },
  { title: 'Gross Weight (lbs)', APIMap: grossWeight },
  { title: 'Fitment Qty.', APIMap: fitmentQty, type: 'text' }
];

export const bulkContainersColumns = [
  { title: 'ID', APIMap: containerId },
  { title: 'Max. Density', APIMap: maxDensity },
  { title: 'Fill Capacity (lbs)', APIMap: fillCapacity },
  { title: 'Gross Weight (lbs)', APIMap: grossWeight },
  { title: 'Fitment Qty.', APIMap: fitmentQty, type: 'text' }
];

const capacity = 'CAPACITY';
const quanity = 'QUANTITY';
export const pickface = 'PICK_FACE_REQ';
const footPrints = 'PICK_FACE_REQ';
const linearInches = 'LINEAR';

export const standardContainerRackColumns = [
  { title: 'Capacity', APIMap: capacity },
  { title: 'Number of Containers', APIMap: quanity },
  { title: 'Recommended Qty.', APIMap: 'RECOMMENDED_QUANTITY' },
  { title: 'Pickface Req', APIMap: pickface },
  { title: 'Linear (in.)', APIMap: linearInches }
];

export const bulkContainerRackColumns = [
  { title: 'Capacity', APIMap: capacity },
  { title: 'Number of Containers', APIMap: quanity },
  { title: 'Recommended Qty.', APIMap: 'RECOMMENDED_QUANTITY' },
  { title: 'Footprints Req', APIMap: footPrints },
  { title: 'Linear (in.)', APIMap: linearInches }
];

export const fitmentSaveKeyMap = {
  ITEM_ID: itemId,
  FACILITY_ID: branch,
  ITEM_PLAN_ID: itemPlanId,
  CONTAINER_USAGE_DETAILS: []
};

export const isFromItemPlan = 'isFromItemPlan';


// Warning popup table constants

export const warningDetailsKey = 'ITEM_PLAN_LIST';
export const warningDetailsColumns = [
  { title: 'Item Plan Id', APIMap: itemPlanId },
  { title: 'Presentation Method', APIMap: presentationTypeKey },
  { title: 'POU Container', APIMap: containerCode },
  { title: 'POU Container Qty.', APIMap: containerQty },
  { title: 'Handstack Space Qty.', APIMap: QHS },
  { title: 'Bag Quantity', APIMap: QPB }
];
export const pfepSummaryScreenPath = './pfep-summary';


// request change constants

export const supplierQty = 'SUPPLIER_CONTAINER_QTY';
export const MOQ = 'MOQ';
export const MMOQ = 'MMOQ';
export const VOP = 'VOP';
export const safetyStock = 'SAFETY_STOCK';
export const project = 'PROJECT';
export const kanbanId = 'ERP_KANBAN_ID';
export const mfcrIdAPIKey = 'MFCR_SID';
export const mfcrApproveTaskId = 'MFCR_APPROVAL_TASK_SID';
export const supplierCont = 'SUPPLIER_CONTAINER';

export const requestChangeFields = [presentation, containerCode, containerQty, supplierQty, supplierCont, QHS, HRPQ, HPQ, QPB, QBPH, kitType, MFP, MOQ, MMOQ, SPQ, VOP, safetyStock, project, kanbanId];
export const requestChangeFormFields = {
  [presentation]: [null],
  [containerCode]: [null],
  [containerQty]: [null],
  [supplierCont]: [null],
  [supplierQty]: [null],
  [QHS]: [null],
  [HRPQ]: [null],
  [HPQ]: [null],
  [QPB]: [null],
  [QBPH]: [null],
  [kitType]: [null],
  [MFP]: [null],
  [MOQ]: [null],
  [MMOQ]: [null],
  [SPQ]: [null],
  [VOP]: [null],
  [safetyStock]: [null],
  [project]: [null],
  [kanbanId]: [null],

};
export const requestChangeAttrs = [
  {
    title: 'Presentation Method',
    type: 'dropdown',
    key: presentation,
    formControlName: presentation,
    ddKey: presentationTypeKey
  },
  {
    title: 'Material Flow Plan',
    type: 'dropdown',
    key: MFP,
    formControlName: MFP,
    ddKey: MFPDDKey,
    valueKey: MFPDesc
  },
  {
    title: 'Supplier Container',
    type: 'text',
    formControlName: supplierCont,
    maxlength: 20
  },
  {
    title: 'Supplier Container Qty',
    type: 'number',
    formControlName: supplierQty
  },
  {
    title: 'MOQ',
    type: 'number',
    formControlName: MOQ
  },
  {
    title: 'MMOQ',
    type: 'number',
    formControlName: MMOQ
  },
  {
    title: 'VOP',
    type: 'text',
    formControlName: VOP,
    maxlength: 50
  },
  {
    title: 'SPQ',
    type: 'number',
    formControlName: SPQ
  },
  {
    title: 'Safety Stock',
    type: 'number',
    formControlName: safetyStock
  },
  {
    title: 'Project',
    type: 'text',
    formControlName: project,
    maxlength: 50
  },
  {
    title: 'Kanban Id',
    type: 'text',
    formControlName: kanbanId,
    maxlength: 20
  }

];

export const binTypeFields = [
  { title: 'POU Container', type: 'text', formControlName: containerCode, maxlength: 20 },
  {
    title: 'POU Container Qty.',
    type: 'number',
    formControlName: containerQty
  }
]
export const handStackTypeFields = [
  {
    title: 'Handstack Space Qty.',
    type: 'number',
    formControlName: QHS
  },
  { title: 'Reorder Point (Qty)', formControlName: HRPQ, type: 'number' },
  { title: 'Reorder Quantity', formControlName: HPQ, type: 'number' },
]
export const bagTypeFields = [
  { title: 'Bag Qty', type: 'number', formControlName: QPB },
  {
    title: 'Bags Per Loop',
    type: 'number',
    formControlName: QBPH
  }
]
export const kitTypeFields = [
  {
    title: 'Kit Type',
    type: 'dropdown',
    key: kitType,
    formControlName: kitType,
    ddKey: kitType
  }
]
export const bulkTypeFields = [
  { title: 'POU Container', type: 'text', formControlName: containerCode, maxlength: 20 },
  {
    title: 'POU Container Qty.',
    type: 'number',
    formControlName: containerQty
  }
]

export const presentationTypeFields = {
  [binSelectValue]: binTypeFields,
  [handStackSelectValue]: handStackTypeFields,
  [bagSelectValue]: bagTypeFields,
  [kitSelectValue]: kitTypeFields,
  [bulkSelectValue]: bulkTypeFields,
  [callSelectValue]: []
}
export const requestChangeMandatoryFields = [presentation, MFP];

export const conditionalFields = {
  [kitSelectValue]: { value: masterKitSelectValue, fields: [{ title: 'POU Container', type: 'text', formControlName: containerCode }] }
}

export const requestChangeNumberFields = [containerQty, QPB, QBPH, HRPQ, HPQ, supplierQty, MOQ, MMOQ, SPQ, safetyStock];

export const requestChangeFloatFields = [QHS];
