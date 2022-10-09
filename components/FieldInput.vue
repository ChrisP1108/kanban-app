<template>
    <div>
        <label :class="[dropdown ? 'select-heading' : '']">{{ label }}</label>

        <!-- Text And Textarea Inputs -->

        <div v-if="text || textarea" class="field-container">
            <p v-if="fieldEmpty(value)" :class="[textarea ? 'textarea-err-msg' : '']">{{ errorMsg }}</p>
            <input v-if="text" :class="[fieldEmpty(value) ? 'field-error-border' : '']"
                id="text-input" name="field" v-model="value" @change="updateValue" :placeholder="placeholder" type="text" />
            <textarea v-if="textarea" :class="[fieldEmpty(value) ? 'field-error-border' : '']" 
                id="field" name="field" v-model="value" @change="updateValue" :placeholder="placeholder">
            </textarea>
        </div>

        <!-- List Input -->

        <div v-if="list" class="list-items-container">
            <div class="list-item-container" v-for="(field, index) in value" :key="index">
                <div class="field-container d-flex">
                    <p class="list-item-error-indent" v-if="fieldEmpty(field) && index === 0">{{ errorMsg }}</p>
                    <input id="list-input" :class="[fieldEmpty(field) && index === 0 ? 'field-error-border' : '']" 
                        name="field" v-model="value[index]" :placeholder="placeholder" type="text" />
                    <span @click="deleteValue(index)">
                        <Xicon />
                    </span>
                </div>
            </div>
        </div>

        <!-- Dropdown List Input -->

        <div class="field-container">
            <div v-if="dropdown" class="dropdown-select-container">
                <div @click="toggleDropdown" id="dropdown-container" name="task-status" class="dropdown">
                    <span>{{ input }}</span>
                    <img :class="[dropdownToggled ? 'dropdown-rotate-arrow' : '', 'dropdown-arrow']" src="assets/images/dropdown-arrow.svg" alt="Dropdown Arrow">
                </div>
                <nav @click="toggleDropdown">
                    <DropdownList @option-selected="setOptionSelected" :dropdownToggled="dropdownToggled" 
                        :dropdownOptions="dropdownOptions" :optionSelected="input" />
                </nav>
                
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            label: String,
            type: String,
            input: [String, Number, Array],
            dropdownOptions: [String, Array],
            placeholder: String,
            errorCheck: Boolean
        },
        computed: {
            text() {
                return this.type === 'text'
            },
            textarea() {
                return this.type === 'textarea'
            },
            list() {
                return this.type === 'list'
            },
            dropdown() {
                return this.type === 'dropdown'
            }
        },
        data() {
            return {
                value: '',
                dropdownToggled: false,
                errorMsg: "Can't be empty"
            }
        },
        methods: {
            fieldEmpty(field) {
                if (!field && this.errorCheck) {
                    return true
                } else return false
            },
            toggleDropdown() {
                this.dropdownToggled = !this.dropdownToggled;
            },
            updateValue() {
                this.$emit('value-change', this.value)
            },
            deleteValue(index) {
                if (index > 0) {
                    this.value = this.value.filter((item, i) => 
                    i !== index);
                    this.updateValue()
                }
            },
            setOptionSelected(option) {
                this.value = option;
                this.updateValue()
            }
        },
        created() {
            this.value = this.input;
        },
        mounted() {
            window.addEventListener('click', e => {
                if (e.target.id !== 'dropdown-container') {
                    this.dropdownToggled = false
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