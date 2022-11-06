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
            <div v-for="(column, index) in columns" :key="index" class="task-column-list">
                <TaskListHeading :index="index" :task-status-heading="column.name" :length="column.tasks.length" />
                <ul class="task-list-items-container">
                    <TaskListItem v-for="task in column.tasks" :key="task._id" :task="task" />
                </ul>
            </div>
        </div>

    </main>
</template>

<script>

    export default {
        data() {
            return {
                headingDotColors: ['']
            }
        },
        computed: {
            selectedBoard() {
                return this.$store.state.userData.boards.find(board => board._id === this.$store.state.boardSelected)
            },
            columns() {
                if (this.selectedBoard && this.selectedBoard.columns.length) {
                    const columnTasks = [...this.selectedBoard.columns].map(column => {
                        return { 
                            name: column, 
                            tasks: this.selectedBoard.tasks && this.selectedBoard.tasks.length 
                                ? [...this.selectedBoard.tasks].filter(task => task.status === column) : []
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
        gap: 1.5rem;
    }
    .task-column-list {
        width: 17.5rem;
        min-width: 17.5rem;
    }
    .task-list-items-container {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        margin-top: 1.5rem;
    }
</style>