<script>
  import levels from '../levels';
  import Icon from './Icon.svelte';

  const levelNames = Object.keys(levels);

  function onClick(e) {
    console.log(e.currentTarget);
  }

  const state = Object.keys(levels).map(key => ({
    label: key,
    open: false
  }));
</script>

<ul class="treeview">
  {#each levelNames as name}
    <li>
      <button class="item" data-key={name} on:click={onClick}>
        <div class="arrow">
          <Icon id="arrow-right" />
        </div>
        <div class="icon">
          <Icon id="folder" />
        </div>
        <span>{name}</span>
      </button>
    </li>
  {/each}
</ul>

<style>
  .treeview {
    padding: 0;
    color: #fff;
    font-family: monospace;
  }
  .treeview li {
    list-style-type: none;
    color: #cfd0df;
    fill: currentcolor;
  }
  .item {
    background: transparent;
    width: 100%;
    height: 1.25rem;
    padding: 0;
    padding-left: 0.5rem;
    border: 0;
    margin: 0;
    color: inherit;
    font: inherit;
    text-align: left;
    line-height: 1.25rem;
    cursor: pointer;
  }
  .item:hover,
  .item:focus {
    background-color: #303237;
    color: #fff;
  }
  .item:focus {
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
