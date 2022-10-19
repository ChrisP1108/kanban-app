<template>
    <div :class="[darkModeToggled ? 'dark-mode' : 'light-mode', 'root-full-container']">
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect class="animator one" width="6" height="25" rx="2" fill="#635FC7"/>
            <rect class="animator two" opacity="0.75" x="9" width="6" height="25" rx="2" fill="#635FC7"/>
            <rect class="animator three" opacity="0.5" x="18" width="6" height="25" rx="2" fill="#635FC7"/>
        </svg>
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
                    this.$router.push('/dashboard')
                } else {
                    this.$router.push('/login')
                }
            }, 1000);
        },
        mounted() {
            const storageDarkMode = localStorage.getItem("darkMode") === 'true';;
            if (this.darkModeToggled !== storageDarkMode) {
                this.$store.commit('toggleDarkMode');
            }
            document.body.style.background = this.darkModeToggled ? 'black' : 'white';
        }
    });
</script>

<style lang="scss" scoped>
    .root-full-container {
        display: flex;
    }
    svg {
        margin: auto;
        min-width: 240px;
        min-height: 240px;
        width: 25vw;
        height: 25vw;
        max-height: 50vh;
        max-width: 50vh;
    }

    .animator {
        animation-name: flasher;
        animation-duration: 0.5s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        animation-direction: alternate;
    }

    .one {
        animation-delay: 0s;
    }

    .two {
        animation-delay: 0.25s;
    }

    .three {
        animation-delay: 0.5s;
    }

    @keyframes flasher {
        from { filter: brightness(0.5) }
        to { filter: brightness(2) }
    }
</style>