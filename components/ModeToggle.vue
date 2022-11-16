<template>
    <div class="mode-toggle-container curved-border board-side-item-minwidth">
        <img class="light-mode-icon" src="assets/images/light-mode-logo.svg" alt="light-mode-logo">
        <svg @click="modeToggleClicked" width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="20" rx="10" fill="" />
            <circle :class="[!darkModeToggled ? 'light-mode-active' : '']" cx="30" cy="10" r="7" fill="" />
        </svg>
        <img class="dark-mode-icon" src="assets/images/dark-mode-logo.svg" alt="light-mode-logo">
    </div>
</template>

<script>
    export default {
        data() {
            return {
                metaColor: null
            }
        },
        computed: {
            darkModeToggled() {
                return this.$store.state.darkModeToggled
            } 
        },
        mounted() {
            this.metaColor = document.querySelector('meta[name="theme-color"]');
        },
        methods: {
            modeToggleClicked() {
                this.$store.commit('toggleDarkMode');
                if (this.darkModeToggled) {
                    this.metaColor.content = '#2B2C36'
                } else this.metaColor.content = '#A8A3FF'
            }
        }
    }
</script>

<style lang="scss" scoped>
    .mode-toggle-container {
        width: 100%;
        min-height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .dark-mode {
        .mode-toggle-container {
            background: $color-d;
        }
    }
    .light-mode {
        .mode-toggle-container {
            background: $color-i;
        }
    }
    .light-mode-icon {
        width: 1.1456rem;
        height: 1.1456rem;
    }
    .dark-mode-icon {
        width: 0.9375rem;
        height: 0.9375rem;
    }
    .light-mode-active {
        transform: translateX(-50%);
    }
    svg {
        cursor: pointer;
        width: 5rem;
        height: 2.75rem;
        padding: 0.75rem 0;
        rect {
            fill: $color-a;
        }
        circle {
            fill: $color-white;
        }
    }
</style>