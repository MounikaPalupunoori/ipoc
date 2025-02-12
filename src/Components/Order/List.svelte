<script>
  import ServerTableWrapper from '@Components/Shared/ServerTableWrapper';
  import Container from '@Components/Container/index.svelte';
  import Fa from 'svelte-fa';
  import { searchInputState, sortState,aclState,auditTableState,enableAuditState } from '@Store/Default.js';
  import { DoubleBounce } from '@Components/Shared/Loader/';
  import { ORDER_GRID_CONSTANTS } from '@Components/Order/constants.js';
  import { onMount } from 'svelte';
  import { getDate, getISTDateTime } from '@Utils/common.js';
  import { DashboardController } from '@Controller/DashboardController';
  import { setLocalStorage } from '@Utils/localStorage.js';
  import { navigate } from 'svelte-routing';
  import { faBookMedical } from '@fortawesome/free-solid-svg-icons';
  import { selectedLinkState } from '@Store/Sidebar.js';
  import { viewFile } from '@Utils/downloadData.js';
  import { getLocalStorage } from '@Utils/localStorage.js';
  
  let studies = getLocalStorage('selectedStudies');
  let checkInstanceStudy = localStorage.getItem('instanceStudy');
  //local state
  let config = {
    title: 'Orders',
  };
  let showOrderList = false;
  let noData = false;
  let loading = false;
  let orderListConfig = {};
  let currentPage = 0;
  let customButtons = ORDER_GRID_CONSTANTS.buttons;
  let studyId = '';
  let isError = false;
  let errorMsg = '';
  let reportBaseUrl = '';
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
  let inputModel = {
    orderTestModel: {
      pagination: {
        count: 10,
        page: 1,
        sort: 'desc.accessionId',
        search: '',
      },
      includeMeta: true,
      studyFilter: [],
    },
  };
  $: isEnableSidebar = true;
  //lifecycle hooks
  onMount(() => {
    $selectedLinkState = setListLink;
    loading = true;
    studies = getLocalStorage('selectedStudies');
    if(studies.length > 0){
      let studyId = studies[0].studyId;
      getOrderTestModel({ orderFrom: 'orderTest', studyId });
    }
  });
  //methods
  /**
   * @name getOrderListConfig
   * @param response
   * @description set orderListConfig
   */
  const getOrderListConfig = (response) => {
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
              collection_date: item?.collection_date
                ? getISTDateTime(item?.collection_date)
                : null,
              date_of_birth: item?.date_of_birth
                ? getDate(item?.date_of_birth)
                : null,
              first_name: name,
            },
          };
        })
      : [];
    orderListConfig = {
      data: data,
      chartConfig: {
        id: 'job_notification',
        order: 0,
        title: '',
        cardAttr: 'arm',
        columnConfig: ORDER_GRID_CONSTANTS.columnConfig,
        columnMeta: {},
        columnAlias: ORDER_GRID_CONSTANTS.columnAlias,
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
   * @name getOrderTestModel
   * @param
   * @description get get OrderTest Model
   */
  const getOrderTestModel = async (param) => {
    try {
      let response = await DashboardController.getOrderTestModel(param);
      if (response.statusCode == 200) {
        studyId = response?.data?.orderTestModel?.subject?.studyId;
        if (studyId) {
          inputModel.orderTestModel.studyFilter.push(studyId);
          getOrderTestList();
        }
        reportBaseUrl = response?.data?.uploadConfig?.uploadUrl;
      }else{
        throw response;
      }
    } catch (e) {
      showOrderList = false;
      isError = true;
      errorMsg = 'Error while fetching order list';
      loading = false;
    }
  };
  /**
   * @name getOrderTestList
   * @description get PatientList
   */
  const getOrderTestList = async () => {
    try {
      let response = await DashboardController.getOrderTests(inputModel);
      if (response && response?.data) {
        getOrderListConfig(response);
        loading = false;
        showOrderList = true;
      } else {
        loading = false;
        isError = true;
        errorMsg = 'Error while fetching order list';
      }
    } catch (e) {
      isError = true;
      errorMsg = 'Error while fetching order list';
      loading = false;
      console.log(e);
    }
  };
  const onPageChange = (e) => {
    currentPage = e.detail.page;
    inputModel.orderTestModel.pagination.page = e.detail.page + 1;
    showOrderList = false;
    loading = true;
    getOrderTestList();
  };
  const onSearchEnter = (e) => {
    inputModel.orderTestModel.pagination.page = 1;
    inputModel.orderTestModel.pagination.search = e.detail;
    $searchInputState.searchInput = e.detail;
    showOrderList = false;
    loading = true;
    getOrderTestList();
  };
  const hideMessage = () => {
    isError = false;
    errorMsg = '';
  };
  const handleEditTest = async (e) => {
    setLocalStorage('SELECTED_ORDER', e?.detail);
    localStorage.removeItem('patient_order_test');
    let link = `order/test/edit`;
    await navigate(link, {
      replace: false,
    });
  };
  const handleAccession = async (e) => {
    setLocalStorage('SELECTED_ORDER', e?.detail);
    let link = `order/accession/edit`;
    await navigate(link, {
      replace: false,
    });
  };
  const routeToAddOrderTest = (type) => {
    navigate(`order/${type}/create`, {
      replace: false,
    });
  };
  const onServerSideSort = (e) => {
    let key = e?.detail?.key;
    inputModel.orderTestModel.pagination.page = currentPage + 1;
    $sortState.sortInput = e.detail.dir;
    inputModel.orderTestModel.pagination.sort = `${e?.detail?.dir}.${key}`;
    showOrderList = false;
    loading = true;
    auditTableState.set({'dir': e.detail.dir, 'key':key});
    getOrderTestList();
  };
  const handleViewReport = async (e) => {
    try {
      let fileName = 'Report';
      let reportId = e?.detail?.reportid;
      let url = `${reportBaseUrl}/${reportId}?isId=true`;
      viewFile(fileName, url);
    } catch (e) {
      console.log(e);
    }
  };

  const launchActiveReport = async (e) => {
    try {
      let url = e?.detail?.active_report_url;
      window.open(url, "_blank");
    } catch (e) {
      console.log(e);
    }
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
            on:click={() => routeToAddOrderTest('test')}
            class="btn btn-sm btn-outline-primary float-right m-2">
            <span class="mr-1"><Fa icon={faBookMedical} scale={1.0} /></span>
            <span>Order Test</span></button>
          <button
            type="button"
            on:click={() => routeToAddOrderTest('sample')}
            class="btn btn-sm btn-outline-primary float-right m-2">
            <span class="mr-1"><Fa icon={faBookMedical} scale={1.0} /></span>
            <span>Sample Collection</span></button>
          <button
            type="button"
            on:click={() => routeToAddOrderTest('accession')}
            class="btn btn-sm btn-outline-primary float-right m-2">
            <span class="mr-1"><Fa icon={faBookMedical} scale={1.0} /></span>
            <span>Accession</span></button>
        </div>
      </div>
    </div>
    <div class="col-xs-12 col-lg-12-col-sm-12">
      <div class="card jobs-list mt-2 border-0">
        <div class="card-header p-1 m-0 border rounded">{config.title}</div>
        
        {#if showOrderList && !loading}
          <div class="card-body p-0 pt-1 mt-1">
            <div class="jobs_wrapper">
              <ServerTableWrapper
                config={orderListConfig}
                on:pageChange={onPageChange}
                imputationSearch={true}
                on:onSearch={onSearchEnter}
                on:editTest={handleEditTest}
                on:accession={handleAccession}
                on:viewReport={handleViewReport}
                on:launchActiveReport={launchActiveReport}
                on:serverSideSort={onServerSideSort} />
            </div>
          </div>
        {:else if loading}
          <div class="loader_container my-4">
            <DoubleBounce size="100" color="#2b93fb" unit="px" />
          </div>
        {:else if !showOrderList && !loading}
          <!-- <p>No Data </p> -->
        {/if}
      </div>
    </div>
  </section>
</Container>
