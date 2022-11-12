<template>
    <div class="modal-styling scrollbar-styling" @keyup="checkEnterKeypress">
        <h2>{{ userVerified ? 'Reset User Credentials' : 'Verify Credentials' }}</h2>
        <div :class="[userVerified ? 'user-verified' : '', 'fields-container']">
            <div class="verify-container">
                <FieldInput  class="firstname" label="First Name" type="text" :input="{ value: credentials.firstname.value }" placeholder="" 
                    :empty-check="fieldsEmpty" :error-message="credentials.firstname.errMsg" :has-error="credentials.firstname.hasError"
                    @value-change="(value) => credentials.firstname.value = value" @error-found="(value) => errFound = value" />
                <FieldInput  class="username" label="Username" type="text" :input="{ value: credentials.username.value }" placeholder="" 
                    :empty-check="fieldsEmpty" :error-message="credentials.username.errMsg" :has-error="credentials.username.hasError"
                    @value-change="(value) => credentials.username.value = value" @error-found="(value) => errFound = value" />
                <FieldInput class="pin" label="4 Digit Security PIN" type="password" :input="{ value: credentials.pin.value }" 
                    placeholder="" :empty-check="fieldsEmpty" :error-message="credentials.pin.errMsg" :has-error="credentials.pin.hasError"
                    @value-change="(value) => credentials.pin.value = value" @error-found="(value) => errFound = value" />
            </div>
            <div class="reset-container">
                <FieldInput class="security-question" :label="'Provide Security Answer To Question: ' + credentials.security.question.value" type="text" 
                    :input="{ value: credentials.security.answer.value }" placeholder="" :empty-check="fieldsEmpty" :error-message="credentials.security.answer.errMsg" 
                    :has-error="credentials.security.answer.hasError" 
                    @value-change="(value) => credentials.security.answer.value = value" @error-found="(value) => errFound = value" />
                <FieldInput class="password" label="Enter New Password" type="password" :input="{ value: credentials.password.value }" 
                    placeholder="" :empty-check="fieldsEmpty" :error-message="credentials.password.errMsg" :has-error="credentials.password.hasError"
                    @value-change="(value) => credentials.password.value = value" @error-found="(value) => errFound = value" />
                <FieldInput class="password" label="Re-Enter New Password" type="password" :input="{ value: credentials.password2.value }" 
                    placeholder="" :empty-check="fieldsEmpty" :error-message="credentials.password2.errMsg" :has-error="credentials.password2.hasError"
                    @value-change="(value) => credentials.password2.value = value" @error-found="(value) => errFound = value" />
            </div>
        </div>
        <button :class="[isLoading ? 'button-primary-active' : '', 'button-primary-s']" @click="verifyOrReset" >
            <div v-if="isLoading" class="button-content">
                <LoadingIcon />
            </div>
            <div v-if="!isLoading" class="button-content">
                {{ userVerified ? 'Reset Credentials' : 'Verify Credentials' }}
            </div>
        </button>
        <button class="button-secondary button-margin" @click="goToLogin">Return To Login</button>
        <ModeToggle class="mode-toggler"/>
    </div>
</template>

<script>
import { httpPost, httpErrMsg, httpStatusCode } from '../services/httpClient';

    export default {
        data() {
            return {
                userVerified: false,
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
                    this.verifyOrReset();
                }
            },
            async verifyOrReset() {

                // Exit If Field Input Component Found An Error

                if (this.errFound) {
                    return null
                }

                // Field Declarations

                const firstname = this.credentials.firstname.value;
                const username = this.credentials.username.value;
                const pin = this.credentials.pin.value;
                const password = this.credentials.password.value;
                const password2 = this.credentials.password2.value;
                const answer = this.credentials.security.answer.value;

                const security = {
                    question: this.credentials.security.question.value,
                    answer: this.credentials.security.answer.value
                }

                // HTTP Data Variable Declarations

                let verifyReq;
                let resetReq;

                // Check If User Was Verified.  If Not, Start With Verification First.  Otherwise Go To Reset

                // Verify User

                if (!this.userVerified) {

                    // Check That No Fields Are Empty

                    if (!firstname || !username || !pin) {
                        this.fieldsEmpty = true;
                    } else if (username.length < 8) { 
                        this.credentials.username.hasError = true;
                        this.credentials.username.errMsg = '8 characters minimum';
                    } else if (pin.toString().length !== 4) { 
                        this.credentials.pin.hasError = true;
                        this.credentials.pin.errMsg = '4 numbers required';
                    } else {

                    // HTTP Post Request To Verify First Name, Username, And Pin.  Get Security Question Response From Server

                        this.isLoading = true;
                        verifyReq = await httpPost('/user/verify', 
                        { firstname, username, pin });
                        if (verifyReq.status === 200) {
                            this.fieldsEmpty = false;
                            this.isLoading = false;
                            this.userVerified = true;
                            this.credentials.security.question.value = verifyReq.data.security.question;
                        } else {

                    // Error Handling If User Verification Fails

                            this.isLoading = false;
                            if (httpStatusCode(verifyReq) >= 404) {
                                this.$store.commit('setModalErrorMessage', `verifying user`)
                                this.$store.commit('toggleModal', 'error')
                            } else {
                                this.errorMessage = httpErrMsg(verifyReq);
                                if (this.errorMessage.includes('enter a first name')) {
                                    this.credentials.firstname.hasError = true;
                                    this.credentials.firstname.errMsg = 'enter first name';
                                } else this.credentials.firstname.hasError = false;
                                if (this.errorMessage.includes('Invalid first name')) {
                                    this.credentials.firstname.hasError = true;
                                    this.credentials.firstname.errMsg = 'invalid first name';
                                } else this.credentials.firstname.hasError = false;
                                if (this.errorMessage.includes('enter a username')) {
                                    this.credentials.username.hasError = true;
                                    this.credentials.username.errMsg = 'enter username';
                                } else this.credentials.username.hasError = false;
                                if (this.errorMessage.includes('Username does not exist')) {
                                    this.credentials.username.hasError = true;
                                    this.credentials.username.errMsg = 'invalid username';
                                } else this.credentials.username.hasError = false;
                                if (this.errorMessage.includes('4 digit numeric pin')) {
                                    this.credentials.pin.hasError = true;
                                    this.credentials.pin.errMsg = '4 numbers required';
                                } else this.credentials.pin.hasError = false;  
                                if (this.errorMessage.includes('Invalid pin')) {
                                    this.credentials.pin.hasError = true;
                                    this.credentials.pin.errMsg = 'invalid pin';
                                } else this.credentials.pin.hasError = false;  
                            }
                        }
                    } 

                    // HTTP Reset User Password

                } else if (this.userVerified) {

                    // Check That No Fields Are Empty

                    if (!password || !password2|| !answer) {
                        this.fieldsEmpty = true;
                    } else if (password.length < 8) { 
                        this.credentials.password.hasError = true;
                        this.credentials.password.errMsg = '8 characters minimum';
                    } else if (password !== password2){
                        this.credentials.password.hasError = true;
                        this.credentials.password2.hasError = true;
                        const nonMatchPasswordMsg = 'enter matching passwords'
                        this.credentials.password.errMsg = nonMatchPasswordMsg;
                        this.credentials.password2.errMsg = nonMatchPasswordMsg;
                    } else {

                    // HTTP Post For Reset User Password

                        this.isLoading = true;
                        resetReq = await httpPost('/user/reset', 
                            { firstname, username, password, password2, pin, security });
                        if (resetReq.status === 200) {
                            if (this.$store.state.loginRedirect) {
                                this.$store.commit('toggleLoginRedirect');
                            }
                            this.$router.push('/')
                        } else {

                    // Reset User Password Error Handling

                            this.isLoading = false;
                            if (httpStatusCode(resetReq) >= 404) {
                                this.$store.commit('setModalErrorMessage', `resetting user credentials`)
                                this.$store.commit('toggleModal', 'error')
                            } else {
                                this.errorMessage = httpErrMsg(resetReq);
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
                                if (this.errorMessage.includes('Invalid security answer')) {
                                    this.credentials.security.answer.hasError = true;
                                    this.credentials.security.answer.errMsg = 'invalid answer';
                                } else this.credentials.security.answer.hasError = false;  
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

    .fields-container {
        position: relative;

        & > * {
            transition: $speed-fast !important;
        }

        .verify-container {
            position: relative;
            left: 0%;
        }
        .reset-container {
            position: absolute;
            top: 0;
            width: 100%;
            left: 125%;
        }
    }

    .user-verified {
        .verify-container {
            left: -125% !important;
        }
        .reset-container {
            left: 0% !important;
        }
    }
</style>