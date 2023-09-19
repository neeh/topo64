<script>
  import Icon from './Icon.svelte';

  export let label;
  export let icon;
  export let level = 0;
  export let onClick;
  export let expandable = false;
  export let expanded = false;
</script>

<button class="item" data-key={label} on:click={onClick} style="padding-left: {(level * 2 + 1) * 0.25}rem">
  <div class="arrow">
    {#if expandable}
      <Icon id={expanded ? 'arrow-down' : 'arrow-right'} />
    {/if}
  </div>
  <div class="icon">
    <Icon id={icon} />
  </div>
  <div>{label}</div>
</button>

<style>
  .item {
    display: flex;
    background: transparent;
    width: 100%;
    height: 1.25rem;
    padding: 0 0.75rem;
    border: 0;
    margin: 0;
    color: #cfd0df;
    font: inherit;
    font-family: monospace;
    text-align: left;
    line-height: 1.25rem;
    white-space: nowrap;
    fill: currentcolor;
    cursor: pointer;
  }
  .item:hover,
  .item:focus {
    background-color: #282930;
    color: #fff;
  }
  .item:focus {
    outline: none;
  }
  .icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.375rem;
  }
  .arrow {
    width: 1.25rem;
    height: 1.25rem;
  }
</style>
