<script>
  import TreeViewNode from './TreeViewNode.svelte';

  export let children;
  export let store;
  export let label;
  export let icon;
  export let level = 0;

  const root = level === 0;

  let expanded = root;
</script>

{#if !root}
  <TreeViewNode
    label={label}
    icon={icon}
    level={level + 1}
    expandable={true}
    expanded={expanded}
    onClick={() => expanded = !expanded}
  />
{/if}
{#if expanded}
  <ul>
    {#each children as child}
      <li>
        {#if child.children}
          <svelte:self
            children={child.children}
            label={child.label}
            icon={child.icon}
            level={level + 1}
          />
        {:else}
          <TreeViewNode
            label={child.label}
            icon={child.icon}
            level={level + 1}
            onClick={() => store.update(() => child.data)}
          />
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<style>
  ul {
    padding: 0;
    margin: 0;
  }
  li {
    list-style-type: none;
  }
</style>
