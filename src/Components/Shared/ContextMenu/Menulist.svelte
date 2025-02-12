<script>
  import Icon from 'svelte-awesome';
  import MenuOption from './MenuOption.svelte';
  import { upload, download, userPlus, trash } from 'svelte-awesome/icons';
  import { createEventDispatcher } from 'svelte';
  export let menuOptionList = [];
  const dispatch = createEventDispatcher();
  let menuOptions = [];
  $: {
    menuOptions = menuOptionList;
  }
  $: iconColor = '#717171';
  //Methods
  const handleOptionClicked = (optionMenu) => {
    dispatch('selectedMenuOption', optionMenu);
  };
</script>

<style>
</style>

<div>
  {#each menuOptions as optionMenu}
    <MenuOption
      on:click={handleOptionClicked(optionMenu)}
      isDisabled={optionMenu.disabled}>
      <Icon data={optionMenu.icon} style={`fill:${iconColor}`} />
      <span> {optionMenu.option}</span>
    </MenuOption>
  {/each}
</div>
