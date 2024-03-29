<template>
    <main class="scrollbar-styling-horizontal">
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

        <div v-if="selectedBoard && !selectedBoard.columns.length" class="empty-list-container">
            <h2>This board is empty.  Create a new column to get started.</h2>
            <button class="button-primary-l" @click="toggleEditBoard">
                + <span class="add-button-text ml-1"> 
                    Add New Column
                </span>
            </button>
        </div>

        <!-- If Selected Board Has No Tasks -->

        <div v-if="selectedBoard && selectedBoard.columns.length && !selectedBoard.tasks.length" class="empty-list-container">
            <h2>This board has no tasks.  Create a new task to get started.</h2>
            <button class="button-primary-l" @click="toggleAddTask">
                + <span class="add-button-text ml-1"> 
                    Add New Task
                </span>
            </button>
        </div>

        <!-- If Board Select And Has At Least One Column And A Task  -->

        <div v-if="selectedBoard && selectedBoard.tasks.length" class="all-columns">
            <div v-for="(column, index) in columns" :key="index" class="task-column-list">
                <TaskListHeading :index="index" :task-status-heading="column.name" :length="column.tasks.length" />
                <ul :class="[itemDraggingOver === column.name && draggingEvent.isDragging 
                    ? 'mouseover-active' : '', 'task-list-items-container scrollbar-styling']" 
                    :data-columnName="column.name">
                        <TaskListItem v-for="task in column.tasks" :key="task._id" :task="task" />
                </ul>
            </div>
            <button class="new-column-container" @click="toggleAddColumn">
                <h1>+ <span class="add-button-text ml-1"> 
                        New Column
                    </span></h1>
            </button>
        </div>

    </main>
</template>

<script>
    export default {
        data() {
            return {
                headingDotColors: [''],
                itemDraggingOver: null
            }
        },
        computed: {
            selectedBoard() {
                return [...this.$store.state.userData.boards].find(board => board._id === this.$store.state.boardSelected)
            },
            columns() {
                if (this.selectedBoard && this.selectedBoard.columns.length) {
                    const tasksStatus = this.selectedBoard.tasks.map(task => task.status);
                    const columnTasks = [...this.selectedBoard.columns]
                        .filter(col => tasksStatus.includes(col))
                        .map(column => {
                            return { 
                                name: column, 
                                tasks: this.selectedBoard.tasks && this.selectedBoard.tasks.length 
                                    ? [...this.selectedBoard.tasks].filter(task => task.status === column)
                                        .sort((a, b) => a.title > b.title ? 1 : -1)
                                    : []
                            }
                    }).sort((a, b) => a.name > b.name ? 1 : -1);
                    return columnTasks
                } else return []
            },
            draggingEvent() {
                return this.$store.state.taskItemDragging
            },
        },
        methods: {
            toggleAddBoard() {
                this.$store.commit('toggleModal', 'addBoard')
            },
            toggleAddColumn() {
                this.$store.commit('toggleModal', 'addColumn')
            },
            toggleEditBoard() {
                this.$store.commit('toggleModal', 'editBoard')
            },
            toggleAddTask() {
                this.$store.commit('toggleModal', 'addTask')
            }
        }
    }
</script>

<style lang="scss" scoped>
    main {
        width: 100%;
        height: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        padding: 1.5rem 1rem 2rem;
    }
    .empty-list-container {
        width: 100%;
        height: 100%;
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
        height: 100%;
        display: flex;
        gap: 1.5rem;
    }
    .new-column-container {
        width: 17.5rem;
        min-width: 17.5rem;
        margin-top: 2.5rem;
        padding: 1rem;
        border-radius: $button-container-radius;
        h1 {
            color: $color-g !important;
        }
        &:hover h1 {
            color: $color-a !important;
        }
    }
    .task-column-list {
        width: 17.5rem;
        height: 100%;
        min-width: 17.5rem;
    }
    .task-list-items-container {
        min-height: calc(100% - 2.5rem);
        height: 0;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        margin-top: 1.5rem;
        padding-bottom: 2.5rem;
        overflow-y: auto;
        user-select: none;
        -webkit-user-select: none; 
        -moz-user-select: none; 
    }
    .mouseover-active {
        border-radius: 0.5rem;
        li {
            opacity: 0.5
        }
    }
    @media (min-width: $tablet) {
        main {
            padding: 1.5rem 1.5rem 2rem;
        }
    }
</style>