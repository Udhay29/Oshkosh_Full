export const itemId = 'ITEM_ID';
export const itemPlanId = 'ITEM_PLAN_ID';
export const segment = 'ORG_ID';
export const itemDesc = 'ITEM_DESC';
export const branchDDKey = 'BRANCH_PLANT';
export const branch = 'FACILITY_ID';
export const attributeValuesKey = 'BRANCH_PLANT_DETAILS';
export const pouItemPlanDetailsKey = 'POU_ITEM_PLAN_RESULTS';
export const upStreamPlansDetailsKey = 'UPSTREAM_ITEM_PLAN_RESULTS';

export const MFP = 'MTRL_FLOW_PLAN_ID';
export const MFPDesc = "MTRL_FLOW_PLAN_DESC";
export const replenishCycles = "REPLENISH_CYCLE_BY_DAYS";
export const superMarketInd = "SUPERMARKET_IND";


export const pfepLength = 'PFEP_LENGTH';
export const pfepWidth = 'PFEP_WIDTH';
export const pfepHeight = 'PFEP_HEIGHT';
export const pfepWeight = 'PFEP_WEIGHT';


export const searchFields = [
  { key: segment, type: 'dropDown', placeholder: 'Select a Segment', title: 'Segment' },
  {
    key: itemId,
    title: 'Item Number',
    type: 'wildCard',
    config: {
      serviceUrl: {
        dropdown: 'WildcardSearch/GetFields?fieldName=ITEM_ID',
        table: 'WildcardSearch/GetDropdownValues'
      },
      tableFields: [
        { header: 'ID', field: itemId },
        { header: 'Description', field: 'ITEM_DESC' }
      ],
      label: '',
      isMultiSelect: false,
      selectedData: '',
      modelName: itemId,
      styleclass: 'col-md-2',
      dependentData: '',
      defaultselecteddropDownValue: { FIELD_NAME: itemId }
    }
  }
];

export const attributeDetails = [
  { label: 'Stocking Type', key: 'STOCKING_TYPE' },
  { label: 'Purchase UOM', key: 'PURCHASE_UOM' },
  { label: 'Primary UOM', key: 'PRIMARY_UOM' },
  { label: 'Primary Location', key: 'PRIMARY_WORK_LOCATION' },
  { label: 'Tactical Buyer', key: 'TACTICAL_BUYER_ID' },
  { label: 'Supplier', key: 'SUPPLIER_NAME' },
  { label: 'Commodity Manager', key: 'COMMODITY_MANAGER' },
  { label: 'Model Name', key: 'MODEL_NAME' },
  { label: 'MOQ', key: 'MULTIPLE_ORDER_QTY' },
  { label: 'SPQ', key: 'STANDARD_PACK_QUANTITY' },
  { label: 'Container Type', key: 'CONTAINER_TYPE' },
  { label: 'VOP', key: 'VALUE_ORDER_POLICY' },
  { label: 'OPC', key: 'ORDER_POLICY_CODE' },
  { label: 'Minimum Order Qty.', key: 'MIN_ORDER_QTY' },
  { label: 'Reorder Qty Max', key: 'REORDER_QTY_MAX' },
  { label: 'PFEP Dimensions', key: 'PFEP Dimensions', type: 'multi' },
  { label: 'PFEP Weight', key: pfepWeight, type: 'number' },
  { label: 'PFEP Dimension UOM', key: 'PFEP_DIMENSION_UOM' },
  { label: 'PFEP Weight UOM', key: 'PFEP_WEIGHT_UOM' },
  { label: 'ERP Dimensions', key: 'ERP Dimensions', type: 'multi' },
  { label: 'ERP Weight', key: 'ERP_WEIGHT' },
  { label: 'ERP Dimension UOM', key: 'ERP_DIMENSION_UOM' },
  { label: 'ERP Weight UOM', key: 'ERP_WEIGHT_UOM' },
  { label: 'PFEP ABC Code', key: 'PFEP_ABC_CODE' }
];

export const multiValuedFields = {
  'PFEP Dimensions': [{ label: 'L', key: pfepLength, type: 'number' }, { label: 'W', key: pfepWidth, type: 'number' }, { label: 'H', key: pfepHeight, type: 'number' }],
  'ERP Dimensions': [{ label: 'L', key: 'ERP_LENGTH', type: 'number' }, { label: 'W', key: 'ERP_WIDTH', type: 'number' }, { label: 'H', key: 'ERP_HEIGHT', type: 'number' }]
};

export const emptyDetailsAttributes = [
  pfepLength,
  pfepWidth,
  pfepHeight,
  pfepWeight
];

export const editableFields = [
  pfepLength,
  pfepWidth,
  pfepHeight,
  pfepWeight
];

export const workCenterDesc = 'WORK_CENTER_DESC';
export const pfepWorkCenterDesc = 'PFEP_WORK_CENTER_DESC';
export const supplyingLocation = 'SUPPLYING_LOCATION';

export const itemPlanFields = [
  { title: 'Part Number', field: 'ITEM_ID' },
  { title: 'Part Description', field: 'ITEM_DESC' },
  { title: 'Supplier', field: 'SUPPLIER_NAME' },
  { title: 'Branch', field: 'FACILITY_ID' },
  { title: 'WorkCenter', field: 'WORK_CENTER_ID' },
  { title: 'Work Center Description', field: workCenterDesc },
  { title: 'Supplying Location', field: supplyingLocation },
  { title: 'Item Plan #', field: 'ITEM_PLAN_ID' },
  { title: 'Demand', field: 'PEAK_DAILY_USAGE' },
  { title: 'MFP', field: MFP },
  { title: 'Presentation Type', field: 'PRESENTATION_TYPE' },
  { title: 'Replnshment Type', field: 'REPLENISHMENT_METHOD_CODE' },
  { title: 'POU Container', field: 'CONTAINER_CODE' },
  { title: 'POU Container Qty.', field: 'CONTAINER_QTY' },
  { title: '# of Cards', field: 'LINE_SIDE_QUEUE_QTY' },
  // { title: 'Rack #', field: 'STORAGE_UNIT_ID' },
  { title: 'Effective From', field: 'EFFECTIVE_DATE' },
  { title: 'Effective To', field: 'EXPIRE_DATE' }
];

export const upStreamPlanFields = [
  {
    title: 'Upstream Plan ID',
    field: 'UPSTREAM_ITEM_PLAN_ID',
    isEdit: false,
    type: 'text'
  },
  { title: 'Part Number', field: 'ITEM_ID', isEdit: false, type: 'text' },
  {
    title: 'Receiving Location',
    field: 'FACILITY_ID',
    isEdit: false,
    type: 'text'
  },
  {
    title: 'Description',
    field: 'FACILITY_DESC',
    isEdit: false,
    type: 'text'
  },
  {
    title: 'Supplying Location',
    field: 'SUPPLYING_LOCATION',
    isEdit: false,
    type: 'text'
  },
  {
    title: 'Demand',
    field: 'PEAK_DAILY_USAGE',
    isEdit: false,
    type: 'text'
  },
  {
    title: 'MFP',
    field: MFP,
    isEdit: true,
    type: 'dropDown',
    maxLength: 30,
    cellClass: 'pou-edit-cell',
    valueKey: 'MFP_DESC'
  },
  {
    title: 'Supplier Container',
    field: 'CONTAINER_CODE',
    isEdit: true,
    type: 'text',
    maxLength: 20,
    cellClass: 'pou-edit-cell'
  },
  {
    title: 'Supplier SPQ',
    field: 'CONTAINER_QTY',
    isEdit: true,
    type: 'decimal',
    maxLength: 15,
    cellClass: 'pou-edit-cell'
  },
  {
    title: '# of Cards',
    field: 'NO_OF_CARDS',
    isEdit: true,
    type: 'number',
    maxLength: 15,
    cellClass: 'pou-edit-cell'
  },
  {
    title: 'Effective From',
    field: 'EFFECTIVE_DATE',
    isEdit: true,
    type: 'datefrom',
    cellClass: 'pou-edit-cell'
  },
  {
    title: 'Expire Date',
    field: 'EXPIRE_DATE',
    isEdit: true,
    type: 'dateto',
    cellClass: 'pou-edit-cell'
  }
];

export const requiredUpStreamPlansFields = [MFP, 'CONTAINER_CODE', 'CONTAINER_QTY', 'EFFECTIVE_DATE'];

export const upStreamPlansNumberFields = ['CONTAINER_QTY', 'NO_OF_CARDS'];

export const dateFields = {
  [pouItemPlanDetailsKey]: ['EFFECTIVE_DATE', 'EXPIRE_DATE']
};

export const rowFetchPostDataKeys = [
  'WORK_CENTER_ID',
  'ITEM_ID',
  'ITEM_PLAN_ID',
  'FACILITY_ID'
];

export const exportToExcelData = [
  {
    dataToExport: pouItemPlanDetailsKey,
    tableColumns: itemPlanFields,
    headerKey: 'title',
    valueKey: 'field',
    droDownAPIKey: '',
    fileName: 'POU Item Plans'
  },
  {
    dataToExport: upStreamPlansDetailsKey,
    tableColumns: upStreamPlanFields,
    headerKey: 'title',
    valueKey: 'field',
    droDownAPIKey: '',
    fileName: 'UpStream Item Plans'
  }
];

export const searchFieldAttributes = {
  [MFP]: {
    API: 'ItemPlanDetail/GetMaterialFlowPlans',
    key: MFP,
    displayOrder: [MFPDesc, replenishCycles, superMarketInd]
  }
};

export const upStreamPlanUniqueFields = [
  'UPSTREAM_ITEM_PLAN_ID', 'ITEM_ID', 'FACILITY_ID', 'SUPPLYING_LOCATION'
]

export const upStreamPlansSaveKey = 'UPSTREAM_ITEM_PLANS';