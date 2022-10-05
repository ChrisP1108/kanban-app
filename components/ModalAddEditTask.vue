<template>
    <div class="modal-styling">
        <h2>{{ mode === 'addTask' ? 'Add New Task' : 'editTask' ? 'Edit Task' : 'Error'}}</h2>
        <label for="task-title">Title</label>
        <input id="task-title" name="task-title" v-model="task.title" placeholder="e.g. Take coffee break" type="text" />
        <label for="task-description">Description</label>
        <textarea id="task-description" name="task-description" v-model="task.description" placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."  />
        <label for="task-subtask">Subtasks</label>
        <div class="sub-task-item" v-for="(subtask, index) in task.subtasks" :key="index">
            <input id="task-subtask" name="task-subtask" v-model="task.subtasks[index]" placeholder="e.g. Make coffee" type="text" />
            <span @click="deleteSubTask(index)">
                <SubtaskXicon class="x-icon"  />
            </span>
        </div>
        <button @click="addSubTask" class="button-secondary">
            + <span class="ml-1"> 
                Add New Subtask
            </span>
        </button>
        <DropdownSelect @option-selected="setTaskStatus" :options=dropdownOptions />
        <button class="button-primary-s">{{ mode === 'addTask' ? 'Create Task' : 'Update Task'}}</button>
    </div>
</template>

<script>
    export default {
        props: {
            mode: String
        },
        data() {
            return {
                task: {
                    title: '',
                    description: '',
                    subtasks: [''],
                    status: 'Todo'
                },
                dropdownOptions: ['Todo', 'Doing', 'Done']
            }
        },
        methods: {
            addSubTask(e) {
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    .sub-task-item {
        display: flex;
        align-items: center;
        padding: 0.5rem 0 0.25rem;

        &:nth-of-type(1) .x-icon {
            cursor: auto;
        }

        input {
            margin: 0;
        }

        .x-icon {
            cursor: pointer;
            margin-right: -1rem;
            height: 2.5rem;
            width: 3.0rem;
            padding: 0 1rem;
        }
    }
    .button-secondary {
        margin-top: 0.5rem;

        span {
            font-weight: $bold;
        }
    }

</style>