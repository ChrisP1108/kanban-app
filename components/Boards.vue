<template>
    <div class="boards-mode-container">
        <h4>ALL BOARDS ({{ boards.length }})</h4> 
        <ul>
            <li v-for="(board, index) in boards" :key="board.id" 
                :class="[selectedBoard === board.id ? 'board-active' : !selectedBoard && index === 0 ? 'board-active' : ''
                , 'board-sidebar-item  board-side-item-minwidth']" 
                @click="selectBoard(board.id)">
                    <BoardIcon class="board-icon" />
                    <h3>{{ board.name }}</h3>
            </li>
            <button class="board-sidebar-item board-side-item-minwidth create-board-sidebar-item" @click="toggleAddBoard">
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
        computed: {
            boards() {
                return this.$store.state.userData.boards
            },
            selectedBoard() {
                return this.$store.state.boardSelected;
            }
        },
        methods: {
            toggleAddBoard() {
                this.$store.commit('toggleModal', 'addBoard')
            },
            selectBoard(id) {
                this.$store.commit('selectBoard', id)
            }
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
    
    .board-icon {
        fill: $color-g;
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