<script>
  import { getContext } from 'svelte';
  export let message;
  export let content;
  export let onCancelClick = () => {};
  export let onOkayClick = () => {};

  const { close } = getContext('simple-modal');

  let value;
  let onChange = () => {};
  $: isValue = value;
  /**
   * @name _onCancel()
   * @description This function is called when user clicks on cancel button or the close button is clicked and closes the modal.
   * @example on:click={_onCancel}
   */
  function _onCancel() {
    onCancelClick();
    close();
  }
  /**
   * @name _onOkay()
   * @description This function is called when user clicks on Okay button on the modal it closes the modal.
   * @example on:click={_onOkay}
   */
  function _onOkay() {
    onOkayClick(value);
    close();
  }

  $: onChange(value);
</script>

<style src="./style.scss">
</style>

<section>
  <div class="modal-header">
    <h5 class="modal-title" id="exampleModalLongTitle">{message}</h5>
  </div>
  <div class="modal-body">{content}</div>
  <div class="modal-footer">
    <button
      type="button"
      on:click={_onCancel}
      class="btn btn-secondary">No</button>
    <button
      type="button"
      on:click={_onOkay}
      class="btn btn-primary">Yes</button>
  </div>
</section>
