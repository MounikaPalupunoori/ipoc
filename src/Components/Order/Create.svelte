<script>
  import { onMount, createEventDispatcher, getContext } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { SampleInputWrapper } from '@Components/Order/';
  import { DashboardController } from '@Controller/DashboardController';
  import { toast } from '@zerodevx/svelte-toast';
  import LoadingIndicator from '@Components/Shared/LoadingIndicator.svelte';
  import FormField from '@Components/Shared/FormField/index.svelte';
  import Alert from '@Components/Shared/Alert/index.svelte';
  import Stretch from '@Components/Shared/Loader/Stretch';
  import Container from '@Components/Container/index.svelte';
  import Tabs from '@Components/Shared/Tabs.svelte';
  import Fa from 'svelte-fa';
  import { faList } from '@fortawesome/free-solid-svg-icons';
  import { getLocalStorage } from '@Utils/localStorage.js';
  import { v4 as uuidv4 } from 'uuid';
  import Modal from '@Components/Shared/Modal/Modal.svelte';
  import AuditModal from '@Components/Shared/Modal/AuditModal.svelte';
  import { selectedLinkState } from '@Store/Sidebar.js';

  export let type;
  export let action;
  const dispatch = createEventDispatcher();
  //reactive variable
  $: tabItems = [];
  $: patientDropdownList = [];
  $: orderTestModel = {};
  // local variable
  const { open } = getContext('simple-modal');
  const username = localStorage.getItem('userName');
  let enableAudit= true;
  let eSignatureModel = {
    username: username,
    password: '',
    changeReasonDetail: '',
  };
  let noData;
  let showOverlayLoader = false;
  let listOfSampleInputs = {};
  let fieldsetinputparams = {};
  let fieldsetAttributeParams = {};
  let isAllFieldsetValid = {};
  let isAllFieldValid = false;
  let activeTabValue = 0;
  let orderTestModelAttributes = [];
  let inputParameters = [];
  let attributeInput = [];
  let orderTestModelSubject = {};
  let specimenTestsMapping = [];
  let sampleSpecimenMapping = [];
  let sampleBarcodes = {};
  let isError = false;
  let errorMsg = '';
  let isBarcodeValid = true;
  let status = 0;
  let setListLink = {
    id: 2,
    name: 'List',
    displayName: 'List',
    key: 'order_list',
    parent: 'order_view',
    isEnabled: true,
    isExpanded: false,
    isChildrenExpanded: true,
  };
  let setActiveLink = {
    id: 2,
    name: 'Order Test',
    displayName: 'Order Test',
    key: 'Order_Test',
    parent: 'order_view',
    isEnabled: true,
    isExpanded: false,
    isChildrenExpanded: true,
  };
  let inputModel = {
    subjectModel: {
      pagination: {
        sort: 'desc.subjectId',
        search: '',
      },
      includeMeta: true,
      studyFilter: [],
    },
  };
  let displayStatus = {
    class: '',
    message: '',
  };
  let editMode = false;
  let testType = {
    test: 'orderTest',
    sample: 'sample',
    accession: 'accession',
  };
  let patientDetail = { name: '' };
  let nonMutableOrderTestModel = {};
  let btnTitle = 'Save';
  let btnSavePrintTitle = 'Save and Print Requisition';
  let enableLoader = true;
  let selectedTabId = '';
  let selectedIndex = 0;
  let studies = getLocalStorage('selectedStudies');
  let checkInstanceStudy = localStorage.getItem('instanceStudy');
  // onMount lifecycle
  onMount(async () => {
    localStorage.removeItem('orderTestModel');
    localStorage.removeItem('specimenTestsMapping');
    localStorage.removeItem('sampleSpecimenMapping');
    if (type === 'accession') {
      setActiveLink.name = 'Order Accession Test';
      setActiveLink.displayName = 'Accession';
      setActiveLink.key = 'Accession';
    }
    $selectedLinkState = setActiveLink;
    if (testType.hasOwnProperty(type)) {
      if (action == 'edit') {
        editMode = true;
        btnTitle = 'Update'; //updateBtnTitleObj[type]
        btnSavePrintTitle = "Update and Print Requisition";
      } else {
        editMode = false;
        btnTitle = 'Save'; //saveBtnTitleObj[type];
        btnSavePrintTitle = "Save and Print Requisition";
      }
      let studyId = studies[0].studyId;
      // let studyId = checkInstanceStudy === 'false' ? studies[0].studyId : null;
      await getOrderTestModel(testType[type],studyId);
      await getPatientList();
    }
    let createdPatient = getLocalStorage('patient_order_test');
    let checkPatientRoute = createdPatient?.fromPatientCreate;
    if (checkPatientRoute) {
      let selectedPatient = patientDropdownList.filter(
        (item) => item.value === createdPatient?.subjectInfo
      );
      patientDetail = selectedPatient[0];
    }
    let patientListInputConfig = {
      subjectAttributeValueId: null,
      name: 'patient_name',
      dataType: 'string',
      displayLabel: 'Patient Name',
      description: 'Patient Name',
      visible: true,
      required: true,
      value: checkPatientRoute ? patientDetail : patientDetail?.name,
      enumlist: patientDropdownList,
      widgetType: 'dropdown',
      displayOrder: 6,
      displayGroup: 'Order Test',
    };
    let checkPatientInputIndex = orderTestModelAttributes.findIndex(
      (r) => r.name == 'patient_name'
    );
    let orderTestInput = orderTestModelAttributes;
    if (!orderTestModelAttributes[checkPatientInputIndex]) {
      orderTestInput = [patientListInputConfig, ...orderTestModelAttributes];
    }
    orderTestModelAttributes = orderTestInput.filter((r) => {
      return r.displayGroup == 'Order Test';
    });
    attributeInput = orderTestInput.filter((r) => {
      return r.displayGroup != 'Order Test';
    });
    fieldsetinputparams = orderTestModelAttributes
      .filter((r) => r.visible)
      .reduce((a, d) => {
        if (a.hasOwnProperty(d?.displayGroup)) {
          a[d.displayGroup].push(d);
        } else {
          isAllFieldsetValid[d.displayGroup] = false;
          a[d.displayGroup] = [d];
        }
        return a;
      }, {});
    // order test attribute field input
    fieldsetAttributeParams = attributeInput
      .filter((r) => r.visible)
      .reduce((a, d) => {
        if (a.hasOwnProperty(d?.displayGroup)) {
          a[d.displayGroup].push(d);
        } else {
          isAllFieldsetValid[d.displayGroup] = false;
          a[d.displayGroup] = [d];
        }
        return a;
      }, {});
    // init tabItems for tab component
    handleCreateSampleTab(orderTestModelSubject?.samples);
  });
  const setStatus = () => {
    if (orderTestModel?.attributes?.length > 0) {
      for (let i = 0; i < orderTestModel.attributes.length; i++) {
        if (orderTestModel.attributes[i]?.name === 'status') {
          if (type === 'test') {
            orderTestModel.attributes[i].value = {
              label: 'Ordered',
              value: 'Ordered',
            };
            break;
          } else if (type === 'accession') {
            orderTestModel.attributes[i].value = {
              label: 'Accessioned',
              value: 'Accessioned',
            };
            break;
          }
        }
      }
    }
  };
  const handleCreateSampleTab = (orderTestModelSamples) => {
    let tempOrderTestModelSamples = JSON.parse(
      JSON.stringify(orderTestModelSamples)
    );
    tabItems = tempOrderTestModelSamples.map((r, i) => {
      let tabId = r.tabId;
      let titlealtr = r?.sampleBarcode?.displayLabelaltr;
      if (i == 0) {
        activeTabValue = tabId;
      }
      let sampleBarcodeInput = r.sampleBarcode;
      let inputs = JSON.parse(
        JSON.stringify([...r.attributes, sampleBarcodeInput])
      );
      if (action == 'edit') {
        // specimenTestsMapping = orderTestModelSubject?.samples.map((sample) => {
        //   let sampleTypeValue = '';
        //   let specimenValue = '';
        //   sample.attributes.forEach((r) => {
        //     if (r.name == 'SAMPLE_TYPE') {
        //       sampleTypeValue = r.value.value;
        //     } else if (r.name == 'SPECIMEN') {
        //       specimenValue = r.value.value;
        //     }
        //   });
        //   return {
        //     sampleType: sampleTypeValue,
        //     specimen: specimenValue,
        //     testPanels: sample?.testsPanels,
        //     tests: sample?.tests,
        //   };
        // });
      }
      let o = {};
      let label = '';
      let active = i + 1;
      if (tempOrderTestModelSamples?.length - 1 === i && tabItems?.length > 0) {
        label = `Sample ${tabItems[tabItems.length - 1].active + 1}`;
        active = tabItems[tabItems.length - 1].active + 1;
      } else {
        label = `Sample ${i + 1}`;
        active = i + 1;
      }
      o['label'] = label;
      o['value'] = tabId;
      o['active'] = active;
      o['tabId'] = tabId;
      o['component'] = SampleInputWrapper;
      o['index'] = i;
      o['props'] = {
        tabId: tabId,
        index: i,
        label: titlealtr,
        inputParams: inputs.filter((r) => {
          return r.hasOwnProperty('value');
        }),
        sampleTypeSpecimenList: sampleSpecimenMapping,
        specimenTestsMapping: specimenTestsMapping,
      };
      return o;
    });
  };
  /**
   * @name getOrderTestModel
   * @param
   * @returns
   * @description This getOrderTestModel is used to get order test model from the API.
   * @example getOrderTestModel();
   */
  const getOrderTestModel = async (orderTestType,studyId) => {
    try {
      let apiResponse = null;
      if (action == 'create') {
        let param = {
          orderFrom: orderTestType,
          studyId: studyId
        };
        apiResponse = await DashboardController.getOrderTestModel(param);
        nonMutableOrderTestModel = JSON.parse(
          JSON.stringify(apiResponse.data.orderTestModel)
        );
      } else if (action == 'edit') {
        let orderDetail = getLocalStorage('SELECTED_ORDER');
        let testModelParam = {
          orderFrom: orderTestType,
          studyId: studyId
        };

        let orderTestModelResponse =
          await DashboardController.getOrderTestModel(testModelParam);
        if (orderTestModelResponse) {
          let param = {
            orderTestModel: {
              accessionId: orderDetail?.accessionId,
              studyId:
                orderTestModelResponse?.data?.orderTestModel?.subject?.studyId,
            },
          };
          apiResponse = await DashboardController.getOrderTestDetail(param);

          specimenTestsMapping =
            orderTestModelResponse.data.specimenTestsMapping;
          sampleSpecimenMapping =
            orderTestModelResponse.data.sampleSpecimenMapping;
          nonMutableOrderTestModel = JSON.parse(
            JSON.stringify(orderTestModelResponse.data.orderTestModel)
          );
          localStorage.setItem(
            'specimenTestsMapping',
            JSON.stringify(specimenTestsMapping)
          );
          localStorage.setItem(
            'sampleSpecimenMapping',
            JSON.stringify(sampleSpecimenMapping)
          );
        }
      }
      if (apiResponse) {
        orderTestModel = apiResponse.data.orderTestModel;
        orderTestModel.subject.samples.forEach((sample, i) => {
          orderTestModel.subject.samples[i]['tabId'] = uuidv4();
        });
        localStorage.setItem('orderTestModel', JSON.stringify(orderTestModel));
        orderTestModelAttributes = apiResponse.data.orderTestModel.attributes;
        orderTestModelAttributes.forEach((input, i) => {
          orderTestModelAttributes[i].readOnly =
            nonMutableOrderTestModel.attributes[i].readOnly;
        });
        //orderTestModelAttributes.forEach();
        orderTestModelSubject = JSON.parse(
          JSON.stringify(apiResponse.data.orderTestModel.subject)
        );
        orderTestModelSubject.samples.map((r, i) => {
          let label = r.sampleBarcode.displayLabel;
          r.sampleBarcode.displayLabelaltr = `${label}_${i}`;
          r.sampleBarcode.readOnly =
            nonMutableOrderTestModel.subject.samples[0]?.sampleBarcode.readOnly;
          return r;
        });
        let creatAPIspecimenTestsMapping =
          apiResponse.data.specimenTestsMapping;
        let createAPIsampleSpecimenMapping =
          apiResponse.data.sampleSpecimenMapping;
        // localStorage.setItem('orderTestModel', JSON.stringify(orderTestModel));
        if (creatAPIspecimenTestsMapping) {
          specimenTestsMapping = creatAPIspecimenTestsMapping;
          localStorage.setItem(
            'specimenTestsMapping',
            JSON.stringify(specimenTestsMapping)
          );
        }
        if (createAPIsampleSpecimenMapping) {
          sampleSpecimenMapping = createAPIsampleSpecimenMapping;
          localStorage.setItem(
            'sampleSpecimenMapping',
            JSON.stringify(sampleSpecimenMapping)
          );
        }
        let studyId = orderTestModelSubject?.studyId;
        inputModel.subjectModel.studyFilter.push(studyId);
        // groupInputParams();
        enableLoader = false;
      } else {
        enableLoader = false;
        noData = true;
      }
    } catch (error) {
      noData = true;
      enableLoader = false;
      console.log(error);
    }
  };
  /**
   * @name getPatientList
   * @param
   * @returns
   * @description get PatientList
   * @example getPatientList();
   */
  const getPatientList = async () => {
    try {
      let response = await DashboardController.getSubjects(inputModel);
      if (response) {
        patientDropdownList = response?.data.map((r) => {
          let name = `${r.first_name} ${r.last_name}`;
          if (r?.middle_name?.length > 0) {
            name = `${r.first_name} ${r.middle_name} ${r.last_name}`;
          }
          let subjectId = r.subjectId;
          if (orderTestModelSubject?.subjectId === subjectId) {
            patientDetail.name = {
              label: name,
              value: subjectId,
            };
          }
          return {
            label: name,
            value: subjectId,
          };
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  const isKitBarcodeValid = (fields) => {
    if (Array.isArray(fields)) {
      let result = true;
      let kitBarcodeField = fields.filter((input) => {
        return input.name === 'kit_barcode';
      });
      let kitBarcodeFieldObj =
        kitBarcodeField.length > 0 ? kitBarcodeField[0] : {};
      let samples = Object.keys(sampleBarcodes);
      for (let i = 0; i < samples.length; i++) {
        if (
          kitBarcodeFieldObj?.value !== '' &&
          sampleBarcodes[samples[i]] !== '' &&
          kitBarcodeFieldObj?.value !== sampleBarcodes[samples[i]]
        ) {
          result = false;
          break;
        }
      }
      if (!result) {
        isError = true;
        errorMsg = 'Kit Barcode and Sample Barcode should be same.';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        isError = false;
        errorMsg = '';
      }
      return result;
    }
  };
  const handleAnalysisValid = (e) => {
    let { validInput, fieldset, inputFields } = e.detail;
    isAllFieldsetValid[fieldset] = validInput;
    let checkFieldValidity = Object.keys(isAllFieldsetValid)
      .filter((r) => r != 'undefined')
      .filter((r) => !!isAllFieldsetValid[r]);
    isAllFieldValid =
      checkFieldValidity.length ==
        Object.keys(isAllFieldsetValid).filter((r) => r != 'undefined')
          .length && isIndiVidiualTestSelected(orderTestModel);
    if (validInput) {
      handlInputFields(inputFields);
    }
    isBarcodeValid = isKitBarcodeValid(e?.detail?.inputFields);
    dispatch('isInputValid', e.detail);
  };
  const handlInputFields = (inputFields) => {
    for (let i = 0; i < inputFields.length; i++) {
      let index = inputParameters.findIndex(
        (field) => field.name == inputFields[i].name
      );
      if (inputParameters[index]) {
        inputParameters[index].value = inputFields[i].value;
      }
    }
  };
  const handleAlgoInputValue = (e) => {
    let attrInputs = e.detail;
    let attrInputObj = attrInputs.reduce((a, d) => {
      a[d.name] = d;
      return a;
    }, {});
    orderTestModel.attributes.map((r) => {
      if (attrInputObj.hasOwnProperty(r.name)) {
        let currentIndexInput = attrInputObj[r.name];
        r.value = currentIndexInput.value;
      }
    });
    if (attrInputObj['patient_name']?.value?.hasOwnProperty('value')) {
      orderTestModel.subject['subjectId'] =
        attrInputObj['patient_name'].value?.value;
    }
    localStorage.setItem('orderTestModel', JSON.stringify(orderTestModel));
  };
  const handleAddMoreSample = () => {
    let copyOfTabItem = JSON.parse(
      JSON.stringify(nonMutableOrderTestModel.subject.samples[0])
    );
    let tabId = uuidv4();
    let count = orderTestModel.subject.samples.length;
    copyOfTabItem['sampleBarcode']['displayLabelaltr'] = `Sample Barcode_${
      count + 1
    }`;
    copyOfTabItem['tabId'] = tabId;
    orderTestModel.subject.samples.push(copyOfTabItem);
    orderTestModel.subject.samples.map((r, i) => {
      let label = 'Sample Barcode';
      r.sampleBarcode.displayLabelaltr = `${label}_${i}`;
      return r;
    });
    let sampleBarcodeInput = copyOfTabItem?.sampleBarcode;
    let inputs = JSON.parse(
      JSON.stringify([...copyOfTabItem.attributes, sampleBarcodeInput])
    );
    let title = copyOfTabItem?.sampleBarcode?.displayLabel;
    let tabsCount = tabItems[tabItems.length - 1]?.active;
    let titlealtr = copyOfTabItem?.sampleBarcode?.displayLabelaltr;
    let o = {};
    o['label'] = `Sample ${tabsCount + 1}`;
    o['value'] = tabId;
    o['active'] = tabsCount + 1;
    o['tabId'] = tabId;
    o['component'] = SampleInputWrapper;
    o['index'] = tabItems.length;
    o['props'] = {
      tabId: tabId,
      index: tabItems.length,
      label: titlealtr,
      inputParams: inputs.filter((r) => {
        return r.hasOwnProperty('value');
      }),
      sampleTypeSpecimenList: sampleSpecimenMapping,
      specimenTestsMapping: specimenTestsMapping,
    };
    tabItems.push(o);
    tabItems = tabItems;
    activeTabValue = tabItems[tabItems.length - 1].tabId;
    localStorage.setItem('orderTestModel', JSON.stringify(orderTestModel));
  };
  /**
   * @name closeForm
   * @param
   * @returns
   * @description This closeForm is used to redirect to list.
   * @example closeForm();
   */
  const closeForm = () => {
    navigate('order/list', {
      replace: false,
    });
    $selectedLinkState = setListLink;
    localStorage.removeItem('patient_order_test');
  };
  const isIndiVidiualTestSelected = (model) => {
    let result = false;
    if (model?.subject?.samples) {
      let allTests = [];
      model?.subject?.samples.forEach((sample) => {
        if (sample?.tests) {
          allTests = [...allTests, ...sample?.tests];
        }
      });
      let isTrueCount = 0;
      allTests.forEach((test) => {
        if (test?.value) {
          isTrueCount++;
        }
      });
      if (isTrueCount > 0) {
        result = true;
      } else {
        result = false;
      }
    }
    return result;
  };
  /**
   * @name handleInputChange
   * @param
   * @returns
   * @description This handleInputChange this method help to get input value from tab component.
   * @example handleInputChange();
   */
  const handleInputChange = (e) => {
    let { inputs, tabId } = e.detail;
    listOfSampleInputs[tabId] = inputs;
    orderTestModel.subject.samples.map((res, i) => {
      let label = res.sampleBarcode.displayLabel;
      let displayLabelaltr = `${label}_${i}`;
      if (listOfSampleInputs.hasOwnProperty(tabId) && tabId === res?.tabId) {
        let detail = listOfSampleInputs[tabId];
        let attributeInputs = detail['Sample'].filter((r) => {
          return r.name != 'sample_barcode';
        });
        let sampleBarcodeInput = detail['Sample'].filter((r) => {
          return r.name == 'sample_barcode';
        });
        if (
          sampleBarcodeInput.length > 0 &&
          sampleBarcodeInput[0].value !== ''
        ) {
          res['sampleBarcode'] = sampleBarcodeInput[0];
        } else {
          res['sampleBarcode'] = res['sampleBarcode'];
        }
        res['attributes'] = attributeInputs;
        res['tests'] = detail['Individual Test'];
      }
      return res;
    });
    localStorage.setItem('orderTestModel', JSON.stringify(orderTestModel));
    let samples = orderTestModel.subject.samples;
    samples.forEach((sample, i) => {
      sampleBarcodes[i] = sample?.sampleBarcode?.value;
    });
    let { validInput, fieldset, inputFields } = e.detail;
    isAllFieldsetValid[fieldset] = validInput;
    let checkFieldValidity = Object.keys(isAllFieldsetValid)
      .filter((r) => r != 'undefined')
      .filter((r) => !!isAllFieldsetValid[r]);
    isAllFieldValid =
      checkFieldValidity.length ==
        Object.keys(isAllFieldsetValid).filter((r) => r != 'undefined')
          .length && isIndiVidiualTestSelected(orderTestModel);
    // if (validInput) {
    //   handlInputFields(inputFields);
    // }
    let attributes = orderTestModel.attributes;
    isBarcodeValid = isKitBarcodeValid(attributes);
  };
  /**
   * @name handleRemoveTab
   * @param
   * @returns
   * @description This handleRemoveTab  this method helps to remove tab from tab lists
   * @example handleRemoveTab();
   */
  const handleRemoveTab = (e) => {
    activeTabValue = '';
    let tabId = selectedTabId;
    let filteredOrderTestSample = JSON.parse(
      JSON.stringify(orderTestModel)
    ).subject.samples.filter((r) => {
      return r.tabId != tabId;
    });
    orderTestModel.subject.samples = JSON.parse(
      JSON.stringify(filteredOrderTestSample)
    );
    setTimeout(() => {
      tabItems = tabItems.filter((tab) => {
        return tab.tabId !== tabId;
      });
      activeTabValue = tabItems[0].value;
    }, 1);
    localStorage.setItem('orderTestModel', JSON.stringify(orderTestModel));
  };
  const onCancelClick = () => {
    status = -1;
  };
  const onOkayClick = async (e) => {
    status = 1;
    handleRemoveTab();
  };
  const handleRemoveModal = async (e) => {
    selectedTabId = e.detail.tabId;
    selectedIndex = e.detail.index;
    open(
      Modal,
      {
        message: 'Delete Sample',
        content: 'Do you want to delete this sample',
        onCancelClick,
        onOkayClick,
      },
      {
        closeButton: true,
        closeOnEsc: false,
        closeOnOuterClick: true,
        styleCloseButton: {
          borderRadius: 0,
          boxShadow: 'none',
        },
        styleWindow: {
          borderRadius: '0.3rem!important',
          width: 'max-content!important',
          positon: 'relative!important',
          backgroundClip: ' padding-box',
          border: '1px solid rgba(0,0,0,.2)',
        },
        styleContent: {
          padding: '0px!important',
        },
      }
    );
  };
  /**
   * @name onOkayAuditClick
   * @description onclick of okay button on audit modal closes the modal box
   * @example  onOkayAuditClick();
   */
  const onOkayAuditClick = async (e) => {
    let { orderTestModel } = e.detail;
    eSignatureModel = {
      username: e.username,
      password: e.password,
      changeReasonDetail: e.reason,
    };
    switch (e.section) {
      case 'createOrder':
        await saveOrderTest(orderTestModel);
        break;
      case 'createOrderWithPrint':
        await saveOrderTest(orderTestModel);
        break;
      default:
      // code block
    }
  };
  /**
   * @name onCancelAuditClick
   * @description onclick of close button on audit modal closes the modal box
   * @example  onCancelAuditClick();
   */
  const onCancelAuditClick = async (e) => {
    console.log(e);
  };
  const openAuditModal = (event, section) => {
    //disable toast
    toast.pop();
    open(
      AuditModal,
      {
        message: 'Electronic Signature',
        username: username,
        sectionEvent: event,
        auditsection: section,
        content: '',
        onCancelAuditClick,
        onOkayAuditClick,
      },
      {
        closeButton: true,
        closeOnEsc: false,
        closeOnOuterClick: true,
        styleCloseButton: {
          borderRadius: 0,
          boxShadow: 'none',
        },
        styleWindow: {
          borderRadius: '0.3rem!important',
          width: 'max-content!important',
          positon: 'relative!important',
          backgroundClip: ' padding-box',
          border: '1px solid rgba(0,0,0,.2)',
        },
        styleContent: {
          padding: '0px!important',
        },
      }
    );
  };
  const handleOrderTest = async () => {
    if (enableAudit) {
      let event = {
        orderTestModel: orderTestModel,
      };
      openAuditModal(event, 'createOrder');
    } else {
      await saveOrderTest(orderTestModel);
    }
  };

  const handleOrderTestAndPrint = async () => {
    if (enableAudit) {
      let event = {
        orderTestModel: orderTestModel,
      };
      openAuditModal(event, 'createOrderWithPrint');
    } else {
      await saveOrderTest(orderTestModel);
      // await getTRF(orderTestModel);
    }
  };
  /**
   * @name getTRF
   * @description This method is used to get TRF details from the order
  */
  const getTRF = async (orderTestModel) => {
    try{
      let paramInfo = {
        accessionId: orderTestModel.accessionId,
        subject: {studyId: orderTestModel?.subject?.studyId,subjectId: orderTestModel?.subject?.subjectId}
      };
      let response = await DashboardController.getTRF(paramInfo);
      if(response.statusCode == 200){
        printRequisition(response.data.pdf);
      }else{
        throw Error(response.message);
      }
    }catch(e){
      console.log(e);
      throwInvalidFileError("Error generating requisition form.");
    }
  }
  /**
   * @name printRequisition
   * @description This method prints requisition detail
  */
  const printRequisition = (base64str) =>{
    var binary = atob(base64str.replace(/\s/g, ''));
    var len = binary.length;
    var buffer = new ArrayBuffer(len);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }
    // create the blob object with content-type "application/pdf"
    var blob = new Blob( [view], { type: "application/pdf" });
    var url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.target = "_blank";
    link.title = 'testing';
    // link.download = "Requisition" + new Date() + ".pdf";
    link.click();
  }
  /**
   * @name saveOrderTest
   * @param order
   * @returns
   * @description This saveOrderTest saves the data entered with help API.
   * @example saveOrderTest(order);
   */
  const saveOrderTest = async (orderModel) => {
    try {
      let order = 'saveOrderTest';
      showOverlayLoader = true;
      isAllFieldValid = false;
      setStatus();
      let orderTestModelDetail = {
        orderModel:orderModel,
        eSignature: eSignatureModel
      }
      let apiResponse = await DashboardController.handleSaveOrderTest(orderTestModelDetail);
      if (apiResponse.saveOrderTest.statusCode === 200) {
        if(!orderTestModel.accessionId){
          orderTestModel.accessionId = apiResponse.saveOrderTest.data.id; 
        }
        let editLink = `order/${type}/edit`;
        let createLink = `order/${type}/create`;
        let navLink = 'order/list';
        if (order == 'saveOrderTest') {
          navLink = action == 'edit' ? editLink : createLink;
        }else{
          navLink = backToWorkList(navLink);
        }
        // showMessage = true;
        displayStatus.class = 'alert alert-success';
        displayStatus.message = editMode
          ? 'Record Updated Successfully!'
          : 'Record Saved Successfully!';
        showToastMessage(displayStatus.message, 'success');
        //back to worklist check
        const redirectTmer = setTimeout(() => {
          showOverlayLoader = false;
          isAllFieldValid = true;
          navigate(navLink, {
            replace: false,
          });
        }, 2000);
        await getTRF(orderTestModel);
        $selectedLinkState = setListLink;
      } else {
        // showMessage = true;
        isAllFieldValid = true;
        showOverlayLoader = false;
        // displayStatus.class = 'alert alert-danger';
        displayStatus.message = apiResponse?.saveOrderTest?.message
          ? apiResponse?.saveOrderTest?.message
          : 'Error saving order test';
        showToastMessage(displayStatus.message, 'error');
      }
    } catch (error) {
      noData = true;
      isAllFieldValid = true;
      showOverlayLoader = false;
      console.log(error);
    }
  };
  /**
   * @name showToastMessage
   * @param
   * @returns
   * @description This showToastMessage is used to show toast message.
   * @example showToastMessage();
   */
  const showToastMessage = (msg, type = 'success') => {
    if (type === 'success') {
      toast.push(msg, {
        theme: {
          '--toastBackground': '#48BB78',
          '--toastProgressBackground': '#2F855A',
        },
        duration: 2000,
      });
    } else if (type === 'error') {
      toast.push(msg, {
        theme: {
          '--toastBackground': '#F56565',
          '--toastProgressBackground': '#C53030',
        },
      });
    }
  };
  /**
   * @name handleResetForm
   * @param
   * @returns
   * @description This handleResetForm is used to reset form.
   * @example handleResetForm();
   */
  const handleResetForm = () => {
    window.location.reload();
  };
  /**
   * @name handleClose
   * @param
   * @returns
   * @description This handleClose is used for close order test form
   * @example handleClose();
   */
  const handleClose = () => {
    let link = 'order/list';
    link = backToWorkList(link);
    redirectTo(link);
  };
  const backToWorkList = (navLink) => {
    if(document.referrer.includes('icare')){
      window.location.href = document.referrer;
    }else{
      return navLink;
    }
  }
  const redirectTo = (link) => {
    navigate(link, {
      replace: false,
    });
  };

</script>

<style src="style.scss" lang="scss">
</style>

<Container>
  <div class="study-list col">
    {#if showOverlayLoader}
      <LoadingIndicator text="" />
    {/if}
    {#if isError}
      <Alert
        config={{ type: 'danger', title: 'Error in Order Test', message: errorMsg }}
        close={true} />
    {/if}
    {#if !noData && !enableLoader}
      <div class="col-xs-12 col-lg-12 col-sm-12 p-0 mb-2">
        <div class="create-patient-button card mt-2">
          <div class="card-body p-0 m-0 float-right">
            <button
              type="button"
              class="btn btn-sm btn-outline-primary float-right m-2"
              on:click={closeForm}>
              <span class="mr-2"><Fa
                  icon={faList}
                  scale={1.1} /></span><span>Order Test List</span></button>
          </div>
        </div>
      </div>
      <div class="card border-0">
        <!-- <div class="card-header p-1 m-0 border-0">{config.title}</div> -->
        <div class="card-body p-0 position-relative">
          <section class="m-0">
            {#each Object.keys(fieldsetinputparams) as param}
              <fieldset class="col mt-2 mb-4">
                <legend>{param}</legend>
                <FormField
                  fieldset={param}
                  col={'col-3 mt-2'}
                  inputParameters={fieldsetinputparams[param]}
                  on:isAnalysisInputValid={handleAnalysisValid}
                  on:algoInputValue={handleAlgoInputValue} />
              </fieldset>
            {/each}
            {#each Object.keys(fieldsetAttributeParams) as param}
              <fieldset class="col mt-2 mb-4">
                <legend>{param}</legend>
                <FormField
                  fieldset={param}
                  col={'col-3 mt-2'}
                  inputParameters={fieldsetAttributeParams[param]}
                  on:isAnalysisInputValid={handleAnalysisValid}
                  on:algoInputValue={handleAlgoInputValue} />
              </fieldset>
            {/each}
            {#if tabItems.length > 0}
              <section class="position-absolute" style="right:0em">
                <button
                  type="button"
                  class="btn btn-sm btn-primary"
                  style="padding:5px 10px;"
                  on:click={handleAddMoreSample}>Add Sample</button>
              </section>
              <Tabs
                items={tabItems}
                {activeTabValue}
                tabClass={'card border-top-0'}
                on:inputChange={handleInputChange}
                on:removeTab={handleRemoveModal} />
            {/if}

          </section>
        </div>
        <div class="card-footer border-0 bg-white">
          <div class="d-flex justify-content-center">
            <button
              type="button"
              class="btn btn-outline-primary rounded m-2"
              on:click={handleOrderTest}
              disabled={!isAllFieldValid || isError}>{btnTitle}</button>
            <button
              type="button"
              class="btn btn-outline-primary rounded m-2"
              on:click={handleOrderTestAndPrint}
              disabled={!isAllFieldValid || isError}>{btnSavePrintTitle}</button>  
            <!-- <button class="btn btn-outline-primary rounded mb-0 ml-1">Print
                Reports</button> -->
            <button
              type="button"
              class="btn btn-outline-primary rounded m-2"
              on:click={handleResetForm}>Clear</button>
            <button
              type="button"
              on:click={handleClose}
              class="btn btn-outline-primary rounded m-2">Close</button>
          </div>
        </div>
      </div>
    {:else if noData}
      <Alert
        config={{ type: 'danger', title: 'Error in order test creation', message: 'Failed to insert order test detail' }}
        close={true} />
    {:else if enableLoader}
      <div
        class="loader_container py-4 my-4 d-flex justify-content-center align-items-center">
        <Stretch size="100" color="#2b93fb" unit="px" />
      </div>
    {/if}
  </div>
</Container>
