<script>
  import Container from '@Components/Container/index.svelte';
  import FormField from '@Components/Shared/FormField/index.svelte';
  import Fa from 'svelte-fa';
  import { faAddressCard } from '@fortawesome/free-solid-svg-icons';
  import { onMount,getContext } from 'svelte';
  import { navigate } from 'svelte-routing';
  import { DashboardController } from '@Controller/DashboardController.js';
  import LoadingIndicator from '@Components/Shared/LoadingIndicator.svelte';
  import { selectedLinkState } from '@Store/Sidebar.js';
  import { toast } from '@zerodevx/svelte-toast';
  import AuditModal from '@Components/Shared/Modal/AuditModal.svelte';
  const { open } = getContext('simple-modal');
  const username = localStorage.getItem('userName');
  $: inputParameters = [
    {
      class: 'col-lg-7 col-sm-7 col-md-7 col mb-2',
      dataType: 'select',
      description: '',
      displayGroup: 'Generate and Print Barcodes',
      displayLabel: 'Template',
      displayOrder: 1,
      enumlist: [
        { label: 'Accession', value: 'ACCESSION' },
        { label: 'Sample', value: 'SAMPLE' },
        { label: 'Kit', value: 'KIT' },
      ],
      value: '',
      name: 'barcodeType',
      required: true,
      subjectAttributeValueId: null,
      visible: true,
      widgetType: 'dropdown',
    },
    {
      class: 'col-lg-5 col-sm-5 col-md-5 col mb-2',
      dataType: 'number',
      description: '',
      displayGroup: 'Generate and Print Barcodes',
      displayLabel: 'Quantity',
      displayOrder: 2,
      name: 'quantity',
      min:1,
      required: true,
      value: '',
      subjectAttributeValueId: null,
      visible: true,
      widgetType: 'number',
    },
  ];
  let enableAudit= true;
  let eSignatureModel = {
    username: username,
    password: '',
    changeReasonDetail: '',
  };
	let isAllFieldsetValid = {};
	let isAllFieldValid = false;
  let showOverlayLoader = false;
  let setActiveLink = {
      id: 2,
      name: 'Generate Barcode',
      displayName: "Generate Barcode",
      key: 'Generate_Barcode',
      isEnabled: true,
      parent:'barcode',
      isExpanded: false,
      isChildrenExpanded: true,
    };
  onMount(()=>{
    $selectedLinkState = setActiveLink
    getKitTemplateList();
  })
  const getKitTemplateList = async ()=>{
    try{
      let kitTemplateResponse = await DashboardController.getKitTemplates();
      if(kitTemplateResponse.statusCode == 200){
        let kitTemplates = kitTemplateResponse.data.kitTemplates;
        let enumList = kitTemplates.map(r => {
          return {
            label: r.displayLabel,
            value: r.kitTemplateId
          }
        })
        inputParameters[0].enumlist = enumList
      }else{
        throw Error(kitTemplateResponse.message);
      }
    }catch(e){
      console.log(e);
    }
  }
  /**
   * @name handlInputFields
   * @param inputFields
   * @returns
   * @description This handlInputFields is used to assign the data from form to the subject model array.
   * @example handlInputFields(e);
   */
  const handlInputFields = (inputFields) => {
    for (let i = 0; i < inputFields.length; i++) {
      let index = inputParameters.findIndex(
        (field) => field.name == inputFields[i].name
      );
      inputParameters[index].value = inputFields[i].value;
    }
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
      handlInputFields(inputFields);
    }
    // dispatch('isInputValid', e.detail);
  };

  const handleAlgoInputValue = () => {};
  /**
   * @name onOkayAuditClick
   * @description onclick of okay button on audit modal closes the modal box
   * @example  onOkayAuditClick();
   */
  const onOkayAuditClick = async (e) => {
    let { event } = e.detail;
    eSignatureModel = {
      username: e.username,
      password: e.password,
      changeReasonDetail: e.reason,
    };
    switch (e.section) {
      case 'createBarcode':
        handleGeneratePrint();
        break;
      default:
      // code block
    }
  };
  /**
   * @name onCancelAuditClick
   * @description onclick of close button on audit modal closes the modal box
   * @example  onCancelAuditClick();
   */
  const onCancelAuditClick = async (e) => {
    console.log(e);
  };
  const openAuditModal = (event, section) => {
    //disable toast
    toast.pop();
    open(
      AuditModal,
      {
        message: 'Electronic Signature',
        username: username,
        sectionEvent: event,
        auditsection: section,
        content: '',
        onCancelAuditClick,
        onOkayAuditClick,
      },
      {
        closeButton: true,
        closeOnEsc: false,
        closeOnOuterClick: true,
        styleCloseButton: {
          borderRadius: 0,
          boxShadow: 'none',
        },
        styleWindow: {
          borderRadius: '0.3rem!important',
          width: 'max-content!important',
          positon: 'relative!important',
          backgroundClip: ' padding-box',
          border: '1px solid rgba(0,0,0,.2)',
        },
        styleContent: {
          padding: '0px!important',
        },
      }
    );
  };
  /**
   * @name redirectToList
   * @param
   * @returns
   * @description This redirectToList is used to redirect to list.
   * @example redirectToList();
   */
  const redirectToList = () => {
    navigate('barcode/list', {
      replace: false,
    });
  };
  const onCancel = () => {};
  const handleBarcodePrint = () => {
    if(enableAudit){
      let event = {
        event: "",
      };
      openAuditModal(event, 'createBarcode');
    }else{
      handleGeneratePrint();
    }
  };
  const handleGeneratePrint = async () => {
    try{
      showOverlayLoader = true;
      let kitTemplateId = inputParameters[0].value.value;
      let quantity = inputParameters[1].value;
      let paramInfo = {
        "kitTemplateId": kitTemplateId,
        "quantity": parseInt(quantity)
      }
      let response = await DashboardController.generateBarCodes(paramInfo);
      if(response.statusCode == 200){
        handleGenrateBarCode(response.data.pdf);
        showOverlayLoader = false
      }else{
        throw Error(response.message);
        showOverlayLoader = false
      }
    }catch(e){
      console.log(e);
      throwInvalidFileError("Error generating barcodes.")
      showOverlayLoader = false
    }
  }

  const handleGenrateBarCode = (base64str) =>{
    var binary = atob(base64str.replace(/\s/g, ''));
    var len = binary.length;
    var buffer = new ArrayBuffer(len);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }
    // create the blob object with content-type "application/pdf"
    var blob = new Blob( [view], { type: "application/pdf" });
    var url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.target = "_blank";
    link.title = 'testing';
    // link.download = "Kit Barcode" + new Date() + ".pdf";
    link.click();
  }
  const throwInvalidFileError = (
    text
  ) => {
    toast.push(text, {
      theme: {
        '--toastBackground': '#F56565',
        '--toastProgressBackground': '#C53030',
      },
    });
  };
</script>

<style>
  .customButtonWidth {
    padding-left: 3.4em;
    padding-right: 3.4em;
  }
  .alignBtn{
    display: flex;
    height: 100%;
    margin-top: 1.8rem;
    align-items: center;
  }
</style>

<Container>
  <div class="study-list col">
  {#if showOverlayLoader}
    <LoadingIndicator text="" />
  {/if}
    <div class="card border-0">
      <div class="card-body p-0">
        <div class="row1">
          <fieldset class="col mt-2">
            <legend>{'Generate and Print Barcode'}</legend>
            <div class="row">
              <div class="col-10">
                <FormField
                  fieldset={'Generate and Print Barcode'}
                  col={'col-lg-4 col-sm-4 col-md-4 col mb-2'}
                  {inputParameters}
                  on:isAnalysisInputValid={handleAnalysisValid}
                  on:algoInputValue={handleAlgoInputValue} />
              </div>
              <div class="col-2 p-0 alignBtn">
                <button
                  style="display:block"
                  class="btn btn-sm btn-outline-primary rounded mb-0 mr-1"
									disabled={!isAllFieldValid}
                  on:click={handleBarcodePrint}>Generate & Print</button>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  </div>
</Container>
