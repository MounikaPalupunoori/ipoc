<script>
  import { getContext } from 'svelte';
  export let message;
  export let content;
  export let username;
  export let auditsection;
  export let sectionEvent;
  export let onCancelAuditClick = () => {};
  export let onOkayAuditClick = () => {};

  const { close } = getContext('simple-modal');
  let value;
  let onChange = () => {};
  let headerMsgObj = {
    createStudy: 'I am creating or editing Study',
    createUser: 'I am creating user',
    updateUser: 'I am updating user details',
    updateAssignApp: 'I am assigning application',
    createUserRole: 'I am assigning role to user',
    saveAttr:'I am creating attribute information',
    deleteAttr: 'I am deleting attribute information',
    deleteUserRole: 'I am deleting assigned role from user',
    deleteStudy: 'I am deleting study',
    deleteUser: 'I am deleting user',
    downloadEntity: 'I am downloading attribute information',
    downloadAudit: 'I am downloading audit report',
    createOrg: 'I am creating organization detail',
    editOrg: 'I am editing organization detail',
    removeOrg: 'I am removing organization detail',
    createAcl: 'I am creating or editing Access Control List',
    deleteAcl: 'I am deleting Access Control List',
    createExternalApp: 'I am creating External Application Details',
    editExternalApp: 'I am editing External Application Details',
    removeApplication : 'I am removing External Application Detail',
    createOrder: 'I am creating or editing order test',
    createOrderWithPrint: 'I am creating or editing order test with print',
    createUser: 'I am creating or editing patient information'
  };
  let headerMsg = 'I am modifying the image or image attribute values';
  $: fieldStatus = true;
  $: isValue = value;
  $: auditForm = {
    reason: '',
    section: auditsection,
    username: username,
    password: '',
  };
  $: {
    if (auditForm.reason.length > 5 && auditForm.password.length > 0) {
      fieldStatus = false;
    }
  }
  /**
   * @name _onCancel()
   * @description This function is called when user clicks on cancel button or the close button is clicked and closes the modal.
   * @example on:click={_onCancel}
   */
  function _onCancel() {
    onCancelClick();
    close();
  }
  const handleKeyPress = (e) => {
    if (e.charCode == 13) {
      _onOkay();
    }
  };
  /**
   * @name _onOkay()
   * @description This function is called when user clicks on Okay button on the modal it closes the modal.
   * @example on:click={_onOkay}
   */
  function _onOkay() {
    let param = Object.assign(auditForm, { detail: sectionEvent });
    onOkayAuditClick(param);
    close();
  }

  $: onChange(auditForm);
  const validateReason = () => {
    auditForm['reason'] = auditForm['reason'].trimStart();
  };
</script>

<style src="./style.scss">
</style>

<section>
  <div class="modal-header p-1">
    <h4 class="modal-title" id="exampleModalLongTitle">{message}</h4>
  </div>
  <div class="modal-body">
    <form action="">
      <section>
        <div class="form-group">
          <label for="formGroupExampleInput">Enter reason for this operation</label>
          <input
            type="text"
            class="form-control"
            id="formGroupExampleInput"
            pattern="[a-zA-Z0-9]+" minlength="4"
            bind:value={auditForm.reason}
            on:keyup={validateReason}
            placeholder="Enter reason for this operation" autofocus  />
        </div>
      </section>
      <hr class="my-1 pb-2">
      <h6 class="pb-2">{headerMsgObj.hasOwnProperty(auditsection) ? headerMsgObj[auditsection] : headerMsg}</h6>
      <div class="form-row">
        <div class="col-md-6 mb-6">
          <label for="validationAuditUsername">Username</label>
          <input type="text" class="form-control username" tabindex="-1" bind:value={auditForm.username} id="validationAuditUsername" placeholder="Username" required readonly="readonly">
        </div>
        <div class="col-md-6 mb-6">
          <label for="validationAuditPassword">Password</label>
          <input type="password" class="form-control" id="validationAuditPassword" on:keypress={handleKeyPress} bind:value={auditForm.password} placeholder="Password" required>
        </div>
      </div>
    </form>  
  </div>
  <div class="modal-footer p-1">
    <!-- <button
      type="button"
      on:click={_onCancel}
      class="btn btn-secondary"></button> -->
    <button
      type="button"
      disabled={fieldStatus}
      on:click={_onOkay}
      class="btn btn-sm pull-right icoreblue-btn-bg m-1">Submit</button>
  </div>
</section>
