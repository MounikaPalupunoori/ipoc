<script>
  import DropdownNested from '../DropDownNested/index.svelte';
  import IcoreTooltip from '../IcoreTooltip/index.svelte';
  import Icon from 'svelte-awesome';
  import { times, infoCircle, bars, undo } from 'svelte-awesome/icons';
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  //Props declaration
  export let items = [];
  export let filters = [];
  export let enableChartChange = true;
  export let cardDetail = 'Chart info';
  //Varaiable declaration
  let addDropdown = false;
  //methods declaration
  function showHideList() {
    addDropdown = !addDropdown;
  }
  function getSelectedListValue(event) {
    dispatch('getSelected', event.detail);
  }
  function checkIsEmpty() {
    return filters && filters == 0;
  }
</script>

<style src="./style.scss">
</style>

<div class="headerOptionContainer">
  <div class="headerOptions">
    <div
      class:show={!checkIsEmpty()}
      class:hide={checkIsEmpty()}
      on:click={() => dispatch('reset')}>
      <IcoreTooltip content="Reset" top>
        <Icon
          data={undo}
          scale="1"
          style={'color: steelblue; height:12px; vertical-align:baseline'} />
      </IcoreTooltip>
    </div>
    <div
      class:show={checkIsEmpty()}
      class:hide={!checkIsEmpty()}
      on:click={() => dispatch('remove')}>
      <IcoreTooltip content="Delete chart" top>
        <Icon
          data={times}
          scale="1"
          style={'height:12px; vertical-align:baseline'} />
      </IcoreTooltip>
    </div>
    {#if enableChartChange}
      <div>
        <IcoreTooltip content={cardDetail} top>
          <Icon
            data={infoCircle}
            scale="1"
            style={'height:12px; vertical-align:baseline'} />
        </IcoreTooltip>
      </div>
      <div>
        <div on:mouseenter={showHideList}>
          <Icon
            data={bars}
            scale="1"
            style={'height:12px; vertical-align:baseline'} />
        </div>
      </div>
    {/if}
  </div>
  <div>
    {#if enableChartChange && addDropdown}
      <DropdownNested
        on:closeList={showHideList}
        {items}
        on:selectedListValue={getSelectedListValue} />
    {/if}
  </div>
</div>
