<script>
  export let content = 'chart detail';
  export let top = false;
  export let right = false;
  export let bottom = false;
  export let left = false;
  let randomNum = Math.floor(Math.random() * 1000000 + 1);
  let tooltipWrapperId = `tooltipWrapper${randomNum}`;
  let tooltipId = `toolTip${randomNum}`;
  let direction = top ? 'top' : right ? 'right' : bottom ? 'bottom' : 'left';
  function handleEvent() {
    let wrapperDimensions = getDimensions(`#${tooltipWrapperId}`);
    let tooltipDimensions = getDimensions(`#${tooltipId}`);
    let toolTipEle = document.getElementById(tooltipId);
    if (direction === 'top') {
      top = 'top';
      toolTipEle.style.bottom = `${wrapperDimensions.height + 3}px`;
      toolTipEle.style.left = `${
        (wrapperDimensions.width - tooltipDimensions.width) / 2
      }px`;
    } else if (direction === 'right') {
      right = 'right';
      toolTipEle.style.left = `${wrapperDimensions.width + 3}px`;
      toolTipEle.style.top = `${
        (wrapperDimensions.height - tooltipDimensions.height) / 2
      }px`;
    } else if (direction === 'bottom') {
      bottom = 'bottom';
      toolTipEle.style.top = `${wrapperDimensions.height + 3}px`;
      toolTipEle.style.left = `${
        (wrapperDimensions.width - tooltipDimensions.width) / 2
      }px`;
    } else if (direction === 'left') {
      left = 'right';
      toolTipEle.style.right = `${wrapperDimensions.width + 3}px`;
      toolTipEle.style.top = `${
        (wrapperDimensions.height - tooltipDimensions.height) / 2
      }px`;
    }
  }
  function getDimensions(el) {
    el = typeof el === 'string' ? document.querySelector(el) : el;
    var styles = window.getComputedStyle(el);
    var marginVertical =
      parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);
    var marginHorizontal =
      parseFloat(styles['marginLeft']) + parseFloat(styles['marginBottom']);

    return {
      height: Math.ceil(el.offsetHeight + marginVertical),
      width: Math.ceil(el.offsetWidth + marginHorizontal),
    };
  }
</script>

<style src="./style.scss">
</style>

<div id={tooltipWrapperId} class="tooltip-wrapper" on:mousemove={handleEvent}>
  <span class="tooltip-slot">
    <slot />
  </span>
  <div
    id={tooltipId}
    class="tooltip"
    class:left
    class:right
    class:bottom
    class:top>
    {#if content}
      {content}
    {:else}
      <slot name="custom-tip" />
    {/if}
  </div>
</div>
