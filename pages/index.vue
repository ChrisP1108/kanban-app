<template>
    <div :class="[darkModeToggled ? 'dark-mode' : 'light-mode', 'root-full-container']">
        <div class="modals-container">
            <ModalLoginRegister mode="login" />
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
        }
    });
</script>

<style lang="scss" scoped>
    div {
        width: 100%;
    }
</style>