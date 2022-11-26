<template>
    <div class="modal-styling scrollbar-styling">
        <div class="heading-nav-container">
            <h2>{{ selectedTask.title }}</h2>
            <img class="dot-nav" src="assets/images/dot-nav.svg" @click="toggleTaskDropdown">
            <nav class="dropdown-list">
                <DropdownList :dropdown-toggled="taskDropdownToggled" :dropdown-options="taskDropdownOptions" 
                    @option-selected="toggleOption" />
            </nav>
        </div>
        <p class="content-theme-text">{{ selectedTask.description }}</p>
        <FieldInput class="task-subtask-checklist" :label="subtasksCheckedQty()" type="checklist" 
            :input="{ value: subtasks } " @value-change="(value) => subtaskChecked(value)"  
        />
        <FieldInput class="task-status" label="Current Status" type="dropdown" :input="{ value: selectedTask.status }" 
            :dropdown-options="boardColumns" @value-change="(value) => statusValueChange(value)" 
        />
    </div>
</template>

<script>
    import { cloneDeep } from 'lodash-es';
    import { httpPut, httpStatusCode } from '../services/httpClient';

    export default {
        data() {
            return {
                taskDropdownToggled: false,
                taskDropdownOptions: ['Edit Task', 'Delete Task']
            }
        },
        computed: {
            selectedTask() {
                return [...this.$store.state.userData.boards].find(board => board._id.toString() === this.$store.state.boardSelected)
                    .tasks.find(task => task._id.toString() === this.$store.state.taskSelected)
            },
            boardColumns() {
                return [...this.$store.state.userData.boards]
                    .find(board => board._id.toString() === this.$store.state.boardSelected).columns
            },
            subtasks() {
                const task = [...this.$store.state.userData.boards].find(board => board._id.toString() === this.$store.state.boardSelected)
                    .tasks.find(task => task._id.toString() === this.$store.state.taskSelected);
                return cloneDeep([...task.subtasks].sort((a, b) => a.name > b.name ? 1 : -1))
            }
        },
        methods: {
            toggleTaskDropdown() {
                this.taskDropdownToggled = !this.taskDropdownToggled
            },
            toggleOption(value) {
                if (value === 'Edit Task') {
                    this.$store.commit('toggleModal', 'editTask')
                } else if (value === 'Delete Task') {
                    this.$store.commit('toggleModal', 'deleteTask')
                }
            },
            subtasksCheckedQty() {
                return `Subtasks (${this.selectedTask.subtasks.filter(task => task.checked).length} 
                    of ${this.selectedTask.subtasks.length})`
            },
            async statusValueChange(value) {
                const updateReq = await httpPut(`/tasks/${this.selectedTask._id}/status`, { status: value });
                if (updateReq.status === 200) {
                    this.$store.commit('updateTask', {...this.selectedTask, status: value })
                } else {
                    if (httpStatusCode(updateReq) === 401) {
                        this.$router.push('/login')
                    }
                    this.$store.commit('setModalErrorMessage', `changing task status in "${this.selectedTask.title}"`)
                    this.$store.commit('toggleModal', 'error')
                }
            },
            async subtaskChecked(value) {
                const updateReq = await httpPut(`/tasks/${this.selectedTask._id}/subtasks`, { subtasks: value });
                if (updateReq.status === 200) {
                    this.$store.commit('updateTask', {...this.selectedTask, subtasks: cloneDeep(value) })
                } else {
                    if (httpStatusCode(updateReq) === 401) {
                        this.$router.push('/login')
                    }
                    this.$store.commit('setModalErrorMessage', `checking subtask in "${this.selectedTask.title}"`)
                    this.$store.commit('toggleModal', 'error')
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

    .content-theme-text {
        color: $color-g !important;
        margin-bottom: 1rem;
    }
    .heading-nav-container {
        display: flex;
        gap: 10%;
        position: relative;
        justify-content: space-between;
        margin-bottom: 1rem;

        h2 {
            margin: 0 !important;
        }
    }
    nav {
        top: 2.5rem;
        left: 100%;
        transform: translateX(-100%);
    }
</style>