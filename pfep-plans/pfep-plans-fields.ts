export default {
  searchFields: [
    {
      field: 'Item_Id',
      title: 'ITEM',
      required: true,
      type: 'text',
      maxLength: 20,
      disabled: true,
      value: null,
      isPrimary: false,
      styleclass: 'col-md-2'
    },
    {
      field: 'Facility_Id',
      title: 'Branch',
      required: true,
      type: 'text',
      maxLength: 20,
      disabled: true,
      value: null,
      isPrimary: false,
      styleclass: 'col-md-2'
    },
    {
      field: 'WorkCenter_Id',
      title: 'WorkCenter',
      required: true,
      type: 'text',
      maxLength: 20,
      disabled: true,
      value: null,
      isPrimary: false,
      styleclass: 'col-md-2'
    },
    {
      field: 'Plan_Status_Code',
      title: 'Status',
      required: true,
      type: 'text',
      maxLength: 20,
      disabled: true,
      value: null,
      isPrimary: false,
      styleclass: 'col-md-2'
    }
  ],
  tableItems: {
    searchResultFields: [
      { title: 'Part Number', field: 'ITEM_ID' },
      { title: 'Part Description', field: 'ITEM_DESC' },
      { title: 'Segment', field: 'ORG_ID' }
    ],
    itemPlanFields: [
      { title: 'Part Number', field: 'ITEM_ID' },
      { title: 'Part Description', field: 'ITEM_DESC' },
      { title: 'Supplier', field: 'SUPPLIER_NAME' },
      { title: 'Branch', field: 'FACILITY_ID' },
      { title: 'WorkCenter', field: 'WORK_CENTER_ID' },
      { title: 'Suppling Location', field: 'WORK_CENTER_DESC' },
      { title: 'Item Plan #', field: 'ITEM_PLAN_ID' },
      { title: 'MFP', field: 'MTRL_FLOW_PLAN_ID' },
      { title: 'Demand', field: 'PEAK_DAILY_USAGE' },
      { title: 'Presentation Type', field: 'PRESENTATION_TYPE' },
      { title: 'Rplnshment Type', field: 'REPLENISHMENT_METHOD_CODE' },
      { title: 'POU Container', field: 'CONTAINER_CODE' },
      { title: 'POU Container Qty', field: 'CONTAINER_QTY' },
      // { title: 'Rack #', field: 'STORAGE_UNIT_ID' },
      { title: 'Effective From', field: 'EFFECTIVE_DATE' },
      { title: 'Effective To', field: 'EXPIRE_DATE' }
    ],
    upStreamPlanFields: [
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
        field: 'MTRL_FLOW_PLAN_ID',
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
        type: 'number',
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
    ],
    pfepRequiredFields: [
      { title: 'Part Number', field: 'ITEM_ID' },
      { title: 'Branch', field: 'FACILITY_ID' },
      { title: 'Work Center', field: 'TGT_WORK_CENTER_ID' },
      { title: 'Work Center Description', field: 'WORK_CENTER_DESC' },
      { title: 'Supplying Location', field: 'SUPPLYING_LOCATION' },
      { title: 'Annual Demand', field: 'ANNUAL_DEMAND' }
    ]
  },
  MFP: 'MTRL_FLOW_PLAN_ID',
  MFPDesc: 'MTRL_FLOW_PLAN_DESC',
  replenishCycles: 'REPLENISH_CYCLE_BY_DAYS',
  superMarketInd: 'SUPERMARKET_IND',
   searchFieldAttributes: {
    'MTRL_FLOW_PLAN_ID': {
    API: 'ItemPlanDetail/GetMaterialFlowPlans',
    key: 'MTRL_FLOW_PLAN_ID',
    displayOrder: ['MTRL_FLOW_PLAN_DESC', 'REPLENISH_CYCLE_BY_DAYS', 'SUPERMARKET_IND']
    }
  },
  upStreamPlanUniqueFields: [
    'UPSTREAM_ITEM_PLAN_ID', 'ITEM_ID', 'FACILITY_ID', 'SUPPLYING_LOCATION'
  ],
   requiredUpStreamPlansFields: ['MTRL_FLOW_PLAN_ID', 'CONTAINER_CODE', 'CONTAINER_QTY',  'EFFECTIVE_DATE']
};