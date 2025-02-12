export default {
  "preprocess": {
    "threshold": {
      "title": "Threshold for missing values",
      "column": {
        "label": "Zero Filter",
        "labelNa": "NA Filter",
        "chart": {
          "title": "Missing Value Distribution Per Column",
          "nodata": "Distribution Per Column Data"
        }
      },
      "row": {
        "label": "Filter for 0",
        "labelNa": "NA Filter",
        "chart": {
          "title": "Missing Value Distribution Per Row",
          "nodata": "Distribution Per Row Data"
        }
      }
    },
    "imputation": {
      "title": "Imputation Type",
      "dropdown_title": "Select Imputation type",
      "imputation_btn_title": "Imputation",
      "no_result": "Selected imputation data not available",
      "loading_msg":"Loading data"
    },
    "normalize": {
      "title": "Normalization",
      "dropdown_default_title": "Select Normalization",
      "non_norm_title": "NON Normalized",
      "norm_title": "Normalized",
      "norm_no_chart": "Selected Normalization data not available",
      "non_norm_no_chart": "Selected NON Normalization data not available"
    },
    "batch_correction":{
      "title": "Batch Correction",
      "dropdown_default_title": "Select Subject Attributes",
      "before_title": "Before Batch Correction (Density plot)",
      "after_title": "After Batch Correction (Density plot)",
      "before_no_chart": "Batch Correction data not available",
      "after_no_chart": "Batch Correction data not available"
    }
  },
  "dataset": {
    "list": {
      "title": "Dataset List",
      "actionBtnTitle": "Submit"
    }
  },
  "algorithm": {
    "allowedLevelInMenu": 1
  },
  "rowKey": "observation",
  "columnKey": "sample_barcode",
  "rowChartKey": "observationWiseDistribution",
  "rowChartBeforeCountKey": "observationBefore",
  "rowChartAfterCountKey": "observationAfter",
  "columnChartKey": "sampleWiseDistribution",
  "columnChartBeforeCountKey": "sampleBefore",
  "columnChartAfterCountKey": "sampleAfter",
  "preprocessRouteConfig": {
    "id": 1,
    "name": 'Data Cleansing',
    "link": '/preprocess',
    "parent": 'Preprocessing',
  },
  "boxPlotNorm": {
    datasetName: "boxPlot",
    datasetType: "boxPlot",
    label: "Sample Summary",
    xLabel: "Samples",
    yLabel: "Expression Values"
  }
}
export const DASHBOARD_APP = 'iDiscovery';

export const SORT_ORDER = {
  "aclTable":"desc.aclId"
}
export const STATIC_MSG = {
  "unauthorized":{"type":'warning', "title":"Unauthorized Access", "message":"You do not have privileges to access this page"},
}