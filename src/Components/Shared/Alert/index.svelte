<script>
  import { createEventDispatcher } from 'svelte';
  export let config;
  let messageType = {
    danger: 'alert-danger',
    success: 'alert-success',
    info: 'alert-info',
    warning: 'alert-warning',
  };
  export let close = true;
  let show = true;
  let dispatch = createEventDispatcher();
  function handleMessage() {
    show = false;
    dispatch('showMessageToggle', show);
  }
</script>

<style src="./style.scss">
</style>

{#if show}
  <div
    class="alert {messageType[config.type]} alert-dismissible fade show no-margin-bottom">
    {#if close}
      <button
        type="button"
        on:click={handleMessage}
        class="close"
        data-dismiss="alert">×</button>
    {/if}
    <h5 class="alert-heading">{config.title}</h5>
    <article class="alert-msg">{config.message}</article>
  </div>
{/if}
