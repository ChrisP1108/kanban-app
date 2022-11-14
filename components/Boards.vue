<template>
    <div class="boards-mode-container">
        <h4>{{ boardList.length ? `ALL BOARDS (${boardList.length })` : 'NO BOARDS'}}</h4> 
        <ul>
            <div class="board-list scrollbar-styling">
                <li v-for="(board, index) in boardList" :key="board._id" 
                    :class="[selectedBoard === board._id ? 'board-active' : !selectedBoard && index === 0 ? 'board-active' : ''
                    , 'board-sidebar-item  board-side-item-minwidth']" 
                    @click="selectBoard(board._id)">
                        <BoardIcon class="board-icon" />
                        <h3>{{ board.name }}</h3>
                </li>
            </div>
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
            boardList() {
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
            selectBoard(_id) {
                this.$store.commit('selectBoard', _id)
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
        margin-bottom: 1.375rem;
        padding: 0 $padding-sides-tablet;
    }
    .boards-mode-container {
        display: flex;
        flex-direction: column;
    }

    .board-list {
        overflow-y: auto;
        overflow-x: hidden;
        box-sizing: border-box;
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