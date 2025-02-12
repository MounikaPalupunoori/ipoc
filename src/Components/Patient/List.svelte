<script>
  import Container from '@Components/Container/index.svelte';
  import ServerTableWrapper from '@Components/Shared/ServerTableWrapper';
  import Fa from 'svelte-fa';
  import { searchInputState, sortState,aclState,auditTableState,enableAuditState } from '@Store/Default.js';
  import { DoubleBounce } from '@Components/Shared/Loader/';
  import { PATIENT_GRID_CONSTANTS } from '@Components/Patient/constants.js';
  import { onMount } from 'svelte';
  import { getDate } from '@Utils/common.js';
  import { DashboardController } from '@Controller/DashboardController';
  import { setLocalStorage } from '@Utils/localStorage.js';
  import { navigate } from 'svelte-routing';
  import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
  import { selectedLinkState } from '@Store/Sidebar.js';
  import { getLocalStorage } from '@Utils/localStorage.js';

  //local state
  let showPatientList = false;
  let loading = false;
  let patientListConfig = {};
  let currentPage = 0;
  let customButtons = PATIENT_GRID_CONSTANTS.buttons;
  let studyId = '';
  let isError = false;
  let studies = getLocalStorage('selectedStudies');
  let checkInstanceStudy = localStorage.getItem('instanceStudy')
  let errorMsg = '';
  let inputModel = {
    subjectModel: {
      pagination: {
        count: 10,
        page: 1,
        sort: 'desc.subjectId',
        search: '',
      },
      includeMeta: true,
      studyFilter: [],
    },
  };
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
  //lifecycle hooks
  onMount(() => {
    $selectedLinkState = setListLink;
    loading = true;
    getSubjectModel();
    setUserNameEvent();
    // getPatientList();
  });
  //methods
  /**
   * @name getPatientListConfig
   * @param response
   * @description set patientListConfig
   */
  const getPatientListConfig = (response) => {
    let data = response?.data
      ? response?.data?.map((item) => {
          let name = `${item?.first_name ? item.first_name : ''} ${
            item?.middle_name ? item?.middle_name : ''
          } ${item?.last_name ? item?.last_name : ''}`;
          if(item.hasOwnProperty('first_name')){
            delete item.first_name;
          }
          return {
            ...item,
            ...{
              date_of_birth: item?.date_of_birth
                ? getDate(item?.date_of_birth)
                : null,
              first_name: name,
            },
          };
        })
      : [];
    patientListConfig = {
      data: data,
      chartConfig: {
        id: 'job_notification',
        order: 0,
        title: '',
        cardAttr: 'arm',
        columnConfig: PATIENT_GRID_CONSTANTS.columnConfig,
        columnMeta: {},
        columnAlias: PATIENT_GRID_CONSTANTS.columnAlias,
        customButtons: customButtons,
        maxTextLength: 40,
        columnOrder: [],
        chartOperations: 'hoverheader',
        chartOperationsConfig: [
          { title: 'Show Table', key: 'table', icon: '', show: true },
          { title: 'Show Pie', key: 'pie', icon: '', show: false },
          {
            title: 'Save As',
            key: 'save_as',
            icon: 'download',
            children: [
              { title: 'CSV', key: 'csv', icon: 'csvIcon', show: true },
              { title: 'SVG', key: 'svg', icon: 'svgIcon', show: true },
            ],
          },
        ],
        cardType: 'table',
        initCardType: 'table',
        allowFilter: false,
        width: 3,
        height: 2,
        xAxis: { id: 'value', title: '' },
        yAxis: { id: 'count', title: '' },
        tableConfig: {
          serverSide: true,
          totalPage: response.totalCount,
          perPage: 10,
          currentPage: currentPage,
        },
      },
    };
  };
  /**
   * @name getSubjectModel
   * @param
   * @description get subjetc model
   */
  const getSubjectModel = async () => {
    try {
      let studyId = studies[0].studyId;
      // let studyId = checkInstanceStudy  === "false" ? studies[0].studyId : null;
      let response = await DashboardController.getSubjectModel(studyId);
      if (response.statusCode == 200) {
        studyId = response?.data?.subjectModel?.subject?.studyId;
        if (studyId) {
          inputModel.subjectModel.studyFilter.push(studyId);
          getPatientList();
        }
      }else{
        loading = false;
        throw response;
      }
    } catch (e) {
      loading = false;
      isError = true;
      errorMsg = 'Error while fetching patient list';
    }
  };
  /**
   * @name getPatientList
   * @description get PatientList
   */
  const getPatientList = async () => {
    try {
      let response = await DashboardController.getSubjects(inputModel);
      if (response && response?.data) {
        getPatientListConfig(response);
        loading = false;
        showPatientList = true;
      } else {
        loading = false;
        isError = true;
        errorMsg = 'Error while fetching patient list';
      }
    } catch (e) {
      isError = true;
      errorMsg = 'Error while fetching patient list';
      loading = false;
      console.log(e);
    }
  };
  const onPageChange = (e) => {
    currentPage = e.detail.page;
    inputModel.subjectModel.pagination.page = e.detail.page + 1;
    showPatientList = false;
    loading = true;
    getPatientList();
  };
  const onSearchEnter = (e) => {
    inputModel.subjectModel.pagination.page = 1;
    inputModel.subjectModel.pagination.search = e.detail;
    $searchInputState.searchInput = e.detail;
    showPatientList = false;
    loading = true;
    getPatientList();
  };
  const hideMessage = () => {
    isError = false;
    errorMsg = '';
  };
  const handleEditPatient = async (e) => {
    setLocalStorage('SELECTED_PATIENT', e?.detail);
    await navigate('patient/edit', {
      replace: false,
    });
  };
  const routeToAddPatient = () => {
    navigate('patient/create', {
      replace: false,
    });
  };
  const onServerSideSort = (e) => {
    let key = e?.detail?.key;
    inputModel.subjectModel.pagination.page = currentPage + 1;
    $sortState.sortInput = e.detail.dir;
    inputModel.subjectModel.pagination.sort = `${e?.detail?.dir}.${key}`;
    showPatientList = false;
    loading = true;
    auditTableState.set({'dir': e.detail.dir, 'key':key});
    getPatientList();
  };
  /**
   * @name setUserNameEvent
   * @param
   * @returns
   * @description This dispatchEvent used to fire an event with current logged in username from localstorage.
   * @example dispatchEvent();
   */
  const setUserNameEvent = () => {
    window.dispatchEvent(
      new CustomEvent('poc-get-username', {
        detail: {
          storage: localStorage.getItem('userName'),
        },
      })
    );
  };

</script>

<style>
  .loader_container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<Container>
  <section>
    {#if isError}
      <div class="alert alert-danger py-3 px-2 mb-2" role="alert">
        {errorMsg}
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
    <div class="col-xs-12 col-lg-12-col-sm-12">
      <div class="create-patient-button card mt-2">
        <div class="card-body p-0 m-0 float-right">
          <button
            type="button"
            class="btn btn-sm btn-outline-primary float-right m-2"
            on:click={routeToAddPatient}>
            <span class="mr-1"><Fa icon={faUserPlus} scale={1.0} /></span>
            <span>Add Patient</span></button>
        </div>
      </div>
    </div>
    <div class="col-xs-12 col-lg-12-col-sm-12">
      <div class="jobs-list card mt-2 border-0">
        <div class="card-header p-1 m-0  border rounded">Patient List</div>
        {#if showPatientList && !loading}
          <div class="card-body p-0 pt-1 mt-1">
            <div class="jobs_wrapper">
              <ServerTableWrapper
                config={patientListConfig}
                on:pageChange={onPageChange}
                imputationSearch={true}
                on:onSearch={onSearchEnter}
                isSort={true}
                on:editPatient={handleEditPatient}
                on:serverSideSort={onServerSideSort} />
            </div>
          </div>
        {:else if loading}
          <div class="loader_container my-4">
            <DoubleBounce size="100" color="#2b93fb" unit="px" />
          </div>
        {:else if !showPatientList && !loading}
          <!-- <p>testing</p> -->
        {/if}
      </div>
    </div>
  </section>
</Container>
