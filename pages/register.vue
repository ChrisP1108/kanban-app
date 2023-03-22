<template>
    <div :class="[darkModeToggled ? 'dark-mode' : 'light-mode', 'root-background']">
        <div class="root-full-container">
            <div class="modals-container">
                <ModalRegisterReset :registering="true" />
            </div>

            <!-- Modal Overlay -->

            <div :class="[modalError ? 'modal-toggled priority-layer' : '', 'modal-overlay']"
                @click="untoggleError"></div> 
            
            <!-- Modals -->
            
            <div v-if="modalError" class="modals-container priority-layer">
                <ModalError />
            </div>

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
            modalError() {
                return this.$store.state.modals.error.toggled
            }
        },
        mounted() {
            const storageDarkMode = localStorage.getItem("darkMode") === 'true';
            if (this.darkModeToggled !== storageDarkMode) {
                this.$store.commit('toggleDarkMode');
            }
        },
        methods: {
            untoggleError() {
                this.$store.commit('toggleModal')
            }
        }
    });
</script>

<style lang="scss" scoped>
    div {
        width: 100%;
    }
</style>