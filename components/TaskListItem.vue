<template>
    <li :class="[ dragging ? 'dragging' : '', 'task-list-item']" :data-id="task._id"
        @click="itemClicked" @mousedown="mouseDown">
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
    import { httpPut } from '../services/httpClient';
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
        mounted() {
            window.addEventListener('mousemove', (e) => { 
                const item = e.path[0];
                if (this.dragging && item.dataset.id === this.task._id) {
                    this.$store.commit('setTaskItemDragging', { isDragging: true, columnName: this.task.status });
                    item.style.pointerEvents = 'none';
                    setTimeout(() => {
                        item.style.pointerEvents = 'auto';
                        item.style.top = (e.y - item.scrollHeight / 2) + 'px';
                        item.style.left = (e.x - item.scrollWidth / 2) + 'px';
                    }, 5)
                }
            });
            window.addEventListener('mouseup', () => {
                if (this.dragging) {
                    if (this.draggingEvent.columnName !== this.task.status) {
                        this.dragging = false;
                        setTimeout(() => {
                            this.$store.commit('toggleModal');
                        });
                        this.statusValueChange(this.draggingEvent.columnName)
                        this.$store.commit('setTaskItemDragging', { isDragging: false, columnName: '' });
                    }
                }
            })
            window.addEventListener('click', () => {
                this.dragging = false;
                this.$store.commit('setTaskItemDragging', { isDragging: false, columnName: '' });
            })
        },
        methods: {
            itemClicked() {
                this.$store.commit('selectTask', this.task._id);
                this.$store.commit('toggleModal', 'viewTask');
            },
            subtasksCheckedQty() {
                return this.task.subtasks.filter(subtask => subtask.checked).length
            },
            mouseDown() {
                setTimeout(() => {
                    if (!this.$store.state.modals.viewTask.toggled) {
                        this.dragging = true;
                    }
                }, 250)
            },
            async statusValueChange(value) {
                const updateReq = await httpPut(`/tasks/${this.task._id}/status`, { status: value });
                if (updateReq.status === 200) {
                    this.$store.commit('updateTask', {...this.task, status: value })
                } else {
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