<script>
  import { onMount, onDestroy } from 'svelte';
  import { navigate } from 'svelte-routing';
  import IcoreDropdown from '@Components/Shared/IcoreDropdown.svelte';
  import Alert from '@Components/Shared/Alert/index.svelte';
  import Stretch from '@Components/Shared/Loader/Stretch';
  import { setLocalStorage } from '@Utils/localStorage.js';
  import { selectedStudies } from '@Store/analysis.js';
  import { setStudies, subscribe } from '@Store/Study.js';
  import { StudyController } from '@Controller/StudyController.js';
  let isButtonDisabled = true;
  let noData;
  let studyList;
  $: selectedStudy = null;
  $: isStudyAvailable = studyList.length > 0 || noData;
  const unsubscribe = subscribe((state) => (studyList = state));
  onMount(async () => {
    await getStudyList();
    setUserNameEvent();
  });
  async function getStudyList() {
    try {
      let studyResponse = await StudyController.getStudy();
      let instanceResponse = await StudyController.checkInstanceStudy();
      noData = !!studyResponse.length ? false : true;
      if (!!studyResponse.length) {
        setStudies(studyResponse);
        localStorage.setItem('instanceStudy', instanceResponse);
        if(instanceResponse.length != 0){
          handleInstanceSelectedStudy(instanceResponse);
        }
      }
    } catch (e) {
      noData = true;
      console.error('GET STUDY ERROR:', e);
    }
  }
  function handleInstanceSelectedStudy(param){
    let filteredStudy = studyList.filter(r => r.label == param);
    if(filteredStudy.length > 0) {
      let tempFilteredStudy = filteredStudy.map(r => {
        return {
          "isGroupItem": false,
          "label": r.label,
          "value": r.value
        }
      });
      selectedStudy = tempFilteredStudy;
      let param = {
        detail: tempFilteredStudy
      }
      getSelectedStudy(param);
      let isRedirect = localStorage.getItem('autoDirectToSubjectList');
      if(isRedirect){
        localStorage.setItem('autoDirectToSubjectList', 'N');
        redirectToDashboard();
      }
    }
  }
  function getSelectedStudy(e) {
    let tempselectedStudy = StudyController.processSelectedStudy(e);
    $selectedStudies = (tempselectedStudy !== null ? [...tempselectedStudy] : []);
    isButtonDisabled = (tempselectedStudy !== null ? false : true);
  }
  function redirectToDashboard() {
    setLocalStorage('selectedStudies', $selectedStudies);
    console.log("Trying to navigate");
    navigate('/ipoc/order/list', { replace: false });
  }
    /**
   * @name setUserNameEvent
   * @param
   * @returns
   * @description This dispatchEvent used to fire an event with current logged in username from localstorage.
   * @example dispatchEvent();
   */
  const setUserNameEvent = () => {
    window.dispatchEvent(
      new CustomEvent('idiscovery-get-username', {
        detail: {
          storage: localStorage.getItem('userName'),
        },
      })
    );
  };
  onDestroy(unsubscribe);
</script>

<style src="./style.scss" lang="scss">
</style>

<div class="study-list col">
  {#if isStudyAvailable}
    <IcoreDropdown
      name={null}
      options={studyList}
      isMultiple={true}
      placeholder={studyList.length > 0 ? "Select Study" : "No study available"}
      isSearchable={true}
      selectedValue={selectedStudy}
      on:getSeletedOptions={getSelectedStudy} />
    <button
      class="redirect-button btn btn-primary"
      disabled={isButtonDisabled}
      on:click={redirectToDashboard}>View Order List</button>
  {:else if noData}
    <Alert
      config={{ type: 'danger', title: 'Error in study list', message: 'Failed to fetch study list' }}
      close={true} />
  {:else}
    <div class="loader_container">
      <Stretch size="100" color="#2b93fb" unit="px" />
    </div>
  {/if}
</div>
