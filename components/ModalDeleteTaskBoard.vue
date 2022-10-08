<template>
    <div class="modal-styling">
        <h2>Delete this {{ deletingTask ? 'task' : deletingBoard ? 'board' : '[Error]'}}?</h2>
        <p>Are you sure you want to delete the '' {{ deletingTask ? 'task and its subtasks' 
            : deletingBoard ? 'board' : '[Error]'}} ? This action {{ deletingTask  
            ? '' : deletingBoard ? 'will remove all columns and tasks and' : '[Error]'}} 
            cannot be reversed.</p>
        <button @click="confirmDelete" class="button-destructive">Delete</button>
        <button @click="cancelDelete" class="button-secondary">
            Cancel
        </button>
    </div>
</template>

<script>
    export default {
        props: {
            mode: String,
            deleting: Number
        },
        computed: {
            errorMsg() {
                return this.$store.state.fieldErrorMsg
            },
            deletingTask() {
                return this.mode === 'deleteTask'
            },
            deletingBoard() {
                return this.mode === 'deleteBoard'
            }
        },
        data() {
            return {
                board: {
                    name: '',
                    columns: ['Todo', 'Doing'],
                },
                fieldErrors: false
            }
        },
        methods: {
            confirmDelete() {
                alert('Item Deleted')
            },
            cancelDelete() {
                this.$store.commit('toggleModal')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modal-styling {
        width: 100%;
    }
    h2 {
        color: $color-j !important;
    }
    p {
        color: $color-g !important;
    }
    .button-destructive {
        margin: 1.5rem 0 1rem !important;
    }
    .button-secondary {
        margin: 0 !important;
    }
</style>