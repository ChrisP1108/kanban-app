<template>
    <aside class="">
        <div class="sidebar-content">
            <div class="logo-title-container">
                <img class="logo" src="assets/images/logo.svg" alt="Logo">
                <h1>kanban</h1>
            </div>
        </div>
    </aside>
</template>

<script lang="ts">
    export default {
        
    }
</script>

<style lang="scss" scoped>
    aside {
        display: flex;
        position: relative;
        height: 100vh;
        z-index: -1;
        flex-basis: 0;
        overflow: hidden;
        transition: $speed-medium;
        min-width: 0;
    }

    .sidebar-content {
        display: flex;
        flex-direction: column;
        position: absolute;
        padding: 32px;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }

    .logo-title-container {
        display: flex;
        align-items: center;
    }

    h1 {
        font-size: 1.875rem;
        margin-left: 16px;
    }

    .sidebar-hidden {
        min-width: 0;
        width: 0;
        flex-basis: 0;
        z-index: -1;
    }

    @media (min-width: $tablet) {
        aside {
            min-width: 261px;
            flex-basis: 261px;
            z-index: 1;
        }
    }
</style>