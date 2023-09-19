<script>
  import { beforeUpdate, afterUpdate } from 'svelte';
  import levels from '../levels/index.js';
  import * as stores from '../stores.js';
  import { faces, edges, seams, bounds, gaps, folds, level } from '../stores.js';
  import ToolButton from './ToolButton.svelte';
  import TreeView from './TreeView.svelte';

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

  const toggle = value => !value;
  const toggleFaces = () => faces.update(toggle);
  const toggleEdges = () => edges.update(toggle);
  const toggleSeams = () => seams.update(toggle);
  const toggleBounds = () => bounds.update(toggle);
  const toggleGaps = () => gaps.update(toggle);
  const toggleFolds = () => folds.update(toggle);

  function onKeyDown(e) {
    switch (e.code) {
      case 'Digit1': toggleFaces(); break;
      case 'Digit2': toggleEdges(); break;
      case 'Digit3': toggleSeams(); break;
      case 'Digit4': toggleBounds(); break;
      case 'Digit5': toggleGaps(); break;
      case 'Digit6': toggleFolds(); break;
    }
  }
</script>

<div class="app">
  <div class="nav">
    <TreeView children={folders} selected={level} />
  </div>
  <div class="main">
    <ul class="toolbar">
      <li>
        <ToolButton
          title="Toggle faces"
          icon="faces"
          key="1"
          active={$faces}
          onclick={toggleFaces}
        />
      </li>
      <li>
        <ToolButton
          title="Toggle edges"
          icon="edges"
          key="2"
          active={$edges}
          onclick={toggleEdges}
        />
      </li>
      <li>
        <ToolButton
          title="Toggle seams"
          icon="seams"
          key="3"
          active={$seams}
          onclick={toggleSeams}
        />
      </li>
      <li>
        <ToolButton
          title="Toggle boundary seams"
          icon="bounds"
          key="4"
          active={$bounds}
          onclick={toggleBounds}
        />
      </li>
      <li>
        <ToolButton
          title="Toggle misaligned seams"
          icon="gaps"
          key="5"
          active={$gaps}
          onclick={toggleGaps}
        />
      </li>
      <li>
        <ToolButton
          title="Toggle folded edges"
          icon="folds"
          key="6"
          active={$folds}
          onclick={toggleFolds}
        />
      </li>
    </ul>
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
  .main {
    flex-grow: 1;
  }
  .toolbar {
    padding: 0;
    margin: 0.75rem;
  }
  .toolbar li {
    display: inline-block;
    list-style-type: none;
  }
</style>

<svelte:window on:keydown={onKeyDown} />
