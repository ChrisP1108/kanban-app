<template>
    <div class="modal-styling">
        <h2>User Menu</h2>
        <button class="button-primary-s" @click="logout">Logout</button>
        <button class="button-destructive" @click="deleteUser">Delete Account</button>
    </div>
</template>

<script>
    import { httpPost } from '../services/httpClient';
    
    export default {
        methods: {
            async logout() {
                await httpPost('/user/logout', {});
                this.$store.commit('toggleLoginRedirect');
                this.$router.push('/login');
            },
            deleteUser() {
                this.$store.commit('toggleModal', 'deleteUser')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .modal-styling {
        width: 100%;
    }
    h2 {
        margin-bottom: 2rem !important;
    }
    p {
        color: $color-g !important;
    }
    .button-destructive {
        margin: 1.5rem 0 1rem !important;
    }
    .button-secondary {
        margin: 0 !important;
    }
</style>