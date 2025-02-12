<script>
  import Container from '@Components/Container/index.svelte';
  import Fa from 'svelte-fa';
  import { faBarcode } from '@fortawesome/free-solid-svg-icons';
  import { navigate } from 'svelte-routing';

  let isError = false;
  let errorMsg = '';
  const hideMessage = () => {};
  const routeToGenerateBarcode = () => {
    navigate(`barcode/generate`, {
      replace: false,
    });
  };

</script>

<Container>
  <section>
    {#if isError}
      <div class="alert alert-danger py-3 px-2 mb-2" role="alert">
        {errorMsg}
        <button
          type="button"
          class="close"
          data-dismiss="alert"
          aria-label="Close"
          on:click={hideMessage}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    {/if}
    <div class="col-xs-12 col-lg-12-col-sm-12">
      <div class="create-patient-button card mt-2">
        <div class="card-body p-0 m-0 float-right">
          <button
            type="button"
            on:click={() => routeToGenerateBarcode()}
            class="btn btn-sm btn-outline-primary float-right m-2">
            <span class="mr-1"><Fa icon={faBarcode} scale={1.0} /></span>
            <span>Generate Barcode</span></button>
        </div>
      </div>
    </div>
    <div class="col-xs-12 col-lg-12-col-sm-12">
      <div class="card jobs-list mt-2 border-0">
        <div class="card-header p-1 m-0 border rounded">Barcode List</div>
        <!-- {#if showOrderList && !loading}
          <div class="card-body p-0 pt-1 mt-1">
            <div class="jobs_wrapper">
              <ServerTableWrapper
                config={orderListConfig}
                on:pageChange={onPageChange}
                imputationSearch={true}
                on:onSearch={onSearchEnter}
                on:editTest={handleEditTest} />
            </div>
          </div>
        {:else if loading}
          <div class="loader_container my-4">
            <DoubleBounce size="100" color="#2b93fb" unit="px" />
          </div>
        {/if} -->
      </div>
    </div>
  </section>
</Container>
