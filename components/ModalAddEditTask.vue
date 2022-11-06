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
        <FieldInput class="task-subtasks" label="Subtasks" type="list" :input="task.subtasks.values" 
            placeholder="e.g. Make coffee" :empty-check="fieldsEmpty" :error-message="task.subtasks.errMsg" 
            :has-error="task.subtasks.hasError" @value-change="(value) => task.subtasks.values = value"  
        />
        <button v-if="task.subtasks.values.length <= 8" class="button-secondary" @click="addSubTask">
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
    import { httpPost, httpPut, httpErrMsg } from '../services/httpClient';
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
                        errMsg: ''
                    },
                    description: {
                        value: '',
                        hasError: false,
                        errMsg: ''
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
                return [...this.$store.state.userData.boards].find(board => 
                    board._id.toString() === this.$store.state.boardSelected)
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
                this.task.title.value = this.selectedTask.title;
                this.task.description.value = this.selectedTask.description;
                this.task.subtasks.values = this.selectedTask.subtasks.map(subtask => 
                ({ _id: subtask._id, canModify: true, value: subtask.name, checked: subtask.checked }));
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

                if (!this.task.title.value || !this.task.description.value 
                    || !this.task.subtasks.values[0].value || !this.task.status.value) {
                    this.fieldsEmpty = true;
                    return
                } else this.fieldsEmpty = false;

                // Capitalize Fields

                this.task.title.value = caseFormatFirst(this.task.title.value);
                this.task.description.value = caseFormatFirst(this.task.description.value);
                this.task.subtasks.values = this.task.subtasks.values
                    .filter(task => task !== '')
                    .map(subtask => ({ 
                        _id: subtask._id,
                        value: caseFormatFirst(subtask.value), 
                        canModify: subtask.canModify,
                        checked: subtask.checked
                    }))
                ;

                const title = this.task.title.value;
                const description = this.task.description.value;
                const subtasks = this.task.subtasks.values.map(subtask => 
                    ({  
                        _id: subtask._id,
                        name: subtask.value, 
                        checked: subtask.checked !== undefined ? subtask.checked : false 
                    })
                );
                const status = this.task.status.value;

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
                if (this.mode === 'editTask') {
                    const updatedTask = { _id: this.selectedTask._id, title, description, subtasks, status }
                    const updateReq = await httpPut(`/tasks/${this.selectedTask._id}`, updatedTask);
                    if (updateReq.status === 200) {
                        updatedTask.subtasks = updateReq.data.subtasks
                        this.$store.commit('updateTask', updatedTask);
                        this.$store.commit('toggleModal');
                    } else {
                        reqError = true;
                        reqMade = updateReq;
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