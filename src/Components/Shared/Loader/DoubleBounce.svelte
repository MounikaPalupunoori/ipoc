<script>
  import { range } from './utils';
  export let size = 60;
  export let color = '#FF3E00';
  export let unit = 'px';
</script>

<style>
  .wrapper {
    position: relative;
    width: var(--size);
    height: var(--size);
  }
  .circle {
    position: absolute;
    width: var(--size);
    height: var(--size);
    background-color: var(--color);
    border-radius: 100%;
    opacity: 0.6;
    top: 0;
    left: 0;
    animation-fill-mode: both;
    animation-name: bounce !important;
  }
  @keyframes bounce {
    0%,
    100% {
      transform: scale(0);
    }
    50% {
      transform: scale(1);
    }
  }
</style>

<div class="wrapper" style="--size: {size}{unit}; --color: {color}">
  {#each range(2, 1) as version}
    <div
      class="circle"
      style="animation: 2.1s {version === 1 ? `1s` : `0s`} infinite ease-in-out" />
  {/each}
</div>
