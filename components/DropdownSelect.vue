<template>
    <div class="dropdown-select-container">
        <label for="task-status" class="select-heading">Status</label>
        <div id="task-status" name="task-status" class="dropdown">
            <span>Todo</span>
            <img src="assets/images/dropdown-arrow.svg" alt="Dropdown Arrow"></img>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .dropdown-select-container {
        width: 100%;
        transition: $speed-fast;
        &:hover .dropdown{
            border: 0.0625rem $color-a solid;
        }
    }
</style>