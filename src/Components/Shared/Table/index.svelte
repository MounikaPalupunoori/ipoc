<script>
  //Row component is optional and only serves to render odd/even row, you can use <tr> instead.
  //Sort component is optional
  import { onMount } from 'svelte';
  import Table, { Pagination, Row, Search, Sort } from './Table.svelte';
  import Image from './Image.svelte';
  import { sortNumber, sortString } from './Sorting.js';
  import { createEventDispatcher } from 'svelte';

  let page = 0; //first page
  let pageSize = 10;
  export let rows;
  export let headers;
  export let isRowClickable = true;
  export let showCheckBox = true;
  // export let showPagination = true;
  export let isSort = true;
  export let useDefaultSearch = true;
  export let isAllSelected = false;
  export let tableCheckBoxName = 'tableContent';
  export let columnConfig;
  export let columnMeta;
  export let columnAlias;
  const dispatch = createEventDispatcher();
  onMount(async () => {
    autoCheckBoxes(); // to check the already selected checkboxes on load of table
    getContentLimitSize();
  });
  $: contentLimit = 20;
  $:if($$props.isCardUpdated){
    getContentLimitSize()
  }
  const getContentLimitSize=() =>{
    if(document.querySelector('tbody td > article')){
      contentLimit = document.querySelector('tbody td > article').offsetWidth;
    }
  }
  const getFileName = (filename, fileNameLimit) => {
    if (filename?.length > fileNameLimit && typeof filename == 'string') {
      filename = (filename ?  filename?.substring(0, fileNameLimit) + '...' : '')
    }
    if(['object'].includes(typeof filename)){
      return '';
    }else{
      return filename;
    }
  };
  function handleCellClick(row, isSelectAll) {
    if (isSelectAll && !selectall()) {
      row = []; // when deselect the data
    }
    let data = {
      selectedRowData: row,
      isChecked: event.target.checked,
      isAllSelected: isSelectAll,
    };
    checkBoxSelection();
    dispatch('tableSeleted', data);
  }

  function checkBoxSelection() {
    let checkboxes = document.getElementsByName(tableCheckBoxName);
    let counter = 0;
    checkboxes.forEach((item) => {
      if (item.checked) {
        counter++;
      }
    });
    if (counter > 1 && counter == checkboxes.length - 1) {
      checkboxes[0].checked = !checkboxes[0].checked; // when all the other checkboxes are checked or unchecked except the select all
    }
  }

  function onSortString(event) {
    event.detail.rows = sortString(
      event.detail.rows,
      event.detail.dir,
      event.detail.key
    );
  }

  function onSortNumber(event) {
    event.detail.rows = sortString(
      event.detail.rows,
      event.detail.dir,
      event.detail.key
    );
  }

  function selectall() {
    let checkboxes = document.getElementsByName(tableCheckBoxName);
    var val = checkboxes[0].checked;
    for (var i = 0; i < checkboxes.length; i++) checkboxes[i].checked = val;
    return val;
  }

  function autoCheckBoxes() {
    // this is to check the checkboxes onload of table (pre-existing checked data)
    let checkboxes = document.getElementsByName(tableCheckBoxName); // get all checkboxes
    let selectedIndex = rows
      .map((item, i) => {
        return item.hasOwnProperty('selected') && item.selected == true
          ? i
          : undefined;
      })
      .filter((item) => item !== undefined);
    if (selectedIndex.length === rows.length) {
      if(checkboxes.length > 0){
        checkboxes[0].checked = true;
      }
    }
    selectedIndex.forEach((item) => (checkboxes[item + 1].checked = true)); // item+1 as 0th index is occupied by select all checkbox
  }
</script>

<style>
  th {
    text-transform: capitalize;
    font-size: 14px;
    font-weight: bold;
    border-bottom: 0;
  }
  th,
  td {
    align-items: center;
    vertical-align: middle;
    /* this is to hide the data in fixed width columns*/
    border-top: 0 !important;
  }
  /* span {
    position: relative;
    cursor: pointer;
  } */

  /* span[data-title]:after {
    opacity: 0;
    content: attr(data-title);
    padding: 4px 8px;
    position: absolute;
    left: 0;
    top: 100%;
    white-space: nowrap;
    z-index: 20;
    background: rgba(96, 96, 96, 1);
    color: #fff;
    transition: opacity 0.5s;
    pointer-events: none;
  }

  span[data-title]:hover:after {
    opacity: 1;
    transition-delay: 0.1s;
  } */
  [aria-label] {
    position: relative;
  }

  [aria-label]:after {
    content: attr(aria-label);
    display: none;
    position: absolute;
    top: 110%;
    left: 40%;
    z-index: 5000;
    pointer-events: none;
    padding: 8px 10px;
    line-height: 15px;
    white-space: nowrap;
    text-decoration: none;
    text-indent: 0;
    overflow: visible;
    font-size: 0.9em;
    font-weight: normal;
    color: #fff;
    text-shadow: 1px 0 1px #888;
    background-color: rgba(96, 96, 96, 1);
    -webkit-border-radius: 2px;
    border-radius: 2px;
    -webkit-box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.3);
    box-shadow: 1px 2px 6px rgba(0, 0, 0, 0.3);
  }

  [aria-label]:hover:after,
  [aria-label]:focus:after {
    display: block;
  }
</style>

<Table
  :key={$$props.isCardUpdated}
  class="table_container"
  {page}
  {pageSize}
  {rows}
  let:rows={rows2}
  {useDefaultSearch}>
  <thead slot="head">
    <tr>
      {#if showCheckBox === true}
        <th class="checkboxFilterAll">
          <input
            type="checkbox"
            checked={isAllSelected ? true : false}
            name={tableCheckBoxName}
            on:click={() => handleCellClick(rows, true)} />
        </th>
      {/if}
      {#each headers as header}
        <th>
          {columnAlias.hasOwnProperty(header.title) ? columnAlias[header.title] : header.title}
          {#if isSort === true}
            <Sort key={header.key} on:sort={onSortString} />
          {/if}
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each rows2 as row, index (row)}
      <Row>
        {#if showCheckBox === true}
          <td class="checkboxFilter">
            <input
              type="checkbox"
              name={tableCheckBoxName}
              {index}
              on:click={() => handleCellClick(row, false)} />
          </td>
        {/if}
        <!-- Enabled the row click and pass the data to parent -->
        {#if isRowClickable === true}
          {#each headers as header}
            <td
              data-label={header.key}
              on:click={() => handleCellClick(row, false)}>
              {row[header.key]}
            </td>
          {/each}
        {:else}
          {#each headers as header}
            <td data-label={header.key}>
              {#if columnConfig.hasOwnProperty(header.key) && columnConfig[header.key] == 'image'}
                {#if columnMeta.hasOwnProperty(header.key)}
                  <a
                    href={row[columnMeta[header.key]['linkTo']]}
                    target="_blank">
                    <Image src={row[header.key]} />
                  </a>
                {:else}
                  <Image src={row[header.key]} />
                {/if}
              {:else if columnConfig.hasOwnProperty(header.key) && columnConfig[header.key] == 'link'}
                <a href={'dashboard?subject_id='+row[columnMeta[header.key]['linkTo']]} target="_blank"> {row[header.key]}</a>
              {:else}
                <article aria-label={row[header.key]}>
                  {row.hasOwnProperty(header.key) ? getFileName(row[header.key], (contentLimit > 30 ? contentLimit / 5 : 20)) : ''}
                </article>
              {/if}
            </td>
          {/each}
        {/if}
      </Row>
    {/each}
  </tbody>
</Table>
