<script>
  import { onMount, onDestroy } from 'svelte';
  import { init, setSize, start, stop } from '../render.js';
  import { viewportSize } from '../stores.js';

  let canvas;

  onMount(() => {
    init(canvas);
    viewportSize.subscribe(size => setSize(size[0], size[1]));
    start();
  });

  onDestroy(() => {
    stop();
  });
</script>

<canvas bind:this={canvas} />
