// State Interface

export interface State {
    darkModeToggled: boolean;
    modalOverlay: boolean;
    modals: {
        mobileBoardsToggled: boolean;
        addTaskToggled: boolean;
        editTaskToggled: boolean;
        createBoard: boolean;
    }
}

// Reset Modals

function resetModals(state: State) {
    state.modals.mobileBoardsToggled = false;
    state.modals.addTaskToggled = false;
    state.modals.editTaskToggled = false;
    state.modals.createBoard = false;
}

// State Declarations

export const state = (): State => ({
    darkModeToggled: true,
    modalOverlay: false,
    modals: {
        mobileBoardsToggled: false,
        addTaskToggled: false,
        editTaskToggled: false,
        createBoard: false
    }
});

// State Mutations

export const mutations = {
    toggleDarkMode(state: State): void {
        state.darkModeToggled = !state.darkModeToggled
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
            case 'createBoard':
                state.modals.createBoard = true;
                break;
            default:
                resetModals(state);
                state.modalOverlay = false;
        }
    }
}