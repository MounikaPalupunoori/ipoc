<script>
  export let text;
  let menuEl;

  $: (() => {
    if (!menuEl) return;

    let tooltipParent = document.querySelectorAll('.tooltip-box');
    tooltipParent.forEach(function (ktooltip, index) {
      // For each ktooltip
      ktooltip.addEventListener('mouseover', position_tooltip); // On hover, launch the function below
    });

    function position_tooltip() {
      // Get tooltiptext-wrapper sibling
      let tooltip = this.parentNode.querySelector('.tooltip-wrapper');

      // Get calculated tooltip coordinates and size
      let ktooltip_rect = this.getBoundingClientRect();

      let tipX = ktooltip_rect.width; // right of the tooltip
      let tipY = 10; // the top of the tooltip
      // Position tooltip
      tooltip.style.top = tipY + 'px';
      tooltip.style.left = tipX + 'px';

      // Get calculated tooltip coordinates and size
      let tooltip_rect = tooltip.getBoundingClientRect();

      // Corrections if out of window
      if (tooltip_rect.x + tooltip_rect.width > window.innerWidth)
        // Out on the right
        tipX = -tooltip_rect.width - 5; // Simulate a "right: tipX" position
      if (tooltip_rect.y < 0)
        // Out on the top
        tipY = tipY - tooltip_rect.y; // Align on the top

      // Apply corrected position
      tooltip.style.top = tipY + 'px';
      tooltip.style.left = tipX + 'px';
    }
  })();
</script>

<style src="./style.scss">
</style>

<div class="tooltip-box">
  <slot />
  <div class="tooltip-wrapper" bind:this={menuEl}>
    <span class="text"> {text} </span>
  </div>
</div>
