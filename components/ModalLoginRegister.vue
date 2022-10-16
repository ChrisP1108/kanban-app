<template>
    <div class="modal-styling">
        <Logo class="center-logo" />
        <h2>{{ mode === 'login' ? 'Login' : mode === 'register' ? 'Register User' : 'Error'}}</h2>
        <FieldInput label="Username" type="text" :input="credentials.username" placeholder="" 
            :error-check="fieldErrors" @value-change="(value) => credentials.username = value"  />
        <FieldInput label="Password" type="text" :input="credentials.password" 
            placeholder="" :error-check="fieldErrors" @value-change="(value) => credentials.password = value" />
        <button class="button-primary-s" @click="loginOrRegister" >Login</button>
        <button class="button-secondary button-margin" @click="loginOrRegister">Register New User</button>
        <ModeToggle class="mode-toggler"/>
    </div>
</template>

<script>
    export default {
        props: {
            mode: {
                type: String,
                default: "null"
            }
        },
        data() {
            return {
                credentials: {
                    username: '',
                    password: '',
                },
                fieldErrors: false,
                status: {
                    isLoading: false,
                    hasError: false,
                    isSuccess: false,
                    payload: null
                }
            }
        },
        computed: {
            errorMsg() {
                return this.$store.state.fieldErrorMsg
            }
        },
        methods: {
            fieldEmpty(field) {
                if (!field && this.fieldErrors) {
                    return true
                } else return false
            },
            loginOrRegister() {
                const { username, password  } = this.credentials;
                if (this.mode === 'login') {
                    if (!username || !password) {
                        this.fieldErrors = true;
                    }
                }
                // httpPost('/user/login', { username, password })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modal-styling {
        width: 100%;
    }
    .button-secondary {
        margin-bottom: 1.5rem !important;
    }
    .button-margin {
        margin: 1.5rem 0 1.5rem 0 !important;
    }
    .center-logo {
        display: flex;
        justify-content: center;

    }
    h2 {
        margin-top: 2rem;
    }
    .mode-toggler {
        max-width: 12.5rem !important;
        margin: 0 auto;
    }
</style>