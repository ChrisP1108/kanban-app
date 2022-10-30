<template>
    <div class="modal-styling" @keyup="checkEnterKeypress">
        <h2>{{ mode === 'addTask' ? 'Add New Task' : mode === 'editTask' ? 'Edit Task' : 'Error'}}</h2>
        <FieldInput class="task-title" label="Title" type="text" :input="task.title.value" 
            placeholder="e.g. Take coffee break" :empty-check="fieldsEmpty" :error-message="task.title.errMsg" 
            :has-error="task.title.hasError" @value-change="(value) => task.title.value = value"  
        />
        <FieldInput class="task-description" label="Description" type="textarea" :input="task.description.value" 
            placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little." 
            :empty-check="fieldsEmpty" :error-message="task.description.errMsg" :has-error="task.description.hasError"
            @value-change="(value) => task.description.value = value"  
        />
        <FieldInput class="task-subtasks" label="Subtasks" type="list" :input="task.subtasks.value" 
            placeholder="e.g. Make coffee" :empty-check="fieldsEmpty" :error-message="task.subtasks.errMsg" 
            :has-error="task.subtasks.hasError" @value-change="(value) => task.subtasks.value = value"  
        />
        <button v-if="task.subtasks.value.length <= 8" class="button-secondary" @click="addSubTask">
            + <span class="ml-1"> 
                Add New Subtask
            </span>
        </button>
        <FieldInput class="task-status" label="Status" type="dropdown" :input="task.status.value" 
            :dropdown-options="dropdownOptions" :empty-check="fieldsEmpty" :error-message="task.status.errMsg" 
            :has-error="task.status.hasError" @value-change="(value) => task.status.value = value" 
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
    import { httpPost, httpErrMsg } from '../services/httpClient';
    import { caseFormatFirst , caseFormatAll } from '../services/caseFormatting';

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
                        errMsg: ''
                    },
                    description: {
                        value: '',
                        hasError: false,
                        errMsg: ''
                    },
                    subtasks: {
                        value: [''],
                        hasError: false,
                        errMsg: ''
                    },
                    status: {
                        value: '',
                        hasError: false,
                        errMsg: ''
                    }
                },
                dropdownOptions: [],
                fieldsEmpty: false,
                isLoading: false
            }
        },
        computed: {
            selectedBoard() {
                return this.$store.state.userData.boards.find(board => board._id === this.$store.state.boardSelected)
            }
        },
        created() {
            this.task.status.value = this.selectedBoard.columns[0];
            this.dropdownOptions = this.selectedBoard.columns;
        },
        methods: {
            addSubTask() {
                const subtasks = this.task.subtasks;
                if (subtasks[subtasks.length - 1] !== '') {
                    this.task.subtasks.value.push('')
                } 
            },
            deleteSubTask(index) {
                if (index > 0) {
                    this.task.subtasks.value = this.task.subtasks.value.filter((item, i) => 
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
                    this.taskSubmit();
                }
            },
            async taskSubmit() {

                // Capitalize Fields

                this.task.title.value = this.task.title.value ? caseFormatAll(this.task.title.value) : '';
                this.task.description.value = this.task.description.value ? caseFormatFirst(this.task.description.value) : '';
                this.task.subtasks.value = this.task.subtasks.value.length ? this.task.subtasks.value
                    .filter(task => task !== '')
                    .map(subtask => ({ name: caseFormatFirst(subtask), checked: false })) : [];

                // Check that fields are not empty

                const title = this.task.title.value;
                const description = this.task.description.value;
                const subtasks = this.task.subtasks.value;
                const status = this.task.status.value;

                if (!title || !description || !subtasks[0] || !status) {
                    this.fieldsEmpty = true;
                    return
                } else this.fieldsEmpty = false;

                const boardId = this.selectedBoard._id

                // HTTP Requests

                let reqError = false;
                let reqMade = null;
                this.isLoading = true;

                // HTTP Post Request For Adding Task And Store Commit If No Errors

                if (this.mode === 'addTask') {
                    const addReq = await httpPost('/tasks', { title, description, subtasks, status, boardId });
                    if (addReq.status === 201) {
                        const _id = addReq.data._id;
                        this.task.title.hasError = false;;
                        this.task.description.hasError = false;
                        this.task.subtasks.hasError = false;
                        this.task.status.hasError= false;
                        this.$store.commit('addTask', { _id, title, description, subtasks, status });
                        this.$store.commit('toggleModal');
                    } else {
                        reqError = true;
                        reqMade = addReq;
                    }
                }
                if (reqError) {
                    this.isLoading = false;
                    this.errorMessage = httpErrMsg(reqMade);
                    if (this.errorMessage.includes('Please add a task title')) {
                        this.task.title.hasError = true;
                        this.task.title.errMsg = 'add title';
                    } else this.task.title.hasError = false;
                    if (this.errorMessage.includes('duplicate title in the same board already exists')) {
                        this.task.title.hasError = true;
                        this.task.title.errMsg = 'duplicate task exists';
                    } else this.task.title.hasError = false;
                    if (this.errorMessage.includes('Please add a task description')) {
                        this.task.description.hasError = true;
                        this.task.description.errMsg = 'add description';
                    } else this.task.description.hasError = false;
                    if (this.errorMessage.includes('Please add at least one subtask')) {
                        this.task.subtasks.hasError = true;
                        this.task.subtasks.errMsg = 'one subtask minimum';
                    } else this.task.subtasks.hasError = false;
                    if (this.errorMessage.includes('Please add a task status')) {
                        this.task.subtasks.hasError = true;
                        this.task.subtasks.errMsg = 'select task status';
                    } else this.task.subtasks.hasError = false;
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