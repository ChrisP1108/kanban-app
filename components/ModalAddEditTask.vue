<template>
    <div class="modal-styling">
        <h2>{{ mode === 'addTask' ? 'Add New Task' : mode === 'editTask' ? 'Edit Task' : 'Error'}}</h2>
        <label for="task-title">Title</label>
        <div class="field-container">
            <p v-if="fieldEmpty(task.title)">{{ errorMsg }}</p>
            <input :class="[fieldEmpty(task.title) ? 'field-error-border' : '']"
                id="task-title" name="task-title" v-model="task.title" placeholder="e.g. Take coffee break" type="text" />
        </div>
        <label for="task-description">Description</label>
        <div class="field-container">
            <p v-if="fieldEmpty(task.description)">{{ errorMsg }}</p>
            <textarea :class="[fieldEmpty(task.description) ? 'field-error-border' : '']" 
                id="task-description" name="task-description" v-model="task.description" placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."  />
        </div>
        <label for="list-item">Subtasks</label>
        <div class="list-items-container">
            <div class="list-item-container" v-for="(subtask, index) in task.subtasks" :key="index">
                <div class="field-container d-flex">
                    <p class="list-item-error-indent" v-if="fieldEmpty(subtask) && index === 0">{{ errorMsg }}</p>
                    <input id="list-item" :class="[fieldEmpty(subtask) && index === 0 ? 'field-error-border' : '']" 
                        name="list-item" v-model="task.subtasks[index]" placeholder="e.g. Make coffee" type="text" />
                    <span @click="deleteSubTask(index)">
                        <ListItemXicon class="x-icon"  />
                    </span>
                </div>
            </div>
        </div>
        <button v-if="task.subtasks.length <= 8" @click="addSubTask" class="button-secondary">
            + <span class="ml-1"> 
                Add New Subtask
            </span>
        </button>
        <label for="task-status" class="select-heading">Status</label>
        <div class="field-container">
            <DropdownSelect @option-selected="setTaskStatus" :options=dropdownOptions :optionActive=task.status />
        </div>
        <button @click="taskSubmit" class="button-primary-s">{{ mode === 'addTask' ? 'Create Task' : 'Update Task'}}</button>
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
                task: {
                    title: '',
                    description: '',
                    subtasks: [''],
                    status: 'Todo'
                },
                dropdownOptions: ['Todo', 'Doing', 'Done'],
                fieldErrors: false
            }
        },
        methods: {
            addSubTask() {
                const subtasks = this.task.subtasks;
                if (subtasks[subtasks.length - 1] !== '') {
                    this.task.subtasks.push('')
                } 
            },
            deleteSubTask(index) {
                if (index > 0) {
                    this.task.subtasks = this.task.subtasks.filter((item, i) => 
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
            taskSubmit() {
                const { title, description, subtasks, status} = this.task;
                if (!title || !description || !subtasks[0] || !status) {
                    this.fieldErrors = true;
                    return
                } else this.fieldErrors = false;
                alert(JSON.stringify(this.task));
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modal-styling {
        width: 100%;
    }
</style>