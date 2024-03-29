<template>
    <li :class="[ dragging ? 'dragging' : '', 'task-list-item']" :data-id="task._id"
        @click="itemClicked">
        <h3 :class="[dragging ? 'disable-highlight' : '']">{{ task.title }}</h3>
        <div class="subtask-checkmark-container">
            <b :class="[allSubtasksChecked ? 'strike-through' : '']">
                {{ subtasksCheckedQty() }} of {{ task.subtasks.length }} subtasks
            </b>
            <div v-if="allSubtasksChecked">
                <CheckmarkIcon />
            </div>
        </div>
    </li>
</template>

<script>
    import { httpPut, httpStatusCode } from '../services/httpClient';
    export default {
        data() {
            return {
                dragging: false
            }
        },
        props: {
            task: {
                type: Object,
                default: () => { }
            }
        },
        computed: {
            allSubtasksChecked() {
                return this.task.subtasks.every(sub => sub.checked)
            },
            draggingEvent() {
                return this.$store.state.taskItemDragging
            }
        },
        methods: {
            itemClicked() {
                this.$store.commit('selectTask', this.task._id);
                this.$store.commit('toggleModal', 'viewTask');
            },
            subtasksCheckedQty() {
                return this.task.subtasks.filter(subtask => subtask.checked).length
            },
            async statusValueChange(value) {
                const updateReq = await httpPut(`/tasks/${this.task._id}/status`, { status: value });
                if (updateReq.status === 200) {
                    this.$store.commit('updateTask', {...this.task, status: value })
                } else {
                    if (httpStatusCode(updateReq) === 401) {
                        this.$router.push('/login')
                    }
                    this.$store.commit('setModalErrorMessage', `changing task status in "${this.task.title}"`)
                    this.$store.commit('toggleModal', 'error')
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    b {
        color: $color-g !important;
    }
    .task-list-item {
        padding: 1.25rem 1rem;
        border-radius: $button-container-radius;
        cursor: pointer;
        &:hover {
            h3 {
                color: $color-a !important;
            }
        }
    }
    .strike-through {
        text-decoration: line-through;
    }
    .subtask-checkmark-container {
        margin-top: 0.1875rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-height: 1.625rem;
    }
    .dragging {
        position: fixed;
        width: 17.5rem;
        user-select: none;
        -webkit-user-select: none; 
        -moz-user-select: none; 
        transition: 0s !important;
    }
    .disable-highlight {
        user-select: none;
        pointer-events: none !important;
        -webkit-user-select: none; 
        -moz-user-select: none;
    }
</style>