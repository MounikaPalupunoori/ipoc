<script>
    import { getContext } from 'svelte';
    export let message;
    export let content;
    export let onCancel = () => {};
    export let onOkay = () => {};
  
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
      onCancel();
      close();
    }
     /**
     * @name _onOkay()
     * @description This function is called when user clicks on Okay button on the modal it closes the modal.
     * @example on:click={_onOkay}
     */
    function _onOkay() {
      onOkay(value);
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
      <div class="modal-body">
        {content}
    </div>
      <div class="modal-footer">
        <button type="button" on:click={_onCancel} class="btn btn-secondary">No</button>
        <button type="button" on:click={_onOkay} class="btn btn-primary">Yes</button>
      </div>
    </section>
  <!-- <div class="modal-header">
    <h4 class="modal-title" id="exampleModalLongTitle">{message}</h4>
  </div>
  
  <section>
    {content}
    <div class="buttons">
      <button on:click={_onCancel} class="btn btn-sm btn-secondary c-btn">
        No
      </button>
      <button on:click={_onOkay} class="btn btn-sm btn-primary c-btn">
        Yes
      </button>
    </div>
  </section> -->
  


  <!-- <div class="modal fade" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          ...
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div> -->