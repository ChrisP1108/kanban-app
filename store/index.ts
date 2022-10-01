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

// State Declarations

export const state = (): State => ({
    darkModeToggled: true,
    modalOverlay: false,
    modals: {
        mobileBoardsToggled: false,
        addTaskToggled: false,
        createBoard: false
    }
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
                    state.modalOverlay = false;
                    break;
            }
        } else {
            state.modals.mobileBoardsToggled = false;
            state.modals.addTaskToggled = false;
            state.modals.createBoard = false;
        }
    }
}