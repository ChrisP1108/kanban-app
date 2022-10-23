<template>
    <div :class="[darkModeToggled ? 'dark-mode' : 'light-mode', 'root-background']">
        <div class="root-full-container">
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
            const getDataAttempt = await httpGet('/user/data');
            setTimeout(() => {
                if (getDataAttempt.status === 200) {
                    this.$store.commit('setUserData', getDataAttempt.data);
                    console.log(this.$store.state.userData);
                    this.$router.push('/dashboard')
                } else {
                    this.$store.commit('toggleLoginRedirect');
                    this.$router.push('/login')
                }
            }, 1000);
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
</style>