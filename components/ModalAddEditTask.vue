<template>
    <div class="modal-styling">
        <h2>{{ mode === 'addTask' ? 'Add New Task' : mode === 'editTask' ? 'Edit Task' : 'Error'}}</h2>
        <FieldInput label="Title" type="text" :input="task.title" placeholder="e.g. Take coffee break" 
            :empty-check="fieldsEmpty" @value-change="(value) => task.title = value"  
        />
        <FieldInput label="Description" type="textarea" :input="task.description" placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little." 
            :empty-check="fieldsEmpty" @value-change="(value) => task.description = value"  
        />
        <FieldInput label="Subtasks" type="list" :input="task.subtasks" placeholder="e.g. Make coffee" 
            :empty-check="fieldsEmpty" @value-change="(value) => task.subtasks = value"  
        />
        <button v-if="task.subtasks.length <= 8" class="button-secondary" @click="addSubTask">
            + <span class="ml-1"> 
                Add New Subtask
            </span>
        </button>
        <FieldInput label="Status" type="dropdown" :input="task.status" :dropdownOptions="dropdownOptions" 
            :errorCheck="fieldsEmpty" @value-change="(value) => task.status = value" 
        />
        <button class="button-primary-s" @click="taskSubmit">{{ mode === 'addTask' ? 'Create Task' : 'Update Task'}}</button>
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
                task: {
                    title: '',
                    description: '',
                    subtasks: [''],
                    status: 'Todo'
                },
                dropdownOptions: ['Todo', 'Doing', 'Done'],
                fieldsEmpty: false
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
            taskSubmit() {
                const { title, description, subtasks, status} = this.task;
                if (!title || !description || !subtasks[0] || !status) {
                    this.fieldsEmpty = true;
                    return
                } else this.fieldsEmpty = false;
                this.task.subtasks = this.task.subtasks.filter(task => task !== '');
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