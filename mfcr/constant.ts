export const workCenter = 'WORK_CENTER_ID';
export const workCenterDDKey = 'WORK_CENTER_IDS';
export const itemId = 'ITEM_ID';
export const itemPlanStatusDDKey = 'DROP_DOWN_VALUE';
export const itemPlanId = 'ITEM_PLAN_ID';
export const segment = 'ORG_ID';
export const branch = 'FACILITY_ID';
export const mfcdSID = 'MFCR_SID';
export const MFCRStatusCode = 'MFCR_STATUS';
export const assignedTo = 'ASSIGNED_TO';

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
      { header: 'ID', field: workCenter },
      { header: 'Description', field: 'WORK_CENTER_DESC' }
    ],
    label: '',
    labelText: 'Work Center',
    isMultiSelect: true,
    selectedData: '',
    options: [],
    modelName: workCenter,
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


export const searchResultResponse = {
  SearchRecords: [
    {
      MFCR_SID: '2',
      CHANGE_TYPE: 'CHANGE',
      FACILITY_ID: 'STH001',
      WORK_CENTER_ID: 'APL001',
      ITEM_ID: '3642797',
      ITEM_PLAN_ID: '10332',
      PROJECT_ID: 'Proj01',
      MFCR_STATUS: 'InProgress',
      REQUESTOR: 'PFEPAdmin',
      ASSIGNED_TO: null,
      CREATED_DATE: '2020-02-04T00:00:00'
    }
  ],
  PageIndex: 1,
  PageSize: 10,
  TotalPageCount: 1,
  TotalCount: 1,
  StatusType: 'SUCCESS',
  Message: ''
};


export const formTableKeysValues =
  [
    { title: 'Request ID', field: 'MFCR_SID' },
    { title: 'Change Type', field: 'CHANGE_TYPE' },
    { title: 'Branch', field: 'FACILITY_ID' },
    { title: 'Work Center', field: 'WORK_CENTER_ID' },
    { title: 'Item Number', field: 'ITEM_ID' },
    { title: 'Item Plan ID', field: 'ITEM_PLAN_ID' },
    { title: 'Project ID', field: 'PROJECT_ID' },
    { title: 'MFCR Status', field: 'MFCR_STATUS' },
    { title: 'Requestor', field: 'REQUESTOR' },
    { title: 'Assigned To', field: 'ASSIGNED_TO' },
    { title: 'Created Date', field: 'CREATED_DATE' },
  ];

export const itemPlanDataFormLabel = [
  { label: 'Item Plan ID', type: 'link', field: 'ITEM_PLAN_ID' },
  { label: 'Item', type: 'text', field: 'ITEM_ID' },
  { label: 'Change Type', type: 'text', field: 'CHANGE_TYPE' },
  { label: 'Org', type: 'text', field: 'ORG_ID' },
  { label: 'Branch', type: 'text', field: 'FACILITY_ID' },
  { label: 'Dimensions', type: 'multi', field: 'DIMENSIONS' },
  { label: 'Dimensions UoM', type: 'text', field: 'DIMENSIONS_UOM' },
  { label: 'Weight', type: 'text', field: 'WEIGHT' },
  { label: 'Weight UoM', type: 'text', field: 'WEIGHT_UOM' },
  { label: 'Supplier', type: 'text', field: 'SUPPLIER' },
  { label: 'Project (Optional)', type: 'text', field: 'PROJECT' },
  { label: 'ERP Kanban ID (Optional)', type: 'text', field: 'ERP_KANBAN_ID' },
  { label: 'Estimated Annual Usage', type: 'text', field: 'ESTIMATED_ANNUAL_USAGE' }
];


export const presentationTypeBin_bulk = [
  { label: 'Presentation Method', type: 'dropdown', field: 'PRESENTATION_METHOD', ddKey: 'PRESENTATION_TYPE' },
  { label: 'POU Container', type: 'text', field: 'CONTAINER_CODE' },
  { label: 'POU Container Qty', type: 'text', field: 'CONTAINER_QTY' },
  { label: 'Supplier Container', type: 'text', field: 'SUPPLIER_CONTAINER' },
  { label: 'Supplier Container Qty', type: 'text', field: 'SUPPLIER_CONTAINER_QTY' },
  { label: 'Material Flow Plan', type: 'dropdown', field: 'MATERIAL_FLOW_PLANS', ddKey: 'MFP_DESC' },

];

export const presentationTypeBag = [
  { label: 'Presentation Method', type: 'dropdown', field: 'PRESENTATION_METHOD', ddKey: 'PRESENTATION_TYPE' },
  { label: 'Bag Qty', type: 'text', field: 'BAG_QUANTITY' },
  { label: 'Bags per Loop', type: 'text', field: 'BAGS_PER_HOOK_QUANTITY' },
  { label: 'Supplier Container', type: 'text', field: 'SUPPLIER_CONTAINER' },
  { label: 'Supplier Container Qty', type: 'text', field: 'SUPPLIER_CONTAINER_QTY' },
  { label: 'Material Flow Plan', type: 'dropdown', field: 'MATERIAL_FLOW_PLANS', ddKey: 'MFP_DESC' },

];
export const presentationTypeHandStack = [
  { label: 'Presentation Method', type: 'dropdown', field: 'PRESENTATION_METHOD', ddKey: 'PRESENTATION_TYPE' },
  { label: 'Handstack Space Qty', type: 'text', field: 'HANDSTACK_SPACE_QUANTITY' },
  { label: 'Reorder Point Qty', type: 'text', field: 'HDS_REORDER_POINT_QTY' },
  { label: 'Reorder Qty', type: 'text', field: 'HDS_REORDER_QTY' },
  { label: 'Supplier Container', type: 'text', field: 'SUPPLIER_CONTAINER' },
  { label: 'Supplier Container Qty', type: 'text', field: 'SUPPLIER_CONTAINER_QTY' },
  { label: 'Material Flow Plan', type: 'dropdown', field: 'MATERIAL_FLOW_PLANS', ddKey: 'MFP_DESC' },

];
export const presentationTypeKit = [
  { label: 'Presentation Method', type: 'dropdown', field: 'PRESENTATION_METHOD', ddKey: 'PRESENTATION_TYPE' },
 
  { label: 'Kit Type', type: 'dropdown', field: 'KIT_TYPE', ddKey: 'KIT_TYPE' },
  { label: 'POU Container', type: 'text', field: 'CONTAINER_CODE' },
  { label: 'Supplier Container', type: 'text', field: 'SUPPLIER_CONTAINER' },
  { label: 'Supplier Container Qty', type: 'text', field: 'SUPPLIER_CONTAINER_QTY' },
  { label: 'Material Flow Plan', type: 'dropdown', field: 'MATERIAL_FLOW_PLANS', ddKey: 'MFP_DESC' },

];
export const erpValuesLabel = [
  { label: 'MOQ', type: 'text', field: 'MOQ' },
  { label: 'MMOQ', type: 'text', field: 'MMOQ' },
  { label: 'VOP', type: 'text', field: 'VOP' },
  { label: 'SPQ', type: 'text', field: 'STANDARD_PACK_QUANTITY' },
  { label: 'Safety Stock', type: 'text', field: 'SAFETY_STOCK' },

];

export const multiValueFields = [
  { label: 'L', type: 'number', field: 'ITEM_LENGTH' },
  { label: 'W', type: 'number', field: 'ITEM_WIDTH' },
  { label: 'H', type: 'number', field: 'ITEM_HEIGHT' }
]

export const ApproverTblCol =
  [
    { title: 'Approver Group', field: 'APPROVER_GROUP',isEdit: false,cellClass: 'col-edit-cell' },
    { title: 'Approver', field: 'APPROVER',isEdit: false,cellClass: 'col-edit-cell'},
    { title: 'Status', field: 'STATUS',isEdit: false,cellClass: 'col-edit-cell' },
    { title: 'Notes', field: 'NOTES',isEdit: true,cellClass: 'col-edit-cell' }
  ];

export const mockResponse = [
  {
    "MFCRItemPlanData": {
        "ITEM_PLAN_ID": 9529,
        "ITEM_ID": "A000N489",
        "CHANGE_TYPE": "CHANGE",
        "ORG_ID": "DEF",
        "FACILITY_ID": "STH001",
        "ITEM_HEIGHT": null,
        "ITEM_WIDTH": null,
        "ITEM_LENGTH": null,
        "DIMENSIONS_UOM": "IN",
        "WEIGHT": 104.3000,
        "WEIGHT_UOM": "LB",
        "SUPPLIER": "APL001",
        "PROJECT": "1",
        "ERP_KANBAN_ID": "1",
        "ESTIMATED_ANNUAL_USAGE": "420",
        "PROPOSED_DATA": {
            "ITEM_PLAN_ID": 9529,
            "CHANGE_TYPE": null,
            "CONTAINER_CODE": "E0007",
            "CONTAINER_QTY": 4,
            "SUPPLIER_CONTAINER": "1",
            "SUPPLIER_CONTAINER_QTY": 1,
            "BAG_QUANTITY": null,
            "BAGS_PER_HOOK_QUANTITY": null,
            "HANDSTACK_SPACE_QUANTITY": null,
            "HDS_REORDER_POINT_QTY": null,
            "HDS_REORDER_QTY": null,
            "MOQ": 1,
            "MMOQ": 1,
            "VOP": "1",
            "STANDARD_PACK_QUANTITY": 11,
            "SAFETY_STOCK": 1,
            "PROJECT": "1",
            "ERP_KANBAN_ID": "1",
            "PRESENTATION_METHOD": [
                {
                    "PRESENTATION_TYPE": "Bag",
                    "IsSelected": false
                },
                {
                    "PRESENTATION_TYPE": "Bin",
                    "IsSelected": false
                },
                {
                    "PRESENTATION_TYPE": "Bulk",
                    "IsSelected": true
                },
                {
                    "PRESENTATION_TYPE": "Hand Stack",
                    "IsSelected": false
                },
                {
                    "PRESENTATION_TYPE": "Kit",
                    "IsSelected": false
                }
            ],
            "MATERIAL_FLOW_PLANS": [
                {
                    "MTRL_FLOW_PLAN_ID": "STH-1",
                    "MFP_DESC": "STH-1 - GDC to STH kanban - 3 - N",
                    "SUPERMARKET_IND": "N",
                    "IsSelected": true
                },
                {
                    "MTRL_FLOW_PLAN_ID": "STH-2",
                    "MFP_DESC": "STH-2 - STH supermarket kanban - 3 - Y",
                    "SUPERMARKET_IND": "Y",
                    "IsSelected": false
                },
                {
                    "MTRL_FLOW_PLAN_ID": "STH-3",
                    "MFP_DESC": "STH-3 - MWA to STH kanban - 3 - N",
                    "SUPERMARKET_IND": "N",
                    "IsSelected": false
                },
                {
                    "MTRL_FLOW_PLAN_ID": "STH-4",
                    "MFP_DESC": "STH-4 - NTH to STH kanban - 3 - N",
                    "SUPERMARKET_IND": "N",
                    "IsSelected": false
                },
                {
                    "MTRL_FLOW_PLAN_ID": "STH-5",
                    "MFP_DESC": "STH-5 - TWA to STH kanban - 3 - N",
                    "SUPERMARKET_IND": "N",
                    "IsSelected": false
                },
                {
                    "MTRL_FLOW_PLAN_ID": "STH-6",
                    "MFP_DESC": "STH-6 - ECT to STH kanban - 3 - N",
                    "SUPERMARKET_IND": "N",
                    "IsSelected": false
                },
                {
                    "MTRL_FLOW_PLAN_ID": "STH-7",
                    "MFP_DESC": "STH-7 - MRP ordered - 2 - N",
                    "SUPERMARKET_IND": "N",
                    "IsSelected": false
                },
                {
                    "MTRL_FLOW_PLAN_ID": "STH-8",
                    "MFP_DESC": "STH-8 - Supplier kanban - 1 - N",
                    "SUPERMARKET_IND": "N",
                    "IsSelected": false
                },
                {
                    "MTRL_FLOW_PLAN_ID": "STH-9",
                    "MFP_DESC": "STH-9 - Supermarket to Line; call as needed - 1 - Y",
                    "SUPERMARKET_IND": "Y",
                    "IsSelected": false
                },
                {
                    "MTRL_FLOW_PLAN_ID": "STH-10",
                    "MFP_DESC": "STH-10 - STH to STH internal move kanban - 1 - N",
                    "SUPERMARKET_IND": "N",
                    "IsSelected": false
                }
            ],
            "KIT_TYPE": null
        },
        "CURRENT_DATA": {
            "ITEM_PLAN_ID": 9529,
            "CHANGE_TYPE": null,
            "CONTAINER_CODE": "E0007",
            "CONTAINER_QTY": 4,
            "SUPPLIER_CONTAINER": null,
            "SUPPLIER_CONTAINER_QTY": null,
            "BAG_QUANTITY": null,
            "BAGS_PER_HOOK_QUANTITY": null,
            "HANDSTACK_SPACE_QUANTITY": null,
            "HDS_REORDER_POINT_QTY": null,
            "HDS_REORDER_QTY": null,
            "MOQ": 0,
            "MMOQ": 0,
            "VOP": "6",
            "STANDARD_PACK_QUANTITY": 1,
            "SAFETY_STOCK": 0,
            "PROJECT": null,
            "ERP_KANBAN_ID": null,
            "PRESENTATION_METHOD": [
                {
                    "PRESENTATION_TYPE": "Bag",
                    "IsSelected": false
                },
                {
                    "PRESENTATION_TYPE": "Bin",
                    "IsSelected": false
                },
                {
                    "PRESENTATION_TYPE": "Bulk",
                    "IsSelected": true
                },
                {
                    "PRESENTATION_TYPE": "Hand Stack",
                    "IsSelected": false
                },
                {
                    "PRESENTATION_TYPE": "Kit",
                    "IsSelected": false
                }
            ],
            "MATERIAL_FLOW_PLANS": [
                {
                    "MTRL_FLOW_PLAN_ID": "STH-1",
                    "MFP_DESC": "STH-1 - GDC to STH kanban - 3 - N",
                    "SUPERMARKET_IND": "N",
                    "IsSelected": true
                },
                {
                    "MTRL_FLOW_PLAN_ID": "STH-2",
                    "MFP_DESC": "STH-2 - STH supermarket kanban - 3 - Y",
                    "SUPERMARKET_IND": "Y",
                    "IsSelected": false
                },
                {
                    "MTRL_FLOW_PLAN_ID": "STH-3",
                    "MFP_DESC": "STH-3 - MWA to STH kanban - 3 - N",
                    "SUPERMARKET_IND": "N",
                    "IsSelected": false
                },
                {
                    "MTRL_FLOW_PLAN_ID": "STH-4",
                    "MFP_DESC": "STH-4 - NTH to STH kanban - 3 - N",
                    "SUPERMARKET_IND": "N",
                    "IsSelected": false
                },
                {
                    "MTRL_FLOW_PLAN_ID": "STH-5",
                    "MFP_DESC": "STH-5 - TWA to STH kanban - 3 - N",
                    "SUPERMARKET_IND": "N",
                    "IsSelected": false
                },
                {
                    "MTRL_FLOW_PLAN_ID": "STH-6",
                    "MFP_DESC": "STH-6 - ECT to STH kanban - 3 - N",
                    "SUPERMARKET_IND": "N",
                    "IsSelected": false
                },
                {
                    "MTRL_FLOW_PLAN_ID": "STH-7",
                    "MFP_DESC": "STH-7 - MRP ordered - 2 - N",
                    "SUPERMARKET_IND": "N",
                    "IsSelected": false
                },
                {
                    "MTRL_FLOW_PLAN_ID": "STH-8",
                    "MFP_DESC": "STH-8 - Supplier kanban - 1 - N",
                    "SUPERMARKET_IND": "N",
                    "IsSelected": false
                },
                {
                    "MTRL_FLOW_PLAN_ID": "STH-9",
                    "MFP_DESC": "STH-9 - Supermarket to Line; call as needed - 1 - Y",
                    "SUPERMARKET_IND": "Y",
                    "IsSelected": false
                },
                {
                    "MTRL_FLOW_PLAN_ID": "STH-10",
                    "MFP_DESC": "STH-10 - STH to STH internal move kanban - 1 - N",
                    "SUPERMARKET_IND": "N",
                    "IsSelected": false
                }
            ],
            "KIT_TYPE": [
                {
                    "KIT_TYPE": "CWO KIT",
                    "IsSelected": false
                },
                {
                    "KIT_TYPE": "MASTER KIT",
                    "IsSelected": false
                }
            ]
        }
    },
    "REVIEW_APPROVALS": [
        {
            "MFCR_APPROVAL_TASK_SID": 425,
            "APPROVAL_GROUP": "Materials",
            "APPROVAL_ORDER": 1,
            "APPROVER_GROUP": "DEF Materials",
            "APPROVER": "PFEPAdmin",
            "STATUS": "Approved",
            "NOTES": "Test Note",
            "IS_ENABLE": false
        },
        {
            "MFCR_APPROVAL_TASK_SID": 426,
            "APPROVAL_GROUP": "Warehouse",
            "APPROVAL_ORDER": 2,
            "APPROVER_GROUP": "STH001 Warehouse",
            "APPROVER": null,
            "STATUS": "InProgress",
            "NOTES": null,
            "IS_ENABLE": false
        },
        {
            "MFCR_APPROVAL_TASK_SID": 427,
            "APPROVAL_GROUP": "Packaging",
            "APPROVAL_ORDER": 3,
            "APPROVER_GROUP": "STH001 Packaging",
            "APPROVER": null,
            "STATUS": "Pending",
            "NOTES": null,
            "IS_ENABLE": false
        },
        {
            "MFCR_APPROVAL_TASK_SID": 428,
            "APPROVAL_GROUP": "Purchasing",
            "APPROVAL_ORDER": 4,
            "APPROVER_GROUP": "STH001 Purchasing",
            "APPROVER": null,
            "STATUS": "Pending",
            "NOTES": null,
            "IS_ENABLE": false
        },
        {
            "MFCR_APPROVAL_TASK_SID": 429,
            "APPROVAL_GROUP": "Logistics",
            "APPROVAL_ORDER": 5,
            "APPROVER_GROUP": "STH-1 Logistics",
            "APPROVER": null,
            "STATUS": "Pending",
            "NOTES": null,
            "IS_ENABLE": false
        }
    ],
    "StatusType": "SUCCESS",
    "Message": ""
}

]
