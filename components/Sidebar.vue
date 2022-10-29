<template>
    <aside :class="[!sidebarToggled ? 'sidebar-hidden' : '']">
        <div class="logo-user-container">
            <Logo />
            <UserIcon />
        </div>
        <Boards class="boards-container board-side-item-minwidth" />
        <div @click="toggleSidebar">
            <HideSidebar  />
        </div>
    </aside>
</template>

<script>
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

    .boards-container {
        height: 100%;
        margin-top: 3.5rem;
    }

    .logo-user-container {
        display: flex;
        align-items: center;
        width: 100%;
        position: relative;
        min-width: $board-side-minwidth;
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