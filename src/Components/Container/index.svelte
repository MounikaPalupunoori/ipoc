
<script>
  import { onMount, onDestroy } from 'svelte';
  import { SIDE_BAR_NAV } from '@Constants/sidebar';
  import Sidebar from '@Components/Sidebar/index.svelte';
  import { ENABLE_SIDEBAR } from '@Store/Sidebar.js';
  import Message from '@Components/Shared/Message';
  import DashboardMeta from './DashboardMeta.svelte';
  import { getLocalStorage } from '@Utils/localStorage.js';
  import { StudyController } from '@Controller/StudyController.js';
  let isEnableSidebar = true;
  const unsubscribe = ENABLE_SIDEBAR.subscribe((state) => {
    isEnableSidebar = state
  });
  $: instanceStudy = localStorage.getItem('instanceStudy');
  let studies = getLocalStorage('selectedStudies');
  let aclHashMap = {};
  let sideBarList = []
  onMount(()=>{
    aclResponse();
  })
  const aclResponse = async() => {
    try {
      let roleId = localStorage.getItem('userRole');
      let aclParam = {
        application: 'iPOC',
        role: [roleId],
      };
      let apiResponse = await StudyController.getACL(aclParam);
      if(apiResponse.length > 0){
        aclHashMap = apiResponse.reduce((a, d)=>{
          a[d.businessScope] = d.operationAllowed.split("");
          return a;
        }, {});
        sideBarList = SIDE_BAR_NAV.filter(r => {  
          if(r.key == "barcode" && checkPermissionExist('GENERATE_BARCODES', 'r') !== 'yes'){
            return false;
          }else{
            return true;
          }
        })
      }
    } catch (error) {
      console.log(error);
    }
  }
  const checkPermissionExist = (key, permission) => {
    if(aclHashMap.hasOwnProperty(key)){
      return aclHashMap[key].includes(permission) ? 'yes' : 'no';
    }else{
      return 'no';
    }
  }
  onDestroy(unsubscribe);
</script>
<section class="container-fluid">
  <div class="row">
    <div class="col-2 {isEnableSidebar ? 'd-block' : 'd-none'}" id="sidebar_container" >
      <Sidebar navDataList={sideBarList} routeChange={true} />
    </div>
    <main role="main" class="{isEnableSidebar ? 'col-10' : 'col-12'} ml-sm-auto px-2">
      {#if instanceStudy == 'false'}
      <div class="icoreDashboard pt-2 px-2">
      <Message>
        <DashboardMeta {studies} />
      </Message>
      </div>
      {/if}
      <slot />
    </main>
  </div>
</section>