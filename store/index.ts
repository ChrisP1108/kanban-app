// State Interface

export interface State {
    darkModeToggled: boolean;
    sidebarToggled: boolean;
    modalOverlay: boolean;
    modals: {
        mobileBoardsToggled: boolean;
        addTaskToggled: boolean;
        editTaskToggled: boolean;
        addBoardToggled: boolean;
        editBoardToggled: boolean;
        deleteTaskToggled: boolean;
        deleteBoardToggled: boolean;
    }
}

// Reset Modals

function resetModals(state: State) {
    state.modals.mobileBoardsToggled = false;
    state.modals.addTaskToggled = false;
    state.modals.editTaskToggled = false;
    state.modals.addBoardToggled = false;
    state.modals.editBoardToggled = false;
    state.modals.deleteTaskToggled = false;
    state.modals.deleteBoardToggled = false;
}

// State Declarations

export const state = (): State => ({
    darkModeToggled: true,
    sidebarToggled: true,
    modalOverlay: false,
    modals: {
        mobileBoardsToggled: false,
        addTaskToggled: false,
        editTaskToggled: false,
        addBoardToggled: false,
        editBoardToggled: false,
        deleteTaskToggled: false,
        deleteBoardToggled: false
    }
});

// State Mutations

export const mutations = {
    toggleDarkMode(state: State): void {
        state.darkModeToggled = !state.darkModeToggled
    },
    toggleSidebar(state: State): void {
        state.sidebarToggled = !state.sidebarToggled
    },
    toggleModal(state: State, type: string): void {
        state.modalOverlay = true;
        resetModals(state);
        switch(type) {
            case 'mobileBoards':
                state.modals.mobileBoardsToggled = true;
                break;
            case 'addTask':
                state.modals.addTaskToggled = true;
                break;
            case 'editTask':
                state.modals.editTaskToggled = true;
                break;
            case 'addBoard':
                state.modals.addBoardToggled = true;
                break;
            case 'editBoard':
                state.modals.editBoardToggled = true;
                break;
            case 'deleteTask':
                state.modals.deleteTaskToggled = true;
                break;
            case 'deleteBoard':
                state.modals.deleteBoardToggled = true;
                break;
            default:
                resetModals(state);
                state.modalOverlay = false;
        }
    }
}