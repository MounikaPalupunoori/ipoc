<script>
  // imports
  import LocalTable from './Table/index.svelte';
  import Search, { setLabels as _setSearchLabels } from './Table/Search.svelte';
  import { createEventDispatcher } from 'svelte';
  import { generateUniqueId } from '@Utils/common';
  const dispatch = createEventDispatcher();

  // declaration
  export const setSearchLabels = _setSearchLabels;
  export let config;
  export let filters;
  export let isCardUpdated;
  const sortingArr = config.chartConfig.columnOrder;
  const tableCheckBoxName = 'tableContent_' + generateUniqueId('time');
  const tableHeaderList = !!Object.keys(config?.chartConfig?.columnConfig)
    .length
    ? config.chartConfig.columnConfig
    : config.data[0];
  const getTableHeaderListConfig = () => {
    if (tableHeaderList) {
      return Object.keys(tableHeaderList)
        .filter((r) => r !== 'selected')
        .map((r) => {
          let o = {};
          o['title'] = r;
          o['key'] = r;
          return o;
        });
    } else {
      return [];
    }
  };
  let originalTableHeader = [];
  if (tableHeaderList) {
    originalTableHeader = getTableHeaderListConfig();
  }
  let originalTableRow = config.data;
  let tableRow = config.data;
  let tableHeader = originalTableHeader.sort(sortFunc);
  let selectedRows = [];
  $: cardValueUpdated = $$props.isCardUpdated;
  $: {
    originalTableRow = config.data;
    tableRow = config.data;
    originalTableHeader = getTableHeaderListConfig();
    tableHeader = originalTableHeader.sort(sortFunc);
  }
  // methods
  function sortFunc(a, b) {
    if (sortingArr?.length > 0) {
      return sortingArr.indexOf(a.title) - sortingArr.indexOf(b.title);
    }
  }
  export let searchData = (row, text) => {
    text = text.toLowerCase();
    for (let i in row) {
      if (row[i]?.toString().toLowerCase().indexOf(text) > -1) {
        return true;
      }
    }
    return false;
  };
  function onSearch(event) {
    let text = event.detail;
    tableRow = originalTableRow;
    if (text) {
      tableRow = tableRow.filter((row) => {
        return searchData(row, text);
      });
    }
  }
  function removeTableSelection(value) {
    return selectedRows.filter((item) => {
      return item.value != value;
    });
  }
  function addTableSelection(selectedRowData) {
    selectedRows.push(selectedRowData);
  }
  function getSelected(event) {
    let dispatchData = {};
    dispatchData.attributeName = config?.chartConfig?.cardAttr
      ? config.chartConfig.cardAttr
      : '';
    dispatchData.aggregator = config?.chartConfig?.aggregator
      ? config.chartConfig.aggregator
      : '';
    dispatchData.entity = config?.chartConfig?.entity
      ? config.chartConfig.entity
      : '';
    dispatchData.selectionMode = config?.chartConfig?.selectionMode
      ? config.chartConfig.selectionMode
      : '';
    dispatchData.values = [];
    let { selectedRowData, isChecked, isAllSelected } = event?.detail;
    if (isAllSelected) {
      selectedRows = selectedRowData;
      dispatchData.values = selectedRows;
      dispatch('cardclick', dispatchData);
      return;
    }
    let selectedRowObj = {};
    if (selectedRows.length > 0) {
      selectedRowObj = selectedRows.reduce((acc, item, i) => {
        acc[item.value] = item;
        return acc;
      }, {});
    }
    if (Object.keys(selectedRowData).length > 0) {
      if (!selectedRowObj[selectedRowData['value']]) {
        // selectedRows = addTableSelection(selectedRowData)
        selectedRows.push(selectedRowData);
      } else if (selectedRowObj[selectedRowData['value']]) {
        if (!isChecked) {
          selectedRows = removeTableSelection(selectedRowData);
        }
      }
    } else {
      selectedRows = []; // deselect all
    }
    // step 1
    // define empty array
    // if filters exist contact selected rows with filters and assign to defined array
    // if filters not exist push it to defined array
    // step 2
    // check for twice clicked and filter out twice clicked row and assign to variable
    // convert  filtered twice clicked object to array for dispatch event
    let selectedFilters = [];
    if (filters) {
      selectedFilters = filters.concat(selectedRows);
    } else {
      selectedFilters.push(...selectedRows);
    }
    let removeUnChecked = selectedFilters.reduce((a, d) => {
      if (a.hasOwnProperty(d.value)) {
        a[d.value] += 1;
      } else {
        a[d.value] = 1;
      }
      return a;
    }, {});
    let filterWithoutUncheck = Object.keys(removeUnChecked)
      .filter((r) => removeUnChecked[r] == 1)
      .map((r) => {
        return {
          value: r,
        };
      });
    dispatchData.values = selectedFilters;
    dispatch('cardclick', dispatchData);
  }
</script>

<style>
  .box {
    height: 100%;
    width: 100%;
    position: relative;
  }
  .table-container {
    height: calc(100% - 2.3em);
    width: 100%;
    z-index: 1;
  }
  .search-container {
    position: absolute;
    /* bottom: 1.2em; */
    left: 0.05em;
    background-color: rgb(255 255 255 / 13%);
    /* border-top: 1px solid rgba(0, 0, 0, 0.09); */
    width: 40%;
    font-weight: normal;
    z-index: 1;
    line-height: 3;
  }
  .search-left {
    display: flex;
    /* margin-left: -190%; */
  }
</style>

<div
  class="box"
  on:mouseenter={() => {
    dispatch('hoverOnElement');
  }}
  on:mouseleave={(e) => {
    dispatch('hoverOutElement');
  }}>
  <div class="table-container">
    <LocalTable
      rows={tableRow}
      headers={tableHeader}
      isRowClickable={false}
      showCheckBox={config.chartConfig.allowFilter}
      isAllSelected={filters && filters.length === originalTableRow.length ? true : false}
      isSort={true}
      useDefaultSearch={false}
      isCardUpdated={cardValueUpdated}
      {tableCheckBoxName}
      columnConfig={config.chartConfig.columnConfig}
      columnMeta={config.chartConfig.columnMeta}
      columnAlias={config.chartConfig.columnAlias}
      on:tableSeleted={getSelected} />
    <div class="search-container">
      <slot name="top">
        <div class="search-left">
          <svelte:component
            this={Search}
            on:searchText={onSearch}
            useDefaultSearch={false} />
        </div>
      </slot>
    </div>
  </div>
</div>
