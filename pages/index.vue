<template>
    <div :class="[darkModeToggled ? 'dark-mode' : 'light-mode', 'root-background']">
        <div class="root-full-container padding-cover">
            <LoadingIcon class="loading-icon-full" />
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { httpGet } from '../services/httpClient';

    export default Vue.extend({
        computed: {
            darkModeToggled() {
                return this.$store.state.darkModeToggled
            }
        },
        async created() {
            let dataUrl;
            if (localStorage.getItem("demoMode") === "true") {
                dataUrl = '/user/demo'
            } else { 
                dataUrl = '/user/data'
            }
            const getDataAttempt = await httpGet(dataUrl);
            setTimeout(() => {
                if (getDataAttempt.status === 200) {
                    this.$store.commit('setUserData', getDataAttempt.data);
                    const boards = getDataAttempt.data.boards;
                    if (boards.length) {
                        const storedBoardSelected = localStorage.getItem("lastBoardSelected");
                        if (storedBoardSelected && boards.some(board => 
                            board._id.toString() === storedBoardSelected)) {
                                this.$store.commit('selectBoard', storedBoardSelected)
                        } else this.$store.commit('selectBoard', boards[0]._id)
                    }
                    this.$router.push('/dashboard')
                } else {
                    this.$store.commit('toggleLoginRedirect');
                    this.$router.push('/login')
                }
            }, 500);
        },
        mounted() {
            const storageDarkMode = localStorage.getItem("darkMode") === 'true';;
            if (this.darkModeToggled !== storageDarkMode) {
                this.$store.commit('toggleDarkMode');
            }
        }
    });
</script>

<style lang="scss" scoped>
    .root-full-container {
        display: flex;
    }
    .padding-cover {
        padding: 1.5rem !important;
    }
</style>