<template>
    <div class="modal-styling">
        <h2>{{ mode === 'addTask' ? 'Add New Task' : 'editTask' ? 'Edit Task' : 'Error'}}</h2>
        <b>Title</b>
        <input placeholder="e.g. Take coffee break" type="text" />
        <b>Description</b>
        <textarea placeholder="e.g. It’s always good to take a break. This 15 minute break will  recharge the batteries a little."  />
        <b>Subtasks</b>
        <div class="sub-task-item">
            <input placeholder="e.g. Make coffee" type="text" />
            <img src="/assets/images/subtask-x.svg" alt="delete-subtask">
        </div>
        <button class="button-secondary">
            + <span class="ml-1"> 
                Add New Subtask
            </span>
        </button>
    </div>
</template>

<script>
    export default {
        props: {
            mode: String
        }
    }
</script>

<style lang="scss" scoped>
    .sub-task-item {
        display: flex;
        padding: 0.5rem 0 0.25rem;

        input {
            margin: 0;
        }

        img {
            cursor: pointer;
            padding: 1rem;
            margin: -1rem -1rem -1rem 0;
        }
    }
    .button-secondary {
        margin-top: 0.5rem;

        span {
            font-weight: $bold;
        }
    }
</style>