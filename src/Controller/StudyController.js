import { getLocalStorage } from '@Utils/localStorage.js';
import { StudyService } from '@Services/Study.js';
export const StudyController = new (class {
  constructor() {
    this.selectedStudies = this.getSelectedStudies();
    this.studyAttributeList = [];
  }
  async getStudy() {
    try {
      const studyListResponse = await StudyService.getStudyList();
      const response = studyListResponse.data.getStudyList.data;
      if (response && response.length) {
        const studyResponse = response.map((r) => {
          return {
            value: r.studyId,
            label: r.studyIdentifier,
          };
        });
        return studyResponse;
      } else {
        throw Error('study information not available');
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  async checkInstanceStudy(){
    try {
      const instanceResponse = await StudyService.checkInstanceStudy();
      if (instanceResponse.statusCode == 200) {
        return instanceResponse.data;
      } else {
        throw Error('study information not available');
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  processSelectedStudy(param) {
    return param.detail !== null ?
      param.detail.map((ele) => {
        return { studyId: ele.value, studyName: ele.label };
      })
      : null;
  }
  getSelectedStudies() {
    return getLocalStorage('selectedStudies');
  }
  /**
   * 
  */
  async getStudyAttributes() {
    try {
      this.selectedStudies = getLocalStorage('selectedStudies');
      let studyIds = this.selectedStudies.map((r) => r.studyId.toString());
      let params = {};
      params = { studyIds: studyIds };
      let studyAttributeResponse = await StudyService.getStudyAttributes(
        params
      );
      if (studyAttributeResponse?.data?.getStudyAttributes?.statusCode != 200) {
        throw new Error('Error while fetching study attributes.');
      }
      let studyAttributeList =
        studyAttributeResponse.data.getStudyAttributes.data;
      // let removeDuplicateAttribute = studyAttributeList.reduce((a, d) => {
      //   if(d){
      //     a[d.attributeName] = d;
      //   }
      //   return a;
      // }, {});
      // studyAttributeList = [
      //   ...Object.values(removeDuplicateAttribute),
      //   ...[{ attributeName: 'radiology' }, { attributeName: 'pathology' }],
      // ];
      this.studyAttributes = studyAttributeList;
      return studyAttributeList;
      // return studyAttributeList.reduce((acc, data) => {
      //   acc[data.attributeName] = data;
      //   return acc;
      // }, {});
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  async revokeToken() {
    try {
      const tokenResponse = await StudyService.revokeToken();
      return tokenResponse;
    } catch (error) {
      console.log(error);
    }
  }
  async getApplications(){
    try{
      let userApplicationList = await StudyService.getApplication();
      return userApplicationList.assignedApps;
    }catch(e){
      console.log(e)
    }
  }
  async getACL(aclParam){
    try{
      let aclResponse = await StudyService.getACLDetail(aclParam);
      if (aclResponse && aclResponse.data.length > 0) {
        return aclResponse.data;
      } else {
        throw new Error("Empty record");
      }
    }catch(e){
      console.log(e);
      return [];
    }
  }
})();