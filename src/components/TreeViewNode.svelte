<script>
  import Icon from './Icon.svelte';

  export let label;
  export let icon;
  export let level = 0;
  export let onClick;
  export let expandable = false;
  export let expanded = false;
</script>

<button data-key={label} on:click={onClick} style="padding-left: {(level * 2 + 1) * 0.25}rem">
  <div class="arrow">
    {#if expandable}
      <Icon id={expanded ? 'arrow-down' : 'arrow-right'} />
    {/if}
  </div>
  <div class="icon">
    <Icon id={icon} />
  </div>
  <span>{label}</span>
</button>

<style>
  button {
    display: block;
    background: transparent;
    width: 100%;
    height: 1.25rem;
    padding: 0;
    padding-left: 0.5rem;
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
  button:hover,
  button:focus {
    background-color: #303237;
    color: #fff;
  }
  button:focus {
    outline: none;
  }
  .icon {
    width: 1.25rem;
    height: 1.25rem;
    float: left;
    margin-right: 0.375rem;
  }
  .arrow {
    width: 1.25rem;
    height: 1.25rem;
    float: left;
  }
</style>
