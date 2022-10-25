<template>
    <div class="modal-styling" @keyup="checkEnterKeypress">
        <h2>{{ mode === 'addBoard' ? 'Add New Board' : mode === 'editBoard' ? 'Edit Board' : 'Error'}}</h2>
        <FieldInput class="board-name" label="Board Name" type="text" :input="board.name.value" 
            placeholder="e.g. Web Design" :empty-check="fieldsEmpty" :error-message="board.name.errMsg" 
            :has-error="board.name.hasError" @value-change="(value) => board.name.value = value" 
        />
        <FieldInput class="board-columns" label="Board Columns" type="list" :input="board.columns.value"
            placeholder="e.g. Todo" :empty-check="fieldsEmpty" :error-message="board.columns.errMsg"
            :has-error="board.columns.hasError" @value-change="(value) => board.columns.value = value" 
        />
        <button v-if="board.columns.value.length <= 8" class="button-secondary" @click="addColumn">
            + <span class="ml-1"> 
                Add New Column
            </span>
        </button>
        <button :class="[isLoading ? 'button-primary-active' : '', 'button-primary-s']" @click="boardSubmit">
            <div v-if="isLoading" class="button-content">
                <LoadingIcon />
            </div>
            <div v-if="!isLoading" class="button-content">
                {{ mode === 'addBoard' ? 'Create New Board' 
                : mode === 'editBoard' ? 'Update Board' : 'Error'}}
            </div>
        </button>
    </div>
</template>

<script>
import { httpPut, httpPost, httpErrMsg } from '../services/httpClient';
import { caseFormatAll } from '../services/caseFormatting';

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
                    name: {
                        value: '',
                        hasError: false,
                        errMsg: ''
                    },
                    columns: {
                        value: [''],
                        hasError: false,
                        errMsg: ''
                    }
                },
                fieldsEmpty: false,
                isLoading: false
            }
        },
        computed: {
            errorMsg() {
                return this.$store.state.fieldEmptyMsg
            },
            boardList() {
                return this.$store.state.userData.boards
            },
            selectedId() {
                return this.$store.state.boardSelected ? this.$store.state.boardSelected : this.boardList[0].id
            }
        },
        created() {
            if (this.mode === 'editBoard') {
                const boardSelected = [...this.boardList].find(board => board.id === this.selectedId);
                this.board.name.value = boardSelected.name;
                this.board.columns.value = [...boardSelected.columns];
            }
        },
        methods: {
            addColumn() {
                const columns = this.board.columns;
                if (columns[columns.length - 1] !== '') {
                    this.board.columns.value.push('')
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
            async boardSubmit() {
                this.board.name.value = this.board.name.value ? caseFormatAll(this.board.name.value) : '';
                this.board.columns.value = this.board.columns.value
                    .filter(column => column !== '')
                    .map(column => caseFormatAll(column));
                const name = this.board.name.value;
                const columns = this.board.columns.value;
                if (!name || !columns[0]) {
                    this.fieldsEmpty = true;
                } else {
                    let reqError = false;
                    let reqMade = null;
                    this.isLoading = true;
                    if (this.mode === 'addBoard') {
                        const addReq = await httpPost('/boards', { name, columns});
                        if (addReq.status === 201) {
                            const id = addReq.data._id;
                            this.board.name.hasError = false;
                            this.board.columns.hasError = false;
                            this.$store.commit('addBoard', { name, columns, id })
                            this.$store.commit('toggleModal')
                        } else {
                            reqError = true;
                            reqMade = addReq;
                        }
                    } else if (this.mode === 'editBoard') {
                        const id = this.selectedId;
                        const updateReq = await httpPut(`/boards/${id}`, { name, columns })
                        if (updateReq.status === 200) {
                            this.board.name.hasError = false;
                            this.board.columns.hasError = false;
                            this.$store.commit('updateBoard', { name, columns, id })
                            this.$store.commit('toggleModal')
                        } else {
                            reqError = true;
                            reqMade = updateReq;
                        }
                    }
                    if (reqError) {
                        this.isLoading = false;
                        this.errorMessage = httpErrMsg(reqMade);
                        if (this.errorMessage.includes('add a board name')) {
                            this.board.name.hasError = true;
                            this.board.name.errMsg = 'add name';
                        } else this.board.name.hasError = false;
                        if (this.errorMessage.includes('duplicate name already exists')) {
                            this.board.name.hasError = true;
                            this.board.name.errMsg = 'name already exists';
                        } else this.board.name.hasError = false;
                        if (this.errorMessage.includes('add at least one board column')) {
                            this.board.columns.hasError = true;
                            this.board.columns.errMsg = 'one column minimum';
                        } else this.board.columns.hasError = false;
                    }
                }
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