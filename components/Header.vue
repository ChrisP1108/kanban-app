<template>
    <header>
        <div class="logo-user-container">
            <Logo />
            <UserIcon class="user-icon-position" />
        </div>
        <div class="logo-divider"></div>
        <img class="logo" src="assets/images/logo.svg" alt="Logo">

        <h2>Platform Launch</h2>

        <div class="dropdown-container" @click="toggleMobileBoard">
            <img :class="[mobileBoardToggled ? 'dropdown-arrow-toggled' : '', 'dropdown-arrow']" src="assets/images/dropdown-arrow.svg" alt="Dropdown Arrow">
        </div>
        <button :class="[ !columnExists ? 'button-inactive' : '', 'button-primary-l ml-auto button-mobile']" 
            @click="toggleAddTask">
            + <span class="add-button-text ml-1"> 
                Add New Task
            </span>
        </button>
        <img class="dot-nav" src="assets/images/dot-nav.svg" @click="toggleBoardDropdown">
        <nav class="dropdown-list">
            <DropdownList :dropdown-toggled="boardDropdownToggled" :dropdown-options="boardDropdownOptions" 
                @option-selected="toggleOption" />
        </nav>
    </header>
</template>

<script>
    export default {
        data() {
            return {
                boardDropdownToggled: false,
                boardDropdownOptions: ['Edit Board', 'Delete Board']
            }
        },
        computed: {
            mobileBoardToggled() {
                return this.$store.state.modals.mobileBoardsToggled
            },
            columnExists() {
                const boardFind = this.$store.state.userData.boards.find(board => board._id === this.$store.state.boardSelected)
                return boardFind && boardFind.columns.length > 0
            }
        },
        mounted() {
            window.addEventListener('click', e => {
                if (![...e.target.classList].includes('dot-nav')) {
                    this.boardDropdownToggled = false
                }
            });
        },
        methods: {
            toggleMobileBoard() {
                this.$store.commit('toggleModal', 'mobileBoards')
            },
            toggleAddTask() {
                if (this.columnExists) {
                    this.$store.commit('toggleModal', 'addTask')
                }
            },
            toggleBoardDropdown() {
                if (this.$store.state.userData.boards.length) {
                    this.boardDropdownToggled = !this.boardDropdownToggled
                }
            },
            toggleOption(value) {
                this.$store.commit('toggleModal', 
                    value === 'Edit Board' ? 'editBoard' : 
                    value === 'Delete Board' ? 'deleteBoard' : '')
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
        padding: $padding-top-bottom;
        z-index: 10;
    }
    .logo {
        width: 1.5rem;
        height: 1.5625rem;
    }
    h2 {
        margin-left: 1rem;
        margin-right: 0.5rem;
    }
    .logo-user-container {
        display: none;
        position: relative;
        padding-right: 4rem;
        min-width: calc($sidebar-width - 1.5rem);
        transition: $speed-fast;
    }
    .logo-user-width-reduced {
        min-width: 0 !important;
    }
    .user-icon-position {
        left: calc(100% - 2.25rem) !important;
        top: -0.25rem;
    }
    .logo-divider {
        height: calc(100% + 2rem);
        margin-right: 1.5rem;
        margin-left: -0.0625rem;
        display: none;
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

    nav {
        min-width: 12rem;
        position: absolute;
        top: 5rem;
        left: 100%;
        transform: translateX(calc(-100% - 1rem));
    }

    @media (min-width: $tablet) {
        .logo-user-container {
            display: block;
        }
        .logo-divider {
            display: block;
        }
        header {
            padding: $padding-top-bottom $padding-sides-tablet;
            min-height: 5.0625rem;
        }
        button {
            margin-right: 1rem;
            font-size: $heading-m-size !important;
            line-height: $heading-m-height !important;
        }
        nav {
            top: 5.5625rem;
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

    @media (min-width: $desktop) {
        header {
            min-height: 6rem;
        }
        h2 {
            font-size: $heading-xl-size;
            line-height: $heading-xl-height;
            font-weight: $bold;
        }
    }
    .button-inactive {
        opacity: 0.25;
        cursor: auto;

        &:hover {
            pointer-events: none;
        }

        &:active {
            pointer-events: none;
        }

        span:hover {
            pointer-events: none;
        }

        span:active {
            pointer-events: none;
        }
    }
</style>