<script>
  export let items;
</script>

<style type="text/scss">
  ul {
    padding-left: 1.2em;
    margin: 0;
    li {
      list-style-type: square;
    }
  }
</style>

<ul>
  {#each items as item}
    <!-- svelte-ignore a11y-invalid-attribute -->
    <li><a href="study"> {item.studyName} </a></li>
  {/each}
</ul>
