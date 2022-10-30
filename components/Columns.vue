<template>
    <main>
        <!-- If There Are No Boards Found For User -->

        <div v-if="!selectedBoard" class="empty-list-container">
            <h2>There are no boards.  Create a new board to get started.</h2>
            <button class="button-primary-l" @click="toggleAddBoard">
                + <span class="add-button-text ml-1"> 
                    Create New Board
                </span>
            </button>
        </div>

        <!-- If Selected Board Has No Columns -->

        <div v-if="!columns.length" class="empty-list-container">
            <h2>This board is empty.  Create a new column to get started.</h2>
            <button class="button-primary-l" @click="toggleEditBoard">
                + <span class="add-button-text ml-1"> 
                    Add New Column
                </span>
            </button>
        </div>

        <!-- If Board Select And Has At Least One Column  -->
        <div v-if="columns.length" class="all-columns">
            <div v-for="(column, index) in columns" :key="index" class="column-list">
                <h4>{{ `${column.name.toUpperCase()} (${column.tasks.length})` }}</h4>
            </div>
        </div>

    </main>
</template>

<script>

    export default {
        computed: {
            selectedBoard() {
                return this.$store.state.userData.boards.find(board => board._id === this.$store.state.boardSelected)
            },
            columns() {
                if (this.selectedBoard && this.selectedBoard.columns.length) {
                    const columnTasks = this.selectedBoard.columns.map(column => {
                        return { 
                            name: column, 
                            tasks: this.selectedBoard.tasks.filter(task => task.status === column)
                        }
                    });
                    return columnTasks
                } else return []
            }
        },
        methods: {
            toggleAddBoard() {
                this.$store.commit('toggleModal', 'addBoard')
            },
            toggleEditBoard() {
                this.$store.commit('toggleModal', 'editBoard')
            }
        }
    }
</script>

<style lang="scss" scoped>
    main {
        display: flex;
        width: 100%;
        height: 100%;
        overflow: auto;
        padding: 1.5rem 1rem;
    }
    .empty-list-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    button {
        width: auto;
        margin-top: 1.5rem;
    }
    h2 {
        text-align: center;
    }

    .all-columns {
        width: 100%;
        display: flex;
    }
    .column-list {
        width: 17.5rem;
        min-width: 17.5rem;
    }
</style>