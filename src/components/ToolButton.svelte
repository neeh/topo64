<script>
  import Icon from './Icon.svelte';

  export let active = false;
  export let icon;
  export let title;
  export let key;
  export let onclick;
</script>

<button class={active ? "active" : ""} title={title} on:click={onclick}>
  <Icon id="{icon}"/>
  <span>{key}</span>
</button>

<style>
  button {
    background-color: #404248;
    width: 3rem;
    height: 3rem;
    padding: 0;
    border: 1px solid #181a1f;
    border-radius: 0.25rem;
    position: relative;
    color: #bcbcbf;
    cursor: pointer;
    fill: #fcfcff;
  }

  button:hover {
    background-color: #50525a;
    color: #fff;
  }

  button.active {
    /* background-color: #307677; */
    background-color: #4d78cc;
    fill: #fff;
    color: #fff;
    background-color: #a03000;
    fill: #101010;
    color: #101010;
  }

  button.active:hover {
    background-color: #557ecf;
    color: #fff;
  }

  span {
    position: absolute;
    bottom: 2px;
    right: 4px;
    font-size: 0.7rem;
  }
</style>
