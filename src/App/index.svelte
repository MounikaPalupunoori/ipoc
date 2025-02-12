<script>
  import { Router, Route, navigate } from 'svelte-routing';
  import { onMount } from 'svelte';
  import Layout from '@Components/Layout/index.svelte';
  import Login from '@Components/Login/index.svelte';
  import {
    Create as CreateOrderTest,
    List as ListOrderTest,
  } from '@Components/Order/index.js';
  import {
    Generate as GenerateBarcode,
    List as BarcodeList,
  } from '@Components/Barcode/index.js';
  import {
    Create as PatientCreate,
    List as PatientGrid,
  } from '@Components/Patient/index.js';
  import { printPage } from '@Utils/common.js';
  import queryString from 'query-string';
  import Modal from 'svelte-simple-modal';
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import Study from '@Components/Study/index.svelte';

  let options = {
    duration: 4000,
    dismissable: true,
    initial: 1,
    progress: 0,
    reversed: false,
    intro: { x: 10 },
    theme: {},
  };
  export let url = '';
  onMount(() => {
    window.onunhandledrejection = (e) => {
      console.log('we got exception, but the app has crashed', e);
    };
    printPage();
    isTokenExist();
    setAppId();
    setSubjectID();
  });
  /**
   * Each loop
   * @memberOf Svelte
   * @param {function} callback Function to be run on each selector
   * @returns Svelte
   * @example
   * $('.each').each(function() { });
   */
  const isTokenExist = () => {
    const launchUrlToken = queryString.parse(location.search)?.token;
    if (!launchUrlToken) {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate(myapp.env.ICORE_CONSOLE, { replace: false });
      }
    }
  };
  const setAppId = () => {
    const appId = queryString.parse(location.search)?.appId;
    if (appId) {
      localStorage.setItem('appId', appId);
    }
  };
  const setSubjectID = () => {
    const subject_id = queryString.parse(location.search)?.subject_id;
    if (subject_id) {
      localStorage.setItem('selectedSubjectID', subject_id);
    } else {
      localStorage.removeItem('selectedSubjectID');
    }
  };

</script>

<style src="./style.scss">
</style>

<Router {url} basepath={myapp.env.BASE_PATH}>
  <Modal>
    <Layout>
        <!-- The internal content of the alert block. -->
        <main role="main" class="mt-3 col-xs-12">
          <Route path="/" component={Login} />
          <Route path="/study" component={Study} />
          <Route path="/patient" component={PatientGrid} />
          <Route path="/order/:type/:action" component={CreateOrderTest} />
          <Route path="/barcode/generate" component={GenerateBarcode} />
          <Route path="/barcode/list" component={BarcodeList} />
          <Route path="/order/list" component={ListOrderTest} />
          <Route path="/LaunchApp" component={Login} />
          <Route path="/patient/list" component={PatientGrid} />
          <Route path="/patient/create" component={PatientCreate} />
          <Route path="/patient/edit" component={PatientCreate} />
        </main>
      <SvelteToast {options} />
    </Layout>
  </Modal>
</Router>
