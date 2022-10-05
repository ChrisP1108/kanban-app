<template>
    <div class="dropdown-select-container">
        <label for="task-status" class="select-heading">Status</label>
        <div @click="toggleDropdown" id="task-status" name="task-status" class="dropdown">
            <span>{{ optionSelected }}</span>
            <img :class="[dropdownToggled ? 'dropdown-rotate-arrow' : '', 'dropdown-arrow']" src="assets/images/dropdown-arrow.svg" alt="Dropdown Arrow">
        </div>
        <ul @click="toggleDropdown" :class="[dropdownToggled ? 'dropdown-active' : '' ,'dropdown-toggled-container']">
            <li @click="setOptionSelected(option)" v-for="option in options" :key="option">{{ option }}</li>
        </ul>
    </div>
</template>

<script>
    export default {
        props: {
            options: Array[String]
        },
        data() {
            return {
                dropdownToggled: false,
                optionSelected: this.options[0]
            }
        },
        methods: {
            toggleDropdown() {
                this.dropdownToggled = !this.dropdownToggled;
            },
            setOptionSelected(option) {
                this.optionSelected = option;
                this.$emit('option-selected', option)
            }
        },
        mounted() {
            window.addEventListener('click', (e) => {
                if (e.target.id !== 'task-status') {
                    this.dropdownToggled = false;
                }
            });
        }
    }
</script>

<style lang="scss" scoped>
    .dropdown-select-container {
        width: 100%;
        transition: $speed-fast;
        position: relative;
        margin-bottom: 1.5rem !important;
    }
    .dropdown {
        cursor: pointer;
    }
    img {
        transition: $speed-fast;
    }
    .dropdown-toggled-container {
        width: 100%;
        top: 100%;
        position: absolute;
        background: red;
        border-radius: 0.5rem;
        transform: rotateX(90deg);
        transform-origin: top;
        transition: 0s;
        padding: 1rem !important;
        li {
            cursor: pointer;
            color: $color-g;
            font-weight: $semi-bold;
            transition: $speed-fast;

            &:not(li:nth-of-type(3)) {
                margin-bottom: 0.75rem;
            }
        }
    }

    .dropdown-active {
        transform: rotateX(0deg);
        transition: $speed-fast;
    }
    .dropdown-rotate-arrow {
        transform: rotate(180deg);
    }
</style>