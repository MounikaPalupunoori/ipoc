<script>
  // imports
  import LocalTable from './ServerTable/index.svelte';
  import Search, {
    setLabels as _setSearchLabels,
  } from './ServerTable/Search.svelte';
  import { createEventDispatcher } from 'svelte';
  import { generateUniqueId } from '@Utils/common';
  const dispatch = createEventDispatcher();
  // declaration
  export const setSearchLabels = _setSearchLabels;
  export let config;
  export let filters;
  export let showCheckBox = false;
  export let imputationSearch;
  export let isSort = true;
  const sortingArr = config.chartConfig.columnOrder;
  const tableCheckBoxName = 'tableContent_' + generateUniqueId('time');
  const tableHeaderList = Object.keys(config?.chartConfig?.columnConfig).length
    ? config.chartConfig.columnConfig
    : config.chartConfig.columnAlias;
  let originalTableHeader = [];
  if (tableHeaderList) {
    originalTableHeader = Object.keys(tableHeaderList)
      .filter((r) => r !== 'selected')
      .map((r) => {
        let o = {};
        o['title'] = r;
        o['key'] = r;
        return o;
      });
  }
  let totalPage = 0;
  let perPage = 0;
  let serverSide = false;
  let currentPage = 0;
  if (config.chartConfig.hasOwnProperty('tableConfig')) {
    totalPage = config.chartConfig.tableConfig.totalPage;
    perPage = config.chartConfig.tableConfig.perPage;
    serverSide = config.chartConfig.tableConfig.serverSide;
    currentPage = config.chartConfig.tableConfig.currentPage;
  }

  let count = Math.round(totalPage / perPage);
  let originalTableRow = config.data;
  let tableRow = config.data;
  let tableHeader = originalTableHeader.sort(sortFunc);
  let selectedRows = [];
  // let selectedTableData = [];
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
    if (imputationSearch) {
      dispatch('onSearch', text);
    } else {
      tableRow = originalTableRow;
      if (text) {
        tableRow = tableRow.filter((row) => {
          return searchData(row, text);
        });
      }
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
      dispatchData.flag = 'All';
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
      if (
        !selectedRowObj[
          selectedRowData[
            config?.chartConfig?.dataSelectionKey
              ? config?.chartConfig?.dataSelectionKey
              : 'value'
          ]
        ]
      ) {
        // selectedRows = addTableSelection(selectedRowData)
        selectedRows.push(selectedRowData);
      } else if (
        selectedRowObj[
          selectedRowData[
            config?.chartConfig?.dataSelectionKey
              ? config?.chartConfig?.dataSelectionKey
              : 'value'
          ]
        ]
      ) {
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
    if (config?.chartConfig?.dataSelectionKey) {
      dispatchData.values = selectedFilters;
    } else {
      dispatchData.values = filterWithoutUncheck;
    }
    dispatch('cardclick', dispatchData);
  }
  const onPageChange = (e) => {
    dispatch('pageChange', e.detail);
  };
  const handleActionClick = (e) => {
    let eventName = e?.detail?.eventName;
    let data = e?.detail?.data;
    dispatch(eventName, data);
  };
  const onServerSideSort = (e) => {
    dispatch('serverSideSort', e.detail);
  };

</script>

<style>
  .box {
    height: 100%;
    width: 100%;
    position: relative;
  }
  .table-container {
    border: 1px solid #ddd;
    height: calc(100% - 2.3em);
    width: 100%;
    z-index: 1;
  }
  .search-container {
    position: absolute;
    bottom: 1.2em;
    left: 0.05em;
    background-color: rgb(255 255 255 / 13%);
    /* border-top: 1px solid rgba(0, 0, 0, 0.09); */
    width: 50%;
    font-weight: normal;
    z-index: 1;
    line-height: 1.5;
  }
  .search-left {
    display: flex;
    /* margin-left: -190%; */
  }
  .table-container > table > thead > tr > th:first-child {
    flex: 2 !important;
  }
  .table-container > table > tbody > tr > td:first-child {
    flex: 3 !important;
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
      {showCheckBox}
      isAllSelected={filters && filters.length === originalTableRow.length ? true : false}
      {isSort}
      {serverSide}
      count={totalPage}
      page={currentPage}
      pageSize={perPage}
      useDefaultSearch={false}
      {tableCheckBoxName}
      columnConfig={config.chartConfig.columnConfig}
      columnMeta={config.chartConfig.columnMeta}
      columnAlias={config.chartConfig.columnAlias}
      customButtons={config?.chartConfig?.customButtons}
      maxTextLength={config?.chartConfig?.maxTextLength}
      on:tableSeleted={getSelected}
      on:pageChange={onPageChange}
      on:actionClick={handleActionClick}
      on:serverSideSort={onServerSideSort} />
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
