<script context="module">
  import Pagination, {
    setLabels as _setPaginationLabels,
  } from './Pagination.svelte';
  import Row from './Row.svelte';
  import Search, { setLabels as _setSearchLabels } from './Search.svelte';
  import Sort, { setLabels as _setSortLabels } from './Sort.svelte';
  export { Pagination, Row, Search, Sort };

  let globalLabels;

  export function setTableLabels(labels) {
    globalLabels = labels;
  }

  export const setPaginationLabels = _setPaginationLabels;
  export const setSearchLabels = _setSearchLabels;
  export const setSortLabels = _setSortLabels;
</script>

<script>
  import { createEventDispatcher, setContext } from 'svelte';
  const dispatch = createEventDispatcher();

  export let loading = false;
  export let page = 0;
  export let pageIndex = 0;
  export let pageSize = 4;
  export let responsive = true;
  export let rows;
  export let serverSide = false;
  export let showPagination = rows.length > pageSize;
  export let useDefaultSearch = true;
  export let labels = {
    empty: 'No records available',
    loading: 'Loading data',
    ...globalLabels,
  };

  let buttons = [-2, -1, 0, 1, 2];
  let pageCount = 0;

  $: filteredRows = rows;
  $: visibleRows = filteredRows.slice(pageIndex, pageIndex + pageSize); //getFilteredData(filteredRows); //filteredRows.slice(pageIndex, pageIndex + pageSize);

  setContext('state', {
    getState: () => ({
      page,
      pageIndex,
      pageSize,
      rows,
      filteredRows,
    }),
    setPage: (_page, _pageIndex) => {
      page = _page;
      pageIndex = _pageIndex;
    },
    setRows: (_rows) => (filteredRows = _rows),
  });

  function onPageChange(event) {
    dispatch('pageChange', event.detail);
  }

  function onSearch(event) {
    dispatch('search', event.detail);
  }
  function getFilteredData(filteredRows) {
    if (showPagination) {
      return filteredRows.slice(pageIndex, pageIndex + pageSize);
    } else {
      return filteredRows;
    }
  }
</script>

<style>
  .table_container {
    width: 100%;
    border-collapse: collapse;
  }
  .table_container :global(th, td) {
    position: relative;
    border: none;
    text-align: center;
    padding: 0.2em 0;
  }

  .table_container :global(td) {
    padding: 0.1em 0.1em;
    font-size: 14px;
  }
  .table_container :global(thead) {
    border-bottom: 1px solid #ddd;
  }
  .table_container td,
  .table_container th {
    padding: 0.2em;
  }
  .center {
    text-align: center;
    font-style: italic;
  }

  .center > span {
    padding: 10px 10px;
    float: left;
    width: 100%;
  }

  .slot-top,
  .slot-bottom {
    z-index: 999;
    /* float: left; */
    width: 100%;
    border-top: 1px solid rgb(221, 221, 221, 0.5);
    /* margin-top: 0.5em; */
    /* margin-bottom: 0.5em; */
  }

  @media screen and (max-width: 767px) {
    table.responsive {
      border: 0;
    }

    table.responsive :global(thead) {
      border: none;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
      border-bottom: 1px solid #ccc;
    }

    table.responsive :global(tr) {
      border: none;
      border-bottom: 2px solid #ddd;
      display: block;
      padding-bottom: 0.3em;
      margin-bottom: 0.3em;
    }

    table.responsive :global(td) {
      border-bottom: 1px solid #ddd;
      display: block;
      font-size: 0.8em;
      text-align: right;
    }

    table.responsive :global(td::before) {
      /*
	* aria-label has no advantage, it won't be read inside a table content: attr(aria-label);
	*/
      content: attr(data-label);
      float: left;
      font-weight: bold;
    }

    table.responsive :global(td[data-label-normal]::before) {
      font-weight: normal;
    }

    table.responsive :global(td[data-label-upper]::before) {
      text-transform: uppercase;
    }

    table.responsive :global(td:last-child) {
      border-bottom: 0;
    }
  }
</style>

{#if useDefaultSearch === true}
  <slot name="top">
    <div class="slot-top form-group">
      <svelte:component this={Search} on:search={onSearch} />
    </div>
  </slot>
{/if}
<table class={'table_container ' + $$props.class} class:responsive>
  <slot name="head" />
  {#if loading}
    <tbody>
      <tr>
        <td class="center" colspan="100%">
          <span>
            {@html labels.loading}
          </span>
        </td>
      </tr>
    </tbody>
  {:else if visibleRows.length === 0}
    <tbody>
      <tr>
        <td class="center" colspan="100%">
          <span>
            {@html labels.empty}
          </span>
        </td>
      </tr>
    </tbody>
  {:else}
    <slot rows={visibleRows} />
  {/if}
  <slot name="foot" />
</table>

<slot name="bottom">
  <div class="slot-bottom">
    {#if showPagination}
      <svelte:component
        this={Pagination}
        {page}
        {pageSize}
        {serverSide}
        count={filteredRows.length - 1}
        on:pageChange={onPageChange} />
      <!-- {:else}
        &nbsp; This is just to adjust the bottom space issue -->
    {/if}
  </div>
</slot>
