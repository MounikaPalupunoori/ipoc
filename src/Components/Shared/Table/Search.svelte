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
  export let useDefaultSearch = true;
  export let filter = (row, text, index) => {
    text = text.toLowerCase();
    row = Object.values(row);
    for (let i in row) {
      if (row[i].toString().toLowerCase().indexOf(text) > -1) {
        return true;
      }
    }
    return false;
  };
  export let index = -1;
  export let text = '';

  export let labels = {
    placeholder: 'Search',
    ...globalLabels,
  };

  async function onSearch(event) {
    if (!useDefaultSearch) {
      dispatch('searchText', text);
    } else {
      const state = stateContext.getState();
      const detail = {
        originalEvent: event,
        filter,
        index,
        text,
        page: state.page,
        pageIndex: state.pageIndex,
        pageSize: state.pageSize,
        rows: state.filteredRows,
      };
      dispatch('search', detail);

      if (detail.preventDefault !== true) {
        if (detail.text.length === 0) {
          stateContext.setRows(state.rows);
        } else {
          stateContext.setRows(
            detail.rows.filter((r) => detail.filter(r, detail.text, index))
          );
        }
        stateContext.setPage(0, 0);
      } else {
        stateContext.setRows(detail.rows);
      }
    }
  }
</script>

<style>
  .search {
    width: 100%;
    float: right;
  }
  .search input {
    width: 100%;
    border: none;
    border-right: 1px solid rgba(0, 0, 0, 0.125);
    /* border-top: 1px solid rgba(0, 0, 0, 0.125); */
    border-radius: 0;
    line-height: 3;
    outline-offset: 0px;
    margin: 0;
    padding-left: 5px !important;
    padding: 0;
  }
  input[type='search']:focus {
    outline: 1px solid rgba(0, 0, 0, 0.125);
  }
  ::placeholder {
    font-size: 13px;
  }
  @media screen and (max-width: 767px) {
    .search {
      width: 100%;
    }
  }
</style>

<div class="search">
  <input
    type="search"
    title={labels.placeholder}
    placeholder={labels.placeholder}
    bind:value={text}
    on:keyup={onSearch} 
    on:search={onSearch}/>
</div>
