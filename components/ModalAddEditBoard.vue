<template>
    <div class="modal-styling" @keyup="checkEnterKeypress">
        <h2>{{ mode === 'addBoard' ? 'Add New Board' : mode === 'editBoard' ? 'Edit Board' : 'Error'}}</h2>
        <FieldInput :input="board.name" placeholder="e.g. Web Design" :empty-check="fieldsEmpty"  
            label="Board Name" type="text" @value-change="(value) => board.name = value" 
        />
        <FieldInput :input="board.columns" placeholder="e.g. Todo" :empty-check="fieldsEmpty" 
            label="Board Columns" type="list" @value-change="(value) => board.columns = value" 
        />
        <button v-if="board.columns.length <= 8" class="button-secondary" @click="addColumn">
            + <span class="ml-1"> 
                Add New Column
            </span>
        </button>
        <button class="button-primary-s" @click="boardSubmit">{{ mode === 'addBoard' ? 'Create New Board' 
            : mode === 'editBoard' ? 'Update Board' : 'Error'}}
        </button>
    </div>
</template>

<script>
    export default {
        props: {
            mode: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                board: {
                    name: '',
                    columns: ['Todo', 'Doing'],
                },
                fieldsEmpty: false
            }
        },
        computed: {
            errorMsg() {
                return this.$store.state.fieldEmptyMsg
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
                    i !== index && item);
                }
            },
            setTaskStatus(option) {
                this.task.status = option;
            },
            fieldEmpty(field) {
                if (!field && this.fieldsEmpty) {
                    return true
                } else return false
            },
            checkEnterKeypress(e) {
                if (e.key === 'Enter') {
                    this.boardSubmit();
                }
            },
            boardSubmit() {
                const { name, columns } = this.board;
                if (!name || !columns[0]) {
                    this.fieldsEmpty = true;
                    return
                } else this.fieldsEmpty = false;
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