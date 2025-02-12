<script>
  import Icon from 'svelte-awesome';
  import {
    file,
    upload,
    download,
    userPlus,
    trash,
  } from 'svelte-awesome/icons';
  import Menu from './Menu.svelte';
  import MenuOption from './MenuOption.svelte';

  import { tick } from 'svelte';

  let pos = { x: 0, y: 0 };
  let showMenu = false;

  async function onRightClick(e) {
    if (showMenu) {
      showMenu = false;
      await new Promise((res) => setTimeout(res, 100));
    }

    pos = { x: e.clientX, y: e.clientY };
    showMenu = true;
  }

  function closeMenu() {
    showMenu = false;
  }
</script>

{#if showMenu}
  <Menu {...pos} on:click={closeMenu} on:clickoutside={closeMenu}>
    <MenuOption on:click={console.log}>
      <Icon data={upload} />
      <span> Import</span>
    </MenuOption>
    <MenuOption on:click={console.log}>
      <Icon data={userPlus} />
      <span> Share</span>
    </MenuOption>
    <MenuOption on:click={console.log}>
      <Icon data={download} />
      <span> Download</span>
    </MenuOption>
    <MenuOption on:click={console.log}>
      <Icon data={trash} />
      <span> Delete</span>
    </MenuOption>
  </Menu>
{/if}

<svelte:body on:contextmenu|preventDefault={onRightClick} />
