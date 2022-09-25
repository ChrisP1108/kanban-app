<template>
    <div class="header-container">
        <img src="assets/images/logo.svg" alt="Platform Launch Logo">
        <h2>Platform Launch</h2>
        <div class="dropdown-container" @click="toggleMobileDropdown">
            <img :class="[mobileDropdownToggled ? 'dropdown-arrow-toggled' : '', 'dropdown-arrow']" src="assets/images/dropdown-arrow.svg" alt="Platform Launch Logo"></img>
        </div>
    </div>
</template>

<script lang="ts">
    declare interface HeaderData {
        mobileDropdownToggled: boolean
    }
    export default {

        data(): HeaderData {
            return {
                mobileDropdownToggled: false
            }
        },
        methods: {
            toggleMobileDropdown(): void {
                this.mobileDropdownToggled = !this.mobileDropdownToggled;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .header-container {
        display: flex;
        align-items: center;
        min-height: 4rem;
        width: 100%;
        padding: 1rem $padding-sides;
    }
    h2 {
        margin-left: 1rem;
        margin-right: 0.5rem;
    }
    .header-title-container {
        cursor: pointer;
    }
    .dropdown-container {
        padding: 1rem 1rem 1rem 9.5rem;
        margin: -1rem -1rem -1rem -9.5rem;
        cursor: pointer;
    }
    .dropdown-arrow {
        transition: $speed-fast;
    }

    .dropdown-arrow-toggled {
        transform: rotate(180deg);
    }

    @media (min-width: $tablet) {
        .dropdown-container {
            display: none;
        }
    }
</style>