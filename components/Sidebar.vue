<template>
    <aside :class="[!sidebarToggled ? 'sidebar-hidden' : '']">
        <a href=".">
            <div class="logo-title-container board-side-item-minwidth">
                <img class="logo" src="assets/images/logo.svg" alt="Logo">
                <h1>kanban</h1>
            </div>
        </a>
        <Boards class="boards-container board-side-item-minwidth" />
        <div @click="toggleSidebar">
            <HideSidebar  />
        </div>
    </aside>
</template>

<script lang="ts">
    export default {
        computed: {
            sidebarToggled() {
                return this.$store.state.sidebarToggled
            }
        },
        methods: {
            toggleSidebar() {
                this.$store.commit('toggleSidebar')
            }
        }
    }
</script>

<style lang="scss" scoped>
    aside {
        display: flex;
        flex-direction: column;
        padding-top: 2rem;
        height: 100vh;
        z-index: 2;
        flex-basis: 0;
        overflow: hidden;
        min-width: 0;
        position: relative;
        left: 0%;
        transition: $speed-medium;
    }

    .logo-title-container {
        display: flex;
        padding: 0 $padding-sides-tablet;
        align-items: center;
        margin-bottom: 3.5rem;
        gap: 1rem;
    }

    .logo {
        width: 1.5rem;
        height: 1.5rem;
    }

    h1 {
        font-size: 1.875rem;
    }

    .boards-container {
        height: 100%;
    }

    .sidebar-hidden {
        min-width: 0;
        flex-basis: 0;
        border: 0 transparent solid !important;
        top: 0;
        left: -0%;

    }

    .full-height {
        height: 100%;
    }

    @media (min-width: $tablet) {
        aside {
            min-width: 16.3125rem;
            flex-basis: 16.3125rem;
            z-index: 2;
            position: relative;
            left: 0%;
        }
    }
</style>