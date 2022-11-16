<template>
    <div class="modal-styling scrollbar-styling" @keyup="checkEnterKeypress">
        <h2>Add Column To Board "{{ selectedBoard.name }}"</h2>
        <h3>Current Board Columns:</h3>
        <ul>
            <li v-for="(column, index) in boardColumns" :key="index">
                {{ column  + ` (${selectedBoard.tasks.filter(task => task.status === column).length})`}}
            </li>
        </ul>
        <p>Note: Columns That Have No Tasks With The Corresponding Task Status Value Will Not Display On The Dashboard Until Task(s) Have Their Status Set To Them.</p>
        <FieldInput class="column-name" label="Column" type="text" :input="column" 
            placeholder="e.g. Web Design" :empty-check="fieldsEmpty" :error-message="column.errMsg" 
            :has-error="column.hasError" :duplicates="{ haveDuplicates: false, array: columnNames, multiInputs: false }" 
            @value-change="(value) => column.value = value" @error-found="(value) => column.errFound = value"
        />
        <button :class="[isLoading ? 'button-primary-active' : '', 'button-primary-s']" @click="columnSubmit">
            <div v-if="isLoading" class="button-content">
                <LoadingIcon />
            </div>
            <div v-if="!isLoading" class="button-content">
                Add Column
            </div>
        </button>
    </div>
</template>

<script>
    import { httpPut, httpErrMsg, httpStatusCode } from '../services/httpClient';
    import { caseFormatAll } from '../services/caseFormatting';

    export default {
        data() {
            return {
                column: {
                    value: '',
                    hasError: false,
                    errMsg: '',
                    errFound: false
                },
                isLoading: false,
                fieldsEmpty: false
            }
        },
        computed: {
            selectedBoard() {
                return [...this.$store.state.userData.boards].find(board => 
                    board._id === this.$store.state.boardSelected);
            },
            boardColumns() {
                return [...this.selectedBoard.columns.map(col => col).sort()]
            },
            columnNames() {
                return this.selectedBoard.columns.map(col => ({ value: col }))
            }
        },
        methods: {
            fieldEmpty(field) {
                if (!field && this.fieldsEmpty) {
                    return true
                } else return false
            },
            checkEnterKeypress(e) {
                if (e.key === 'Enter') {
                    this.columnSubmit();
                }
            },
            async columnSubmit() {

                // Clear Any Previous Error Highlighted Fields For Fresh Check

                this.column.hasError = false;

                // Exit If Field Input Component Found An Error

                if (this.column.errFound) {
                    return null
                }

                // Check That Column Field Is Not Empty.  Column Field Optional

                if (!this.column.value) {
                    this.fieldsEmpty = true;
                    return null
                } else this.fieldsEmpty = false;

                // Capitalize Before Making HTTP Request

                const column = caseFormatAll(this.column.value)

                this.isLoading = true;

                // Add Column To Board HTTP Post Request And Store Commit If No Errors

                const addReq = await httpPut(`/boards/${this.selectedBoard._id}/column`, { column });
                if (addReq.status === 200) {
                    this.$store.commit('updateBoard', 
                        { ...this.selectedBoard, columns: [...this.selectedBoard.columns, column] });
                    this.$store.commit('toggleModal');
                } else {
                    this.isLoading = false;
                    if (httpStatusCode(addReq) >= 404) {
                        this.$store.commit('setModalErrorMessage', `adding column "${column}"`)
                        this.$store.commit('toggleModal', 'error')
                    } else {
                        this.errorMessage = httpErrMsg(addReq);
                        if (this.errorMessage.includes('add a column')) {
                            this.column.hasError = true;
                            this.column.errMsg = "can't be empty";
                        } else this.column.hasError = false;
                        if (this.errorMessage.includes('duplicate name already exists')) {
                            this.column.hasError = true;
                            this.column.errMsg = 'duplicate exists';
                        } else this.column.hasError = false;
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
    .add-column-disabled {
        cursor: auto !important;
    }
    h2 {
        margin-bottom: 1.5rem !important;
    }
    h3 {
        margin-bottom: 1rem;
    }
    .column-name {
        margin-top: 1rem;
    }
    li {
        font-size: 0.875rem;
        font-weight: 500;
    }
    p {
        margin-top: 1rem;
        font-size: 0.6875rem !important;
        line-height: 1rem !important;
    }
</style>