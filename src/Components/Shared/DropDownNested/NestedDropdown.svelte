<script>
  import { createEventDispatcher } from 'svelte';
  import Icon from 'svelte-awesome';
  import {
    caretRight,
    pieChart,
    download,
    fileExcelO,
    fileImageO,
    group,
    barChart,
    table,
  } from 'svelte-awesome/icons';

  export let item;
  const iconsList = {
    chartPie: pieChart,
    download: download,
    csvIcon: fileExcelO,
    svgIcon: fileImageO,
    versus: group,
    custmBin: barChart,
    showTable: table,
  };
  const dispatch = createEventDispatcher();
  function handleClick(key, title) {
    dispatch('NestedListItem', {
      key: key,
      title: title,
    });
  }
  function handleNestedClick(e) {
    dispatch('NestedListItem', e.detail);
  }
</script>

<style src="./style.scss">
</style>

{#if item.hasOwnProperty('children')}
  <li data-value={item.title} class="hoverOption">
    <Icon data={iconsList[item.icon]} style={'height:11px;'} />
    {item.title}
    <Icon data={caretRight} style={'height:11px;'} />
    <ul class="hoverUL">
      {#each item.children as childrenItem}
        <svelte:self
          item={childrenItem}
          on:NestedListItem={handleNestedClick} />
        <!-- content here -->
      {/each}
    </ul>
  </li>
{:else}
  <li
    data-value={item.key}
    on:click={() => handleClick(item.key, item.title)}
    style={item.show ? 'display:block' : 'display:none'}>
    <Icon data={iconsList[item.icon]} style={'height:12px;'} />
    {item.title}
  </li>
{/if}
