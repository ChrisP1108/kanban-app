<template>
    <div class="modal-styling scrollbar-styling" @keyup="checkEnterKeypress">
        <h2>{{ emailSent && registering ? 'Enter Validation Key And Create Password' : emailSent && !registering ? "Enter Validation Key And New Password" : 'Enter Your Email' }}</h2>
        <div :class="[emailSent ? 'user-verified' : '', 'fields-container']">
            <div class="email-container">
                <FieldInput  class="email" label="Email" type="text" :input="{ value: credentials.email.value }" placeholder="" 
                    :empty-check="fieldsEmpty" :error-message="credentials.email.errMsg" :has-error="credentials.email.hasError"
                    @value-change="(value) => credentials.email.value = value" @error-found="(value) => credentials.email.errFound = value" />
                <label class="disclaimer-text">A six character validation key will be sent to your email to validate your email address prior to {{ registering ? "creating your password to finish your account registration." : "entering a new password."}} You will have five minutes and up to three attempts to enter the validation key and password or else you'll need to restart the process again.</label>
            </div>
            <div class="validate-container">
                <FieldInput class="key" label="Enter Validation Key That Was Sent To Your Email" type="text" 
                    :input="{ value: credentials.key.value }" placeholder="" :empty-check="fieldsEmpty" :error-message="credentials.key.errMsg" 
                    :has-error="credentials.key.hasError" 
                    @value-change="(value) => credentials.key.value = value" @error-found="(value) => credentials.key.errFound = value" />
                <FieldInput class="password" :label="registering ? 'Create New Password' : 'Enter New Password'" type="password" :input="{ value: credentials.password.value }" 
                    placeholder="" :empty-check="fieldsEmpty" :error-message="credentials.password.errMsg" :has-error="credentials.password.hasError"
                    @value-change="(value) => credentials.password.value = value" @error-found="(value) => credentials.password.errFound = value" />
                <FieldInput class="password" label="Re-Enter Password" type="password" :input="{ value: credentials.password2.value }" 
                    placeholder="" :empty-check="fieldsEmpty" :error-message="credentials.password2.errMsg" :has-error="credentials.password2.hasError"
                    @value-change="(value) => credentials.password2.value = value" @error-found="(value) => credentials.password2.errFound = value" />
            </div>
        </div>
        <button :class="[isLoading ? 'button-primary-active' : '', 'button-primary-s']" @click="emailOrRegisterReset" >
            <div v-if="isLoading" class="button-content">
                <LoadingIcon />
            </div>
            <div v-if="!isLoading" class="button-content">
                {{ emailSent && registering ? 'Register' : emailSent && !registering ? 'Update Password' : 'Get Validation Key' }}
            </div>
        </button>
        <button class="button-secondary button-margin" @click="goToLogin">Return To Login</button>
        <ModeToggle class="mode-toggler"/>
    </div>
</template>

<script>
import { httpPost, httpErrMsg, httpStatusCode } from '../services/httpClient';
import { validEmail } from '../services/validEmail';

    export default {
        props: {
            registering: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                credentials: {
                    email: {
                        value: '',
                        hasError: false,
                        errMsg: '',
                        errFound: false
                    },
                    key: {
                        value: '',
                        hasError: false,
                        errMsg: '',
                        errFound: false
                    },
                    password: {
                        value: '',
                        hasError: false,
                        errMsg: '',
                        errFound: false
                    },
                    password2: {
                        value: '',
                        hasError: false,
                        errMsg: '',
                        errFound: false
                    }
                },
                emailSent: false,
                fieldsEmpty: false,
                isLoading: false,
                errorMessage: '',
                keyValidationAttempts: 0,
                noKeyCookie: false
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
                    this.emailOrRegisterReset();
                }
            },
            async emailOrRegisterReset() {

                // Check That Number Of Key Validation Attempts Was Not Exceeded Or That Key Cookie Did Not Expire.  If So, Return To Exit

                if (this.keyValidationAttempts === 3 || this.noKeyCookie) {
                    return
                }

                // Clear Any Previous Error Highlighted Fields For Fresh Check

                this.credentials.email.hasError = false;
                this.credentials.password.hasError = false;
                this.credentials.password2.hasError = false;
                this.credentials.key.hasError = false;

                // Field Declarations

                const email = this.credentials.email.value.toLowerCase();
                const key = this.credentials.key.value;
                const password = this.credentials.password.value;
                const password2 = this.credentials.password2.value;

                // HTTP Data Variable Declarations

                let emailReq;
                let registerReq;
                let resetPassword;

                // Check If User Entered Email And Email Was Sent For Key.  If Not, Start With Email First.  Otherwise Go To Registration Or Reset Password

                // Enter Email For Key

                if (!this.emailSent) {

                    // Check That Email Is Entered And Valid

                    if (!email) {
                        this.fieldsEmpty = true;
                    } else if (!validEmail(email)) { 
                        this.credentials.email.hasError = true;
                        this.credentials.email.errMsg = 'invalid email';
                    } else {

                        // HTTP Post Request To Verify First Name, Username, And Pin.  Get Security Question Response From Server

                        this.isLoading = true;
                        emailReq = await httpPost('/user/validate', 
                        { email , registering: this.registering });
                        if (emailReq.status === 200) {
                            this.fieldsEmpty = false;
                            this.isLoading = false;
                            this.emailSent = true;
                        } else {

                        // Error Handling If Email Verification Fails

                            this.isLoading = false;
                            if (httpStatusCode(emailReq) >= 404) {
                                console.error(emailReq);
                                this.$store.commit('setModalErrorMessage', `registering user`)
                                this.$store.commit('toggleModal', 'error')
                            } else {
                                this.errorMessage = httpErrMsg(emailReq);
                                if (this.errorMessage.includes('email already exists')) {
                                    this.credentials.email.hasError = true;
                                    this.credentials.email.errMsg = 'email already exists';
                                } else if (this.errorMessage.includes('No such user email exists')) {
                                    this.credentials.email.hasError = true;
                                    this.credentials.email.errMsg = 'no user email exists';
                                } else this.credentials.email.hasError = false;
                            }
                        }
                    }

                    // HTTP Register Or Reset Password

                } else if (this.emailSent) {

                    // Check That No Fields Are Empty

                    if ( !key || !password || !password2 ) {
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
                    } else if (!key) { 
                        this.credentials.key.hasError = true;
                        this.keyValidationAttempts++;
                        this.credentials.key.errMsg = `enter key from email. ${3 - this.keyValidationAttempts} ${this.keyValidationAttempts === 2 ? 'attempt' : 'attempts'} remaining.`;
                    } else if (key.length < 6) { 
                        this.credentials.key.hasError = true;
                        this.keyValidationAttempts++;
                        this.credentials.key.errMsg = `invalid key. ${3 - this.keyValidationAttempts} ${this.keyValidationAttempts === 2 ? 'attempt' : 'attempts'} remaining.`;
                    } else {

                        this.isLoading = true;
                        let validationError = false;

                        if (this.registering) {

                            // HTTP Post For Registration

                            registerReq = await httpPost('/user/register', 
                            { email, key, password, password2, attempts: this.keyValidationAttempts });
                            if (registerReq.status !== 201) {
                                validationError = registerReq;
                            } 
                        } else {

                            // HTTP Post For Resetting Password

                            resetPassword = await httpPost('/user/reset', 
                            { email, key, password, password2, attempts: this.keyValidationAttempts });
                            if (resetPassword.status !== 200) {
                                validationError = resetPassword;
                            } 
                        }

                        if (validationError === false) {
                            if (this.$store.state.loginRedirect) {
                                this.$store.commit('toggleLoginRedirect');
                            }
                            this.$router.push('/')
                        } else {

                        // Reset User Password Error Handling

                            this.isLoading = false;
                            if (httpStatusCode(validationError) >= 404) {
                                this.$store.commit('setModalErrorMessage', `resetting user password`)
                                this.$store.commit('toggleModal', 'error')
                            } else {
                                this.errorMessage = httpErrMsg(validationError);
                                if (this.errorMessage.includes('could not verify key')) {
                                    this.credentials.key.hasError = true;
                                    this.keyValidationAttempts++;
                                    this.credentials.key.errMsg = `key not found. ${3 - this.keyValidationAttempts} ${this.keyValidationAttempts === 2 ? 'attempt' : 'attempts'} remaining.`;
                                } else if (this.errorMessage.includes('invalid validation key cookie') || this.errorMessage.includes('Not authorized, invalid key')) {
                                    this.credentials.key.hasError = true;
                                    this.keyValidationAttempts++;
                                    this.credentials.key.errMsg = `invalid key. ${3 - this.keyValidationAttempts} ${this.keyValidationAttempts === 2 ? 'attempt' : 'attempts'} remaining.`;
                                } else if (this.errorMessage.includes('no email validation key cookie')) {
                                    this.credentials.key.hasError = true;
                                    this.credentials.key.errMsg = 'validation time period expired.';
                                    this.noKeyCookie = true;
                                } else {
                                    this.credentials.key.hasError = false;  
                                    this.credentials.email.hasError = false;  
                                }
                            }
                        }
                    }
                }

                // Check If Number Of Key Validation Attempts Was 3 Or If Key Cookie Not Found/Expired.  If So, Force User Back To Reentering Their Email

                if (this.keyValidationAttempts === 3 || this.noKeyCookie) {
                    this.credentials.key.hasError = true;
                    if (this.keyValidationAttempts === 3) {
                        this.credentials.key.errMsg = 'number of attempts exceeded.';
                        this.credentials.email.value = '';
                    }
                    setTimeout(() => {
                        this.keyValidationAttempts = 0;
                        this.emailSent = false;
                        this.noKeyCookie = false;
                    }, 3000);
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

    .disclaimer-text {
        font-weight: 400;
        line-height: 1.125rem;
    }

    .fields-container {
        position: relative;

        & > * {
            transition: $speed-fast !important;
        }

        .email-container {
            position: absolute;
            left: 0%;
            width: 100%;
            height: 100%;
            top: 0%;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .validate-container {
            position: relative;
            top: 0;
            width: 100%;
            left: 125%;
        }
    }

    .user-verified {
        .email-container {
            left: -125% !important;
        }
        .validate-container {
            left: 0% !important;
        }
    }
</style>