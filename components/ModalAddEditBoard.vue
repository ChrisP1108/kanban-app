<template>
    <div class="modal-styling">
        <h2>{{ mode === 'addBoard' ? 'Add New Board' : mode === 'editBoard' ? 'Edit Board' : 'Error'}}</h2>
        <FieldInput @value-change="(value) => board.name = value" label="Board Name" type="text"
            :input="board.name" placeholder="e.g. Web Design" :errorCheck="fieldErrors" />
        <FieldInput @value-change="(value) => board.columns = value" label="Board Columns" type="list"
            :input="board.columns" placeholder="e.g. Todo" :errorCheck="fieldErrors" />
        <button v-if="board.columns.length <= 8" @click="addColumn" class="button-secondary">
            + <span class="ml-1"> 
                Add New Column
            </span>
        </button>
        <button @click="boardSubmit" class="button-primary-s">{{ mode === 'addBoard' ? 'Create New Board' 
            : mode === 'editBoard' ? 'Update Board' : 'Error'}}
        </button>
    </div>
</template>

<script>
    export default {
        props: {
            mode: String
        },
        computed: {
            errorMsg() {
                return this.$store.state.fieldErrorMsg
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
            addColumn() {
                const columns = this.board.columns;
                if (columns[columns.length - 1] !== '') {
                    this.board.columns.push('')
                } 
            },
            deleteColumn(index) {
                if (index > 0) {
                    this.board.columns = this.board.columns.filter((item, i) => 
                    i !== index);
                }
            },
            setTaskStatus(option) {
                this.task.status = option;
            },
            fieldEmpty(field) {
                if (!field && this.fieldErrors) {
                    return true
                } else return false
            },
            boardSubmit() {
                const { name, columns } = this.board;
                if (!name || !columns[0]) {
                    this.fieldErrors = true;
                    return
                } else this.fieldErrors = false;
                alert(JSON.stringify(this.board));
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modal-styling {
        width: 100%;
    }
    .button-secondary {
        margin-bottom: 1.5rem !important;
    }
</style>