<script>
  import { onMount, getContext } from 'svelte';
  import { key } from './menu.js';
  import { createEventDispatcher } from 'svelte';

  export let isDisabled = false;
  export let text = '';

  const dispatch = createEventDispatcher();

  const { dispatchClick } = getContext(key);

  const handleClick = (e) => {
    if (isDisabled) return;

    dispatch('click');
    dispatchClick();
  };
</script>

<style src="./MenuOption.scss">
</style>

<div class="menu_option" class:disabled={isDisabled} on:click={handleClick}>
  {#if text}
    {text}
  {:else}
    <slot />
  {/if}
</div>
