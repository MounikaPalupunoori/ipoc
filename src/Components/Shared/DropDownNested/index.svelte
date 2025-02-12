<script>
  import { createEventDispatcher } from 'svelte';
  import NestedDropdown from './NestedDropdown.svelte';
  const dispatch = createEventDispatcher();
  //Props declaration start
  export let items = [];
  //Props declaration End

  //METHODS
  function closeList() {
    dispatch('closeList');
  }
  function getClickedListItem(event) {
    dispatch('selectedListValue', event.detail.key);
  }
</script>

<style src="./style.scss">
</style>

<ul class="mainDropdownContainer" on:mouseleave={closeList}>
  {#each items as item}
    <NestedDropdown {item} on:NestedListItem={getClickedListItem} />
  {/each}
</ul>
