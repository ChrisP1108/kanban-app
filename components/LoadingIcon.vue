<template>
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect class="animator one" width="6" height="25" rx="2" fill="#635FC7"/>
        <rect class="animator two" opacity="0.75" x="9" width="6" height="25" rx="2" fill="#635FC7"/>
        <rect class="animator three" opacity="0.5" x="18" width="6" height="25" rx="2" fill="#635FC7"/>
    </svg>
</template>

<style lang="scss" scoped>
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