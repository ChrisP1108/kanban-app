<template>
    <div class="modal-styling" @keyup="checkEnterKeypress">
        <h2>There was an error {{ errorMessage }}.  Please try again or check your internet connection.</h2>
        <button class="button-primary-s" @click="okClicked">Ok</button>
    </div>
</template>

<script>
    
    export default {
        computed: {
            errorMessage() {
                return this.$store.state.modalErrorMessage
            }
        },
        methods: {
            okClicked() {
                this.$store.commit('toggleModal')
            },
            checkEnterKeypress(e) {
                if (e.key === 'Enter') {
                    this.$store.commit('toggleModal')
                }
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
        margin-bottom: 6.25rem !important;
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