<template>
    <header>
        <img class="logo" src="assets/images/logo.svg" alt="Logo">
        <h2>Platform Launch</h2>
        <div class="dropdown-container" @click="toggleMobileBoard">
            <img :class="[mobileBoardToggled ? 'dropdown-arrow-toggled' : '', 'dropdown-arrow']" src="assets/images/dropdown-arrow.svg" alt="Dropdown Arrow">
        </div>
        <button @click="toggleAddTask" class="button-primary-l ml-auto button-mobile">
            + <span class="add-button-text ml-1"> 
                Add New Task
            </span>
        </button>
        <img class="dot-nav" src="assets/images/dot-nav.svg">
    </header>
</template>

<script>
    export default {
        computed: {
            mobileBoardToggled() {
                return this.$store.state.modals.mobileBoardsToggled
            }
        },
        methods: {
            toggleMobileBoard() {
                this.$store.commit('toggleModal', 'mobileBoards')
            },
            toggleAddTask() {
                this.$store.commit('toggleModal', 'addTask')
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
        transition: $speed-medium;
    }
    .logo {
        width: 1.5rem;
        height: 1.5625rem;
    }
    h2 {
        margin-left: 1em;
        margin-right: 0.5em;
    }

    @media (max-width: 340px) {
        .logo {
            width: 7vw;
        }
        h2 {
            font-size: 5vw;
        }
    }

    button {
        margin-right: 1rem;
        width: fit-content;
    }

    .add-button-inactive {
        opacity: 0.25;
        cursor: auto;

        &:hover {
            background: $color-a;
        }
    }
    .header-title-container {
        cursor: pointer;
    }
    .dropdown-container {
        padding: 1rem 1rem 1rem 9.5rem;
        margin: -1rem -1rem -1rem -9.5rem;
        cursor: pointer;
    }

    .dropdown-arrow-toggled {
        transform: rotate(180deg);
    }

    .add-button-text {
        display: none;
    }

    .button-mobile {
        padding: 0 0 0.375rem;
        font-size: $heading-xl-size;
        min-height: 2rem;
        min-width: 3rem;
    }

    .dot-nav {
        cursor: pointer;
        padding: 1rem;
        margin: -1rem;
        width: 2.3125rem;
    }

    @media (min-width: $tablet) {
        header {
            padding: $padding-top-bottom $padding-sides-tablet;
            min-height: 5.0625rem;
        }
        button {
            margin-right: 1rem;
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