<script>
  import ToolButton from './ToolButton.svelte';

  let name = 'name';
</script>

<div class="app">
  <div class="menu">
  </div>
  <div class="main">
    <ul class="toolbar">
      <li>
        <ToolButton title="Toggle faces" icon="faces" key="1" />
      </li>
      <li>
        <ToolButton title="Toggle edges" icon="edges" key="2" />
      </li>
      <li>
        <ToolButton title="Toggle seams" icon="seams" key="3" active={true} />
      </li>
      <li>
        <ToolButton title="Toggle bounds" icon="bounds" key="4" />
      </li>
      <li>
        <ToolButton title="Toggle gaps" icon="gaps" key="5" />
      </li>
      <li>
        <ToolButton title="Toggle folds" icon="folds" key="6" />
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
    background-color: #303236;
    width: 20em;
  }
  .main {
    flex-grow: 1;
  }
  .toolbar {
    padding: 0;
    margin: 1rem;
  }
  .toolbar li {
    float: left;
    list-style-type: none;
    margin-right: 0.25rem;
  }
</style>
