// import {Http} from './Http';
import axios from 'axios';
import Constant from '../../config/constant';
axios.interceptors.response.use(response => {
  let {statusCode} = response && response.data.data ? { ...response.data.data[Object.keys(response.data.data)[0]] } : "";
  if (statusCode && statusCode == 401) {
    let dialog = document.getElementById("logoutModal");
    dialog.className += " show"
    dialog.style.display = "block";
    document.getElementById("loginButton").addEventListener("click", redirectToLogin);
  }
  else {
    return response
  }
}, error => {
  if (error.response.status === 401) {
    console.log("in error", error)
  }
  return error;
});
function redirectToLogin() {
  window.location.href = myapp.env.ICORE_CONSOLE;
}
export const StudyService = new (class {
  constructor() {
    this.baseUrl = myapp.env.BASE_URL;
    this.gqlUrl = myapp.env.BASE_URL_GQL;
  }
  async getUserApplications(paramInfo) {
    let reqParams = {
      query:
        'query GetUserApplications($userId:Float!) { getUserApplications(userId : $userId){data{assignedApps{name,applicationId,description,iconUrl,launchUrl},otherApps{name,applicationId,description,iconUrl,launchUrl}}statusCode, message}}',
      variables: {
        userId: paramInfo.userId,
      },
    };
    let response = await this.getData(reqParams);
    return response.data;
  }
  getValidToken(param) {
    let { username, password } = param;
    return new Promise((resolve, reject) => {
      axios
        .post(Constant.base_url + '/api/token', {
          username: username,
          password: password,
        })
        .then(function (response) {
          //localStorage.setItem('token', response.data.token);
          resolve(response.data.token);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
  revokeToken() {
    return new Promise((resolve, reject) => {
      axios
        .post(Constant.base_url + "/api/token/revoke", {
          token: localStorage.getItem("token")
        },{
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }})
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          self.error = true;
        });
    });
  }
  getData(reqParams) {
    let token = localStorage.getItem('token');
    return new Promise((resolve, reject) => {
      axios
        .post(this.gqlUrl + '/graphql', reqParams, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          self.error = true;
          reject(error);
        });
    });
  }
  async getEntityAttributeData(dashboardModel) {
    let reqParams = {
      query:
        `query getEntityAttributeData ($dashboardModel:JSON!){
          getEntityAttributeData(dashboardModel:$dashboardModel){
            data
            message
            statusCode
            error
          }
        }`,
      variables: {
        dashboardModel: dashboardModel,
      },
    };
    let response = await this.getData(reqParams);
    return response.data;
  }
  /**
   * 
  */
  async getStudyList() {
    let reqParams = {
      query:`query getStudies($paginationParams: JSON, $includeMeta: Boolean ) {getStudyList(paginationParams:$paginationParams, includeMeta: $includeMeta)}`,
      variables: {
        paginationParams: {},
        includeMeta: false
      }
    };
    let response = await this.getData(reqParams);
    return response.data;
  }
  async getStudyAttributes(paramInfo) {
    let reqParams = {
      query:
        'query getStudyAttributes($studyIds:[String!]!) { getStudyAttributes(studyIds : $studyIds){data{studyId, entity, attributeName, displayName, displayOrder, description, dataType }statusCode, message}}',
      variables: {
        studyIds: paramInfo.studyIds,
      },
    };
    let response = await this.getData(reqParams);
    return response.data;
  }
  async getClinicalAttributeDataCounts(paramInfo) {
    let reqParams = {
      query:
        'query getClinicalAttributeDataCounts($attributes: [String!]!, $studyIds: [String!]!, $attributeFilters:[AttributeDataCountInputFilter!]) { getClinicalAttributeDataCounts(attributes: $attributes, studyIds: $studyIds, attributeFilters:$attributeFilters) { data { attributeId, attributeName, counts { value, count,selected } } statusCode, message }}',
      variables: {
        attributes: paramInfo.attributes,
        studyIds: paramInfo.studyIds,
        attributeFilters: paramInfo.attributeFilters,
      },
    };
    let response = await this.getData(reqParams);
    return response.data;
  }
  async getChartOperationsData() {
    let response = {
      data: {
        chartOperationsName: 'hoverheader',
      },
    }; // get hoverHeader data from config
    return response;
  }
  async getChartData() {
    // get the data for the chart once the API is ready
  }
  async getStorageObjectAttributes(params) {
    let reqParams = {
      query: `query getStorageObjectAttributes($storageFilter: StorageFilter) {
          getStorageObjectAttributes(storageFilter: $storageFilter)
        }`,
      variables: {
        storageFilter: {
          filter: {
            imageType: params.imageType,
          },
          storageObjectId: [],
        },
      },
    };

    let response = await this.getData(reqParams);
    return response?.data?.data?.getStorageObjectAttributes?.data?.data;
  }
  async getApplication() {
    let userId = parseInt(localStorage.getItem('userId'));
    let reqParams = {
      query: `
      query getUserApplications{
        getUserApplications(userId: ${userId}){ 
          data{
            assignedApps{ applicationId, name, description, iconUrl, launchUrl  }, 
            otherApps{ applicationId, name, description, iconUrl  }
          }
        }
      }
      `
    };
    let response = await this.getData(reqParams);
    return response.data.data.getUserApplications.data;
  }
  async getPCAData(paramInfo) {
    try {
      let reqParams = {
        query: `query getPCAData($attributeFilters: PcaAnalysisInputFilter){
          getPCAData(attributeFilters: $attributeFilters) 
        }`,
        variables: {
          attributeFilters: {
            studyId: paramInfo.study_id,
            assayName: paramInfo.assay,
            normalization: paramInfo.normalization,
            measure: paramInfo.measure,
            remainingSamples: paramInfo.remainingSamples,
            cutOffVariance: paramInfo.cutOffVariance,
          },
        },
      };
      var response = await this.getData(reqParams);
      //TODO: handle the error and success
      return response.data.data.getPCAData;
    } catch (e) {
      console.log(e);
    }
  }
  async checkInstanceStudy(){
    let reqParams = {
      query:`query checkInstanceStudy{checkInstanceStudy}`
    };
    let response = await this.getData(reqParams);
    return response.data.data.checkInstanceStudy;
  }
  async getACLDetail(param) {
    var reqParams = {
      query: `query getAcl($aclModel:JSON) {
        getAcl(aclModel:$aclModel)
      }`,
      variables: {
        aclModel: {
          "application": param.application,
          "role": param.role,
          "pagination": param?.pagination
        }
      },
    };
    var response = await this.getData(reqParams);
    return response.data.data.getAcl;
  }
})();
