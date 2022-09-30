<template>
    <aside class="">
        <a href=".">
            <div class="logo-title-container">
                <img class="logo" src="assets/images/logo.svg" alt="Logo">
                <h1>kanban</h1>
            </div>
        </a>
        <h4>ALL BOARDS (3)</h4>
        <ul>
            <li class="board-item board-active">
                <BoardIcon class="board-icon" />
                <h3>Platform Launch</h3>
            </li>
            <li class="board-item">
                <BoardIcon class="board-icon" />
                <h3>Marketing Plan</h3>
            </li>
        </ul>
        <div class="board-item create-board-item">
            <BoardIcon class="board-icon" />
            <h3>+ Create New Board</h3>
        </div>
    </aside>
</template>

<script lang="ts">
    export default {
        data() {
            return {
                boardIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.846133 0.846133C0.304363 1.3879 0 2.12271 0 2.88889V13.1111C0 13.8773 0.304363 14.6121 0.846133 15.1538C1.3879 15.6957 2.12271 16 2.88889 16H13.1111C13.8773 16 14.6121 15.6957 15.1538 15.1538C15.6957 14.6121 16 13.8773 16 13.1111V2.88889C16 2.12271 15.6957 1.3879 15.1538 0.846133C14.6121 0.304363 13.8773 0 13.1111 0H2.88889C2.12271 0 1.3879 0.304363 0.846133 0.846133ZM1.33333 13.1111V8.44448H9.77781V14.6667H2.88889C2.03022 14.6667 1.33333 13.9698 1.33333 13.1111ZM9.77781 7.11111V1.33333H2.88889C2.47633 1.33333 2.08067 1.49723 1.78895 1.78895C1.49723 2.08067 1.33333 2.47633 1.33333 2.88889V7.11111H9.77781ZM11.1111 5.77778H14.6667V10.2222H11.1111V5.77778ZM14.6667 11.5555H11.1111V14.6667H13.1111C13.5236 14.6667 13.9194 14.5028 14.2111 14.2111C14.5028 13.9194 14.6667 13.5236 14.6667 13.1111V11.5555ZM14.6667 2.88889V4.44445H11.1111V1.33333H13.1111C13.5236 1.33333 13.9194 1.49723 14.2111 1.78895C14.5028 2.08067 14.6667 2.47633 14.6667 2.88889Z" fill=""/>
                </svg>`
            }
        }
    }
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
    }

    .logo {
        width: 1.5rem;
        height: 1.5rem;
    }

    h1 {
        font-size: 1.875rem;
        margin-left: 16px;
    }

    h3 {
        margin-left: 0.75rem;
        color: $color-g;

    }

    h4 {
        color: $color-g;
        margin: 3.5rem 0 1.375rem;
        padding: 0 $padding-sides-tablet;
    }

    .dark-mode {
        .board-item:hover:not(.board-active) {
            background: $color-white;
        }
    }

    .light-mode {
        .board-item:hover:not(.board-active) {
            background: $color-a-10;
        }
    }

    .board-item {
        display: flex;
        align-items: center;
        padding: $padding-top-bottom $padding-sides-tablet;
        min-height: $button-l-height;
        border-top-right-radius: $button-l-radius;
        border-bottom-right-radius: $button-l-radius;
        transition: $speed-medium;
        cursor: pointer;

        &:hover:not(.board-active) h3 {
            color: $color-a;
        }
        &:hover:not(.board-active) .board-icon {
            fill: $color-a;
        }
    }

    .create-board-item {
        .board-icon {
            fill: $color-a;
        }
        h3 {
            color: $color-a;
        }
    }

    .board-icon {
        fill: $color-g;
        width: 1rem;
        height: 1rem;
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

    .board-active {
        background: $color-a;
        cursor: auto;
        h3 {
            color: $color-white;
        }
        .board-icon {
            fill: $color-white;
        }
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