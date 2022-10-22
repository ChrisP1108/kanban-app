<template>
    <div class="modal-styling" @keyup="checkEnterKeypress">
        <Logo class="center-logo" />
        <h2>Login</h2>
        <FieldInput  class="username" label="Username" type="text" :input="credentials.username.value" placeholder="" 
            :empty-check="fieldsEmpty" :error-message="credentials.username.errMsg" :has-error="credentials.username.hasError"
            @value-change="(value) => credentials.username.value = value"  />
        <FieldInput class="password" label="Password" type="password" :input="credentials.password.value" 
            placeholder="" :empty-check="fieldsEmpty" :error-message="credentials.password.errMsg" :has-error="credentials.password.hasError"
            @value-change="(value) => credentials.password.value = value" />
        <button :class="[isLoading ? 'button-primary-active' : '', 'button-primary-s']" @click="login" >
            <div v-if="isLoading" class="button-content">
                <LoadingIcon />
            </div>
            <div v-if="!isLoading" class="button-content">
                Login
            </div>
        </button>
        <button class="button-secondary button-margin" @click="goToRegister">Register New User</button>
        <ModeToggle class="mode-toggler"/>
    </div>
</template>

<script>
import { httpGet, httpPost, httpErrMsg } from '../services/httpClient';

    export default {
        data() {
            return {
                credentials: {
                    username: {
                        value: '',
                        hasError: false,
                        errMsg: ''
                    },
                    password: {
                        value: '',
                        hasError: false,
                        errMsg: ''
                    },
                },
                fieldsEmpty: false,
                isLoading: false
            }
        },
        methods: {
            fieldEmpty(field) {
                if (!field && this.fieldsEmpty) {
                    return true
                } else return false
            },
            checkEnterKeypress(e) {
                if (e.key === 'Enter') {
                    this.login();
                }
            },
            async login() {
                const username = this.credentials.username.value;
                const password = this.credentials.password.value;
                if (!username || !password) {
                    this.fieldsEmpty = true;
                } else {
                    this.isLoading = true;
                    const httpReq = await httpPost('/user/login', { username, password });
                    if (httpReq.status === 200) {
                        this.credentials.username.hasError = false;
                        this.credentials.password.hasError = false;
                        if (this.$store.state.loginRedirect) {
                            this.$store.commit('toggleLoginRedirect');
                        }
                        const getDataAttempt = await httpGet('/user/data');
                        if (getDataAttempt.status === 200) {
                            this.$store.commit('setUserData', getDataAttempt.data);
                            this.$router.push('/dashboard')
                        }
                    } else {
                        this.isLoading = false;
                        this.errorMessage = httpErrMsg(httpReq);
                        if (this.errorMessage.includes('enter a username')) {
                            this.credentials.username.hasError = true;
                            this.credentials.username.errMsg = 'enter a username';
                        } else this.credentials.username.hasError = false;
                        if (this.errorMessage.includes('Username does not exist')) {
                            this.credentials.username.hasError = true;
                            this.credentials.username.errMsg = 'username does not exist';
                        } else this.credentials.username.hasError = false;
                        if (this.errorMessage.includes('enter a password')) {
                            this.credentials.password.hasError = true;
                            this.credentials.password.errMsg = 'enter a password';
                        } else this.credentials.password.hasError = false;  
                        if (this.errorMessage.includes('Invalid password')) {
                            this.credentials.password.hasError = true;
                            this.credentials.password.errMsg = 'invalid password';
                        } else this.credentials.password.hasError = false;  
                    }
                }
            },
            goToRegister() {
                this.$router.push('/register');
            },
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
    p {
        margin-bottom: 1rem;
        color: $color-j !important;
    }

    .mode-toggler {
        max-width: 12.5rem !important;
        margin: 0 auto;
    }
</style>