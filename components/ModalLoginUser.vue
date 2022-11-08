<template>
    <div class="modal-styling" @keyup="checkEnterKeypress">
        <Logo class="center-logo" />
        <h2>Login</h2>
        <FieldInput class="username" label="Username" type="text" :input="credentials.username.value" placeholder="" 
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
        <div class="mode-forgot-container">
            <ModeToggle class="mode-container" />
            <button class="button-primary-s" @click="resetCredentials">Forgot?</button>
        </div>
    </div>
</template>

<script>
    import { httpGet, httpPost, httpErrMsg, httpStatusCode } from '../services/httpClient';

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

                // Check That No Fields Are Empty

                const username = this.credentials.username.value;
                const password = this.credentials.password.value;
                if (!username || !password) {
                    this.fieldsEmpty = true;
                    return null
                } 

                // Define HTTP Data Variables

                let getDataAttempt;

                // HTTP Post Request For Login Authentication

                this.isLoading = true;
                const loginReq = await httpPost('/user/login', { username, password });
                if (loginReq.status === 200) {
                    this.credentials.username.hasError = false;
                    this.credentials.password.hasError = false;
                    if (this.$store.state.loginRedirect) {
                        this.$store.commit('toggleLoginRedirect');
                    }

                // HTTP Get Request For All User Boards And Corresponding Tasks  And Store Commit If Login Successful

                    getDataAttempt = await httpGet('/user/data');
                    if (getDataAttempt.status === 200) {
                        this.$store.commit('setUserData', getDataAttempt.data);
                        const boards = getDataAttempt.data.boards;
                        if (boards.length) {
                            this.$store.commit('selectBoard', boards[0]._id)
                        }
                        this.$router.push('/dashboard')
                    }
                } 

                // Error Handling If Login Authentication Fails
                
                else {
                    this.isLoading = false;
                    if (httpStatusCode(loginReq) >= 404) {
                        this.$store.commit('setModalErrorMessage', `logging in`)
                        this.$store.commit('toggleModal', 'error')
                    } else if (getDataAttempt && httpStatusCode(getDataAttempt) >= 404) {
                        this.$store.commit('setModalErrorMessage', `getting user data`)
                        this.$store.commit('toggleModal', 'error')
                    } else {
                        this.errorMessage = httpErrMsg(loginReq);
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
            resetCredentials() {
                this.$router.push('/reset');
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
    p {
        margin-bottom: 1rem;
        color: $color-j !important;
    }
    .mode-forgot-container {
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        gap: 1.5rem;

        .mode-container {
            flex: 1;
            flex-basis: 8rem;
        }

        button {
            flex: 1;
            flex-basis: 7.8125rem;
        }
    }
</style>