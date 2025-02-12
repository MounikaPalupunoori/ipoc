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
    next: 'next',
    previous: 'previous',
    ...globalLabels,
  };

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
    margin-bottom: 8px;
  }

  ul {
    flex: 1;
    float: right;
    list-style: none;
    /* position: absolute; */
    bottom: 0.7rem;
    right: 0%;
    margin-bottom: 0;
  }

  li {
    float: left;
  }

  button {
    background: transparent;
    border: none;
    padding: 0.73em 0.8em;
    margin-left: 3px;
    float: left;
    font-size: 0.8em;
    cursor: pointer;
  }
  button:focus {
    outline: none;
  }
</style>

<ul>
  <li>
    <button disabled={page === 0} on:click={(e) => onChange(e, 0)}>
      {labels.first}
    </button>
  </li>
  <li>
    <button disabled={page === 0} on:click={(e) => onChange(e, page - 1)}>
      {labels.previous}
    </button>
  </li>
  {#each buttons as button}
    {#if page + button >= 0 && page + button <= pageCount}
      <li>
        <button
          class:active={page === page + button}
          on:click={(e) => onChange(e, page + button)}>
          {page + button + 1}
        </button>
      </li>
    {/if}
  {/each}
  <li>
    <button
      disabled={page > pageCount - 1}
      on:click={(e) => onChange(e, page + 1)}>
      {labels.next}
    </button>
  </li>
  <li>
    <button
      disabled={page >= pageCount}
      on:click={(e) => onChange(e, pageCount)}>
      {labels.last}
    </button>
  </li>
</ul>
