<script>
  import { onMount, tick } from 'svelte';
  import levels from '../levels/index.js';
  import { navWidth, resizing, viewportSize, browse, level } from '../stores.js';
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

  level.update(() => levels.hmc[0]);

  let nav;
  let viewport;

  function onResize() {
    if (!viewport) return;

    const width = viewport.clientWidth;
    const height = viewport.clientHeight;
    viewportSize.set([width, height]);
  }

  let xOnDown = 0;
  let navWidthOnDown = 0;

  function onMouseDown(e) {
    xOnDown = e.clientX;
    navWidthOnDown = nav.offsetWidth;
    resizing.set(true);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function onMouseMove(e) {
    const deltaWidth = e.clientX - xOnDown;
    navWidth.set(Math.max(navWidthOnDown + deltaWidth, 0));
    onResize();
  }

  function onMouseUp(e) {
    resizing.set(false);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  browse.subscribe(() => {
    tick().then(onResize);
  });

  onMount(() => {
    onResize();
    navWidth.set(nav.offsetWidth);
  });

  $: navStyle = `display: ${$browse ? 'block' : 'none'}; width: ${$navWidth >= 0 ? $navWidth + 'px' : '20rem'};`;
</script>

<div class={'app' + ($resizing ? ' resize' : '')}>
  <div bind:this={nav} class="nav" style={navStyle}>
    <TreeView children={folders} selected={level} />
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <div role="separator" aria-orientation="vertical" class="nav-resize-handle" on:mousedown={onMouseDown} />
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
  .app.resize :global(*) {
    user-select: none !important;
    cursor: col-resize !important;
  }
  .nav {
    /* background-color: #303236; */
    flex-shrink: 0;
    box-sizing: content-box;
    width: 22rem;
    min-width: 2rem;
    max-width: 90%;
    padding: 0.5rem 0;
    border-right: 1px solid #494c50;
    overflow: auto;
    position: relative;
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
  .nav-resize-handle {
    width: 0.25rem;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    cursor: col-resize;
  }
  .viewport {
    flex-grow: 1;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    position: relative;
  }
</style>

<svelte:window on:resize={onResize} />
