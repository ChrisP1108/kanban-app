<template>
    <div class="boards-mode-container">
        <h4>ALL BOARDS (3)</h4> 
        <ul>
            <li class="board-sidebar-item board-active board-side-item-minwidth">
                <BoardIcon class="board-icon" />
                <h3>Platform Launch</h3>
            </li>
            <li class="board-sidebar-item">
                <BoardIcon class="board-sidebar-icon" />
                <h3>Marketing Plan</h3>
            </li>
            <button @click="toggleAddBoard" class="board-sidebar-item board-side-item-minwidth create-board-sidebar-item">
                <BoardIcon class="board-sidebar-icon" />
                <h3>+ Create New Board</h3>
            </button>
        </ul>
        <div class="mode-toggle-outer-container">
            <ModeToggle />
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            toggleAddBoard() {
                this.$store.commit('toggleModal', 'addBoard')
            },
        }
    }

</script>

<style lang="scss" scoped>
    h3 {
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
    ul, .create-new-board-container {
        margin-right: $padding-sides-tablet !important;
    }

    .create-board-sidebar-item {
        margin-bottom: 1rem;
        .board-sidebar-icon {
            fill: $color-a;
        }
        h3 {
            color: $color-a;
        }
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
    .mode-toggle-outer-container {
        margin-top: auto;
        padding: 0 0.8125rem;
    }

</style>