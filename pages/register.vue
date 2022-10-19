<template>
    <div :class="[darkModeToggled ? 'dark-mode' : 'light-mode', 'root-full-container']">
        <div class="modals-container">
            <ModalRegisterUser />
        </div>
    </div>
</template>

<script>
import Vue from 'vue';

    export default Vue.extend({
        computed: {
            darkModeToggled() {
                return this.$store.state.darkModeToggled
            }
        },
        mounted() {
            const storageDarkMode = localStorage.getItem("darkMode") === 'true';
            if (this.darkModeToggled !== storageDarkMode) {
                this.$store.commit('toggleDarkMode');
            }
            document.body.style.background = this.darkModeToggled ? 'black' : 'white';
        }
    });
</script>

<style lang="scss" scoped>
    div {
        width: 100%;
    }
</style>