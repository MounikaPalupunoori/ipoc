<script>
  import { afterUpdate } from 'svelte';
  import Select from 'svelte-select';
  import { createEventDispatcher } from 'svelte';
  //Props declaration start
  export let options;
  export let isMultiple = false;
  export let isSearchable = true;
  export let isClearable = true;
  export let isRequiredField = false;
  export let readOnly = false;
  export let selectedValue;
  export let placeholder;
  export let name;
  export let label;
  export let sort = true;
  export let paddingClass = 'paddingtop5 paddingBottom15';
  //variable declaration start
  let isDisabled;
  let placeholdertxt = '';
  let sortParameter = checkSortParameter(options);
  const dispatch = createEventDispatcher();
  // let selectedValue = undefined;
  //variable declaration End
  let prevOptions;
  // $: if (options) {
  //   sortParameter = checkSortParameter(options);
  //   if (JSON.stringify(prevOptions) !== JSON.stringify(options)) {
  //     selectedValue = null;
  //   }
  //   prevOptions = options;
  // }
  //Methods definition start
  function checkSortParameter(options) {
    if (options?.length > 0) {
      if (typeof options[0] === 'object') {
        return 'label';
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  function handleSelect(selectedVal) {
    if (Array.isArray(selectedVal.detail)) {
      selectedVal.detail.map((x) => {
        x.name = name;
      });
    }
    dispatch('getSeletedOptions', selectedVal.detail);
  }
  function checkOptions() {
    placeholdertxt =
      options?.length === 0 ? `No ${name}s Available` : placeholder;
    if (readOnly) {
      isDisabled = readOnly;
    } else {
      isDisabled = options?.length === 0 ? true : false;
    }
  }
  afterUpdate(() => {
    checkOptions(); // ...the DOM is now in sync with the data
  });
  /**
   * @name isRequired
   * @description helper function for alphabeticalSort
   */
  const isRequired = () => {
    throw Error('Argument key is required!');
  };
  /**
   * @name alphabeticalSort
   * @param {*} arr
   * @param {*} key
   * @description when using array of object, pass key, for normal arrays pass key as null
   * @returns sorted array in alphabetical order.
   */
  const alphabeticalSort = (arr, key = isRequired()) => {
    let sortedArray = arr;
    if (sortedArray.length === 0) {
      return [];
    }
    if (key !== null) {
      sortedArray = arr.sort((a, b) => a[key].localeCompare(b[key]));
    } else if (key === null) {
      sortedArray = arr.sort((a, b) => a.localeCompare(b));
    }
    return sortedArray;
  };
  /**
   * @name getTitleCaseString
   * @param {*} str
   * @returns return a title case string.
   */
  const getTitleCaseString = (str = null) => {
    if (str) {
      if (str.toString().includes('.')) {
        return str.toString().replaceAll('.', ' ');
      } else {
        return str.toString().replace(/([A-Z])/g, ' $1');
      }
    } else {
      return '';
    }
  };
  const handleClear = (selectedVal) => {
    let val = selectedVal?.detail;
    if (val === null) {
      dispatch('getSeletedOptions', '');
    } else {
      dispatch('getSeletedOptions', val);
    }
  };
  //Methods definition End

</script>

<style>
  .select-label {
    display: flex;
    justify-content: flex-start;
  }
  .paddingtop5 {
    padding-top: 5px;
  }
  .paddingBottom15 {
    padding-bottom: 15px;
  }
  .no-dropdown {
    line-height: 2.7;
    border: 1px solid #ced4da;
    border-radius: 5px;
    text-align: center;
    color: #495057;
  }
  .required-field {
    color: #f44336;
  }

</style>

<section>
  {#if label}
    <div class="select-label">
      <label for={name}>{getTitleCaseString(label)}
        {#if !isRequiredField}<span class="required-field">*</span>{/if}</label>
    </div>
  {/if}
  <div class={paddingClass}>
    <Select
      items={sort ? alphabeticalSort(options, sortParameter) : options}
      isMulti={isMultiple}
      {placeholder}
      {isSearchable}
      {isClearable}
      value={selectedValue}
      listPlacement="auto"
      on:clear={handleClear}
      on:select={handleSelect}
      {isDisabled} />
  </div>
</section>
