<script>
  import { onDestroy, onMount } from "svelte";
  let showConfirm, acceptConfirm, denyConfirm, confirmationMsg;
  const confirm = async (msg) =>
    new Promise((resolve, reject) => {
      confirmationMsg = msg;
      document.body.style.overflow = "hidden";
      showConfirm = true;
      acceptConfirm = () => {
        showConfirm = false;
        document.body.style.overflow = null;
        resolve(true);
      };
      denyConfirm = () => {
        showConfirm = false;
        document.body.style.overflow = null;
        resolve(false);
      };
    });

  function handleKeydown(event) {
    let key = event.key;
    if (showConfirm) {
      if (key === "Enter") {
        acceptConfirm();
      }
      if (key === "Escape") {
        denyConfirm();
      }
    }
  }
  onMount(() => {
    window.confirm = confirm;
  });
  onDestroy(() => {});
</script>

<svelte:window on:keydown={handleKeydown}/>
{#if showConfirm}
<div class="backdrop">
  <div class="bg">
    <div class="modal-header">
      <h4 class="modal-title" >Replace</h4>
    </div>
    <div class="modal-body">{confirmationMsg}</div>
    <div class="modal-footer">
      <button
        type="button"
        on:click={denyConfirm}
        class="btn btn-secondary">No</button>
      <button
        type="button"
        on:click={acceptConfirm}
        class="btn btn-primary">Yes</button>
    </div>
  </div>
</div>
{/if}

<style>
  .backdrop {
    background: rgba(0, 0, 0, 0.66);
    padding: 1rem;
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 10000;
  }
  .bg {
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    z-index: 10000;
    background: white;
  }
</style>
