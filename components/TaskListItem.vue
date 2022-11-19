<template>
    <li class="task-list-item" @click="itemClicked">
        <h3>{{ task.title }}</h3>
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
    export default {
        props: {
            task: {
                type: Object,
                default: () => { }
            }
        },
        computed: {
            allSubtasksChecked() {
                return this.task.subtasks.every(sub => sub.checked)
            }
        },
        methods: {
            itemClicked() {
                this.$store.commit('selectTask', this.task._id);
                this.$store.commit('toggleModal', 'viewTask');
            },
            subtasksCheckedQty() {
                return this.task.subtasks.filter(subtask => subtask.checked).length
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
</style>