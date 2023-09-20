<script>
  import { onMount, tick } from 'svelte';
  import levels from '../levels/index.js';
  import { viewportSize, browse, level } from '../stores.js';
  import TreeView from './TreeView.svelte';
  import Canvas from './Canvas.svelte';
  import Toolbar from './Toolbar.svelte';

  const folders = Object.entries(levels).map(entry => ({
    label: entry[0],
    icon: 'folder',
    open: false,
    children: entry[1].map(fn => ({
      label: fn.name,
      icon: 'file',
      data: fn
    }))
  }));

  level.update(() => levels.lll[0]);

  let viewport;

  function onResize() {
    if (!viewport) return;

    const width = viewport.clientWidth;
    const height = viewport.clientHeight;

    viewportSize.set([width, height]);

    // console.log('resized to', width, '×', height);
  }

  browse.subscribe(() => {
    tick().then(onResize);
  });

  onMount(() => {
    onResize();
  });
</script>

<div class="app">
  <div class="nav" style={'display: ' + ($browse ? 'block' : 'none')}>
    <TreeView children={folders} selected={level} />
  </div>
  <div bind:this={viewport} class="viewport">
    <Canvas />
    <Toolbar />
  </div>
</div>

<style>
  .app {
    display: flex;
    height: 100%;
  }
  .nav {
    /* background-color: #303236; */
    flex-shrink: 0;
    box-sizing: content-box;
    width: 22rem;
    padding: 0.5rem 0;
    border-right: 1px solid #494c50;
    overflow: auto;
    /* scrollbar-color: #303236 transparent; */
  }
  /* .nav::-webkit-scrollbar {
    width: 0.5rem;
    height: 0.5rem;
  }
  .nav::-webkit-scrollbar-track {
    background-color: transparent;
    margin: 0.25rem;
  }
  .nav::-webkit-scrollbar-thumb {
    background-color: #404248;
    border-radius: 0.25rem;
  } */
  .viewport {
    flex-grow: 1;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    position: relative;
  }
</style>

<svelte:window on:resize={onResize} />
