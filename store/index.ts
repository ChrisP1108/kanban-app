import { State, Board } from './interface';


// Reset Modals

function resetModals(state: State) {
    state.modals.mobileBoards.toggled = false;
    state.modals.addTask.toggled = false;
    state.modals.editTask.toggled= false;
    state.modals.addBoard.toggled= false;
    state.modals.editBoard.toggled = false;
    state.modals.deleteTask.toggled = false;
    state.modals.deleteBoard.toggled = false;
    state.modals.deleteUser.toggled = false;
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
            toggled: false
        },
        deleteTask: {
            toggled: false
        },
        deleteBoard: {
            toggled: false
        },
        deleteUser: {
            toggled: false
        }
    },
    boardSelected: '',
    userData: {
        boards: [],
        user: {}
    },
    loginRedirect: false,
});

// Sort Boards

function boardSorter(list: Array<any>): Array<any> {
    return list.sort((a: any, b: any) => a.name > b.name ? 1 : -1 )
}

// State Mutations

export const mutations = {
    toggleDarkMode(state: State): void {
        state.darkModeToggled = !state.darkModeToggled;
        localStorage.setItem("darkMode", state.darkModeToggled.toString());
    },
    toggleSidebar(state: State): void {
        state.sidebarToggled = !state.sidebarToggled
    },
    toggleModal(state: State, type: string, selectedId: string): void {
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
            case 'deleteUser':
                state.modals.deleteUser.toggled = true;
                break;
            default:
                resetModals(state);
        }
    },
    setUserData(state: State, data: any): void {
        state.userData.user = data.user;
        state.userData.boards = boardSorter(data.boards);
    },
    toggleLoginRedirect(state: State): void {
        state.loginRedirect = !state.loginRedirect;
    },
    selectBoard(state: State, id: string): void {
        state.boardSelected = id;
    },
    addBoard(state: State, newBoard: Board): void {
        state.userData.boards = boardSorter([...state.userData.boards, { ...newBoard, tasks: [] }]);
        state.boardSelected = newBoard.id.toString();
    },
    updateBoard(state: State, updatedBoard: Board): void {
        state.userData.boards = boardSorter(state.userData.boards.map(board => 
            board.id === updatedBoard.id ? updatedBoard : board
        ));
    },
    deleteBoard(state: State, id: string): void {
        state.userData.boards = boardSorter(state.userData.boards.filter(board => board.id !== id));
        state.boardSelected = state.userData.boards.length ? state.userData.boards[0].id : '';
    }
}