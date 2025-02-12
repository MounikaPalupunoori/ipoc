

import { StudyController } from '@Controller/StudyController.js';
import { DASHBOARD_APP } from '@Constants/default.js';
import { DashboardService } from '@Services/Dashboard';
export const DashboardController = new (class {

  constructor() {
    this.iPOCAppID = null;
    this.showDashboard = true;
    this.applicationId = 0;
  }
  /**
   * @name getApplicationList
   * @param {Object} config
   * @returns {Object}
   * @description This getApplicationList method help to get list of application
   * @example getApplicationList({})
  */
  async getApplicationList() {
    try {
      let applicationList = await StudyController.getApplications();
      this.applicationList = applicationList;
    } catch (e) {
      console.log(e);
    }
  };
  /**
   * @name getApplicationList
   * @param {Object} config
   * @returns {Object}
   * @description This getApplicationList method help to get list of application
   * @example getApplicationList({})
  */
  getPOCAppID() {
    try {
      let iPOCApp = this.applicationList.filter(app => {
        return app.name === DASHBOARD_APP;
      })
      this.iPOCAppID = iPOCApp[0].applicationId;
      return iPOCApp;
    } catch (e) {
      console.log(e);
    }
  };
  async getSubjects(params) {
    try {
      let response = await DashboardService.getSubjects(params);
      if (response.statusCode == 200) {
        return response;
      } else {
        throw new Error('Failed to fetch data for selected algorithm config');
      }
    } catch (e) {
      console.log(e);
    }
  }
  async getOrderTests(params) {
    try {
      let response = await DashboardService.getOrderTests(params);
      if (response.statusCode == 200) {
        return response;
      } else {
        throw new Error('Failed to fetch data for selected order test');
      }
    } catch (e) {
      console.log(e);
    }
  }
  async getSubjectModel(param) {
    try {
      let response = await DashboardService.getSubjectModel(param);
      if (response.statusCode == 200) {
        return response;
      } else {
        let errMsg = {
          "message":response.message,
          "statusCode":response.statusCode
        }
        throw errMsg;
      }
    } catch (e) {
      return {
        "statusCode": e.statusCode,
        "message": e.message
      }
    }
  }
  /**
   * @name getOrderTestModel
   * @param
   * @returns
   * @description This getOrderTestModel is used to get order test model from the API.
   * @example getOrderTestModel();
   */
  async getOrderTestModel(param){
    try {
      let response = await DashboardService.getOrderTestModel(param);
      if (response.statusCode == 200) {
        return response;
      } else {
        let errMsg = {
          "message":response.message,
          "statusCode":response.statusCode
        }
        throw errMsg;
      }
    } catch (e) {
      return {
        "statusCode": e.statusCode,
        "message": e.message
      }
    }
  }
  /**
   * @name getOrderTestModel
   * @param
   * @returns
   * @description This getOrderTestModel is used to get order test model from the API.
   * @example getOrderTestModel();
   */
  async getOrderTestDetail(param){
    try {
      let response = await DashboardService.getOrderTestDetail(param);
      if (response.statusCode == 200) {
        return response;
      } else {
        throw new Error('Failed to fetch data for order test model');
      }
    } catch (e) {
      console.log(e);
    }
  }
  async handleSaveOrderTest(orderModel) {
    try {
      // let param = {
      //   subjectModel: subModel,
      // }
      let response = await DashboardService.saveOrderTest(orderModel);
      return response.data
    } catch (error) {
      console.log("Error:handleSaveSubject", error);
      return false;
    }
  }
  async handleSavePatient(subModel) {
    try {
      // let param = {
      //   subjectModel: subModel,
      // }
      let response = await DashboardService.saveSubject(subModel);
      return response.data
    } catch (error) {
      console.log("Error:handleSaveSubject", error);
      return false;
    }
  }
  async handleEditPatient(subModel){
    try {
      //  let param = {
      //   subjectModel: subModel,
      // }
      let response = await DashboardService.getSubjectDetail(subModel);
      if(response){
        return response.data 
      }else{
        throw new Error('Failed to fetch data for selected patient info');
      }
    } catch (error) {
      console.log(error)
    }
  }
  /**
 * @name getOrderTestModel
 * @param
 * @returns
 * @description This getOrderTestModel is used to get order test model from the API.
 * @example getOrderTestModel();
 */
  async getKitTemplates(){
    try {
      let response = await DashboardService.getKitTemplates();
      if (response.statusCode == 200) {
        return response;
      } else {
        throw new Error('Failed to fetch data for order test model');
      }
    } catch (e) {
      console.log(e);
    }
  }
  /**
 * @name generateBarCodes
 * @param
 * @returns
 * @description This generateBarCodes is used to get order test model from the API.
 * @example generateBarCodes();
 */
  async generateBarCodes(paramInfo){
    try {
      let response = await DashboardService.generateBarCodes(paramInfo);
      if (response.statusCode == 200) {
        return response;
      } else {
        throw new Error('Failed to fetch data for order test model');
      }
    } catch (e) {
      console.log(e);
    }
  }
  async getTRF(paramInfo){
    try {
      let response = await DashboardService.getTRF(paramInfo);
      if (response.statusCode == 200) {
        return response;
      } else {
        throw new Error('Failed to print requisition');
      }
    } catch (e) {
      console.log(e);
    }
  }
  async setNotificationState(status) {
    notificationState.set({
      active: status,
      msg: "Please save your action. Otherwise the changes will not reflect in your dashboard."
    })
  }
})();