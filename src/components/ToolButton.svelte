<script>
  import Icon from './Icon.svelte';

  export let active = false;
  export let icon;
  export let title;
  export let key;
</script>

<button class={active ? "active" : ""} title={title}>
  <span>{key}</span>
  <Icon id="{icon}"/>
</button>

<style>
  button {
    background-color: #404248;
    width: 3rem;
    height: 3rem;
    border: 1px solid #181a1f;
    border-radius: 3px;
    position: relative;
    color: #bcbcbf;
    cursor: pointer;
    fill: #fcfcff;
  }

  .active {
    background-color: #4d78cc;
    fill: #fff;
    color: #fff;
  }

  span {
    position: absolute;
    bottom: 2px;
    right: 4px;
    font-size: 0.7rem;
  }
</style>
