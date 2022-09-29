<template>
    <header>
        <img class="logo" src="assets/images/logo.svg" alt="Logo">
        <h2>Platform Launch</h2>
        <div class="dropdown-container" @click="toggleMobileDropdown">
            <img :class="[mobileDropdownToggled ? 'dropdown-arrow-toggled' : '', 'dropdown-arrow']" src="assets/images/dropdown-arrow.svg" alt="Dropdown Arrow">
        </div>
        <button @click="toggleAddTask" class="button-primary-l ml-auto button-mobile">
            + <span class="add-button-text ml-1"> 
                Add New Task
            </span>
        </button>
        <img class="dot-nav" src="assets/images/dot-nav.svg">
    </header>
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
            },
            toggleAddTask(e: any): void {
                console.log(e)
            }
        }
    }
</script>

<style lang="scss" scoped>
    header {
        display: flex;
        align-items: center;
        min-height: 4rem;
        width: 100%;
        padding: $padding-top-bottom $padding-sides;
    }
    h2 {
        margin-left: 1rem;
        margin-right: 0.5rem;
    }

    button {
        margin-right: 16px;
        max-width: 11.25rem;
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

    .add-button-text {
        display: none;
    }

    .button-mobile {
        padding: 0 0 6px;
        font-size: $heading-xl-size;
        min-height: 2rem;
        min-width: 3rem;
    }

    .dot-nav {
        cursor: pointer;
        padding: 1rem;
        margin: -1rem;
    }

    @media (min-width: $tablet) {
        header {
            padding: $padding-top-bottom $padding-sides-tablet;
            min-height: 5.0625rem;
        }
        button {
            margin-right: 24px;
            font-size: $heading-m-size !important;
            line-height: $heading-m-height !important;
        }
        .dropdown-container {
            display: none;
        }
        .logo {
            display: none;
        }
        h2 {
            margin-left: 0;
        }
        .add-button-text {
            display: block;
        }
        .button-mobile {
            padding: 1rem 1.5rem;
            font-size: inherit;
        }
    }
</style>