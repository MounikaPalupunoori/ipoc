<script>
  import Icon from 'svelte-awesome';
  import { plusCircle, minusCircle } from 'svelte-awesome/icons';
  import List from '@Components/Shared/List';
  export let studies;
  export let dashboardDetailInformation;
  let showStudyList = true;
  const handleStudyView = () => {
    showStudyList = !showStudyList;
  };
</script>
<div class="study-container">
  <!-- {#if studies.length >= 1}
    <h6 class="dashboard_title mb-0">
      {dashboardDetailInformation.dashboardName}
    </h6>
  {/if} -->
  <div class="study-list-container">
    {#if studies.length >= 1}
      <div>
        <span>Patients from
          <!-- {studies.length} -->
          studies</span>
        <span on:click={handleStudyView} class="cursor__pointer">
          <Icon
            data={showStudyList ? minusCircle : plusCircle}
            flip="horizontal" />
        </span>
      </div>
    {:else}{studies.map((study) => study.studyName).join(' ')}{/if}
    {#if showStudyList}
      <List items={studies} />
    {/if}
  </div>
</div>