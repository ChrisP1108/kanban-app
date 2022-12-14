<template>
    <div class="modal-styling scrollbar-styling" @keyup="checkEnterKeypress">
        <h2>{{ mode === 'addTask' ? 'Add New Task' : mode === 'editTask' ? 'Edit Task' : 'Error'}}</h2>
        <FieldInput class="task-title" label="Title" type="text" :input="task.title" 
            placeholder="e.g. Take coffee break" :empty-check="fieldsEmpty" :error-message="task.title.errMsg" 
            :has-error="task.title.hasError" :duplicates="{ haveDuplicates: false, array: selectedBoardTaskNames, multiInputs: false }"
            @value-change="(value) => task.title.value = value" @error-found="(value) => task.title.errFound = value"
        />
        <FieldInput class="task-description" label="Description" type="textarea" :input="task.description" 
            placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little." 
            :empty-check="fieldsEmpty" :error-message="task.description.errMsg" :has-error="task.description.hasError"
            @value-change="(value) => task.description.value = value" @error-found="(value) => task.description.errFound = value"
        />
        <FieldInput class="task-subtasks" label="Subtasks" type="list" :input="{ value: task.subtasks.values }" 
            placeholder="e.g. Make coffee" :empty-check="fieldsEmpty" :error-message="task.subtasks.errMsg" 
            :has-error="task.subtasks.hasError" :duplicates="{ haveDuplicates: false, array: task.subtasks.values, multiInputs: true }"
            @value-change="(value) => task.subtasks.values = value" @error-found="(value) => task.subtasks.errFound = value"  
        />
        <button v-if="task.subtasks.values.length <= 8" class="button-secondary" @click="addSubTask">
            + <span class="ml-1"> 
                Add New Subtask
            </span>
        </button>
        <FieldInput class="task-status" label="Status" type="dropdown" :input="task.status" 
            :dropdown-options="dropdownOptions" :empty-check="fieldsEmpty" :error-message="task.status.errMsg" 
            :has-error="task.status.hasError" @value-change="(value) => task.status.value = value" 
            @error-found="(value) => task.status.errFound = value"
        />
        <button class="button-primary-s" @click="taskSubmit">
            <div v-if="isLoading" class="button-content">
                <LoadingIcon />
            </div>
            <div v-if="!isLoading" class="button-content">
                {{ mode === 'addTask' ? 'Create Task' : 'Update Task'}}
            </div>
        </button>
    </div>
</template>

<script>
    import { httpPost, httpPut, httpErrMsg, httpStatusCode } from '../services/httpClient';
    import { caseFormatFirst } from '../services/caseFormatting';

    export default {
        props: {
            mode: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                task: {
                    title: {
                        value: '',
                        hasError: false,
                        errMsg: '',
                        errFound: false
                    },
                    description: {
                        value: '',
                        hasError: false,
                        errMsg: '',
                        errFound: false
                    },
                    subtasks: {
                        values: [
                            { 
                                canModify: true, 
                                value: '',
                                checked: false 
                            }
                        ],
                        hasError: false,
                        errMsg: '',
                        errFound: false
                    },
                    status: {
                        value: '',
                        hasError: false,
                        errMsg: '',
                        errFound: false
                    }
                },
                dropdownOptions: [],
                fieldsEmpty: false,
                isLoading: false,
            }
        },
        computed: {
            selectedBoard() {
                return [...this.$store.state.userData.boards].find(board => 
                    board._id.toString() === this.$store.state.boardSelected)
            },
            selectedBoardTaskNames() {
                return this.selectedBoard.tasks.map(task => ({ _id: task._id, value: task.title }) )
            },
            selectedTask() {
                return this.selectedBoard.tasks.find(task => task._id.toString() === this.$store.state.taskSelected)
            }
        },
        created() {
            this.dropdownOptions = this.selectedBoard.columns;
            if (this.mode === 'addTask') {
                this.task.status.value = this.selectedBoard.columns[0]
            }
            if (this.mode === 'editTask') {
                this.task.title = { ...this.task.title, _id: this.selectedTask._id, value: this.selectedTask.title };
                this.task.description.value = this.selectedTask.description;
                this.task.subtasks.values = this.selectedTask.subtasks.map(subtask => 
                ({ ...subtask, canModify: true, value: subtask.name  }));
                this.task.status.value = this.selectedTask.status;
            }
        },
        methods: {
            addSubTask() {
                const subtasks = this.task.subtasks.values;
                if (subtasks[subtasks.length - 1].value !== '') {
                    this.task.subtasks.values.push( { canModify: true, value: '', checked: false } )
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
                    this.taskSubmit();
                }
            },
            async taskSubmit() {

                // Clear Any Previous Error Highlighted Fields For Fresh Check

                this.task.title.hasError = false;
                this.task.description.hasError = false;
                this.task.subtasks.hasError = false;
                this.task.status.hasError = false;

                // Exit If Field Input Component Found An Error

                if (this.task.title.errFound || this.task.description.errFound || this.task.subtasks.errFound
                    || this.task.status.errFound) {
                        return null
                }

                // Check For Empty Fields

                if (!this.task.title.value || !this.task.description.value 
                    || !this.task.subtasks.values[0].value || !this.task.status.value) {
                    this.fieldsEmpty = true;
                    return null
                } else this.fieldsEmpty = false;

                // Capitalize Fields

                this.task.title.value = caseFormatFirst(this.task.title.value);
                this.task.description.value = caseFormatFirst(this.task.description.value);
                this.task.subtasks.values = this.task.subtasks.values
                    .filter(task => task.value !== '' && typeof task.value === 'string')
                    .map(subtask => ({...subtask, name: caseFormatFirst(subtask.value)}
                ));

                // Destructuring Variable Names

                const title = this.task.title.value;
                const description = this.task.description.value;
                const subtasks = [...this.task.subtasks.values].map(subtask => 
                    ({ name: subtask.value , checked: subtask.checked !== undefined ? subtask.checked : false } ));
                const status = this.task.status.value;
                const boardId = this.selectedBoard._id;

                // HTTP Request Variables

                let reqError = false;
                let reqMade = null;

                this.isLoading = true;

                // HTTP Post Request For Adding Task And Store Commit If No Errors

                if (this.mode === 'addTask') {
                    const addedTask = { title, description, subtasks, status }
                    const addReq = await httpPost('/tasks', {...addedTask, boardId });
                    if (addReq.status === 201) {
                        reqError = false;
                        addedTask.subtasks = addReq.data.subtasks;
                        addedTask._id = addReq.data._id;
                        this.task.title.hasError = false;
                        this.task.description.hasError = false;
                        this.task.subtasks.hasError = false;
                        this.task.status.hasError= false;
                        this.$store.commit('addTask', addedTask);
                        this.$store.commit('toggleModal');
                    } else {
                        this.isLoading = false;
                        if (httpStatusCode(addReq) === 401) {
                            this.$router.push('/login')
                        }
                        if (httpStatusCode(addReq) >= 404) {
                            this.$store.commit('setModalErrorMessage', `adding task "${title}"`)
                            this.$store.commit('toggleModal', 'error')
                        } else {
                            reqError = true;
                            reqMade = addReq;
                        }
                    }
                }

                // HTTP Put Request For Updating Task And Store Commit If No Errors

                if (this.mode === 'editTask') {
                    const updatedTask = { _id: this.selectedTask._id, title, description, subtasks, status }
                    const updateReq = await httpPut(`/tasks/${this.selectedTask._id}`, updatedTask);
                    if (updateReq.status === 200) {
                        reqError = false;
                        updatedTask.subtasks = updateReq.data.subtasks;
                        this.$store.commit('updateTask', updatedTask);
                        this.$store.commit('toggleModal');
                    } else {
                        this.isLoading = false;
                        if (httpStatusCode(updateReq) === 401) {
                            this.$router.push('/login')
                        }
                        if (httpStatusCode(updateReq) >= 404) {
                            this.$store.commit('setModalErrorMessage', `editing task "${title}"`)
                            this.$store.commit('toggleModal', 'error')
                        } else {
                            reqError = true;
                            reqMade = updateReq;
                        }
                    }
                }

                // HTTP Error Handling

                if (reqError) {
                    this.errorMessage = httpErrMsg(reqMade);
                    if (this.errorMessage.includes('Please add a task title')) {
                        this.task.title.hasError = true;
                        this.task.title.errMsg = 'add title';
                    } else this.task.title.hasError = false;
                    if (this.errorMessage.includes('duplicate title in the same board already exists')) {
                        this.task.title.hasError = true;
                        this.task.title.errMsg = 'duplicate name exists';
                    } else this.task.title.hasError = false;
                    if (this.errorMessage.includes('Please add a task description')) {
                        this.task.description.hasError = true;
                        this.task.description.errMsg = 'add description';
                    } else this.task.description.hasError = false;
                    if (this.errorMessage.includes('Please add at least one subtask')) {
                        this.task.subtasks.hasError = true;
                        this.task.subtasks.errMsg = 'one subtask minimum';
                    } else this.task.subtasks.hasError = false;
                    if (this.errorMessage.includes('Cannot have two subtasks with the same name')) {
                        this.task.subtasks.hasError = true;
                        this.task.subtasks.errMsg = 'no duplicate names';
                    } else this.task.subtasks.hasError = false;
                    if (this.errorMessage.includes('Please add a task status')) {
                        this.task.status.hasError = true;
                        this.task.status.errMsg = 'select task status';
                    } else this.task.status.hasError = false;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modal-styling {
        width: 100%;
    }
</style>