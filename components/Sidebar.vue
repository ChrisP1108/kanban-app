<template>
    <aside class="">
        <a href=".">
            <div class="logo-title-container">
                <img class="logo" src="assets/images/logo.svg" alt="Logo">
                <h1>kanban</h1>
            </div>
        </a>
        <Boards />
    </aside>
</template>

<script lang="ts">
    
</script>

<style lang="scss" scoped>
    aside {
        display: flex;
        flex-direction: column;
        padding: 0;
        height: 100vh;
        z-index: -1;
        flex-basis: 0;
        overflow: hidden;
        min-width: 0;
        position: relative;
        left: -100%;
        transition: $speed-medium;
    }

    .logo-title-container {
        display: flex;
        padding: 0 $padding-sides-tablet;
        align-items: center;
        margin-bottom: 3.5rem;
    }

    .logo {
        width: 1.5rem;
        height: 1.5rem;
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
        padding: 0 !important;
        border: 0 transparent solid !important;
        // left: -10%;
        top: 0;
        transform: rotateY(90deg);
    }

    @media (min-width: $tablet) {
        aside {
            min-width: 16.3125rem;
            flex-basis: 16.3125rem;
            z-index: 1;
            padding: 2rem $padding-sides-tablet 0 0;
            position: relative;
            left: 0%;
        }
    }
</style>