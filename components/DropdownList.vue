<template>
    <ul id="dropdown-container" :class="[dropdownToggled ? 'dropdown-active' : 'dropdown-inactive' ,'dropdown-toggled-container curved-border']">
        <li v-for="option in dropdownOptions" :key="option" :class="[optionSelected === option ? 'dropdown-item-active' : '', 
            option.includes('Delete') ? 'delete-board-text-color' : '']" @click="setOptionSelected(option)">
                {{ option }}
        </li>
    </ul>
</template>

<script>
    export default {
        props: {
            dropdownToggled: {
                type: Boolean,
                default: false
            },
            dropdownOptions: {
                type: [String, Array],
                default: () => ''
            },
            optionSelected: {
                type: String,
                default: ''
            }
        },
        methods: {
            setOptionSelected(option) {
                this.$emit('option-selected', option)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .dropdown-toggled-container {
        width: 100%;
        top: 100%;
        position: absolute;
        // height: 0;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        background: red;
        transform: rotateX(90deg);
        transform-origin: top;
        transition-timing-function: step-end;
        // transition: 0s !important;
        padding: 1rem !important;
        li {
            cursor: pointer;
            color: $color-g;
            font-weight: $semi-bold;
            transition: $speed-fast;
            font-size: $body-l-size;
            line-height: $body-l-height;
        }
    }

    .dropdown-active {
        position: relative;
        height: 100% !important;
        transform: rotateX(0deg);
    }

    .dropdown-inactive {
        transition: 0s !important;
    }

    .delete-board-text-color {
        color: $color-j !important;
    }
</style>