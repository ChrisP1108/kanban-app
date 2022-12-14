<template>
    <div class="modal-styling scrollbar-styling" @keyup="checkEnterKeypress">
        <h2>{{ mode === 'addBoard' ? 'Add New Board' : mode === 'editBoard' ? 'Edit Board' : 'Error'}}</h2>
        <FieldInput class="board-name" label="Board Name" type="text" :input="board.name" 
            placeholder="e.g. Web Design" :empty-check="fieldsEmpty" :error-message="board.name.errMsg" 
            :has-error="board.name.hasError" :duplicates="{ haveDuplicates: false, array: boardNames, multiInputs: false }" 
            @value-change="(value) => board.name.value = value" @error-found="(value) => board.name.errFound = value"
        />
        <FieldInput class="board-columns" label="Board Columns" type="list" :input="{ value: board.columns.values }"
            placeholder="e.g. Todo" :duplicates="{ haveDuplicates: false, array: board.columns.values, multiInputs: true }"
            @value-change="(value) => board.columns.values = value" @error-found="(value) => board.columns.errFound = value"
        />
        <button v-if="board.columns.values.length <= 8" 
            :class="[board.columns.values[board.columns.values.length - 1] === '' ?'add-column-disabled' : '', 'button-secondary']" 
            @click="addColumn">
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
    import { httpPut, httpPost, httpErrMsg, httpStatusCode } from '../services/httpClient';
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
                        errMsg: '',
                        errFound: false
                    },
                    columns: {
                        values: [
                            { 
                                canModify: true, 
                                value: '' 
                            }
                        ],
                        hasError: false,
                        errMsg: '',
                        errFound: false
                    }
                },
                fieldsEmpty: false,
                isLoading: false,
            }
        },
        computed: {
            errorMsg() {
                return this.$store.state.fieldEmptyMsg
            },
            boardList() {
                return this.$store.state.userData.boards
            },
            boardNames() {
                return this.boardList.map(board => ({ _id: board._id, value: board.name }) )
            },
            selectedId() {
                return this.$store.state.boardSelected
            },
            selectedBoard() {
                return [...this.$store.state.userData.boards].find(board => 
                    board._id === this.$store.state.boardSelected);
            }
        },
        created() {
            if (this.mode === 'editBoard') {
                this.board.name= { ...this.board.name, _id: this.selectedBoard._id, value: this.selectedBoard.name };
                this.board.columns.values = this.selectedBoard.columns.length !== 0 
                    ? this.selectedBoard.columns.map(column => {
                        return {
                            canModify: !this.selectedBoard.tasks.some(task => task.status === column),
                            value: column
                        } 
                    }).sort((a, b) => a.value > b.value ? 1 : -1) 
                    : [{ 
                        canModify: true, 
                        value: '' 
                    }]
                ;
            }
        },
        methods: {
            addColumn() {
                const columns = this.board.columns.values;
                if (columns[columns.length - 1].value !== '') {
                    this.board.columns.values.push( { canModify: true, value: '' } )
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

                // Clear Any Previous Error Highlighted Fields For Fresh Check

                this.board.name.hasError = false;
                this.board.columns.hasError = false;

                // Exit If Field Input Component Found An Error

                if (this.board.name.errFound || this.board.columns.errFound) {
                    return null
                }

                // Check That Name Fields Is Not Empty.  Column Field Optional

                if (!this.board.name.value) {
                    this.fieldsEmpty = true;
                    return null
                } else this.fieldsEmpty = false;

                // Format Fields For HTTP

                const name = caseFormatAll(this.board.name.value);
                const columns = this.board.columns.values[0].value !== ''
                    ? this.board.columns.values.map(column => caseFormatAll(column.value))
                        .filter(column => column.value !== '')
                    : [];

                // Capitalize Name And Title And Filter Empty Columns

                this.board.name.value = this.board.name.value ? caseFormatAll(this.board.name.value) : '';
                this.board.columns.values = this.board.columns.values[0].value !== '' ? this.board.columns.values
                    .map(column => ({ value: caseFormatAll(column.value), canModify: column.canModify }))
                    : [{ canModify: true, value: ''}]
                ;

                // HTTP Request Variables

                let reqError = false;
                let reqMade = null;

                this.isLoading = true;

                // Add Board HTTP Post Request And Store Commit If No Errors

                if (this.mode === 'addBoard') {
                    const addReq = await httpPost('/boards', { name, columns});
                    if (addReq.status === 201) {
                        reqError = false;
                        const _id = addReq.data._id;
                        this.board.name.hasError = false;
                        this.board.columns.hasError = false;
                        this.$store.commit('addBoard', { _id, name, columns });
                        this.$store.commit('toggleModal');
                    } else {
                        this.isLoading = false;
                        if (httpStatusCode(addReq) === 401) {
                            this.$router.push('/login')
                        }
                        if (httpStatusCode(addReq) >= 404) {
                            this.$store.commit('setModalErrorMessage', `adding board "${name}"`)
                            this.$store.commit('toggleModal', 'error')
                        } else {
                            reqError = true;
                            reqMade = addReq;
                        }
                    }

                // Edit Board HTTP Put Request And Store Commit If No Errors

                } else if (this.mode === 'editBoard') {
                    const _id = this.selectedId;
                    const updateReq = await httpPut(`/boards/${_id}`, { name, columns })
                    if (updateReq.status === 200) {
                        reqError = false;
                        this.board.name.hasError = false;
                        this.board.columns.hasError = false;
                        this.$store.commit('updateBoard', { name, columns })
                        this.$store.commit('toggleModal')
                    } else {
                        this.isLoading = false;
                        if (httpStatusCode(updateReq) === 401) {
                            this.$router.push('/login')
                        }
                        if (httpStatusCode(updateReq) >= 404) {
                            this.$store.commit('setModalErrorMessage', `editing board "${name}"`)
                            this.$store.commit('toggleModal', 'error')
                        } else {
                            reqError = true;
                            reqMade = updateReq;
                        }
                    }
                }

                // Error Handling

                if (reqError) {
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
                    if (this.errorMessage.includes('Duplicate column names not allowed')) {
                        this.board.columns.hasError = true;
                        this.board.columns.errMsg = 'no duplicate names';
                    } else this.board.columns.hasError = false;
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
    .add-column-disabled {
        cursor: auto !important;
    }
</style>