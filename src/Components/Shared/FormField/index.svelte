<script>
  import { onMount, afterUpdate, createEventDispatcher } from 'svelte';
  import { InfoIcon } from 'svelte-feather-icons';
  import { DashboardController } from '@Controller/DashboardController.js';
  import Input from '@Components/Shared/Input.svelte';
  import Tooltip from '@Components/Shared/Tooltip/Tooltip.svelte';
  import RangeSlider from '@Components/Shared/SliderRange/index.svelte';
  import IcoreDropdown from '@Components/Shared/IcoreDropdown';
  export let inputParameters;
  export let fieldset = '';
  export let col = 'col p-1';
  $: diabloInputParameters = [];
  $: diabloOption = 1;
  $: selectedDropDownField = {};
  let errorMessage = {};
  const dispatch = createEventDispatcher();
  afterUpdate(() => {
    validatedAlgoInput();
    getDropdownValues();
  });
  const handleInputValue = (e, algoOption = 'all', inputField = null) => {
    let selectedField =
      e?.target === null ? Object.keys(e.detail)[0] : e?.target?.name;
    let index = inputParameters.findIndex((res) => {
      return res.name == selectedField;
    });
    let val =
      e.target === null ? e.detail[Object.keys(e.detail)[0]] : e.target.value;
    if (inputParameters[index]?.dataType === 'Array') {
      inputParameters[index].value.push(val);
    } else if (inputParameters[index]?.dataType === 'boolean') {
      inputParameters[index].value =
        val && val.toLowerCase() === 'true' ? true : false;
    } else if (inputParameters[index]?.dataType === 'select') {
      inputParameters[index].value = { value: val };
    } else if (inputParameters[index]?.widgetType === 'slider') {
      inputParameters[index].value = e.detail.selectedValue;
    } else if (inputParameters[index]?.dataType === 'json') {
      inputParameters[index].value = val;
    } else if (inputParameters.hasOwnProperty(index)) {
      inputParameters[index].value = val;
    }
    validatedAlgoInput();
    dispatch('algoInputValue', [...inputParameters, ...diabloInputParameters]);
  };
  const handleDropdownInput = (e, paramName) => {
    if (paramName == 'SAMPLE_TYPE') {
      if (document.querySelector('.SPECIMEN .clearSelect')) {
        // document.querySelector('.SPECIMEN .clearSelect').click();
      }
    }
    let selectedField = paramName;
    let index = inputParameters.findIndex((res) => {
      return res.name == selectedField;
    });
    if (e.detail) {
      if (inputParameters[index]?.widgetType == 'dropdown') {
        selectedDropDownField[paramName] = e.detail;
        inputParameters[index].value = e.detail;
        getAttributeNameField(e, paramName, inputParameters[index]);
      } else if (inputParameters[index]?.widgetType == 'multiselect-dropdown') {
        inputParameters[index].value = e.detail.map((r) => {
          return r;
        });
        selectedDropDownField[paramName] = inputParameters[index].value;
      }
    } else {
      if (inputParameters[index]?.widgetType == 'dropdown') {
        selectedDropDownField[paramName] = null;
        inputParameters[index].value = null;
      } else if (inputParameters[index]?.widgetType == 'multiselect-dropdown') {
        selectedDropDownField[paramName] = [];
        inputParameters[index].value = [];
      }
    }
    validatedAlgoInput();
    dispatch('algoInputValue', inputParameters);
  };
  const getAttributeNameField = async (e, paramName, selectedInputParam) => {
    let param = {
      dataSetId: null,
      attributeName: null,
      type: null,
    };
    let index = inputParameters.findIndex(
      (res) => res?.name == selectedInputParam.linkedParam
    );
    if (index != -1) {
      let dfTypeIndex = inputParameters.findIndex(
        (res) => res?.name == inputParameters[index].linkedParam
      );
      if (dfTypeIndex != -1) {
        param.type = inputParameters[index]?.value;
        param.dataSetId = [inputParameters[dfTypeIndex]?.value[0]?.datasetId];
        param.attributeName = selectedInputParam?.value?.value;
      }
      let dfattrIndex = inputParameters.findIndex(
        (res) => res.linkedParam == paramName
      );
      if (param.type && param.dataSetId && param.attributeName) {
        let response = await getAttributeNameValue(param);
        if (
          response &&
          Object.keys(response)?.length > 0 &&
          dfattrIndex != -1
        ) {
          let enumList = response[param.dataSetId].attributeNameValues;
          setInputFieldValue(dfattrIndex, enumList, []);
        } else {
          setInputFieldValue(dfattrIndex, [], []);
        }
      }
    }
  };
  const setInputFieldValue = (index, enumlist, value) => {
    inputParameters[index].value = value?.length > 0 ? value : '';
    inputParameters[index].enumlist = enumlist;
  };
  const getAttributeNameValue = async (param) => {
    try {
      let response = await DashboardController.getAttributeNameValue(param);
      return response;
    } catch (e) {
      console.log(e);
    }
  };
  const validatedAlgoInput = () => {
    let filteredInputParam = inputParameters.filter((res) => res.visible);
    let validInput = true;
    for (let i = 0; i < filteredInputParam.length; i++) {
      // Check for data type and data
      if (filteredInputParam[i].dataType == 'number') {
        if (filteredInputParam[i].value && isNaN(filteredInputParam[i].value)) {
          validInput = false;
          break;
        }
      } else if (filteredInputParam[i].dataType == 'boolean') {
        if (
          filteredInputParam[i].value &&
          typeof filteredInputParam[i].value != 'boolean'
        ) {
          validInput = false;
          break;
        }
      } else if (filteredInputParam[i].required) {
        // Check for required fields
        if (filteredInputParam[i]?.dataType === 'select') {
          if (!filteredInputParam[i]?.value?.value) {
            validInput = false;
            break;
          } else {
            validInput = true;
          }
        }
        if (
          !filteredInputParam[i]?.value ||
          Object.values(filteredInputParam[i]?.value)?.length == 0
        ) {
          validInput = false;
          break;
        }
      }
    }
    if (Object.keys(errorMessage).length > 0) {
      validInput = false;
    }
    let o = {};
    o['validInput'] = validInput;
    o['fieldset'] = fieldset;
    o['inputFields'] = inputParameters;
    dispatch('isAnalysisInputValid', o);
  };
  const handleCheckboxVal = (e, parameter) => {
    dispatch('algoInputValue', inputParameters);
  };
  const getDropdownValues = () => {
    for (let i = 0; i < inputParameters.length; i++) {
      let widgetType = ['dropdown', 'multiselect-dropdown'];
      if (
        widgetType.includes(inputParameters[i]?.widgetType) &&
        inputParameters[i]?.value?.value !== ''
      ) {
        selectedDropDownField[inputParameters[i].name] =
          inputParameters[i].value;
      }
    }
  };
  const handleBlurInput = (e) => {
    let key = Object.keys(e.detail)[0];
    if (key === 'email_id') {
      let regEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let val = e.detail[key];
      if (val !== '' && !regEmail.test(val)) {
        errorMessage[key] = 'Please enter a valid email address';
      } else {
        delete errorMessage[key];
      }
    } else if (key === 'phone' || key === 'mobile' || key ==="zipcode" || key === "alternate_number") {
      let val = e.detail[key];
      if (val !== '' && isNaN(val)) {
        errorMessage[key] = key.split('').includes("_") ? `Please enter a valid ${key.replaceAll('_', ' ').toLowerCase()}`:`Please enter a valid ${key} no.`;
      } else {
        delete errorMessage[key];
      }
    }else if (key === 'physician_name' || key==="first_name" || key==="middle_name" || key==="last_name") {
      let val = e.detail[key];
      let regName = /^([^0-9]*)$/
      if (val !== '' && !regName.test(val)) {
        errorMessage[key] = `Please enter a valid ${key.replaceAll('_', ' ')}.`;
      } else {
        delete errorMessage[key];
      }
    }else if (key === 'quantity') {
      let val = e.detail[key];
      if (val !== '' && val <= 0) {
        errorMessage[key] = `Please enter a valid ${key}.`;
      } else {
        delete errorMessage[key];
      }
    }
    errorMessage = errorMessage;
    validatedAlgoInput();
  };
  const getCheckboxChecked = (value) => {
    return ['true', true].includes(value);
  };

</script>

<style>
  .rangeSlider.pip-labels {
    margin-top: 10px !important;
  }
  .col {
    min-width: 20em;
  }
  .algo-checkbox {
    margin-left: 0.8em !important;
    margin-top: 1em !important;
  }
  .diablo-col {
    min-width: 20px;
    width: 20px;
    max-width: 50px;
    justify-content: center;
    align-items: center;
    display: flex;
  }
  .error {
    font-size: 0.8em;
    color: rgba(220, 53, 69, 1);
    margin-top: 0.25em;
  }

</style>

<section class="row">
  {#each inputParameters as parameter, i}
    {#if parameter.visible}
      {#if (parameter.widgetType == 'dropdown' || parameter.widgetType == 'multiselect-dropdown') && parameter.type !== 'slider'}
        <div
          class={parameter?.class ? parameter?.class : col}
          class:disabled={diabloOption == '2'}>
          <IcoreDropdown
            className={'mw-22 rounded'}
            name={parameter?.name}
            label={parameter?.displayLabel}
            options={parameter?.enumlist}
            isMultiple={parameter.widgetType == 'multiselect-dropdown'}
            placeholder="Select {parameter?.displayLabel}"
            isSearchable={true}
            readOnly={parameter?.readOnly}
            isRequiredField={!parameter.required}
            isClearable={true}
            paddingClass={'p-0 m-0 ' + parameter?.name}
            selectedValue={selectedDropDownField[parameter.name]}
            on:getSeletedOptions={(e) => handleDropdownInput(e, parameter.name)} />
        </div>
      {:else if parameter.widgetType == 'checkbox'}
        <div
          class={parameter?.class ? parameter?.class : col}
          class:disabled={diabloOption == '2'}>
          <div class="d-flex align-items-center flex-wrap">
            <input
              type="checkbox"
              id={`${parameter.name}_${i + 1}`}
              name={`${parameter.displayLabel}_${i + 1}`}
              description={parameter?.description}
              bind:checked={parameter.value}
              on:change={(e) => handleCheckboxVal(e, parameter)} />
            <label
              style="display:inline-block"
              class="ml-1 m-0 p-0"
              for={parameter.name}>{parameter.displayLabel}
              {#if parameter?.description.length > 0}
                <Tooltip text={parameter?.description} bottom>
                  <InfoIcon size="1.1x" class="plus-icon" />
                </Tooltip>
              {/if}
              {#if parameter.required}
                <span class="required">*</span>
              {/if}</label>
          </div>
        </div>
      {:else if parameter.widgetType == 'slider'}
        <div
          class={parameter?.class ? parameter?.class : col}
          class:disabled={diabloOption == '2'}>
          <label for="cutoff" class="form-label">{parameter.displayLabel}
            <Tooltip text={parameter?.description} bottom>
              <InfoIcon size="1.1x" class="plus-icon" />
            </Tooltip>
            {#if parameter.required}<span class="required">*</span>{/if}
          </label>
          <RangeSlider
            cutsomClass={`rounded form-control no-border`}
            componentConfig={{ name: parameter.name, elementId: parameter.name, defaultValue: parseFloat(parameter.min), min: parseFloat(parameter.min), max: parseFloat(parameter.max), label: '', step: parameter?.step ? parseFloat(parameter.step) : parseFloat(parameter.max / 100) }}
            on:enteredData={handleInputValue} />
        </div>
      {:else if parameter.widgetType == 'datetime'}
        <div
          class={parameter?.class ? parameter?.class : col}
          class:disabled={diabloOption == '2'}>
          <Input
            name={parameter.name}
            type={'datetime-local'}
            value={parameter.value}
            readOnly={parameter?.readOnly}
            description={parameter?.description}
            placeholder="Enter {parameter?.displayLabel}"
            key={parameter.name}
            customclass={'full-width'}
            max={new Date().toISOString().slice(0, -5)}
            inputClass={errorMessage && errorMessage.hasOwnProperty( [parameter.name] ) ? 'form-control is-invalid ' : 'form-control'}
            required={parameter.required}
            displayLabel={parameter.displayLabel}
            on:valueInput={handleInputValue}
            on:onBlurInput={handleBlurInput} />
          {#if errorMessage && errorMessage.hasOwnProperty([parameter.name])}
            <div class="error">{errorMessage[parameter.name]}</div>
          {/if}
        </div>
      {:else if parameter.widgetType == 'textarea'}
        <div
          class={parameter?.class ? parameter?.class : col}
          class:disabled={diabloOption == '2'}>
          <div class="full-width">
            <label for="parameter.name">{parameter?.displayLabel}</label>
            <textarea
              class="form-control"
              id={parameter.name}
              rows="3"
              name={parameter.name}
              on:change={handleInputValue}
              placeholder="Enter {parameter?.displayLabel}">{parameter.value}</textarea>
          </div>
        </div>
      {:else}
        <div
          class={parameter?.class ? parameter?.class : col}
          class:disabled={diabloOption == '2'}>
          <Input
            name={parameter.name}
            type={parameter.dataType}
            value={parameter.value}
            readOnly={parameter?.readOnly}
            description={parameter?.description}
            min={parameter?.min}
            placeholder="Enter {parameter?.displayLabel}"
            key={parameter.name}
            customclass={'full-width'}
            inputClass={errorMessage && errorMessage.hasOwnProperty( [parameter.name] ) ? 'form-control is-invalid ' : 'form-control'}
            required={parameter.required}
            displayLabel={parameter.displayLabel}
            on:valueInput={handleInputValue}
            on:onBlurInput={handleBlurInput} />
          {#if errorMessage && errorMessage.hasOwnProperty([parameter.name])}
            <div class="error">{errorMessage[parameter.name]}</div>
          {/if}
        </div>
      {/if}
    {/if}
  {/each}
</section>
