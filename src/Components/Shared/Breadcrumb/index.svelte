<script>
  import Icon from 'svelte-awesome';
  import { createEventDispatcher } from 'svelte';
  export let breadCrumbChain = [];
  let breadcrumbList = [];
  const dispatch = createEventDispatcher();
  $: if (breadCrumbChain?.length) {
    breadcrumbList = breadCrumbChain;
  }
  //Methods
  const handleBreadCrumbClick = (event) => {
    dispatch('selectedBreadCrumb', event);
  };
</script>

<style src="./style.scss">
</style>

<div>
  <ul class="mb-0 breadcrumb">
    {#each breadcrumbList as breadcrumbItem, index}
      <li
        class="breadcrumb-item"
        class:active={breadcrumbItem.active && index === breadcrumbList.length - 1}>
        <!-- <a
          href={breadcrumbItem.link}
          class="breadcrumb-link">{breadcrumbItem.name}</a> -->
        <!-- svelte-ignore a11y-missing-attribute -->
        <a
          on:click={handleBreadCrumbClick(breadcrumbItem)}
          class="breadcrumb-link">{breadcrumbItem.name}</a>
      </li>
    {/each}
  </ul>
</div>
