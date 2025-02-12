<script>
  import Tooltip from '@Components/Shared/Tooltip/Tooltip.svelte';
  import { InfoIcon } from 'svelte-feather-icons';
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();
  //export variable
  export let customclass = 'col-3 p-1';
  export let type = 'text';
  export let name = 'inputname';
  export let value = '';
  export let style = '';
  export let key;
  export let placeholder = ""
  export let displayLabel = '';
  export let required = false;
  export let description = '';
  export let readOnly = false;
  export let max;
  export let min;
  export let inputClass= "form-control"
  let currentDate = '';
  onMount(() => {
    if (type && type == 'date' && name == 'date_of_birth') {
      setMaxDate();
    }
  });
  //methods
  /**
   * @name handleInputChange
   * @param
   * @returns
   * @description This handleInputChange used for get input value changes and dispatch value output
   * @example
   */
  const handleInputChange = (e) => {
    let value = e.target.value;
    if (type == 'number') {
      value = value ? parseFloat(value) : value;
    }
    if (type == 'boolean') {
      if (!(value.toLowerCase() == 'true' || value.toLowerCase() == 'false')) {
        value = 'false';
        e.target.value = value;
      }
    }
    let o = {};
    o[key] = value;
    dispatch('valueInput', o);
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
  const setMaxDate = () => {
    let currentDate = new Date();
    let dd = String(currentDate.getDate()).padStart(2, '0');
    let mm = String(currentDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = currentDate.getFullYear();
    currentDate = yyyy + '-' + mm + '-' + dd;
    document.getElementById(key).max = currentDate;
  };
  const handleInputBlur = (e) =>{
    let value = e.target.value;
    let o = {};
    o[key] = value;
    dispatch('onBlurInput', o);
  }
</script>

<style>
  label > span {
    color: #f44336;
  }

</style>

<div class={customclass}>
  <label
    for={key}>{displayLabel.length > 0 ? displayLabel : ''}
    {#if description.length > 0}
      <Tooltip text={description} bottom>
        <InfoIcon size="1.1x" class="plus-icon" />
      </Tooltip>
    {/if}
    {#if required}<span class="required">*</span>{/if}</label>
  <input
    {type}
    {name}
    {placeholder}
    {value}
    {max}
    {min}
    on:change={handleInputChange}
    on:blur={handleInputBlur}
    class={inputClass}
    {style}
    id={key}
    readonly={readOnly} />
</div>
