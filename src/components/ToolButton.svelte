<script>
  import Icon from './Icon.svelte';

  export let active = false;
  export let icon;
  export let title;
  export let key;
  export let onclick;
</script>

<button class={active ? "active" : ""} title={title + ` [Press ${key}]`} on:click={onclick}>
  <Icon id="{icon}"/>
  <span>{key}</span>
</button>

<style>
  button {
    background-color: #303236;
    box-sizing: content-box;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    border: 1px solid #181a1f;
    border-radius: 0.25rem;
    position: relative;
    color: #bcbcbf;
    cursor: pointer;
    fill: currentcolor;
    user-select: none;
  }

  button:hover,
  button:focus {
    background-color: #404248;
    color: #fff;
  }

  button.active {
    background-color: #a03000;
    color: #101010;
    /* background-color: #307677; */
    background-color: #4d78cc;
    color: #fff;
    background-color: #32456b;
  }

  button.active:hover,
  button.active:focus {
    background-color: #557ecf;
    background-color: #3c5589;
  }

  span {
    position: absolute;
    bottom: 1px;
    right: 3px;
    font-size: 0.7rem;
  }
</style>
