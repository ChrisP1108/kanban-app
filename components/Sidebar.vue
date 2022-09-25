<template>
    <div class="sidebar-container">
        <h1>Sidebar</h1>
    </div>
</template>

<script lang="ts">
    export default {
        
    }
</script>

<style lang="scss" scoped>
    .sidebar-container {
        display: flex;
        height: 100vh;
        z-index: -1;
        width: 0;
        background: red;
        overflow: hidden;
        transition: 0.5s;
    }

    @media (min-width: 768px) {
        .sidebar-container {
            padding: 32px;
            width: 261px;
            z-index: 1;
        }
    }

    .hide-sidebar {
        padding: 0;
        width: 0;
    }
</style>