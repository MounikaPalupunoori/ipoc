<script>
  import { onMount, setContext, createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { key } from './menu.js';
  import { tempMenuAdjust } from './config.js';

  export let x;
  export let y;

  // whenever x and y is changed, restrict box to be within bounds
  $: (() => {
    if (!menuEl) return;

    const rect = menuEl.getBoundingClientRect();
    x = Math.min(window.innerWidth - rect.width - tempMenuAdjust, x);
    if (y > window.innerHeight - rect.height) y -= rect.height;
    if (window.scrollY) y += window.scrollY; // this is to identify if the user scrolled over the page
  })(x, y);

  const dispatch = createEventDispatcher();

  setContext(key, {
    dispatchClick: () => dispatch('click'),
  });

  let menuEl;
  function onPageClick(e) {
    if (e.target === menuEl || menuEl.contains(e.target)) return;
    dispatch('clickoutside');
  }
</script>

<style src="./Menu.scss">
</style>

<svelte:body on:click={onPageClick} />

<div
  class="menu_container"
  transition:fade={{ duration: 100 }}
  bind:this={menuEl}
  style="top: {y}px; left: {x}px;">
  <slot />
</div>
