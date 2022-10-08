<template>
    <div class="boards-mode-container">
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
        <button @click="toggleAddBoard" class="board-item create-board-item">
            <BoardIcon class="board-icon" />
            <h3>+ Create New Board</h3>
        </button>
        <div class="mode-toggle-outer-wrapper">
            <ModeToggle />
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            toggleAddBoard() {
                this.$store.commit('toggleModal', 'addBoard')
            }
        }
    }

</script>

<style lang="scss" scoped>
    h3 {
        margin-left: 0.75rem;
        color: $color-g;
    }

    button {
        background: inherit;
        justify-content: flex-start;
    }

    h4 {
        color: $color-g;
        margin-bottom: 1.375rem;
        padding: 0 $padding-sides-tablet;
    }
    .boards-mode-container {
        display: flex;
        flex-direction: column;
    }
    ul, button {
        margin-right: $padding-sides-tablet;
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
        margin-bottom: 1rem;
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
    .mode-toggle-outer-wrapper {
        margin-top: auto;
        padding: 0 0.8125rem;
    }
</style>