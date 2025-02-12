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
export const DashboardService = new (class {
  constructor() {
    this.baseUrl = myapp.env.BASE_URL;
    this.gqlUrl = myapp.env.BASE_URL_GQL;
  }
  getValidToken() {
    return new Promise((resolve, reject) => {
      axios
        .post(this.baseUrl + '/api/token', {
          username: Constant.username,
          password: Constant.password,
        })
        .then(function (response) {
          localStorage.setItem('token', response.data.token);
          resolve(response.token);
        })
        .catch(function (error) {
          reject(error);
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
  async getEntityList() {
    var reqParams = {
      query: `query {getEntityList}`,
    };
    var response = await this.getData(reqParams);
    return response.data;
  }
  async setDashboardConfig(paramInfo) {
    var reqParams = {
      query: `
        mutation saveDashboardConfig($dashboardConfig: JSON!,$applicationId: Int!) {
          saveDashboardConfig(dashboardConfig: $dashboardConfig, applicationId : $applicationId)
        } 
      `,
      variables: {
        dashboardConfig: paramInfo.dashboardConfig,
        applicationId: paramInfo.appId
      },
    };
    var response = await this.getData(reqParams);
    return response.data;
  }
  async getSubjects (params) {
    var reqParams = {
      query: `query getSubjects($subjectModel: JSON!) {
        getSubjects(subjectModel: $subjectModel)
      }`,
      variables: params
    };
    let response = await this.getData(reqParams);
    return response.data.data.getSubjects;
  }
  async getOrderTests (params) {
    var reqParams = {
      query: `query getOrderTests($orderTestModel: JSON!) {
        getOrderTests(orderTestModel: $orderTestModel)
      }`,
      variables: params
    };
    let response = await this.getData(reqParams);
    return response.data.data.getOrderTests;
  }
  async getOrderTestDetail (params) {
    var reqParams = {
      query: `query getOrderTestDetail($orderTestModel: JSON!) {
        getOrderTestDetail(orderTestModel: $orderTestModel)
      }`,
      variables: params
    };
    let response = await this.getData(reqParams);
    return response.data.data.getOrderTestDetail;
  }
  async getSubjectModel (params) {
    var reqParams = {
      query: ` query getSubjectModel($studyId:Int) {
        getSubjectModel(studyId:$studyId) 
      }`,
      variables:{
        "studyId": params
      } 
    };
    let response = await this.getData(reqParams);
    return response.data.data.getSubjectModel;
  }
  async saveSubject(paramInfo){
    var reqParams = {
      query: `
      mutation saveSubject($subjectModel: JSON!,$eSignatureModel: JSON) {
        saveSubject(subjectModel: $subjectModel,eSignatureModel: $eSignatureModel)
      }
      `,
      variables: {
        subjectModel: paramInfo.subjectModel,
        eSignatureModel: paramInfo.eSignature
      },
    };
    var response = await this.getData(reqParams);
    return response.data;
  }
  async getSubjectDetail(paramInfo){
    var reqParams = {
      query: `
      query getSubjectDetail($subjectModel: JSON!) {
        getSubjectDetail(subjectModel: $subjectModel)
      } 
      `,
      variables: {
        subjectModel: paramInfo,
      },
    };
    var response = await this.getData(reqParams);
    return response.data;
  }
  async getOrderTestModel(paramInfo){
    var reqParams = {
      query: `query getOrderTestModel($orderFrom:String!,$studyId:Int) {
        getOrderTestModel(orderFrom:$orderFrom,studyId:$studyId)
      }`,
      variables: {
        orderFrom: paramInfo?.orderFrom,
        studyId: paramInfo?.studyId
      },
    };
    let response = await this.getData(reqParams);
    return response.data.data.getOrderTestModel;
  }
  async saveOrderTest(paramInfo){
    var reqParams = {
      query: `
        mutation saveOrderTest($orderTestModel: JSON!,  $eSignatureModel: JSON) {
          saveOrderTest(orderTestModel: $orderTestModel, eSignatureModel: $eSignatureModel)
        }
      `,
      variables: {
        orderTestModel: paramInfo.orderModel,
        eSignatureModel: paramInfo.eSignature
      },
    };
    var response = await this.getData(reqParams);
    return response.data;
  }
  async getKitTemplates  () {
    var reqParams = {
      query: `query getKitTemplates{
        getKitTemplates
      }`
    };
    let response = await this.getData(reqParams);
    return response.data.data.getKitTemplates;
  }
  async generateBarCodes(paramInfo){
    var reqParams = {
      query: `query generateBarcodes($inputModel: JSON!) {
        generateBarcodes(inputModel: $inputModel)
      }`,
      variables: {
        inputModel: paramInfo,
      }
    };
    let response = await this.getData(reqParams);
    return response.data.data.generateBarcodes;
  }
  async getTRF(paramInfo){
    var reqParams = {
      query: `query getTRF($inputModel: JSON!) {
        getTRF(inputModel: $inputModel)
      }`,
      variables: {
        inputModel: paramInfo,
      }
    };
    let response = await this.getData(reqParams);
    return response.data.data.getTRF;
  }
})();
