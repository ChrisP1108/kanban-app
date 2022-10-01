// State Interface

export interface State {
    darkModeToggled: boolean;
    modalOverlay: boolean;
    modals: {
        mobileBoardsToggled: boolean;
        addTaskToggled: boolean;
        createBoard: boolean;
    }
}

// Modals Declarations

const modalsInit: State['modals'] = {
    mobileBoardsToggled: false,
    addTaskToggled: false,
    createBoard: false
}

// Reset Modals

    function resetModals(state: State) {
        state.modalOverlay = false;
        state.modals = modalsInit;
    }

// State Declarations

export const state = (): State => ({
    darkModeToggled: true,
    modalOverlay: false,
    modals: modalsInit
});

// State Mutations

export const mutations = {
    toggleDarkMode(state: State): void {
        state.darkModeToggled = !state.darkModeToggled
    },
    toggleModal(state: State, type: string): void {
        state.modalOverlay = !state.modalOverlay
        if (state.modalOverlay) {
            switch(type) {
                case 'mobileBoards':
                    state.modals.mobileBoardsToggled = true;
                    break;
                case 'addTask':
                    state.modals.addTaskToggled = true;
                    break;
                case 'createBoard':
                    state.modals.createBoard = true;
                    break;
                default:
                    resetModals(state);
            }
        } else {
            resetModals(state)
        }
    }
}