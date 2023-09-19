<script>
  import Icon from './Icon.svelte';

  export let label = '';
  export let icon = '';
  export let children;
  export let level = 0;
  export let selected;

  const root = level === 0;
  let expanded = root;

  function onItemClick(item, e) {
    selected.update(curData => item.data !== curData ? item.data : null);
    e?.currentTarget?.blur();
  }
</script>

{#if !root}
  <button
    class="item"
    on:click={() => expanded = !expanded}
  >
    <div class="arrow"><Icon id={expanded ? 'arrow-down' : 'arrow-right'} /></div>
    <div class="icon"><Icon id={icon} /></div>
    <div>{label}</div>
  </button>
{/if}
{#if expanded}
  <ul style={'--level: ' + level}>
    {#each children as child}
      <li>
        {#if child.children}
          <svelte:self
            children={child.children}
            label={child.label}
            icon={child.icon}
            level={level + 1}
            selected={selected}
          />
        {:else}
          <button
            class={child.data === $selected ? 'item active' : 'item'}
            on:click={e => onItemClick(child, e)}
          >
            <div class="arrow"></div>
            <div class="icon"><Icon id={child.icon} /></div>
            <div class="label">{child.label}</div>
          </button>
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
  ul {
    display: table;
    min-width: 100%;
    padding: 0;
    margin: 0;
  }
  li {
    display: table-row;
    list-style-type: none;
  }
  .item {
    display: flex;
    background: transparent;
    width: 100%;
    height: 1.25rem;
    padding: 0 0.75rem;
    padding-left: calc((var(--level) * 2 + 1) * 0.25rem);
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
  .item.active {
    background-color: #32456b;
    color: #fff;
  }
  .item.active:hover,
  .item.active:focus {
    background-color: #557ecf;
    background-color: #3c5589;
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
