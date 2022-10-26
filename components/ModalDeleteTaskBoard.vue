<template>
    <div class="modal-styling">
        <h2>Delete this {{ deletingTask ? 'task' : deletingBoard ? 'board' : '[Error]'}}?</h2>
        <p>Are you sure you want to delete the '{{ deletingBoard ? boardName : '' }}' 
            {{ deletingTask ? 'task and its subtasks' 
            : deletingBoard ? 'board' : '[Error]'}}? This action {{ deletingTask  
            ? '' : deletingBoard ? 'will remove all columns and tasks and' : '[Error]'}} 
            cannot be reversed.</p>
        <button class="button-destructive" @click="confirmDelete">
            <div v-if="isLoading" class="button-content">
                <LoadingIcon />
            </div>
            <div v-if="!isLoading" class="button-content">
                Delete
            </div>
        </button>
        <button class="button-secondary" @click="cancelDelete">Cancel</button>
    </div>
</template>

<script>
    import { httpDelete } from '../services/httpClient';
    
    export default {
        props: {
            mode: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                boardName: '',
                isLoading: false
            }
        },
        computed: {
            errorMsg() {
                return this.$store.state.fieldEmptyMsg
            },
            deletingTask() {
                return this.mode === 'deleteTask'
            },
            deletingBoard() {
                return this.mode === 'deleteBoard'
            },
            selectedBoardId() {
                return this.$store.state.boardSelected
            },
            boardList() {
                return this.$store.state.userData.boards
            }
        },
        created() {
            if (this.deletingBoard) {
                const boardSelected = [...this.boardList].find(board => board.id === this.selectedBoardId);
                this.boardName = boardSelected.name
            }
        },
        methods: {
            async confirmDelete() {
                this.isLoading = true;
                if (this.deletingBoard) {
                    const boardDelReq = await httpDelete(`/boards/${this.selectedBoardId}`);
                    if (boardDelReq.status === 200) {
                        this.$store.commit('deleteBoard', this.selectedBoardId);
                        this.$store.commit('toggleModal');
                    } else {
                        isLoading = false;
                        console.error('Error deleting board')
                    }
                }
            },
            cancelDelete() {
                this.$store.commit('toggleModal')
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