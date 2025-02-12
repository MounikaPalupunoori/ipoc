<script context="module">
  let globalLabels;

  export function setLabels(labels) {
    globalLabels = labels;
  }
</script>

<script>
  import { createEventDispatcher, getContext } from 'svelte';
  const dispatch = createEventDispatcher();
  const stateContext = getContext('state');

  export let buttons = [-2, -1, 0, 1, 2];
  export let count;
  export let page = 0;
  export let pageSize;
  export let serverSide = false;

  export let labels = {
    first: '<<',
    last: '>>',
    next: '>',
    previous: '<',
    ...globalLabels,
  };
  let isFirstPage = true;
  let maxCheck = 4;
  $: isFirstPage = page > 0 ? false : true;
  $: maxCheck = isFirstPage ? 4 : 3;
  $: pageCount = Math.floor(count / pageSize);
  function onChange(event, page) {
    const state = stateContext.getState();
    const detail = {
      originalEvent: event,
      page,
      pageIndex: serverSide ? 0 : page * state.pageSize,
      pageSize: state.pageSize,
    };
    dispatch('pageChange', detail);
    if (detail.preventDefault !== true) {
      stateContext.setPage(detail.page, detail.pageIndex);
    }
  }
</script>

<style>
  .active {
    background-color: rgb(242 242 242);
    color: #212529;
    border-bottom: 1px solid rgb(217 217 217 / 42%);
    margin-bottom: 0px;
  }

  ul {
    flex: 1;
    float: right;
    list-style: none;
    bottom: 0rem;
    right: 0rem;
    margin-bottom: 0;
  }

  li {
    float: left;
  }

  button {
    background: transparent;
    border: none;
    padding: 0 0.6em;
    margin-left: 3px;
    float: left;
    font-size: 0.8em;
    cursor: pointer;
    line-height: 3.8;
    min-width: 1.7em;
  }
  button:focus {
    outline: none;
  }
</style>

<ul class="mt-0 mb-0">
  <li>
    <button
      class="mx-0 mb-0 px-0"
      disabled={page === 0}
      on:click={(e) => onChange(e, 0)}>
      {labels.first}
    </button>
  </li>
  <li>
    <button
      class="mx-0 mb-0 px-0"
      disabled={page === 0}
      on:click={(e) => onChange(e, page - 1)}>
      {labels.previous}
    </button>
  </li>
  {#each buttons as button, index}
    {#if page + button >= 0 && page + button <= pageCount && index <= maxCheck && index >= 1}
      <li>
        <button
          class="mx-0 mb-0 px-0"
          class:active={page === page + button}
          on:click={(e) => onChange(e, page + button)}>
          {page + button + 1}
        </button>
      </li>
    {/if}
  {/each}
  <li>
    <button
      class="mx-0 mb-0 px-0"
      disabled={page > pageCount - 1}
      on:click={(e) => onChange(e, page + 1)}>
      {labels.next}
    </button>
  </li>
  <li>
    <button
      class="mx-0 mb-0 px-0"
      disabled={page >= pageCount}
      on:click={(e) => onChange(e, pageCount)}>
      {labels.last}
    </button>
  </li>
</ul>
