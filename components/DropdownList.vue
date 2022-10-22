<template>
    <ul id="dropdown-container" :class="[dropdownToggled ? 'dropdown-active' : '' ,'dropdown-toggled-container curved-border']">
        <li @click="setOptionSelected(option)" v-for="option in dropdownOptions" :key="option"
            :class="[optionSelected === option ? 'dropdown-item-active' : '', 
            option.includes('Delete') ? 'delete-board-text-color' : '']">{{ option }}
        </li>
    </ul>
</template>

<script>
    export default {
        props: {
            dropdownToggled: Boolean,
            dropdownOptions: [String, Array],
            optionSelected: String
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
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        background: red;
        transform: rotateX(90deg);
        transform-origin: top;
        transition: 0s;
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
        transform: rotateX(0deg);
        transition: $speed-fast;
    }

    .delete-board-text-color {
        color: $color-j !important;
    }
</style>