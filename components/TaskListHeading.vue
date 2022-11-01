<template>
    <div class="task-item-heading-container">
        <div :class="[index > - 1 ? `dot-color-${dotColor(index)}` : '','task-item-heading-dot']"></div>
        <h4>{{ `${taskStatusHeading.toUpperCase()} (${length})` }}</h4>
    </div>
</template>

<script>
    export default {
        props: {
            taskStatusHeading: {
                type: String,
                default: ''
            },
            index: {
                type: Number,
                default: -1
            },
            length: {
                type: Number,
                default: 0
            }
        },
        data() {
            return {
                lastDotNumber: 1
            }
        },
        methods: {
            dotColor(index) {
                if (index < 8) {
                    return index + 1
                }
                function randomNumber() {
                    return Math.ceil(Math.random() * 8)
                }
                let randomPick = randomNumber();
                while (randomPick === this.lastDotNumber) {
                    randomPick = randomNumber();
                }
                this.lastDotNumber = randomPick;
                return randomPick
            }
        }
    }
</script>

<style lang="scss" scoped>
    .task-item-heading-container {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    .task-item-heading-dot {
        width: 0.9375rem;
        height: 0.9375rem;
        border-radius: 50%;
    }
    .dot-color-1 {
        background: $task-color-1;
    }
    .dot-color-2 {
        background: $task-color-2;
    }
    .dot-color-3 {
        background: $task-color-3;
    }
    .dot-color-4 {
        background: $task-color-4;
    }
    .dot-color-5 {
        background: $task-color-5;
    }
    .dot-color-6 {
        background: $task-color-6;
    }
    .dot-color-7 {
        background: $task-color-7;
    }
    .dot-color-8 {
        background: $task-color-8;
    }
</style>