// TODO: CHANGE THIS TO .json FORMAT (what was I thinking !!!)


// home module constants
export const tableKey = 'displayName';
export const valueKey = 'value';
export const droDownAPIKey = 'APIkey';

// route constants
export const homeScreenPath = 'home';
export const missingDataScreenPath = 'missing-data';
export const pfepRequiredScreenPath = 'pfep-required';
export const pfepShortageScreenPath = 'pfep-shortage';
export const pfepMOQCeilingPath = 'moq-ceiling';
export const pfepDemandGapPath = 'demand-gap';
export const pfepErpAlertPath = 'erp-alert';

export const alertScreenPaths = [pfepRequiredScreenPath, pfepShortageScreenPath, pfepMOQCeilingPath, pfepDemandGapPath, pfepErpAlertPath];
export const missingDataScreenPaths = [missingDataScreenPath]


// dashboard constants
export const dashboardWilCards = [
    {
        name: 'WORK_CENTER_ID', className: 'dashboard-work-center-wildCard', placeHolder: 'Work Center (Parent or Child)', defaultselecteddropDownValue: { 'FIELD_NAME': 'WORK_CENTER_ID' }, type: 'text', order: 3, wildCardConfig: {
            serviceUrl: {
                'dropdown': 'WildcardSearch/GetFields?fieldName=WORK_CENTER_ID',
                'table': 'WildcardSearch/GetDropdownValuesWorkCenter'
            },
            tableFields: [{ header: 'ID', field: 'WORK_CENTER_ID' }, { header: 'Description', field: 'WORK_CENTER_DESC' }],
            label: 'Work Center (Parent or Child)',
            isMultiSelect: true,
            selectedData: [],
            options: [],
            modelName: 'WORK_CENTER_ID',
            styleclass: 'col-md-2',
            dependentData: {
                'ORG_ID': '',
                'FACILITY_ID': '',
            }
        }
    }];
export const noDataMsgGraph = 'No Data';

// Missing data component constants

export const planningParameter = 'planningParameters';
export const weightsDimensions = 'weightsDimensions';
export const packageDetail = 'packagingDetail';

// the dropdowns for all the three stacks are similar, but three different variables have been created, just to make it easy for any further changes

export const weightsDimensionsInputs = [
    { name: 'SUPPLIER_NAME', className: 'weights-dimensions-supplier-name-input', placeHolder: 'Supplier Name', type: 'text', order: 4 }
];

export const weightsDimensionsDropDowns = [
    { name: 'ORG_ID', className: 'weight-dimensions-segment-dropdown', defaultOption: 'Segment', displayValueKey: 'ORG_ID', valueKey: 'ORG_ID', required: true, APIMap: 'Segment', order: 1 },
    { name: 'FACILITY_ID', className: 'weight-dimensions-warehouse-dropdown', defaultOption: 'Branch', displayValueKey: 'FACILITY_ID', valueKey: 'FACILITY_ID', required: true, APIMap: 'Warehouse', order: 2, dependentChange: ['ORG_ID'] },
];

export const weightsDimensionsWildCards = [

    {
        name: 'ITEM_ID', className: 'weights-dimensions-part-number-wildCard', placeHolder: 'Part Number', type: 'text', order: 3, 
        defaultselecteddropDownValue: {},
        wildCardConfig: {
            serviceUrl: {
                'dropdown': 'WildcardSearch/GetFields?fieldName=ITEM_ID',
                'table': 'WildcardSearch/GetDropdownValues'
            },
            tableFields: [{ header: 'ID', field: 'ITEM_ID' }, { header: 'Description', field: 'ITEM_DESC' }],
            label: 'Part Number',
            isMultiSelect: false,
            selectedData: [],
            modelName: 'ITEM_ID',
            styleclass: 'col-md-2',
            dependentData: {
                'ORG_ID': ''
            }
        }
    }
];

export const packageDetailInputs = [
    { name: 'CONTAINER_CODE', class: 'package-detail-container-code-input', placeHolder: 'Container Code', type: 'text', order: 3 },
    { name: 'CONTAINER_CATEGORY', class: 'package-detail-container-category-input', placeHolder: 'Container Category', type: 'text', order: 5 }
];

export const packageDetailDropDowns = [
    { name: 'ORG_ID', className: 'package-detail-segment-dropdown', defaultOption: 'Segment', displayValueKey: 'ORG_ID', valueKey: 'ORG_ID', required: true, APIMap: 'Segment', order: 1 },
    { name: 'FACILITY_ID', className: 'package-detail-warehouse-dropdown', defaultOption: 'Branch', displayValueKey: 'FACILITY_ID', valueKey: 'FACILITY_ID', required: true, APIMap: 'Warehouse', order: 2, dependentChange: ['ORG_ID'] },
];

export const packageDetailWildCards = [

    {
        name: 'SUPPLIER_ID', className: 'package-detail-supplier-wildCard', placeHolder: 'Supplier', type: 'text', order: 4,
            defaultselecteddropDownValue: {},
            wildCardConfig: {
            serviceUrl: {
                'dropdown': 'WildcardSearch/GetFields?fieldName=SUPPLIER_ID',
                'table': 'WildcardSearch/GetSupplierDropdownValues'
            },
            label: 'Supplier',
            isMultiSelect: false,
            selectedData: [],
            modelName: 'SUPPLIER_ID',
            styleclass: 'col-md-2',
            dependentData: {
                'ORG_ID': ''
            }
        }
    }
];

export const inputsMap = {
    [weightsDimensions]: {
        inputs: weightsDimensionsInputs,
        dropDowns: weightsDimensionsDropDowns,
        wildCards: weightsDimensionsWildCards
    },
    [packageDetail]: {
        inputs: packageDetailInputs,
        dropDowns: packageDetailDropDowns,
        wildCards: packageDetailWildCards
    }
};

export const missingTableTabsList = [
    { displayName: 'Weights & Dimensions', value: weightsDimensions, class: 'missing-nav-bar-weights' },
    { displayName: 'Packaging Detail', value: packageDetail, class: 'missing-nav-bar-packaging-detail' },
];

export const paramGetFunctionMap = {
    [weightsDimensions]: 'getWeightsDimensionsData',
    [packageDetail]: 'getPackageDetailData'
};

export const paramSaveFunctionMap = {
    [weightsDimensions]: 'saveWeightsDimensionsData',
    [packageDetail]: 'savePackageDetailData'
};

export const paramAPIMap = {
    [weightsDimensions]: 'weightAndDimensionDetails',
    [packageDetail]: 'packagingDetails',
};

export const weightsDimensionsColumns = {
    columns: [
        { [tableKey]: 'Part Number', [valueKey]: 'ITEM_ID', type: 'text', editable: false },
        { [tableKey]: 'Description', [valueKey]: 'ITEM_DESC', type: 'text', editable: false },
        { [tableKey]: 'Supplier Name', [valueKey]: 'SUPPLIER_NAME', type: 'text', editable: false },
        { [tableKey]: 'ERP', [valueKey]: 'ERP', className: 'erp-group', editable: false },
        { [tableKey]: 'PFEP', [valueKey]: 'PFEP', className: 'pfep-group', editable: false }
    ],

    groupedColumns: {
        'ERP': [
            { [tableKey]: 'Length', [valueKey]: 'SRC_LENGTH', className: 'erp-group', type: 'decimal', group: 'ERP', editable: false },
            { [tableKey]: 'Width', [valueKey]: 'SRC_WIDTH', className: 'erp-group', type: 'decimal', group: 'ERP', editable: false },
            { [tableKey]: 'Height', [valueKey]: 'SRC_HEIGHT', className: 'erp-group', type: 'decimal', group: 'ERP', editable: false },
            { [tableKey]: 'UoM', [valueKey]: 'DIM_UOM', className: 'erp-group', type: 'text', group: 'ERP', editable: false },
            { [tableKey]: 'Weight', [valueKey]: 'SRC_WEIGHT', className: 'erp-group', type: 'decimal', group: 'ERP', editable: false },
            { [tableKey]: 'Weight UoM', [valueKey]: 'WEIGHT_UOM', className: 'erp-group', type: 'text', group: 'ERP', editable: false }
        ],
        'PFEP': [
            { [tableKey]: 'Length', [valueKey]: 'ITEM_LENGTH', className: 'pfep-group', type: 'decimal', group: 'PFEP', editable: true },
            { [tableKey]: 'Width', [valueKey]: 'ITEM_WIDTH', className: 'pfep-group', type: 'decimal', group: 'PFEP', editable: true },
            { [tableKey]: 'Height', [valueKey]: 'ITEM_HEIGHT', className: 'pfep-group', type: 'decimal', group: 'PFEP', editable: true },
            { [tableKey]: 'UoM', [valueKey]: 'ITEM_DIMENSION_UOM', className: 'pfep-group', type: 'text', group: 'PFEP', editable: true },
            { [tableKey]: 'Weight', [valueKey]: 'ITEM_WEIGHT', className: 'pfep-group', type: 'decimal', group: 'PFEP', editable: true },
            { [tableKey]: 'Weight UoM', [valueKey]: 'ITEM_WEIGHT_UOM', className: 'pfep-group', type: 'text', group: 'PFEP', editable: true }
        ]
    }
};

export const planninParameterColumns = {
    columns: [
        { [tableKey]: 'Item ID', [valueKey]: 'Item_Id', type: 'text', editable: false },
        { [tableKey]: 'FacilityID', [valueKey]: 'Facility_Id', type: 'text', editable: false },
        { [tableKey]: 'Primary Supplier', [valueKey]: 'Supplier', type: 'text', editable: false },
        { [tableKey]: 'Standard Cost', [valueKey]: 'Std_Cost', type: 'decimal', editable: false },
        { [tableKey]: 'Commodity Code', [valueKey]: 'Commodity_Code', type: 'text', editable: false },
        { [tableKey]: 'ABC Code', [valueKey]: 'ABC_Code', type: 'text', editable: false },
        { [tableKey]: 'Supplier Lead Time', [valueKey]: 'Supplier_LeadTime', type: 'decimal', editable: false },
        { [tableKey]: 'Min Order Qty', [valueKey]: 'Min_OrderQty', type: 'integer', editable: false },
        { [tableKey]: 'Multiple Order Qty', [valueKey]: 'Multiple_OrderQty', type: 'integer', editable: false },
        { [tableKey]: 'Safety Stock', [valueKey]: 'Safety_Qnty', type: 'integer', editable: false }
    ]
};

export const packageDetailColumns = {
    columns: [
        { [tableKey]: 'Container SID', [valueKey]: 'CONTAINER_SID', type: 'integer', editable: false },
        { [tableKey]: 'Container code', [valueKey]: 'CONTAINER_CODE', type: 'text', editable: true },
        { [tableKey]: 'Description', [valueKey]: 'CONTAINER_DESC', type: 'text', editable: true },
        { [tableKey]: 'Container Category', [valueKey]: 'CONTAINER_CATEGORY', type: 'dropDown', editable: true, [droDownAPIKey]: 'CategoryName' },
        { [tableKey]: 'Supplier', [valueKey]: 'CONTAINER_SUPPLIER', type: 'searchField', editable: true },
        { [tableKey]: 'Inner Length', [valueKey]: 'CONTAINER_IN_LENGHT', type: 'decimal', editable: true },
        { [tableKey]: 'Inner Width', [valueKey]: 'CONTAINER_IN_WIDTH', type: 'decimal', editable: true },
        { [tableKey]: 'Inner Height', [valueKey]: 'CONTAINER_IN_HEIGHT', type: 'decimal', editable: true },
        { [tableKey]: 'Outer Length', [valueKey]: 'CONTAINER_OUT_LENGHT', type: 'decimal', editable: true },
        { [tableKey]: 'Outer Width', [valueKey]: 'CONTAINER_OUT_WIDTH', type: 'decimal', editable: true },
        { [tableKey]: 'Outer Height', [valueKey]: 'CONTAINER_OUT_HEIGHT', type: 'decimal', editable: true },
        { [tableKey]: 'Primary Orientaion', [valueKey]: 'PRIMARY_ORIENTATION_LORW', type: 'dropDown', editable: true, [droDownAPIKey]: 'Primary_Orientation' }
    ]
};

export const weightsDimensionsHighWidthCols = {
    [weightsDimensions]: ['ITEM_DESC', 'SUPPLIER_NAME'],
    [packageDetail]: []
}

export const editPopUpNames = {
    [weightsDimensions]: 'Edit Weights & Dimensions',
    [packageDetail]: 'Edit Packaging Detail',
}
export const searchFieldsMap = {
    [weightsDimensions]: [],
    [packageDetail]: { 'CONTAINER_SUPPLIER': { API: 'WildcardSearch/GetSupplier', key: 'SUPPLIER_ID', displaykey: 'SUPPLIER_NAME' } }
};

export const decimalFieldsMap = {
    [weightsDimensions]: ['SRC_LENGTH', 'SRC_WIDTH', 'SRC_HEIGHT', 'SRC_WEIGHT', 'ITEM_LENGTH', 'ITEM_WIDTH', 'ITEM_HEIGHT', 'ITEM_WEIGHT'],
    [packageDetail]: ['CONTAINER_IN_LENGTH', 'CONTAINER_IN_WIDTH', 'CONTAINER_IN_HEIGHT', 'CONTAINER_OUT_LENGTH', 'CONTAINER_OUT_WIDTH', 'CONTAINER_OUT_HEIGHT']
};

export const paramTableColumnsMap = {
    [weightsDimensions]: weightsDimensionsColumns,
    [packageDetail]: packageDetailColumns
};

export const uniqueKeys = {
    [weightsDimensions]: 'ITEM_ID',
    [packageDetail]: 'CONTAINER_SID'
};

export const dropDownColumns = {
    [weightsDimensions]: [],
    [packageDetail]: ['PRIMARY_ORIENTATION_LORW', 'CONTAINER_CATEGORY']
};

export const saveSuccessMessage = 'Changes saved successfully';
export const saveErrorMessage = 'Something went wrong. Changes have not been saved. Please try again';


// alert details screens constants
export const pfepRequired = 'pfepRequired';
export const pfepShortage = 'pfepShortage';
export const pfepMOQCeiling = 'pfepMOQCeiling';
export const pfepDemandGap = 'pfepDemandGap';
export const pfepERPAlert = 'pfepERPAlert';
export const snoozeUntilDate = 'SNOOZE_UNTIL_DATE';


export const discrepancyTypeKey = 'DISCREPANCY_TYPE';
export const discrepancyTypes = [
    {label: 'POU CONTAINER', value: 'POU CONTAINER'},
    {label: 'SUPPLIER CONTAINER', value: 'SUPPLIER CONTAINER'},
    {label: 'KANBAN CARDS', value: 'KANBAN CARDS'},
    {label: 'CONTAINER QTY', value: 'CONTAINER QTY'},
    {label: 'SUPPLIER CONTAINER QTY', value: 'SUPPLIER CONTAINER QTY'}
];
export const discrepancyTypesArr = ['POU CONTAINER', 'SUPPLIER CONTAINER', 'KANBAN CARDS', 'CONTAINER QTY',  'SUPPLIER CONTAINER QTY'];


export const pathScreenParamMap = {
    [pfepRequired]: pfepRequiredScreenPath,
    [pfepShortage]: pfepShortageScreenPath,
    [pfepMOQCeiling]: pfepMOQCeilingPath,
    [pfepDemandGap]: pfepDemandGapPath,
    [pfepERPAlert]: pfepErpAlertPath
};

export const alertDetailsSimilarInputs = [];

export const alertDetailsSimilarDropDowns = [
    { name: 'ORG_ID', className: 'alert-detail-segment-dropdown', defaultOption: 'Segment', displayValueKey: 'ORG_ID', valueKey: 'ORG_ID', required: true, APIMap: 'Segment', options: [] },
    { name: 'FACILITY_ID', className: 'alert-detail-warehouse-dropdown', defaultOption: 'Branch', displayValueKey: 'FACILITY_ID', valueKey: 'FACILITY_ID', required: true, APIMap: 'Warehouse', options: [], valueToSet: '' },
];

export const alertDetailsWildSimilarCards = [

    {
        name: 'WORK_CENTER_ID', 
        className: 'alert-screen-lookup alert-detail-work-center-input', 
        placeHolder: 'Work Center (Parent or Child)', 
        defaultselecteddropDownValue: { 'FIELD_NAME': 'WORK_CENTER_ID' }, 
        type: 'text', order: 3, 
        wildCardConfig: {
            serviceUrl: {
                'dropdown': 'WildcardSearch/GetFields?fieldName=WORK_CENTER_ID',
                'table': 'WildcardSearch/GetDropdownValuesWorkCenter'
            },
            tableFields: [{ header: 'ID', field: 'WORK_CENTER_ID' }, { header: 'Description', field: 'WORK_CENTER_DESC' }],
            label: 'Work Center (Parent or Child)',
            isMultiSelect: true,
            selectedData: [],
            options: [],
            modelName: 'WORK_CENTER_ID',
            styleclass: 'col-md-2',
            dependentData: {
                'ORG_ID': '',
                'FACILITY_ID': '',
            }
        }
    },
    {
        name: 'ITEM_ID',
        className: 'alert-screen-lookup alert-detail-item-id-input',
        placeHolder: 'Item Id',
        defaultselecteddropDownValue: { 'FIELD_NAME': 'ITEM_ID' },
        type: 'text', order: 4,
        wildCardConfig: {
            serviceUrl: {
                dropdown: 'WildcardSearch/GetFields?fieldName=ITEM_ID',
                table: 'WildcardSearch/GetDropdownValues'
            },
            tableFields: [
                { header: 'ID', field: 'ITEM_ID' },
                { header: 'Description', field: 'ITEM_DESC' }
            ],
            label: 'Item Number',
            isMultiSelect: false,
            selectedData: '',
            modelName: 'ITEM_ID',
            styleclass: 'col-md-2',
            defaultselecteddropDownValue: { FIELD_NAME: 'ITEM_ID' },
            dependentData: {
                'ORG_ID': '',
            }
        }
    }
];

export const specificDropDowns = {
    [pfepERPAlert]: [{ name: discrepancyTypeKey, className: 'alert-detail-discrepancy-type-dropdown', defaultOption: 'Discrepancy Type', displayValueKey: 'label', valueKey: 'value', required: false, APIMap: '', options: discrepancyTypes }]
}

export const alertDetailsInputs = {
    [pfepRequired]: [],
    [pfepShortage]: [],
    [pfepMOQCeiling]: [],
    [pfepDemandGap]: [],
    [pfepERPAlert]: []
}

export const alertDetailsDropDowns = {
    [pfepRequired]: [...alertDetailsSimilarDropDowns],
    [pfepShortage]: [...alertDetailsSimilarDropDowns],
    [pfepMOQCeiling]: [...alertDetailsSimilarDropDowns],
    [pfepDemandGap]: [...alertDetailsSimilarDropDowns],
    [pfepERPAlert]: [...alertDetailsSimilarDropDowns, ...specificDropDowns[pfepERPAlert]]
}

export const alertDetailsWildCards = {
    [pfepRequired]: [...alertDetailsWildSimilarCards],
    [pfepShortage]: [...alertDetailsWildSimilarCards],
    [pfepMOQCeiling]: [...alertDetailsWildSimilarCards],
    [pfepDemandGap]: [...alertDetailsWildSimilarCards],
    [pfepERPAlert]: [...alertDetailsWildSimilarCards]
}

export const alertDetailGetFunctionMap = {
    [pfepRequired]: 'getPFEPRequiredData',
    [pfepShortage]: 'getPFEPShortageData',
    [pfepMOQCeiling]: 'getMOQCeilingData',
    [pfepDemandGap]: 'getDemandGapData',
    [pfepERPAlert]: 'getPFEPERPData'
};

export const saveAlertDetailMap = {
    [pfepRequired]: 'savePFEPRequiredData',
    [pfepShortage]: 'savePFEPShortageData',
    [pfepMOQCeiling]: 'saveMOQCeilingData',
    [pfepDemandGap]: 'saveDemandGapData',
    [pfepERPAlert]: 'savePFEPERPData'
};

export const alertScreenTitles = {
    [pfepRequired]: 'PFEP Required',
    [pfepShortage]: 'PFEP Over/Under Planned Alert',
    [pfepMOQCeiling]: 'MOQ Ceiling',
    [pfepDemandGap]: 'Demand Gaps',
    [pfepERPAlert]: 'ERP Discrepancy Alert'
};

export const alertDetailsTableKeys = {
    [pfepRequired]: ['ITEM_ID', 'DEMAND_DATE'],
    [pfepShortage]: ['ITEM_ID'],
    [pfepMOQCeiling]: ['ITEM_ID'],
    [pfepDemandGap]: ['ITEM_ID', 'DEMAND_GAP_START_DATE'],
    [pfepERPAlert]: ['ITEM_ID', 'ORG_ID', 'FACILITY_ID', 'WORK_CENTER_SID', 'CALCULATED_DATE']
};

/* PFEP ALERTS*/

export const pfepShortageColumns = [
    { [tableKey]: 'Consuming Location', [valueKey]: 'WORK_CENTER_ID' },
    { [tableKey]: 'Item Id', [valueKey]: 'ITEM_ID' },
    { [tableKey]: 'Item Description', [valueKey]: 'ITEM_DESC' },
    { [tableKey]: 'Item Plan ID', [valueKey]: 'ITEM_PLAN_ID', type: 'link' },
    { [tableKey]: 'Effective From', [valueKey]: 'EFFECTIVE_DATE', type: 'date' },
    { [tableKey]: 'Effective To', [valueKey]: 'EXPIRE_DATE', type: 'date' },
    { [tableKey]: '% Under Planned', [valueKey]: 'PERCENT_OVER_TOLERANCE' },
    { [tableKey]: '% Over Planned', [valueKey]: 'PERCENT_UNDER_TOLERANCE' },
    { [tableKey]: 'First Date Past Tolerance', [valueKey]: 'FIRST_DATE_PAST_TOLERANCE', type: 'date' },
    { [tableKey]: 'Alert Date', [valueKey]: 'CALCULATED_DATE', sortable: true, type: 'date' },
    { [tableKey]: 'Hot', [valueKey]: 'HOT_IND', type: 'checkBox' },
    { [tableKey]: 'Snooze', [valueKey]: 'SNOOZE_IND', type: 'checkBox' }
];

/* PFEP REQUIRED*/

export const pfepRequiredColumns = [
    { [tableKey]: 'Segment', [valueKey]: 'ORG_ID' },
    { [tableKey]: 'Branch', [valueKey]: 'FACILITY_ID' },
    { [tableKey]: 'Item Id', [valueKey]: 'ITEM_ID' , type: 'link'},
    { [tableKey]: 'Item Description', [valueKey]: 'ITEM_DESC' },
    { [tableKey]: 'Consuming Location', [valueKey]: 'TGT_WORK_CENTER_ID' },
    { [tableKey]: 'Supplying Location', [valueKey]: 'SRC_WORK_CENTER_ID' },
    { [tableKey]: 'First Demand Date', [valueKey]: 'DEMAND_DATE', type: 'date' },
    { [tableKey]: 'Alert Date', [valueKey]: 'CALCULATED_DATE', sortable: true, type: 'date' },
    { [tableKey]: 'Hot', [valueKey]: 'HOT_IND', type: 'checkBox' },
    { [tableKey]: 'Snooze', [valueKey]: 'SNOOZE_IND', type: 'checkBox' }
];

/* MOQ CEILING*/

export const pfepMOQColumns = [
    { [tableKey]: 'Segment', [valueKey]: 'ORG_ID' },
    { [tableKey]: 'Branch', [valueKey]: 'FACILITY_ID' },
    { [tableKey]: 'Work Center', [valueKey]: 'WORK_CENTER_ID' },
    { [tableKey]: 'Item Id', [valueKey]: 'ITEM_ID' },
    { [tableKey]: 'Item Description', [valueKey]: 'ITEM_DESC' },
    { [tableKey]: 'Item Plan ID', [valueKey]: 'ITEM_PLAN_ID' },
    { [tableKey]: 'PFEP ABC Code', [valueKey]: 'PFEP_ABC_CODE' },
    { [tableKey]: 'Inventory Days', [valueKey]: 'INVENTORY_QNTY' },
    { [tableKey]: 'VOP', [valueKey]: 'VALUE_ORDER_POLICY' },
    { [tableKey]: 'ADU', [valueKey]: 'ADU' },
    { [tableKey]: 'Inventory Ceiling', [valueKey]: 'INVENTORY_CEILING' },
    { [tableKey]: 'SPQ', [valueKey]: 'STANDARD_PACK_QUANTITY' },
    { [tableKey]: 'MOQ', [valueKey]: 'MULTIPLE_ORDER_QTY' },
    { [tableKey]: 'MMOQ', [valueKey]: 'MIN_ORDER_QTY' },
    { [tableKey]: 'Standard Cost', [valueKey]: 'STANDARD_COST' },
    { [tableKey]: 'Delta Cost', [valueKey]: 'DELTA_COST' },
    { [tableKey]: 'Alert Date', [valueKey]: 'CALCULATED_DATE', sortable: true, type: 'date' },
    { [tableKey]: 'Hot', [valueKey]: 'HOT_IND', type: 'checkBox' },
    { [tableKey]: 'Snooze', [valueKey]: 'SNOOZE_IND', type: 'checkBox' }
];

/* DEMAND GAPS*/

export const pfepDemandGapColumns = [
    { [tableKey]: 'Segment', [valueKey]: 'ORG_ID' },
    { [tableKey]: 'Branch', [valueKey]: 'FACILITY_ID' },
    { [tableKey]: 'Work Center', [valueKey]: 'WORK_CENTER_ID' },
    { [tableKey]: 'Item Id', [valueKey]: 'ITEM_ID' },
    { [tableKey]: 'Item Description', [valueKey]: 'ITEM_DESC' },
    { [tableKey]: 'Demand Gap Start', [valueKey]: 'DEMAND_GAP_START_DATE', type: 'date' },
    { [tableKey]: 'Demand Gap Length', [valueKey]: 'DEMAND_GAP_LENGTH_IN_CLNDR_DAYS' },
    { [tableKey]: 'Alert Date', [valueKey]: 'CALCULATED_DATE', sortable: true, type: 'date' },
    { [tableKey]: 'Hot', [valueKey]: 'HOT_IND', type: 'checkBox' },
    { [tableKey]: 'Snooze', [valueKey]: 'SNOOZE_IND', type: 'checkBox' }
];

export const pfepErpAlertColumns = [
  {[tableKey]: 'Segment', [valueKey]: 'ORG_ID'},
  {[tableKey]: 'Branch', [valueKey]: 'FACILITY_ID'},
  {[tableKey]: 'WorkCenter', [valueKey]: 'WORK_CENTER_ID'},
  {[tableKey]: 'Item ID', [valueKey]: 'ITEM_ID'},
  {[tableKey]: 'Item Description', [valueKey]: 'ITEM_DESC'},
  {[tableKey]: 'Item Plan ID', [valueKey]: 'ITEM_PLAN_ID', type: 'link'},
  {[tableKey]: 'PFEP PoU Container', [valueKey]: 'PFEP_POU_CONTAINER', 'className': 'container-column'},
  {[tableKey]: 'ERP PoU Container', [valueKey]: 'ERP_POU_CONTAINER', 'className': 'container-column'},
  {[tableKey]: 'PFEP Supplier Container', [valueKey]: 'PFEP_SUPPLIER_CONTAINER', 'className': 'supplier-container-column'},
  {[tableKey]: 'ERP Supplier Container', [valueKey]: 'ERP_SUPPLIER_CONTAINER', 'className': 'supplier-container-column'},
  {[tableKey]: 'PFEP Supplier Container Quantity', [valueKey]: 'PFEP_SUPPLIER_CONTAINER_QTY', 'className': 'supplier-ctr-qty-column'},
  {[tableKey]: 'ERP Supplier Container Quantity', [valueKey]: 'ERP_SUPPLIER_CONTAINER_QTY', 'className': 'supplier-ctr-qty-column'},
  {[tableKey]: 'PFEP Kanban Cards', [valueKey]: 'PFEP_LINESIDE_QUEUE', 'className': 'lineside-column'},
  {[tableKey]: 'ERP Kanban Cards', [valueKey]: 'ERP_KANBAN_CARD', 'className': 'lineside-column'},
  {[tableKey]: 'PFEP POU Container Qty', [valueKey]: 'PFEP_CONTAINER_QTY', 'className': 'ctr-qty-column'},
  {[tableKey]: 'ERP POU Container Qty', [valueKey]: 'ERP_CONTAINER_QTY', 'className': 'ctr-qty-column'},
  {[tableKey]:  'Alert Date', [valueKey]: 'CALCULATED_DATE', sortable: true, type: 'date'},
  {[tableKey]:  'Hot', [valueKey]: 'HOT_IND', type: 'checkBox'},
  {[tableKey]:  'Snooze', [valueKey]: 'SNOOZE_IND', type: 'checkBox'}
];



export const alertDetailsColumnMap = {
    [pfepRequired]: pfepRequiredColumns,
    [pfepShortage]: pfepShortageColumns,
    [pfepMOQCeiling]: pfepMOQColumns,
    [pfepDemandGap]: pfepDemandGapColumns,
    [pfepERPAlert]: pfepErpAlertColumns
};

// export constants

export const exporFileNames = {
    [pfepRequired]: 'PFEP Required',
    [pfepShortage]: 'PFEP Over/Under Planned',
    [pfepMOQCeiling]: 'MOQ Ceiling',
    [pfepDemandGap]: 'Demand Gaps',
    [pfepERPAlert]: 'Alignment Discrepancies',
    [weightsDimensions]: 'Weights & Dimensions',
    [packageDetail]: 'Packaging Details'
};

export const exportPostDataKeys = {
    [packageDetail]: { key: 'PackagingDetailMissingSearchEntity', dataType: 'PACKAGING_DETAIL' },
    [weightsDimensions]: { key: 'WeightAndDimensionSearchEntity', dataType: 'WEIGHT_AND_DIMENSION' },
    [pfepERPAlert]: { key: 'AlertsSearchEntity', dataType: 'ERP_ALIGNMENT_DISCREPANCIES' },
    [pfepShortage]: { key: 'AlertsSearchEntity', dataType: 'SHORTAGE_ALERT' },
    [pfepRequired]: { key: 'AlertsSearchEntity', dataType: 'PFEP_REQUIRED' },
    [pfepDemandGap]: { key: 'AlertsSearchEntity', dataType: 'DEMAND_GAPS' },
    [pfepMOQCeiling]: { key: 'AlertsSearchEntity', dataType: 'MOQ_CEILING' },
}

export const singleRecAPIParam = {
    [pfepERPAlert]: "ERP_DISCREPANCY",
    [pfepShortage]: "PFEP_SHORTAGE",
    [pfepRequired]: "PFEP_REQUIRED"
}

export const singleRecReqKeys = {
    [pfepERPAlert]: ["ORG_ID", "FACILITY_ID", "WORK_CENTER_ID", "ITEM_PLAN_ID", "ITEM_ID"],
    [pfepShortage]: ["ORG_ID", "FACILITY_ID", "WORK_CENTER_ID", "ITEM_PLAN_ID", "ITEM_ID"]
}


export const wildCardCollectionKeys = {
    'WORK_CENTER_ID': 'WorkCenterList',
};



export const alertData = [{"Week_Start_Date":"2019-07-28T00:00:00","Total_Count":55,"series":[{"name":"BP New","value":3},{"name":"<2 Weeks","value":0},{"name":"2-4 Weeks","value":1},{"name":">4 Weeks","value":51}]}, {"Week_Start_Date":"2019-08-28T00:00:00","Total_Count":55,"series":[{"name":"BP New","value":3},{"name":"<2 Weeks","value":0},{"name":"2-4 Weeks","value":1},{"name":">4 Weeks","value":51}]}, {"Week_Start_Date":"2019-09-28T00:00:00","Total_Count":55,"series":[{"name":"BP New","value":3},{"name":"<2 Weeks","value":0},{"name":"2-4 Weeks","value":1},{"name":">4 Weeks","value":51}]},{"Week_Start_Date":"2019-10-28T00:00:00","Total_Count":55,"series":[{"name":"BP New","value":3},{"name":"<2 Weeks","value":0},{"name":"2-4 Weeks","value":1},{"name":">4 Weeks","value":51}]},{"Week_Start_Date":"2019-11-28T00:00:00","Total_Count":55,"series":[{"name":"BP New","value":3},{"name":"<2 Weeks","value":0},{"name":"2-4 Weeks","value":1},{"name":">4 Weeks","value":51}]},{"Week_Start_Date":"2019-12-28T00:00:00","Total_Count":55,"series":[{"name":"BP New","value":3},{"name":"<2 Weeks","value":0},{"name":"2-4 Weeks","value":1},{"name":">4 Weeks","value":51}]},{"Week_Start_Date":"2019-12-29T00:00:00","Total_Count":55,"series":[{"name":"BP New","value":3},{"name":"<2 Weeks","value":0},{"name":"2-4 Weeks","value":1},{"name":">4 Weeks","value":51}]},{"Week_Start_Date":"2019-12-01T00:00:00","Total_Count":55,"series":[{"name":"BP New","value":3},{"name":"<2 Weeks","value":0},{"name":"2-4 Weeks","value":1},{"name":">4 Weeks","value":51}]},{"Week_Start_Date":"2019-10-08T00:00:00","Total_Count":55,"series":[{"name":"BP New","value":3},{"name":"<2 Weeks","value":0},{"name":"2-4 Weeks","value":1},{"name":">4 Weeks","value":51}]},{"Week_Start_Date":"2019-05-20T00:00:00","Total_Count":55,"series":[{"name":"BP New","value":3},{"name":"<2 Weeks","value":0},{"name":"2-4 Weeks","value":1},{"name":">4 Weeks","value":51}]},{"Week_Start_Date":"2019-05-08T00:00:00","Total_Count":55,"series":[{"name":"BP New","value":3},{"name":"<2 Weeks","value":0},{"name":"2-4 Weeks","value":1},{"name":">4 Weeks","value":51}]},{"Week_Start_Date":"2019-06-21T00:00:00","Total_Count":55,"series":[{"name":"BP New","value":3},{"name":"<2 Weeks","value":0},{"name":"2-4 Weeks","value":1},{"name":">4 Weeks","value":51}]},{"Week_Start_Date":"2019-01-24T00:00:00","Total_Count":55,"series":[{"name":"BP New","value":3},{"name":"<2 Weeks","value":0},{"name":"2-4 Weeks","value":1},{"name":">4 Weeks","value":51}]},{"Week_Start_Date":"2019-07-17T00:00:00","Total_Count":55,"series":[{"name":"BP New","value":3},{"name":"<2 Weeks","value":0},{"name":"2-4 Weeks","value":1},{"name":">4 Weeks","value":51}]},{"Week_Start_Date":"2019-01-01T00:00:00","Total_Count":55,"series":[{"name":"BP New","value":3},{"name":"<2 Weeks","value":0},{"name":"2-4 Weeks","value":1},{"name":">4 Weeks","value":51}]},{"Week_Start_Date":"2019-08-20T00:00:00","Total_Count":55,"series":[{"name":"BP New","value":3},{"name":"<2 Weeks","value":0},{"name":"2-4 Weeks","value":1},{"name":">4 Weeks","value":51}]},{"Week_Start_Date":"2019-08-20T00:00:00","Total_Count":55,"series":[{"name":"BP New","value":3},{"name":"<2 Weeks","value":0},{"name":"2-4 Weeks","value":1},{"name":">4 Weeks","value":51}]},{"Week_Start_Date":"2019-08-27T00:00:00","Total_Count":55,"series":[{"name":"BP New","value":3},{"name":"<2 Weeks","value":0},{"name":"2-4 Weeks","value":1},{"name":">4 Weeks","value":51}]},{"Week_Start_Date":"2019-11-21T00:00:00","Total_Count":55,"series":[{"name":"BP New","value":3},{"name":"<2 Weeks","value":0},{"name":"2-4 Weeks","value":1},{"name":">4 Weeks","value":51}]},{"Week_Start_Date":"2019-10-17T00:00:00","Total_Count":55,"series":[{"name":"BP New","value":3},{"name":"<2 Weeks","value":0},{"name":"2-4 Weeks","value":1},{"name":">4 Weeks","value":51}]}];