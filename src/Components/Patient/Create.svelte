<script>
  import Container from '@Components/Container/index.svelte';
  import Fa from 'svelte-fa';
  import { onMount, getContext } from 'svelte';
  import FormField from '@Components/Shared/FormField/index.svelte';
  import Alert from '@Components/Shared/Alert/index.svelte';
  import Stretch from '@Components/Shared/Loader/Stretch';
  import AuditModal from '@Components/Shared/Modal/AuditModal.svelte';
  import { DashboardController } from '@Controller/DashboardController.js';
  import LoadingIndicator from '@Components/Shared/LoadingIndicator.svelte';
  import { getLocalStorage } from '@Utils/localStorage.js';
  import { navigate } from 'svelte-routing';
  import { toast } from '@zerodevx/svelte-toast';
  import { faAddressCard } from '@fortawesome/free-solid-svg-icons';
  import { setLocalStorage } from '@Utils/localStorage.js';
  import { selectedLinkState } from '@Store/Sidebar.js';
  import { getDate, checkUrlExist } from '@Utils/common.js';
  const { open } = getContext('simple-modal'); // used for modal
  const username = localStorage.getItem('userName');
  const saveDateFormat = 'yyyy-mm-dd';
  const displayDateFormat = 'dd-mm-yyyy';
  const inputControlDateFormat = 'yyyy-mm-dd';
  let noData;
  let eSignatureModel = {
    username: username,
    password: '',
    changeReasonDetail: '',
  };
  let enableAudit = true;
  let inputParameters = [];
  let fieldsetinputparams = {};
  let isAllFieldsetValid = {};
  let isAllFieldValid = false;
  let localSubjectModel = {};
  let showMessage = false;
  let displayStatus = {
    class: '',
    message: '',
  };
  let showOverlayLoader = false;
  let editMode = false;
  let setListLink = {
    id: 2,
    name: 'List',
    displayName: 'List',
    key: 'patient_list',
    parent: 'patient_view',
    isEnabled: true,
    isExpanded: false,
    isChildrenExpanded: true,
  };
  $: isInputParam = inputParameters.length > 0;
  let studies = getLocalStorage('selectedStudies');
  let checkInstanceStudy = localStorage.getItem('instanceStudy');
  onMount(() => {
    $selectedLinkState = setListLink;
    let editURL = 'patient/edit';
    let checkEdit = checkUrlExist(editURL);
    if (checkEdit) {
      editMode = true;
      getSelectedSubjectInfo();
    } else {
      subjectData();
    }
  });
  /**
   * @name subjectData
   * @param
   * @returns
   * @description This subjectData is used to get subject model from the API.
   * @example subjectData();
   */
  const subjectData = async () => {
    try {
      // let studyId = checkInstanceStudy === 'false' ? studies[0].studyId : null;
      let studyId = studies[0].studyId;
      let apiResponse = await DashboardController.getSubjectModel(studyId);
      if (apiResponse && apiResponse.data) {
        inputParameters = apiResponse.data?.subjectModel?.attributes ?? [];
        localSubjectModel = apiResponse.data?.subjectModel ?? {};
        groupInputParams();
      } else {
        noData = true;
      }
    } catch (error) {
      noData = true;
      console.log(error);
    }
  };
  /**
   * @name groupInputParams
   * @param
   * @returns
   * @description This groupInputParams is used to group the subject model according to displayGroup .
   * @example groupInputParams();
   */
  const groupInputParams = () => {
    if (inputParameters.length > 0) {
      fieldsetinputparams = inputParameters.reduce((a, d) => {
        if (a.hasOwnProperty(d?.displayGroup)) {
          a[d.displayGroup].push(d);
        } else {
          isAllFieldsetValid[d.displayGroup] = false;
          a[d.displayGroup] = [d];
        }
        return a;
      }, {});
    } else {
      isInputParam = false;
      noData = true;
    }
  };
  /**
   * @name handleAnalysisValid
   * @param e
   * @returns
   * @description This handleAnalysisValid is used to validate the entered form data and it listens to the event from the resuasble form .
   * @example handleAnalysisValid(e);
   */
  const handleAnalysisValid = (e) => {
    let { validInput, fieldset, inputFields } = e.detail;
    isAllFieldsetValid[fieldset] = validInput;
    let checkFieldValidity = Object.keys(isAllFieldsetValid).filter(
      (r) => !!isAllFieldsetValid[r]
    );
    isAllFieldValid =
      checkFieldValidity.length == Object.keys(isAllFieldsetValid).length;
    if (validInput) {
      handlInputFields(inputFields);
    }
    // dispatch('isInputValid', e.detail);
  };
  /**
   * @name handlInputFields
   * @param inputFields
   * @returns
   * @description This handlInputFields is used to assign the data from form to the subject model array.
   * @example handlInputFields(e);
   */
  const handlInputFields = (inputFields) => {
    for (let i = 0; i < inputFields.length; i++) {
      let index = inputParameters.findIndex(
        (field) => field.name == inputFields[i].name
      );
      inputParameters[index].value = inputFields[i].value;
    }
  };
  const handleAlgoInputValue = (e) => {
    // console.log(e);
  };

  /**
   * @name onOkayAuditClick
   * @description onclick of okay button on audit modal closes the modal box
   * @example  onOkayAuditClick();
   */
  const onOkayAuditClick = async (e) => {
    let { order } = e.detail;
    eSignatureModel = {
      username: e.username,
      password: e.password,
      changeReasonDetail: e.reason,
    };
    switch (e.section) {
      case 'createUser':
        savePatientForm(order);
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
  const handleSavePatient = async (order) => {
    if (enableAudit) {
      let event = {
        order: order,
      };
      openAuditModal(event, 'createUser');
    } else {
      await savePatientForm(order);
    }
  };
  /**
   * @name savePatientForm
   * @param order
   * @returns
   * @description This savePatientForm saves the data entered with help API.
   * @example savePatientForm(order);
   */
  const savePatientForm = async (order) => {
    try {
      inputParameters.forEach((input, i) => {
        if (input.dataType == 'date') {
          inputParameters[i].value = getDate(input.value, '-', saveDateFormat);
        }
      });
      localSubjectModel.attributes = inputParameters;
      showOverlayLoader = true;
      isAllFieldValid = false;
      let patientFormModel = {
        subjectModel: localSubjectModel,
        eSignature:eSignatureModel
      }
      let apiResponse = await DashboardController.handleSavePatient(
        patientFormModel
      );
      if (apiResponse.saveSubject.statusCode === 200) {
        let patientId = apiResponse?.saveSubject?.data?.id;
        let navLink =
          order && order == 'saveOrderTest'
            ? 'order/test/create'
            : 'patient/list';
        // showMessage = true;
        displayStatus.class = 'alert alert-success';
        displayStatus.message = editMode
          ? 'Subject Updated Successfully!'
          : 'Subject Saved Successfully!';
        showToastMessage(displayStatus.message, 'success');
        if(order && order !== 'saveOrderTest'){
          //back to worklist check
          navLink = backToWorkList(navLink)
        }
        const redirectTmer = setTimeout(() => {
          showOverlayLoader = false;
          isAllFieldValid = true;
          navigate(navLink, {
            replace: false,
          });
        }, 2000);
        if (order && order == 'saveOrderTest') {
          let setOrderTest = {
            subjectInfo: editMode
              ? localSubjectModel.subject.subjectId
              : patientId,
            fromPatientCreate: true,
          };
          setLocalStorage('patient_order_test', setOrderTest);
        }
      } else {
        // showMessage = true;
        isAllFieldValid = true;
        showOverlayLoader = false;
        displayStatus.class = 'alert alert-danger';
        displayStatus.message = apiResponse.saveSubject.message
          ? apiResponse.saveSubject.message
          : 'Error saving subject';
        showToastMessage(displayStatus.message, 'error');
      }
    } catch (error) {
      noData = true;
      isAllFieldValid = true;
      showOverlayLoader = false;
      console.log(error);
    }
  };
  const backToWorkList = (navLink) => {
    if(document.referrer.includes('icare')){
      window.location.href = document.referrer;
    }else{
      return navLink;
    }
  }
  /**
   * @name hideMessage
   * @param
   * @returns
   * @description This hideMessage is used to close the alert.
   * @example savePatientForm(order);
   */
  const hideMessage = () => {
    showMessage = false;
    displayStatus = {};
  };
  /**
   * @name onClearForm
   * @param
   * @returns
   * @description This onClearForm is used to clear the form if data is entered.
   * @example onClearForm();
   */
  const onClearForm = () => {
    window.location.reload();
  };
  /**
   * @name getSelectedSubjectInfo
   * @param
   * @returns
   * @description This getSelectedSubjectInfo is used to get already selected data is entered.
   * @example getSelectedSubjectInfo();
   */
  const getSelectedSubjectInfo = async () => {
    try {
      let selectedInfo = getLocalStorage('SELECTED_PATIENT');
      if (Object.keys(selectedInfo).length > 0) {
        let subjectModel = {
          subject: {
            subjectId: selectedInfo.subjectId,
            studyId: selectedInfo.studyId,
          },
        };
        let apiResponse = await DashboardController.handleEditPatient(
          subjectModel
        );
        if (apiResponse && apiResponse?.getSubjectDetail?.data) {
          inputParameters =
            apiResponse.getSubjectDetail?.data?.subjectModel?.attributes ?? [];
          localSubjectModel =
            apiResponse.getSubjectDetail?.data?.subjectModel ?? {};
          inputParameters.forEach((input, i) => {
            if (input.dataType == 'date') {
              inputParameters[i].value = getDate(
                input.value,
                '-',
                inputControlDateFormat
              );
            }
          });
          groupInputParams();
        } else {
          noData = true;
        }
      } else {
        noData = true;
      }
    } catch (error) {
      noData = true;
      console.log('err', error);
    }
  };
  /**
   * @name closeForm
   * @param
   * @returns
   * @description This closeForm is used to redirect to list.
   * @example closeForm();
   */
  const closeForm = () => {
    let listUrl = 'patient/list'
    //back to worklist check
    listUrl = backToWorkList(listUrl);
    console.log(listUrl);
    navigate(listUrl, {
      replace: false,
    });
  };
  /**
   * @name onSaveOrder
   * @param
   * @returns
   * @description This onSaveOrder is used to save form and  redirect to order test.
   * @example onSaveOrder();
   */
  const onSaveOrder = async () => {
    if (enableAudit) {
      let event = {
        order: 'saveOrderTest',
      };
      openAuditModal(event, 'createUser');
    } else {
      await savePatientForm('saveOrderTest');
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
  /***
   * @name handleVegatest
   * @param
   * @returns
   * @description
   * @example
  */
  const handleVegaTest = () =>{
    try{
      let vegaTestUrl = '/icare/vegatest';
      window.location.href = vegaTestUrl;
    }catch(e){
      console.log(e);
    }
  }
</script>

<style src="./style.scss" lang="scss">
</style>

<Container>
  {#if showMessage}
    <div class="{displayStatus.class} py-3 px-2 mb-2 mr-3 ml-3" role="alert">
      {displayStatus.message}
      <button
        type="button"
        class="close"
        data-dismiss="alert"
        aria-label="Close"
        on:click={hideMessage}>
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  {/if}

  <div class="study-list col">
    {#if showOverlayLoader}
      <LoadingIndicator text="" />
    {/if}
    {#if isInputParam}
      <div class="col-xs-12 col-lg-12 col-sm-12 p-0 mb-2">
        <div class="create-patient-button card mt-2">
          <div class="card-body p-0 m-0 float-right">
            <button
              type="button"
              class="btn btn-sm btn-outline-primary float-right m-2"
              on:click={closeForm}>
              <span class="mr-2"><Fa
                  icon={faAddressCard}
                  scale={1.2} /></span><span>Patient List</span></button>
          </div>
        </div>
      </div>
      <div class="card border-0">
        <!-- <div class="card-header p-1 m-0">Create Patient</div> -->
        <div class="card-body p-0">
          <div class="row1">
            {#each Object.keys(fieldsetinputparams) as param}
              <fieldset class="col mt-2">
                <legend>{param}</legend>
                <FormField
                  fieldset={param}
                  col={'col-lg-4 col-sm-4 col-md-4 col mb-2'}
                  inputParameters={fieldsetinputparams[param]}
                  on:isAnalysisInputValid={handleAnalysisValid}
                  on:algoInputValue={handleAlgoInputValue} />
              </fieldset>
            {/each}
          </div>
        </div>
        <div class="card-footer bg-white border-0">
          <div class="d-flex justify-content-center">
            <button
              class="btn  btn-outline-primary rounded mb-0 ml-1"
              disabled={!isAllFieldValid}
              on:click={handleSavePatient}>{editMode ? 'Update' : 'Save'}</button>
            <button
              class="btn  btn-outline-primary rounded  mb-0 ml-1"
              on:click={onSaveOrder}
              disabled={!isAllFieldValid}>{editMode ? 'Update and Order Test' : 'Save and Order Test'}</button>
            <button
              class="btn btn-outline-primary rounded  mb-0 ml-1"
              on:click={handleVegaTest}>Vega Test</button>
            <button
              class="btn btn-outline-primary rounded  mb-0 ml-1"
              on:click={onClearForm}>Clear</button>
            <button
              class="btn btn-outline-primary rounded  mb-0 ml-1"
              on:click={closeForm}>Close</button>
          </div>
        </div>
      </div>
    {:else if noData}
      <Alert
        config={{ type: 'danger', title: 'Error in patient creation.', message: 'Failed to insert patient.' }}
        close={true} />
    {:else}
      <div class="loader_container my-4">
        <Stretch size="100" color="#2b93fb" unit="px" />
      </div>
    {/if}
  </div>
</Container>
