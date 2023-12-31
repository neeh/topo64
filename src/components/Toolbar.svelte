<script>
  import { resetCamera, downloadObj } from '../render.js';
  import { browse, faces, edges, seams, bounds, gaps, folds, xray } from '../stores.js';
  import ToolbarButton from './ToolbarButton.svelte';

  const toggle = value => !value;
  const toggleBrowse = () => browse.update(toggle);
  const toggleFaces = () => faces.update(toggle);
  const toggleEdges = () => edges.update(toggle);
  const toggleSeams = () => seams.update(toggle);
  const toggleBounds = () => bounds.update(toggle);
  const toggleGaps = () => gaps.update(toggle);
  const toggleFolds = () => folds.update(toggle);
  const toggleXray = () => xray.update(toggle);

  function onKeyDown(e) {
    switch (e.code) {
      case 'KeyB': toggleBrowse(); break;
      case 'Digit1': toggleFaces(); break;
      case 'Digit2': toggleEdges(); break;
      case 'Digit3': toggleSeams(); break;
      case 'Digit4': toggleBounds(); break;
      case 'Digit5': toggleGaps(); break;
      case 'Digit6': toggleFolds(); break;
      case 'KeyE': toggleXray(); break;
      case 'KeyR': resetCamera(); break;
      case 'KeyP': downloadObj(); break;
    }
  }
</script>

<div class="toolbar">
  <div class="slot">
    <ToolbarButton
      title={($browse ? 'Close' : 'Open') + ' file browser'}
      icon="browse"
      key="B"
      active={$browse}
      onclick={toggleBrowse}
    />
  </div>
  <div class="slot">
    <ToolbarButton
      title="Download model as .obj"
      icon="download"
      key="P"
      onclick={downloadObj}
    />
  </div>
  <div class="separator" />
  <div class="slot">
    <ToolbarButton
      title="Toggle faces"
      icon="faces"
      key="1"
      active={$faces}
      onclick={toggleFaces}
    />
  </div>
  <div class="slot">
    <ToolbarButton
      title="Toggle edges"
      icon="edges"
      key="2"
      active={$edges}
      onclick={toggleEdges}
    />
  </div>
  <div class="slot">
    <ToolbarButton
      title="Toggle seams"
      icon="seams"
      key="3"
      active={$seams}
      onclick={toggleSeams}
    />
  </div>
  <div class="slot">
    <ToolbarButton
      title="Toggle boundary seams"
      icon="bounds"
      key="4"
      active={$bounds}
      onclick={toggleBounds}
    />
  </div>
  <div class="slot">
    <ToolbarButton
      title="Toggle misaligned seams"
      icon="gaps"
      key="5"
      active={$gaps}
      onclick={toggleGaps}
    />
  </div>
  <div class="slot">
    <ToolbarButton
      title="Toggle folded edges"
      icon="folds"
      key="6"
      active={$folds}
      onclick={toggleFolds}
    />
  </div>
  <div class="separator" />
  <div class="slot">
    <ToolbarButton
      title="Toggle X-ray mode"
      icon="xray"
      key="E"
      active={$xray}
      onclick={toggleXray}
    />
  </div>
  <div class="slot">
    <ToolbarButton
      title="Reset camera pose"
      icon="camera-home"
      key="R"
      onclick={resetCamera}
    />
  </div>
</div>

<style>
  .toolbar {
    display: flex;
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
  }
  .separator {
    width: 1.5rem;
  }
</style>

<svelte:window on:keydown={onKeyDown} />
