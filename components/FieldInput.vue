<template>
    <div>
        <label :class="[dropdown ? 'select-heading' : '']">{{ label }}</label>

        <!-- Text, Textarea, And Password Inputs -->

        <div v-if="text || textarea || password" class="field-container">
            <p v-if="fieldEmpty(value) || hasError" :class="[textarea ? 'textarea-err-msg' : '']">
                {{ hasError ? errorMessage : emptyMsg }}
            </p>
            <input v-if="text || password" 
                v-model="value" :class="[fieldEmpty(value) || hasError ? 'field-error-border' : '']"
                name="field" :placeholder="placeholder" :type="[text ? 'text' : 'password']" 
                @change="updateValue" 
            />
            <textarea v-if="textarea" v-model="value" name="field" 
                :class="[fieldEmpty(value) ? 'field-error-border' : '']" 
                :placeholder="placeholder" @change="updateValue">
            </textarea>
        </div>

        <!-- List Input -->

        <div v-if="list" class="list-items-container">
            <div v-for="(field, index) in value" :key="index" class="list-item-container">
                <div class="field-container d-flex">
                    <p v-if="fieldEmpty(field) && index === 0" class="list-item-error-indent">{{ emptyMsg }}</p>
                    <input  v-model="value[index]" name="field" 
                        :class="[fieldEmpty(field) && index === 0 ? 'field-error-border' : '']"
                        :placeholder="placeholder" type="text" 
                    />
                    <span @click="deleteValue(index)">
                        <Xicon />
                    </span>
                </div>
            </div>
        </div>

        <!-- Dropdown List Input -->

        <div class="field-container">
            <div v-if="dropdown" class="dropdown-select-container">
                <div id="dropdown-container" name="task-status" class="dropdown" @click="toggleDropdown">
                    <span>{{ input }}</span>
                    <img :class="[dropdownToggled ? 'dropdown-rotate-arrow' : '', 'dropdown-arrow']" src="assets/images/dropdown-arrow.svg" alt="Dropdown Arrow">
                </div>
                <nav @click="toggleDropdown">
                    <DropdownList :dropdown-toggled="dropdownToggled" :dropdown-options="dropdownOptions" 
                    :option-selected="input" @option-selected="setOptionSelected" />
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
                type: [String, Number, Array],
                default: ''
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
                emptyMsg: "Can't be empty"
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
            dropdown() {
                return this.type === 'dropdown'
            }
        },
        created() {
            if (this.hasError) {
                this.value = '';
            }
            this.value = this.input;
        },
        mounted() {
            window.addEventListener('click', e => {
                if (e.target.id !== 'dropdown-container') {
                    this.dropdownToggled = false
                }
            });
        },
        methods: {
            fieldEmpty(field) {
                if (!field && this.emptyCheck) {
                    return true
                } else {
                    return false
                }
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
                    i !== index && item);
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
    label {
        transition: $speed-medium;
    }
</style>