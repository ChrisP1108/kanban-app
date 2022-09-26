<template>
  <div class="root-full-container dark-mode">
    <div class="root-boxed-container">
      <Sidebar />
      <main>
        <Header />
        <Tasklist />
      </main>
    </div>
    <div class="modal-overlay"></div> 
  </div>
</template>

<script lang="ts">
  import '../styles/styles.scss';
  import Vue from 'vue';

  export default Vue.extend({})
</script>

<style lang="scss" scoped>

  .root-full-container {
    min-width: 100vw;
    min-height: 100vh;
    transition: $speed-fast;
  }
  .root-boxed-container {
    min-height: 100vh;
    display: flex;
    max-width: 1920px;
    margin: 0 auto;
  }
  main {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .modal-overlay {
    min-width: 100vw;
    min-height: 100vh;
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: $color-modal-overlay;
    z-index: -1;
  }
  .modal-toggled {
    z-index: 101;
    animation-name: fade-in;
    animation-duration: $speed-very-fast;
  }

</style>
