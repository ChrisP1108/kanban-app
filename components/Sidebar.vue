<template>
    <div class="sidebar-container">
        <div class="sidebar-content">
            <h1>Sidebar</h1>
        </div>
    </div>
</template>

<script lang="ts">
    export default {
        
    }
</script>

<style lang="scss" scoped>
    .sidebar-container {
        display: flex;
        position: relative;
        height: 100vh;
        z-index: -1;
        flex-basis: 0;
        overflow: hidden;
        transition: 0.5s;
    }

    .sidebar-content {
        display: flex;
        flex-direction: column;
        position: absolute;
        background: red;
        padding: 32px;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    }

    @media (min-width: $tablet) {
        .sidebar-container {
            flex-basis: 261px;
            z-index: 1;
        }
    }

    .hide-sidebar {
        padding: 0;
        width: 0;
    }
</style>