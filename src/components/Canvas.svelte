<script>
  import { onMount, onDestroy } from 'svelte';
  import { init, setSize, start, stop } from '../render.js';

  let canvas;

  function onResize() {
    if (!canvas) return;

    const width = canvas.parentElement.clientWidth;
    const height = canvas.parentElement.clientHeight;

    canvas.width = width;
    canvas.height = height;

    setSize(width, height);
  }

  onMount(() => {
    window.addEventListener('resize', onResize);
    init(canvas);
    onResize();
    start();
  });

  onDestroy(() => {
    stop();
    window.removeEventListener('resize', onResize);
  });
</script>

<canvas
  bind:this={canvas}
/>

<style>
</style>
