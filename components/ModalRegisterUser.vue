<template>
    <div class="modal-styling scrollbar-styling" @keyup="checkEnterKeypress">
        <h2>Register New User</h2>
        <FieldInput  class="firstname" label="First Name" type="text" :input="{ value: credentials.firstname.value }" placeholder="" 
            :empty-check="fieldsEmpty" :error-message="credentials.firstname.errMsg" :has-error="credentials.firstname.hasError"
            @value-change="(value) => credentials.firstname.value = value" @error-found="(value) => errFound = value" />
        <FieldInput  class="username" label="Username" type="text" :input="{ value: credentials.username.value }" placeholder="" 
            :empty-check="fieldsEmpty" :error-message="credentials.username.errMsg" :has-error="credentials.username.hasError" 
            @value-change="(value) => credentials.username.value = value" @error-found="(value) => errFound = value" />
        <FieldInput class="password" label="Password" type="password" :input="{ value: credentials.password.value }" 
            placeholder="" :empty-check="fieldsEmpty" :error-message="credentials.password.errMsg" :has-error="credentials.password.hasError"
            @value-change="(value) => credentials.password.value = value" @error-found="(value) => errFound = value" />
        <FieldInput class="password" label="Re-Enter Password" type="password" :input="{ value: credentials.password2.value }" 
            placeholder="" :empty-check="fieldsEmpty" :error-message="credentials.password2.errMsg" :has-error="credentials.password2.hasError"
            @value-change="(value) => credentials.password2.value = value" @error-found="(value) => errFound = value" />
        <FieldInput class="pin" label="4 Digit Security PIN" type="password" :input="{ value: credentials.pin.value }" 
            placeholder="" :empty-check="fieldsEmpty" :error-message="credentials.pin.errMsg" :has-error="credentials.pin.hasError"
            @value-change="(value) => credentials.pin.value = value" @error-found="(value) => errFound = value" />
        <FieldInput class="security-question" label="Enter A Unique Security Question For Password Recovery" type="text" 
            :input="{ value: credentials.security.question.value }" placeholder="" :empty-check="fieldsEmpty" :error-message="credentials.security.question.errMsg" 
            :has-error="credentials.security.question.hasError" 
            @value-change="(value) => credentials.security.question.value = value" @error-found="(value) => errFound = value" />
        <FieldInput class="security-answer" label="Answer To Unique Security Question.  Must Be One Word With No Spaces" type="password" 
            :input="{ value: credentials.security.answer.value }" placeholder="" :empty-check="fieldsEmpty" :error-message="credentials.security.answer.errMsg" 
            :has-error="credentials.security.answer.hasError" 
            @value-change="(value) => credentials.security.answer.value = value" />
        <FieldInput class="security-answer-2" label="Reenter Security Answer" type="password" 
            :input="{ value: credentials.security.answer.value2 }" placeholder="" :empty-check="fieldsEmpty" :error-message="credentials.security.answer2.errMsg" 
            :has-error="credentials.security.answer2.hasError" 
            @value-change="(value) => credentials.security.answer2.value = value" @error-found="(value) => errFound = value" />
        <button :class="[isLoading ? 'button-primary-active' : '', 'button-primary-s']" @click="register" >
            <div v-if="isLoading" class="button-content">
                <LoadingIcon />
            </div>
            <div v-if="!isLoading" class="button-content">
                Register User
            </div>
        </button>
        <button class="button-secondary button-margin" @click="goToLogin">Return To Login</button>
        <ModeToggle class="mode-toggler"/>
    </div>
</template>

<script>
import { httpPost, httpGet, httpErrMsg, httpStatusCode } from '../services/httpClient';

    export default {
        data() {
            return {
                nextPageToggled: false,
                credentials: {
                    firstname: {
                        value: '',
                        hasError: false,
                        errMsg: ''
                    },
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
                    password2: {
                        value: '',
                        hasError: false,
                        errMsg: ''
                    },
                    pin: {
                        value: '',
                        hasError: false,
                        errMsg: ''
                    },
                    security: {
                        question: {
                            value: '',
                            hasError: false,
                            errMsg: ''
                        },
                        answer: {
                            value: '',
                            hasError: false,
                            errMsg: ''
                        },
                        answer2: {
                            value: '',
                            hasError: false,
                            errMsg: ''
                        }
                    }
                },
                fieldsEmpty: false,
                isLoading: false,
                errorMessage: '',
                errFound: false
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
                    this.register();
                }
            },
            async register() {

                // Exit If Field Input Component Found An Error

                if (this.errFound) {
                    return null
                }

                // Check That No Fields Are Empty

                const firstname = this.credentials.firstname.value;
                const username = this.credentials.username.value;
                const password = this.credentials.password.value;
                const password2 = this.credentials.password2.value;
                const pin = this.credentials.pin.value;
                const question = this.credentials.security.question.value;
                const answer = this.credentials.security.answer.value;
                const answer2 = this.credentials.security.answer2.value;

                if (!firstname || !username || !password || !password2 || !pin || !question || !answer || !answer2) {
                    this.fieldsEmpty = true;
                } else if (password !== password2){
                    this.credentials.password.hasError = true;
                    this.credentials.password2.hasError = true;
                    const nonMatchPasswordMsg = 'enter matching passwords'
                    this.credentials.password.errMsg = nonMatchPasswordMsg;
                    this.credentials.password2.errMsg = nonMatchPasswordMsg;
                } else if (answer !== answer2) {
                    this.credentials.security.answer.hasError = true;
                    this.credentials.security.answer2.hasError = true;
                    const nonMatchAnswerMsg = 'enter matching answers'
                    this.credentials.security.answer.errMsg = nonMatchAnswerMsg;
                    this.credentials.security.answer2.errMsg = nonMatchAnswerMsg;
                } else if (username.length < 8) { 
                    this.credentials.username.hasError = true;
                    this.credentials.username.errMsg = '8 characters minimum';
                } else if (password.length < 8) { 
                    this.credentials.password.hasError = true;
                    this.credentials.password.errMsg = '8 characters minimum';
                } else if (pin.toString().length !== 4) { 
                    this.credentials.pin.hasError = true;
                    this.credentials.pin.errMsg = '4 numbers required';
                } else {

                // HTTP Post Request For User Registration And Store Commit If Registration Successful

                    this.isLoading = true;
                    const security = { question, answer, answer2 };
                    const registerReq = await httpPost('/user/register', 
                        { firstname, username, password, password2, pin, security });
                    if (registerReq.status === 201) {
                        this.credentials.firstname.hasError = false;
                        this.credentials.username.hasError = false;
                        this.credentials.password.hasError = false;
                        this.credentials.password2.hasError = false;
                        this.credentials.pin.hasError = false;
                        this.credentials.security.question.hasError = false;
                        this.credentials.security.answer.hasError = false;
                        const getNewUserData = await httpGet('/user/data');
                        this.$store.commit('setUserData', getNewUserData.data);
                        this.$router.push('/dashboard');
                    } else {

                // Error Handling

                        this.isLoading = false;
                        if (httpStatusCode(registerReq) >= 404) {
                            this.$store.commit('setModalErrorMessage', `registering user`)
                            this.$store.commit('toggleModal', 'error')
                        } else {
                            this.errorMessage = httpErrMsg(registerReq);
                            if (this.errorMessage.includes('add a first name')) {
                                this.credentials.firstname.hasError = true;
                                this.credentials.firstname.errMsg = 'add first name';
                            } else this.credentials.firstname.hasError = false;
                            if (this.errorMessage.includes('add a username')) {
                                this.credentials.username.hasError = true;
                                this.credentials.username.errMsg = 'add username 8 char min';
                            } else this.credentials.username.hasError = false;
                            if (this.errorMessage.includes('Username already exists')) {
                                this.credentials.username.hasError = true;
                                this.credentials.username.errMsg = 'username already exists';
                            } else this.credentials.username.hasError = false;
                            if (this.errorMessage.includes('add a password')) {
                                this.credentials.password.hasError = true;
                                this.credentials.password.errMsg = 'add password 8 char min';
                            } else this.credentials.password.hasError = false;  
                            if (this.errorMessage.includes('reenter password')) {
                                this.credentials.password2.hasError = true;
                                this.credentials.password2.errMsg = 'reenter password';
                            } else this.credentials.password2.hasError = false;  
                            if (this.errorMessage.includes('entries do not match')) {
                                this.credentials.password.hasError = true;
                                this.credentials.password2.hasError = true;
                                this.credentials.password.errMsg = 'passwords must match';
                                this.credentials.password2.errMsg = 'passwords must match';
                            } else {
                                this.credentials.password.hasError = false; 
                                this.credentials.password2.hasError = false;  
                            }
                            if (this.errorMessage.includes('4 digit numeric pin')) {
                                this.credentials.pin.hasError = true;
                                this.credentials.pin.errMsg = '4 numbers required';
                            } else this.credentials.pin.hasError = false;  
                            if (this.errorMessage.includes('provide a security question and answer')) {
                                this.credentials.security.question.hasError = true;
                                this.credentials.security.answer.hasError = true;
                                this.credentials.security.question.errMsg = 'provide security question';
                                this.credentials.security.answer.errMsg = 'provide security answer';
                            } else {
                                this.credentials.security.question.hasError = false;
                                this.credentials.security.answer.hasError = false; 
                            }
                            if (this.errorMessage.includes('add a security question')) {
                                this.credentials.security.question.hasError = true;
                                this.credentials.security.question.errMsg = 'provide security question';
                            } else this.credentials.security.question.hasError = false;
                            if (this.errorMessage.includes('add a security answer')) {
                                this.credentials.security.answer.hasError = true;
                                this.credentials.security.answer.errMsg = 'provide security answer';
                            } else this.credentials.security.answer.hasError = false;    
                            if (this.errorMessage.includes('Security answer cannot have spaces')) {
                                this.credentials.security.answer.hasError = true;
                                this.credentials.security.answer.errMsg = 'no spaces';
                            } else this.credentials.security.answer.hasError = false;    
                            if (this.errorMessage.includes('Security answer entries do not match')) {
                                this.credentials.security.answer.hasError = true;
                                this.credentials.security.answer2.hasError = true;
                                const nonMatchAnswerMsg = 'enter matching answers'
                                this.credentials.security.answer.errMsg = nonMatchAnswerMsg;
                                this.credentials.security.answer2.errMsg = nonMatchAnswerMsg;
                            } else {
                                this.credentials.security.answer.hasError = false;  
                                this.credentials.security.answer2.hasError = false;  
                            }
                        }
                    }
                }
            },
            goToLogin() {
                this.$router.push('/login');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modal-styling {
        width: 100%;
        overflow: hidden;
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
        text-align: center;
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