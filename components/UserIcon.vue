<template>
    <img src="assets/images/user-font-awesome.svg" alt="Logo" @click="toggleUserMenu">
</template>

<script>
    export default {
        methods: {
            toggleUserMenu() {
                this.$store.commit('toggleModal', 'userMenu')
            }
        }
    }
</script>

<style lang="scss" scoped>
    img {
        position: absolute;
        left: calc(100% - 1.85rem);
        width: 2.5rem;
        height: 2.5rem;
        margin-left: -1.5rem;
        padding: 0.5rem;
        cursor: pointer;
    }
</style>