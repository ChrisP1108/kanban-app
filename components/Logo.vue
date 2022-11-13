<template>
    <a href="." class="logo-full-container">
        <div class="logo-title-container board-side-item-minwidth">
            <img class="logo" src="assets/images/logo.svg" alt="Logo">
            <h1>kanban</h1>
        </div>
        <span>UI Design By Frontendmentor.io</span>
    </a>
</template>

<style lang="scss" scoped>
    .logo-full-container {
        position: relative;
    }
    .logo-title-container {
        display: flex;
        padding: 0 $padding-sides-tablet;
        align-items: center;
        gap: 1rem;
    }

    .logo {
        width: 1.5rem;
        height: 1.5rem;
    }

    h1 {
        font-size: 1.875rem;
    }
    span {
        font-size: 0.625rem;
        width: 100%;
        margin-top: 0.25rem;
        left: -1.125rem;
        top: 100%;
        text-align: center;
        position: absolute;
    }
</style>