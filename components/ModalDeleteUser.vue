<template>
    <div class="modal-styling scrollbar-styling" @keyup="checkEnterKeypress">
        <h2>Delete your user account?</h2>
        <p>Are you sure you want to delete your user account?  This action will remove all of your boards and tasks
             along with your login credentials and cannot be undone.
        </p>
        <FieldInput class="username" label="Username" type="text" :input="{ value: credentials.username.value }" placeholder="" 
            :empty-check="fieldsEmpty" :error-message="credentials.username.errMsg" :has-error="credentials.username.hasError"
            @value-change="(value) => credentials.username.value = value" @error-found="(value) => credentials.username.errFound = value" />
        <FieldInput class="password" label="Password" type="password" :input="{ value: credentials.password.value }" 
            placeholder="" :empty-check="fieldsEmpty" :error-message="credentials.password.errMsg" :has-error="credentials.password.hasError"
            @value-change="(value) => credentials.password.value = value" @error-found="(value) => credentials.password.errFound = value" />
        <button class="button-destructive" @click="confirmDelete">
            <div v-if="isLoading" class="button-content">
                <LoadingIcon />
            </div>
            <div v-if="!isLoading" class="button-content">
                Delete
            </div>
        </button>
        <button class="button-secondary" @click="cancelDelete">Cancel</button>
    </div>
</template>

<script>
    import { httpPost, httpErrMsg, httpStatusCode } from '../services/httpClient';

    export default {
        data() {
            return {
                credentials: {
                    username: {
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
                },
                fieldsEmpty: false,
                isLoading: false,
            }
        },
        computed: {
            errorMsg() {
                return this.$store.state.fieldEmptyMsg
            },
            deletingTask() {
                return this.mode === 'deleteTask'
            },
            deletingBoard() {
                return this.mode === 'deleteBoard'
            }
        },
        methods: {
            checkEnterKeypress(e) {
                if (e.key === 'Enter') {
                    this.confirmDelete();
                }
            },
            fieldEmpty(field) {
                if (!field && this.fieldsEmpty) {
                    return true
                } else return false
            },
            async confirmDelete() {

                // Check That No Fields Are Empty

                const username = this.credentials.username.value;
                const password = this.credentials.password.value;
                if (!username || !password) {
                    this.fieldsEmpty = true;
                    return null
                } 

                this.isLoading = true;

                // HTTP Post Request Which Actually Deletes User To Work Around Delete Request Limitation In Node Express

                const deleteReq = await httpPost('/user/delete', { username, password });

                // Delete User And Store Commit If No Errors Found

                if (deleteReq.status === 200) {
                    this.credentials.username.hasError = false;
                    this.credentials.password.hasError = false;
                    if (!this.$store.state.loginRedirect) {
                        this.$store.commit('toggleLoginRedirect');
                    }
                    this.$store.commit('toggleModal');
                    this.$router.push('/login')

                // Error Handling
                
                } else {
                    this.isLoading = false;
                    if (httpStatusCode(deleteReq) >= 404) {
                        this.$store.commit('setModalErrorMessage', `deleting user account`)
                        this.$store.commit('toggleModal', 'error')
                    } else {
                        this.errorMessage = httpErrMsg(deleteReq);
                        if (this.errorMessage.includes('enter a username')) {
                            this.credentials.username.hasError = true;
                            this.credentials.username.errMsg = 'enter a username';
                        } else this.credentials.username.hasError = false;
                        if (this.errorMessage.includes('Invalid username')) {
                            this.credentials.username.hasError = true;
                            this.credentials.username.errMsg = 'invalid username';
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
            cancelDelete() {
                this.$store.commit('toggleModal')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modal-styling {
        width: 100%;
    }
    h2 {
        color: $color-j !important;
    }
    p {
        color: $color-g !important;
        margin-bottom: 1rem;
    }
    .button-destructive {
        margin: 1.5rem 0 1rem !important;
    }
    .button-secondary {
        margin: 0 !important;
    }
</style>