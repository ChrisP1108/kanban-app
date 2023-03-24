<template>
    <div>
        <label class="field-input-label">{{ label }}</label>

        <!-- Text, Textarea, And Password Inputs -->

        <div v-if="text || textarea || password" class="field-container">
            <p v-if="errorCheck(value, duplicates.array).error" :class="[textarea ? 'textarea-err-msg' : '']">
                {{ errorCheck(value, duplicates.array).message }}
            </p>
            <input v-if="text || password" 
                v-model="value" :class="[errorCheck(value, duplicates.array).error ? 'field-error-border' : '']"
                name="field" :placeholder="placeholder" :type="[text ? 'text' : 'password']" 
                @input="updateValue" 
            />
            <textarea v-if="textarea" v-model="value" name="field" :value.prop="value"
                :class="[errorCheck(value, duplicates.array).error ? 'field-error-border' : '']" 
                :placeholder="placeholder" @input="updateValue">
            </textarea>
        </div>

        <!-- List Input -->

        <div v-if="list" class="list-items-container scrollbar-styling overflow-scroll">
            <div v-for="(field, index) in value" :key="index" class="list-item-container">
                <div :class="[field.canModify === false ? 'list-item-no-edit' : '', 'field-container d-flex']">
                    <p v-if="errorCheck(field.value, duplicates.array).error && index === 0 || errorCheck(field.value, duplicates.array).error" 
                        class="list-item-error-indent">
                            {{ errorCheck(field.value, duplicates.array).message }}
                    </p>
                    <input v-model="value[index].value" name="field" 
                        :class="[errorCheck(field.value, duplicates.array).error && index === 0 || hasError 
                        || errorCheck(field.value, duplicates.array).error ? 'field-error-border' : '',
                        field.checked ? 'checked-text' : '']"
                        :placeholder="placeholder" type="text" @input="updateValue" 
                    />
                    <span @click="deleteValue(index)">
                        <Xicon />
                    </span>
                </div>
            </div>
        </div>

        <!-- Checklist Input -->

        <div v-if="checklist" class="checklist-items-container scrollbar-styling overflow-scroll">
            <div v-for="(field, index) in value" :key="index" class="checklist-item-container">
                <input v-model="value[index].checked" type="checkbox" class="checklist-checkbox"  
                    @change="updateValue">
                <b :class="field.checked ? 'checked-text' : ''">{{ field.name }}</b>
            </div>
        </div>

        <!-- Dropdown List Input -->

        <div class="field-container">
            <div v-if="dropdown" class="dropdown-select-container" @click="toggleDropdown">
                <div id="dropdown-container" name="task-status" class="dropdown">
                    <span>{{ value }}</span>
                    <img :class="[dropdownToggled ? 'dropdown-rotate-arrow' : '', 'dropdown-arrow']" src="assets/images/dropdown-arrow.svg" alt="Dropdown Arrow">
                </div>
                <nav @click="toggleDropdown">
                    <DropdownList :dropdown-toggled="dropdownToggled" :dropdown-options="dropdownOptions" 
                    :option-selected="value" @option-selected="setOptionSelected" />
                </nav>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            label: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: ''
            },
            input: {
                type: Object,
                default: () => {}
            },
            dropdownOptions: {
                type: [String, Array],
                default: ''
            },
            placeholder: {
                type: String,
                default: ''
            },
            emptyCheck: {
                type: Boolean,
                default: false
            },
            duplicates: {
                type: Object,
                default: () => ({
                    haveDuplicates: {
                        type: Boolean,
                        default: true
                    },
                    array: {
                        type: [String, Array],
                        default: ['']
                    },
                    multiInputs: {
                        type: Boolean,
                        default: false
                    }
                })
            },
            hasError: {
                type: Boolean,
                default: false
            },
            errorMessage: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                value: '',
                dropdownToggled: false,
            }
        },
        computed: {
            text() {
                return this.type === 'text'
            },
            textarea() {
                return this.type === 'textarea'
            },
            password() {
                return this.type === 'password'
            },
            list() {
                return this.type === 'list'
            },
            checklist() {
                return this.type === 'checklist'
            },
            dropdown() {
                return this.type === 'dropdown'
            },
        },
        created() {
            if (this.hasError) {
                this.value = '';
            }
            this.value = this.input.value;
        },
        mounted() {
            window.addEventListener('click', e => {
                if (e.target.id !== 'dropdown-container') {
                    this.dropdownToggled = false
                }
            });
        },
        methods: {
            emptyIdCheck(id) {
                if (!id) {
                    return 0
                } else return id
            },
            errorCheck(input, array) {
                let err = { error: false, message: ""}
                if (!input && this.emptyCheck === true) {
                    err = { error: true, message: "can't be empty"};
                }
                if (this.duplicates.multiInputs && typeof array === 'object' && array.length
                    && array.filter(val => val.value.toLowerCase() === input.toLowerCase() 
                        && this.input._id !== this.emptyIdCheck(val._id)).length > 1 
                    && this.duplicates && this.duplicates.haveDuplicates === false) {
                        err = { error: true, message: "duplicate exists"}
                }
                if (!this.duplicates.multiInputs && typeof array === 'object' && array.length
                    && array.filter(val => val.value.toLowerCase() === input.toLowerCase() 
                        && this.input._id !== this.emptyIdCheck(val._id)).length === 1 
                    && this.duplicates && this.duplicates.haveDuplicates === false) {
                        err = { error: true, message: "duplicate exists"}
                }
                if (this.hasError) {
                    err = { error: true, message: this.errorMessage }
                }
                if (err.error) {
                    this.$emit('error-found', true)
                } else this.$emit('error-found', false)
                return err
            },
            toggleDropdown() {
                this.dropdownToggled = !this.dropdownToggled;
            },
            updateValue() {
                this.$emit('value-change', this.value)
            },
            deleteValue(index) {
                if (index >= 0 && this.value[0] !== '') {
                    this.value = this.value.filter((item, i) => 
                    i !== index && item);
                    this.updateValue();
                } else {
                    this.value = [{ value: '', canModify: true, checked: false}];
                    this.updateValue();
                }
            },
            setOptionSelected(option) {
                this.value = option;
                this.updateValue()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .field-container {
        position: relative;
        p {
            z-index: 1;
            position: absolute;
            left: 100%;
            text-align: right;
            top: 50%;
            width: 30%;
            line-height: 1.25em;
            transform: translate(calc(-100% - 0.9375rem), -50%);
            color: $color-j;
        }
        .list-item-error-indent {
            left: calc(100% - 1.9375rem);
        }
    }
    .field-container, .dropdown-toggled-container {
        width: 100%;
        margin: 0.25rem 0 1rem;
        font-size: $body-l-size;
        line-height: $body-l-height;
    }

    .field-error-border {
        border: field-border-error();

        &:hover {
            border: field-border-error();
        }

        &:focus {
            border: field-border-error() !important;
        }
    }

    .dropdown {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
    }

    .dropdown-arrow {
        transition: $speed-fast;
        width: 0.625rem;
    }
    .checklist-items-container {
        margin-top: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-height: 25vh;
    }
    .checked-text {
        text-decoration: line-through;
        color: $color-g !important;
    }
    .list-items-container {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding-right: 1rem;
        margin: 0.25rem -1rem 0.5rem 0;

        .field-container {
            margin: 0 !important;
        }
    }

    .overflow-scroll {
        max-height: 25vh;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .list-item-container {
        display: flex;
        align-items: center;

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
    .checklist-item-container {
        display: flex;
        align-items: center;
        padding:  0.75rem;
        border-radius: 0.25rem;
        gap: 1rem;
    }
    .checklist-checkbox {
        width: 1rem;
        height: 1rem;
        min-height: 1rem !important;
        border-radius: 0.125rem;
        border: 0.0625rem $color-g solid;
        background: $color-white;
        accent-color: $color-a;
    }

    .dropdown-select-container {
        width: 100%;
        transition: $speed-fast;
        position: relative;
        margin-bottom: 1.5rem !important;
    }
    .dropdown-rotate-arrow {
        transform: rotate(180deg);
    }
    label {
        transition: $speed-medium;
    }
    img {
        transition: $speed-fast;
    }
    .list-item-no-edit {

        input {
            opacity: 0.25; 
            pointer-events: none;
            margin-right: 2rem !important;
        }

        span {
            display: none;
        }

    }
</style>