<template>
  <div :class="[darkModeToggled ? 'dark-mode' : 'light-mode', 'root-background']">
    <div class="root-full-container">
      <div v-if="!isLoading">
        <div class="root-boxed-container">
          <Sidebar />
          <div class="primary-content-container">
            <Header />
            <Columns />
          </div>
        </div>

        <!-- Show Sidebar Icon On Bottom Left -->

        <div @click="toggleSidebar">
          <ShowSidebar />
        </div>
      </div>
      <!-- Modal Overlay -->

      <div :class="[modalOverlay || isLoading ? 'modal-toggled' : '', 'modal-overlay']" @click="untoggleModal"></div> 
      <!-- Modals -->
      <div v-if="modalOverlay || isLoading" class="modals-container">
        <MobileBoard v-if="modalToggled === 'mobileBoards'" />
        <ModalAddEditTask v-if="modalToggled === 'addTask' || modalToggled ==='editTask'" :mode="modalToggled" />
        <ModalAddEditBoard v-if="modalToggled === 'addBoard' || modalToggled ==='editBoard'" :mode="modalToggled" />
        <ModalDeleteTaskBoard v-if="modalToggled === 'deleteTask' || modalToggled ==='deleteBoard'" :mode="modalToggled" />
        <ModalDeleteUser v-if="modalToggled === 'deleteUser'" />
        <LoadingIcon v-if="isLoading" class="loading-icon-full" />
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';

  export default Vue.extend({
    data() {
      return {
        isLoading: true
      }
    },
    computed: {
      darkModeToggled() {
        return this.$store.state.darkModeToggled
      },
      modalOverlay() {
        return Object.entries(this.$store.state.modals).some(modal => modal[1].toggled === true)
      },
      modalToggled() {
        const { mobileBoards, addTask, editTask, 
          addBoard, editBoard, deleteTask, deleteBoard, deleteUser } = this.$store.state.modals;
        if (mobileBoards.toggled) {
          return 'mobileBoards'
        }
        if (addTask.toggled) {
          return 'addTask'
        }
        if (editTask.toggled) {
          return 'editTask'
        }
        if (addBoard.toggled) {
          return 'addBoard'
        }
        if (editBoard.toggled) {
          return 'editBoard'
        }
        if (deleteTask.toggled) {
          return 'deleteTask'
        }
        if (deleteBoard.toggled) {
          return 'deleteBoard'
        }
        if (deleteUser.toggled) {
          return 'deleteUser'
        }
        return null
      } 
    },
    created() {
      if (!this.$store.state.userData.user.firstname) {
        this.$router.push('/')
      } else {
        this.isLoading = false;
      }
    },
    mounted() {
      const storageDarkMode = localStorage.getItem("darkMode") === 'true';
      if (this.darkModeToggled !== storageDarkMode) {
          this.$store.commit('toggleDarkMode');
      }
    },
    methods: {
      untoggleModal() {
        this.$store.commit('toggleModal')
      },
      toggleSidebar() {
          this.$store.commit('toggleSidebar')
      }
    }
  })
</script>

<style lang="scss" scoped>

  .primary-content-container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .trans-speed {
    transition: $speed-fast; 
  }
  .no-opacity {
    opacity: 0;
  }
  
</style>
