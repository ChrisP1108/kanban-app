<template>
    <div class="modal-styling">
        <h2>{{ mode === 'addTask' ? 'Add New Task' : 'editTask' ? 'Edit Task' : 'Error'}}</h2>
    </div>
</template>

<script>
    export default {
        props: {
            mode: String
        }
    }
</script>

<style>
    h2 {
        color: red;
    }
</style>