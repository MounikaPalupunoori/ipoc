<script>
  import { onMount, createEventDispatcher, afterUpdate } from 'svelte';
  import FormField from '@Components/Shared/FormField/index.svelte';
  export let label;
  export let inputParams;
  export let index;
  export let tabId;
  //reactive variable
  $: specimenTestsMapping = [];
  $: sampleTypeSpecimenList = [];
  $: sampleTypeSpecimenObj = {};
  $: orderTestModel = {};
  //local variable
  const dispatch = createEventDispatcher();
  let nonMutableInputParams = JSON.parse(JSON.stringify(inputParams));
  let fieldsetinputparams = {};
  let isAllFieldsetValid = {};
  let orderTestSampleObj = {};
  let sampleTypeSpecimentTestMapping = {};
  let isAllFieldValid = false;
  let sampleInputs = {};
  let prevSampleTypeValue = '';
  let sampleTestsObject = {};
  $: {
    if (specimenTestsMapping) {
      createSpecimenObj();
    }
    if (orderTestModel) {
      createSampletests();
    }
  }
  afterUpdate(() => {});
  onMount(() => {
    sampleTypeSpecimenList = JSON.parse(
      localStorage.getItem('sampleSpecimenMapping')
    );
    specimenTestsMapping = JSON.parse(
      localStorage.getItem('specimenTestsMapping')
    );
    orderTestModel = JSON.parse(localStorage.getItem('orderTestModel'));
    handleTabInputs();
  });
  const createSampletests = () => {
    sampleTestsObject = orderTestModel?.subject?.samples
      ?.filter((r) => {
        return r.tabId == tabId;
      })
      .reduce((a, d) => {
        if (d?.tests?.length > 0) {
          a[tabId] = d.tests;
        }
        return a;
      }, {});
  };
  const createSpecimenObj = () => {
    if (specimenTestsMapping) {
      sampleTypeSpecimentTestMapping = specimenTestsMapping.reduce(
        (acc, data) => {
          let key = `${data.sampleType}_${data.specimen}`;
          acc[key] = data.tests;
          return acc;
        },
        {}
      );
    }
  };
  const handleTabInputs = () => {
    if (orderTestModel?.subject?.samples) {
      orderTestSampleObj = orderTestModel.subject.samples.reduce((a, d) => {
        a[d.tabId] = d;
        return a;
      }, {});
    }
    if (orderTestSampleObj.hasOwnProperty(tabId)) {
      inputParams = orderTestSampleObj[tabId].attributes;
      let sampleTypeValue = '';
      let specimenTypeValue = '';
      for (let i = 0; i < inputParams.length; i++) {
        if (inputParams[i].name == 'sample_type') {
          sampleTypeValue = inputParams[i]?.value?.value;
        } else if (inputParams[i].name == 'specimen') {
          specimenTypeValue = inputParams[i]?.value?.value;
        }
      }
    }
    if (sampleTypeSpecimenList) {
      sampleTypeSpecimenObj = sampleTypeSpecimenList.reduce((a, d) => {
        if (a.hasOwnProperty(d.sampleType)) {
          a[d.sampleType].push({ label: d.specimen, value: d.specimen });
        } else {
          a[d.sampleType] = [{ label: d.specimen, value: d.specimen }];
        }
        return a;
      }, {});
    }
    handleSampleInputs();
  };
  const handleSampleInputs = () => {
    fieldsetinputparams = inputParams.reduce((a, d) => {
      if (a.hasOwnProperty(d?.displayGroup)) {
        sampleInputs[d.displayGroup].push(d);
        a[d.displayGroup].push(d);
      } else {
        sampleInputs[d.displayGroup] = [d];
        isAllFieldsetValid[d.displayGroup] = false;
        a[d.displayGroup] = [d];
      }
      return a;
    }, {});
    fieldsetinputparams.Sample.forEach((sample, i) => {
      if (sample.name === 'sample_barcode') {
        fieldsetinputparams.Sample[i].value =
          fieldsetinputparams?.Sample[i]?.value !== ''
            ? fieldsetinputparams?.Sample[i]?.value
            : orderTestModel?.subject?.samples[index]?.sampleBarcode?.value;
      }
    });
    fieldsetinputparams = fieldsetinputparams;
  };
  const handleAnalysisValid = (e) => {
    let { validInput, fieldset, inputFields } = e.detail;
    isAllFieldsetValid[fieldset] = validInput;
    let checkFieldValidity = Object.keys(isAllFieldsetValid).filter(
      (r) => !!isAllFieldsetValid[r]
    );
    isAllFieldValid =
      checkFieldValidity.length == Object.keys(isAllFieldsetValid).length;
    if (validInput) {
      //handlInputFields(inputFields);
    }
    sampleInputs[fieldset] = inputFields;
    let o = {};
    o['label'] = label;
    o['inputs'] = sampleInputs;
    o['tabId'] = tabId;
    o['validInput'] = validInput;
    o['fieldset'] = fieldset;
    o['inputFields'] = inputFields;
    dispatch('tabInputChange', o);
  };
  const handlInputFields = (inputFields) => {
    for (let i = 0; i < inputFields.length; i++) {
      let index = inputParams.findIndex(
        (field) => field.name == inputFields[i].name
      );
      if (inputParams[index]) {
        inputParams[index].value = inputFields[i].value;
      }
    }
  };
  /**
   * @name handleAlgoInputValue
   * @param
   * @returns
   * @description This handleAlgoInputValue method help to handle sample input changes
   * @example handleAlgoInputValue();
   */
  const handleAlgoInputValue = (e, param) => {
    let sampleInputObj = e.detail.reduce((a, d) => {
      a[d.name] = d;
      return a;
    }, {});
    let sampleTestObj = sampleTestsObject[tabId]?.reduce((a, d) => {
      a[d.displayLabel] = d.value;
      return a;
    }, {});
    let inputDetail = e.detail;
    let sampleTypeValue = '';
    let specimenValue = '';
    let isSampleInput = inputDetail.forEach((r) => {
      if (r.name == 'sample_type') {
        sampleTypeValue = r?.value?.value;
      } else if (r.name == 'specimen') {
        specimenValue = r?.value?.value;
      }
    });
    let selectedSampleTypeSpecimenTypeTests = [];
    if (sampleTypeValue?.length > 0 && specimenValue?.length > 0) {
      let key = `${sampleTypeValue}_${specimenValue}`;
      selectedSampleTypeSpecimenTypeTests = sampleTypeSpecimentTestMapping[key];
    }
    let tempInputParams = nonMutableInputParams.map((r) => {
      if (r.name == 'specimen' && param == 'Sample') {
        if (sampleTypeSpecimenObj.hasOwnProperty(sampleTypeValue)) {
          r.enumlist = sampleTypeSpecimenObj[sampleTypeValue];
          if(specimenValue){
            r.value = r.enumlist.find(a=>a.value == specimenValue);   
          }else{
            r.value = r.enumlist[0];
          }
        }
      } else if (sampleInputObj.hasOwnProperty(r.name) && param == 'Sample') {
        r.value = sampleInputObj[r.name].value;
      }
      return r;
    });
    if (selectedSampleTypeSpecimenTypeTests?.length > 0 && param == 'Sample') {
      inputParams = [
        ...tempInputParams,
        ...selectedSampleTypeSpecimenTypeTests,
      ].map((r) => {
        if (sampleTestObj && sampleTestObj.hasOwnProperty(r.displayLabel)) {
          r.value = sampleTestObj[r.displayLabel];
        }
        return r;
      });
    } else if (param == 'Sample') {
      let currentSampleType = '';
      tempInputParams.forEach((input, i) => {
        if (input.name == 'sample_type') {
          currentSampleType = input?.value?.value;
        }
        if (input.name == 'specimen') {
          if (prevSampleTypeValue != currentSampleType) {
            //tempInputParams[i].value = { label: '', value: '' };
            tempInputParams[i].value = null;
            prevSampleTypeValue = currentSampleType;
          }
        }
      });
      inputParams = [...tempInputParams];
    }
    handleSampleInputs();
    let o = {};
    o['label'] = label;
    o['inputs'] = sampleInputs;
    o['tabId'] = tabId;
    dispatch('tabInputChange', o);
  };

</script>

<section class="p-1">
  {#each Object.keys(fieldsetinputparams) as param}
    <fieldset class="col mt-2 mb-2">
      <legend>{param}</legend>
      <FormField
        fieldset={param}
        col={'col-4 mt-1'}
        inputParameters={fieldsetinputparams[param]}
        on:isAnalysisInputValid={handleAnalysisValid}
        on:algoInputValue={(e) => handleAlgoInputValue(e, param)} />
    </fieldset>
  {/each}
</section>
