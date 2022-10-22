import { State } from './interface';


// Reset Modals

function resetModals(state: State) {
    state.modals.mobileBoards.toggled = false;
    state.modals.addTask.toggled = false;
    state.modals.editTask.toggled= false;
    state.modals.addBoard.toggled= false;
    state.modals.editBoard.toggled = false;
    state.modals.deleteTask.toggled = false;
    state.modals.deleteBoard.toggled = false;
}

// State Declarations

export const state = (): State => ({
    darkModeToggled: true,
    sidebarToggled: true,
    modals: {
        mobileBoards: {
            toggled: false
        },
        addTask: {
            toggled: false
        },
        editTask: {
            toggled: false,
            taskSelected: ''
        },
        addBoard: {
            toggled: false
        },
        editBoard: {
            toggled: false,
            boardSelected: ''
        },
        deleteTask: {
            toggled: false
        },
        deleteBoard: {
            toggled: false
        }
    },
    userData: {
        boards: [],
        user: {}
    },
    loginRedirect: false,
});

// State Mutations

export const mutations = {
    toggleDarkMode(state: State): void {
        state.darkModeToggled = !state.darkModeToggled;
        localStorage.setItem("darkMode", state.darkModeToggled.toString());
    },
    toggleSidebar(state: State): void {
        state.sidebarToggled = !state.sidebarToggled
    },
    toggleModal(state: State, type: string): void {
        resetModals(state);
        switch(type) {
            case 'mobileBoards':
                state.modals.mobileBoards.toggled = true;
                break;
            case 'addTask':
                state.modals.addTask.toggled = true;
                break;
            case 'editTask':
                state.modals.editTask.toggled= true;
                break;
            case 'addBoard':
                state.modals.addBoard.toggled = true;
                break;
            case 'editBoard':
                state.modals.editBoard.toggled = true;
                break;
            case 'deleteTask':
                state.modals.deleteTask.toggled = true;
                break;
            case 'deleteBoard':
                state.modals.deleteBoard.toggled = true;
                break;
            default:
                resetModals(state);
        }
    },
    setUserData(state: State, data: any): void {
        state.userData.user = data.user;
        state.userData.boards = data.boards;
    },
    toggleLoginRedirect(state: State): void {
        state.loginRedirect = !state.loginRedirect;
    }
}