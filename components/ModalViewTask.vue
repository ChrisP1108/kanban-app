<template>
    <div class="modal-styling">
        <h2>{{ selectedTask.title }}</h2>
        <p class="task-description-text">{{ selectedTask.description }}</p>
        <FieldInput class="task-subtask-checklist" :label="subtasksCheckedQty()" type="list" :input="task.subtasks" 
            placeholder="e.g. Make coffee" @value-change="(value) => task.subtasks = value"  
        />
        <FieldInput class="task-status" label="Current Status" type="dropdown" :input="task.status" 
            :dropdown-options="boardColumns" @value-change="(value) => statusValueChange(value)" 
        />
    </div>
</template>

<script>
    import { httpPut } from '../services/httpClient';

    export default {
        data() {
            return {
                task: {
                    subtasks: [],
                    status: ''
                }
            }
        },
        computed: {
            taskId() {
                return this.$store.state.taskSelected
            },
            selectedTask() {
                const boards = this.$store.state.userData.boards.find(board => board._id === this.$store.state.boardSelected);
                return boards.tasks.find(task => task._id === this.$store.state.taskSelected);
            },
            boardColumns() {
                return this.$store.state.userData.boards
                    .find(board => board._id === this.$store.state.boardSelected).columns;
            }
        },
        created() {
            this.task.subtasks = this.selectedTask.subtasks;
            this.task.status = this.selectedTask.status
        },
        methods: {
            subtasksCheckedQty() {
                return `Subtasks (${this.task.subtasks.filter(task => task.checked).length} 
                    of ${this.task.subtasks.length})`
            },
            async statusValueChange(value) {
                this.task.status = value;
                const updateReq = await httpPut(`/tasks/${this.taskId}/status`, { status: value });
                if (updateReq.status === 200) {
                    this.$store.commit('updateTaskStatus', value)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modal-styling {
        width: 100%;
        padding-bottom: 0.5rem !important;
    }

    .task-description-text {
        color: $color-g !important;
    }
</style>