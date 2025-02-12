<script>
  import { createEventDispatcher } from 'svelte';
  import RangeSlider from 'svelte-range-slider-pips';
  const dispatch = createEventDispatcher();
  export let componentConfig;
  export let cutsomClass = '';
  let columnVal = componentConfig.hasOwnProperty('defaultValue')
    ? componentConfig.defaultValue
    : 0;
  $: columnThresholdValue = [columnVal];
  const columnInput = (e) => {
    columnVal = columnThresholdValue[0];
  };
  const colInputValues = (e) => {
    if (
      columnVal > componentConfig.max &&
      e.keyCode !== 46 && // keycode for delete
      e.keyCode !== 8 // keycode for backspace
    ) {
      e.preventDefault();
      columnVal = 1;
    }
    let selectedValObj = {
      [componentConfig.name]:componentConfig.name ? componentConfig.name : '',
      fieldName: componentConfig.name ? componentConfig.name : '',
      name: componentConfig.name ? componentConfig.name : '',
      selectedValue: columnVal,
    };
    dispatch('enteredData', selectedValObj);
  };
  const handleStopSlider = () => {
    let selectedValObj = {
      [componentConfig.name]:componentConfig.name ? componentConfig.name : '',
      fieldName: componentConfig.name ? componentConfig.name : '',
      name: componentConfig.name ? componentConfig.name : '',
      selectedValue: columnVal,
    };
    dispatch('enteredData', selectedValObj);
  };
</script>

<style>
  .inputVal {
    border-radius: 0.25rem;
    padding: 2px 5px;
    margin: 0;
    width: 60px;
  }
  .zIndex{
    z-index: 0;
  }
</style>

{#if componentConfig && componentConfig.label}
  <label for={componentConfig.elementId}>{componentConfig.label}</label>
{/if}
<div class={`form-control d-flex justify-content-center px-0 ${cutsomClass}`}>
  <div class="w-75 range-slider zIndex ">
    <RangeSlider
      id={componentConfig.elementId}
      all="label"
      bind:values={columnThresholdValue}
      on:change={columnInput}
      on:start={columnInput}
      float
      min={componentConfig.min}
      max={componentConfig.max}
      step={componentConfig.step}
      on:stop={handleStopSlider} />
  </div>

  <div class="d-flex align-items-center justify-content-center">
    <input
      class="inputVal m-1"
      type="number"
      min={componentConfig.min}
      max={componentConfig.max}
      step={componentConfig.step}
      bind:value={columnVal}
      on:keyup={colInputValues}
      on:change={colInputValues} />
  </div>
</div>
