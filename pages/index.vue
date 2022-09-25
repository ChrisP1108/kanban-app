<template>
  <div class="root-full-container dark-mode">
    <div class="root-boxed-container">
      <Sidebar />
      <div class="content-container">
        <Header />
        <Tasklist />
      </div>
    </div>
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
  }
  .root-boxed-container {
    min-height: 100vh;
    display: flex;
    max-width: 1920px;
    margin: 0 auto;
  }

  .content-container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

</style>
