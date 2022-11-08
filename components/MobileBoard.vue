<template>
    <div class="mobile-board-container modal-styling">
        <Boards class="mobile-boards" />
        <UserIcon  class="offset-adjust" />
    </div>
</template>
<script>

</script>

<style lang="scss" scoped>
    .mobile-board-container {
        top: 5rem !important;
        padding: 1rem 0 !important;
        transform: translateX(-50%) !important;
        max-width: 16.5rem !important;
        width: calc(100% - 2rem);
        position: absolute;
        left: 50%;
    }

    .mobile-boards {
        top: 0;
    }

    .dark-mode {
        .mobile-board-container {
            background: $color-e;
        }
    }
    .light-mode {
        .mobile-board-container {
            background: $color-white;
        }
    }

    .offset-adjust {
        top: 0.2rem;
    }
</style>