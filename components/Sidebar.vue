<template>
    <aside :class="[!sidebarToggled ? 'sidebar-hidden' : '']">
        <div class="boards-toggle-container scrollbar-styling">
            <Boards class="boards-container board-side-item-minwidth" />
            <div @click="toggleSidebar">
                <HideSidebar  />
            </div>
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
        padding: 2rem 0 2rem;
        z-index: 2;
        flex-basis: 0;
        overflow: hidden;
        min-width: 0;
        position: relative;
        left: 0%;
        margin-top: -1px;
    }

    .boards-container {
        flex: 1;
    }

    .boards-toggle-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
        padding-right: 1.5rem !important;
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
            min-width: $sidebar-width;
            flex-basis: $sidebar-width;
            z-index: 2;
            position: relative;
            left: 0%;
        }
    }
</style>