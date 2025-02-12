<script>
  // import { popover } from '@Utils/popover.js';
  // // import Modal from '@Components/Groups/index.svelte';
  // import Icon from 'svelte-awesome';
  import { angleDown } from 'svelte-awesome/icons';
  import { createEventDispatcher } from 'svelte';
  import Icon from 'svelte-awesome';
  import { times } from 'svelte-awesome/icons';
  // props
  export let items = [];
  export let activeTabValue = 1;
  export let enableRemoveTab = false;
  export let dashboardDetail;
  export let tabClass = 'card';
  const dispatch = createEventDispatcher();
  $: updateTabItems = {};
  const handleClick = (tabValue) => {
    activeTabValue = tabValue.value;
    dispatch('tabchange', tabValue);
  };
  const handleCardSelect = (e) => {
    dispatch('cardSelect', { ...{ tabId: activeTabValue }, ...e.detail });
  };
  const handleRemoveTab = (e) => {
    dispatch('removeTab', { tabId: e.tabId, tabName: e.label, index: e.index });
  };
  const handleTabInputChange = (e) => {
    let { label, inputs } = e.detail;
    updateTabItems[label] = inputs;
    items.map((r) => {
      if (r.label == label) {
        r.props.inputParams = updateTabItems[label]['Sample'];
        r.props.specimenTestsMapping = updateTabItems[label]['Individual Test'];
      }
      return r;
    });
    dispatch('inputChange', e.detail);
  };

</script>

<style>
  .card {
    height: 100vh;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #dee2e6;
    border-radius: 0 0 0.5rem 0.5rem;
    border-top: 0;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    border-bottom: 1px solid #dee2e6;
  }
  li {
    margin-bottom: -1px;
  }

  .tab {
    border: 1px solid transparent;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    display: block;
    cursor: pointer;
  }
  .tab-name {
    padding: 0.5rem 1rem 0.5rem 1rem;
  }
  .tab-icon {
    padding: 0.5rem 1rem 0.5rem 0rem;
  }
  .tab:hover {
    border-bottom-color: rgba(200, 200, 200, 0.8);
  }

  li.active > .tab {
    color: #495057;
    background-color: #fff;
    border-color: #dee2e6 #dee2e6 #fff;
  }
  .btn-secondary {
    color: #212529 !important;
    background-color: #ffff !important;
    border-color: #ccc !important;
    margin-top: 0.3em;
  }
  .tabs-category {
    display: grid;
    grid-template-columns: 100%;
  }
  .flex-start {
    display: flex;
    justify-content: flex-start;
  }
  .flex-end {
    display: flex;
    justify-content: flex-end;
  }

</style>

<div class="tabs-category">
  <ul class="flex-start">
    {#each items as item}
      <li class={activeTabValue === item.value ? 'active' : ''}>
        <div class="tab flex-start">
          <div class="tab-name" on:click={handleClick(item)}>{item.label}</div>
          {#if activeTabValue === item.value && items.length > 1}
            <div class="tab-icon" on:click={handleRemoveTab(item)}>
              <Icon data={times} />
            </div>
          {/if}
        </div>
      </li>
    {/each}
  </ul>
  <!-- <ul class="flex-end">
    <li>
      <button
        type="button"
        use:popover={{ component: Modal }}
        class="btn btn-secondary btn-sm float-sm-right">
        Groups
        <Icon data={angleDown} scale="1" /></button>
    </li>
  </ul> -->
</div>
{#each items as item}
  {#if activeTabValue == item.value}
    <div class={tabClass}>
      <svelte:component
        this={item.component}
        {...item.props}
        on:cardSelect={handleCardSelect}
        on:tabInputChange={handleTabInputChange} />
    </div>
  {/if}
{/each}
