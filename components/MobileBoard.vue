<template>
    <div class="mobile-board-container modal-styling">
        <Boards class="mobile-boards" />
    </div>
</template>

<script>

</script>

<style lang="scss" scoped>
    .mobile-board-container {
        top: 5rem !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        transform: translateX(-50%) !important;
        max-width: 16.5rem !important;
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
</style>