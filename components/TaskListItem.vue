<template>
    <li class="task-list-item" @click="itemClicked">
        <h3>{{ task.title }}</h3>
        <b>{{ subtasksCheckedQty() }} of {{ task.subtasks.length }} subtasks</b>
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
    .task-list-item {
        padding: 1.5rem 1rem;
        border-radius: 0.5rem;
        cursor: pointer;

        &:hover {
            h3 {
                color: $color-a !important;
            }
        }
    }
    h3 {
        margin-bottom: 0.25rem;
    }
    b {
        color: $color-g !important;
    }
</style>