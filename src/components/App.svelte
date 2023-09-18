<script>
  import ToolButton from './ToolButton.svelte';

  /*
  import { writable } from 'svelte/store';

  const renderFlags = writable({
    faces: true,
    edges: true,
    seams: true,
    bounds: true,
    gaps: true,
    folds: true
  });

  function onKeyDown(e) {
    switch (e.code) {
    case 'Digit1':
      renderFlags.update(flags => {
        flags.faces = !flags.faces;
        return flags;
      });
      break;
    case 'Digit2':
      renderFlags.update(flags => {
        flags.edges = !flags.edges;
        return flags;
      });
      break;
    case 'Digit3':
      renderFlags.update(flags => {
        flags.seams = !flags.seams;
        return flags;
      });
      break;
    case 'Digit4':
      renderFlags.update(flags => {
        flags.bounds = !flags.bounds;
        return flags;
      });
      break;
    case 'Digit5':
      renderFlags.update(flags => {
        flags.gaps = !flags.gaps;
        return flags;
      });
      break;
    case 'Digit6':
      renderFlags.update(flags => {
        flags.folds = !flags.folds;
        return flags;
      });
      break;
    }
  }
  */

  import { faces, edges, seams, bounds, gaps, folds } from '../stores.js';

  function onKeyDown(e) {
    switch (e.code) {
      case 'Digit1': faces.update(v => !v); break;
      case 'Digit2': edges.update(v => !v); break;
      case 'Digit3': seams.update(v => !v); break;
      case 'Digit4': bounds.update(v => !v); break;
      case 'Digit5': gaps.update(v => !v); break;
      case 'Digit6': folds.update(v => !v); break;
    }
  }
</script>

<div class="app">
  <div class="menu">
  </div>
  <div class="main">
    <ul class="toolbar">
      <li>
        <ToolButton title="Toggle faces" icon="faces" key="1" active={$faces} onclick={() => faces.update(v => !v)} />
      </li>
      <li>
        <ToolButton title="Toggle edges" icon="edges" key="2" active={$edges} onclick={() => edges.update(v => !v)} />
      </li>
      <li>
        <ToolButton title="Toggle seams" icon="seams" key="3" active={$seams} onclick={() => seams.update(v => !v)} />
      </li>
      <li>
        <ToolButton title="Toggle seams" icon="seams2" key="3" active={$seams} onclick={() => seams.update(v => !v)} />
      </li>
      <li>
        <ToolButton title="Toggle bounds" icon="bounds" key="4" active={$bounds} onclick={() => bounds.update(v => !v)} />
      </li>
      <li>
        <ToolButton title="Toggle gaps" icon="gaps" key="5" active={$gaps} onclick={() => gaps.update(v => !v)} />
      </li>
      <li>
        <ToolButton title="Toggle folds" icon="folds" key="6" active={$folds} onclick={() => folds.update(v => !v)} />
      </li>
    </ul>
  </div>
</div>

<style>
  .app {
    display: flex;
    height: 100%;
  }
  .menu {
    /*background-color: #303236;*/
    box-sizing: content-box;
    width: 20em;
    border-right: 1px solid #494c50;
  }
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
