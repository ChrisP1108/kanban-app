<template>
  <div :class="[darkModeToggled ? 'dark-mode' : 'light-mode', 'root-full-container']">
    <div class="root-boxed-container">
      <Sidebar />
      <div class="primary-content-container">
        <Header />
        <Columns />
      </div>
    </div>
    <!-- Modal Overlay -->
    <div @click="untoggleModal" :class="[modalOverlay ? 'modal-toggled' : '', 'modal-overlay']"></div> 
    <!-- Modals -->
    <div v-if="modalOverlay" class="modals-container">
      <MobileBoard v-if="modalToggled === 'mobileBoards'" />
      <ModalAddEditTask v-if="modalToggled === 'addTask' || modalToggled ==='editTask'" :mode="modalToggled" />
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';

  export default Vue.extend({
    computed: {
      darkModeToggled() {
        return this.$store.state.darkModeToggled
      },
      modalOverlay() {
        return this.$store.state.modalOverlay
      },
      modalToggled() {
        const { mobileBoardsToggled, addTaskToggled, editTaskToggled, createBoard } = this.$store.state.modals;
        if (mobileBoardsToggled) {
          return 'mobileBoards'
        }
        if (addTaskToggled) {
          return 'addTask'
        }
        if (editTaskToggled) {
          return 'editTask'
        }
        if (createBoard) {
          return 'createBoard'
        }
      } 
    },
    methods: {
      untoggleModal() {
        this.$store.commit('toggleModal')
      }
    }
  })
</script>

<style lang="scss" scoped>

  .root-full-container {
    min-width: 100%;
    min-height: 100%;
    transition: $speed-fast;
  }
  .root-boxed-container {
    min-height: 100%;
    display: flex;
    max-width: 1920px;
    margin: 0 auto;
  }
  .primary-content-container {
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
    z-index: 100;
    animation-name: fade-in;
    animation-duration: $speed-very-fast;
  }
  .modals-container {
    position: absolute;
    top: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>
