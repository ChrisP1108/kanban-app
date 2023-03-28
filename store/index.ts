import { State, Board, Task, TaskItemDragging } from './interface';
import { isDemo } from '../services/demoAccount';

// Reset Modals

function resetModals(state: State) {
    state.modals.mobileBoards.toggled = false;
    state.modals.addTask.toggled = false;
    state.modals.editTask.toggled= false;
    state.modals.addBoard.toggled= false;
    state.modals.addColumn.toggled= false;
    state.modals.editBoard.toggled = false;
    state.modals.deleteTask.toggled = false;
    state.modals.viewTask.toggled = false;
    state.modals.deleteBoard.toggled = false;
    state.modals.deleteUser.toggled = false;
    state.modals.userMenu.toggled = false;
    state.modals.error.toggled = false;
}

// State Declarations

export const state = (): State => ({
    darkModeToggled: true,
    sidebarToggled: true,
    taskItemDragging: {
        isDragging: false,
        columnName: ''
    },
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
        addColumn: {
            toggled: false
        },
        editBoard: {
            toggled: false
        },
        deleteTask: {
            toggled: false
        },
        viewTask: {
            toggled: false
        },
        deleteBoard: {
            toggled: false
        },
        deleteUser: {
            toggled: false
        },
        userMenu: {
            toggled: false
        },
        error: {
            toggled: false
        }
    },
    boardSelected: '',
    taskSelected: '',
    userData: {
        boards: [],
        user: {}
    },
    loginRedirect: false,
    modalErrorMessage: ''
});

// Sort Boards

function boardSorter(list: Array<any>): Array<any> {
    return list.sort((a: any, b: any) => a.name > b.name ? 1 : -1 )
}

// Demo Mode Update To LocalStorage

function demoUpdate(data: Object): void {
    localStorage.setItem("data", JSON.stringify(data));
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
            case 'addColumn':
                state.modals.addColumn.toggled = true;
                break;
            case 'editBoard':
                state.modals.editBoard.toggled = true;
                break;
            case 'deleteTask':
                state.modals.deleteTask.toggled = true;
                break;
            case 'viewTask':
                state.modals.viewTask.toggled = true;
                break;
            case 'deleteBoard':
                state.modals.deleteBoard.toggled = true;
                break;
            case 'deleteUser':
                state.modals.deleteUser.toggled = true;
                break;
            case 'userMenu':
                state.modals.userMenu.toggled = true;
                break;
            case 'error':
                state.modals.error.toggled = true;
                break;
            default:
                resetModals(state);
        }
    },
    setUserData(state: State, data: any): void {
        state.userData.user = data.user;
        state.userData.boards = boardSorter(data.boards);

        // Demo Mode Only

        console.log(state.userData.user.email);

        if (isDemo(state.userData.user.email)) {
            demoUpdate(state.userData)
        }
    },
    toggleLoginRedirect(state: State): void {
        state.loginRedirect = !state.loginRedirect;
    },
    selectBoard(state: State, _id: string): void {
        state.boardSelected = _id;
        localStorage.setItem("lastBoardSelected", state.boardSelected.toString());
    },
    addBoard(state: State, newBoard: Board): void {
        state.userData.boards = boardSorter([...state.userData.boards, { ...newBoard, tasks: [] }]);
        state.boardSelected = newBoard._id.toString();

        // Demo Mode Only

        if (isDemo(state.userData.user.email)) {
            demoUpdate(state.userData)
        }
    },
    updateBoard(state: State, updatedBoard: Board): void {
        state.userData.boards = boardSorter(state.userData.boards.map((board: Board) => 
            board._id.toString() === state.boardSelected 
            ? {...board, name: updatedBoard.name, columns: updatedBoard.columns} 
            : board
        ));

        // Demo Mode Only

        if (isDemo(state.userData.user.email)) {
            demoUpdate(state.userData)
        }
    },
    deleteBoard(state: State, _id: string): void {
        state.userData.boards = boardSorter(state.userData.boards.filter((board: Board) => 
            board._id.toString() !== _id));
        state.boardSelected = state.userData.boards.length ? state.userData.boards[0]._id : '';
        localStorage.setItem("lastBoardSelected", state.boardSelected.toString());

        // Demo Mode Only

        if (isDemo(state.userData.user.email)) {
            demoUpdate(state.userData)
        }
    },
    selectTask(state: State, _id: string): void {
        state.taskSelected = _id;
    },
    addTask(state: State, newTask: Task): void {
        state.userData.boards = state.userData.boards.map((board: Board) => 
            board._id.toString() === state.boardSelected ? {...board, tasks: [...board.tasks, newTask]} : board);

        // Demo Mode Only

        if (isDemo(state.userData.user.email)) {
            demoUpdate(state.userData)
        }
    },
    updateTask(state: State, updatedTask: Task): void {
        state.userData.boards = state.userData.boards.map((board: Board) => {
            if (board.tasks.some((task: Task) => task._id.toString() === state.taskSelected)) {
                return {...board, tasks: board.tasks.map((t: Task) => 
                    t._id.toString() === state.taskSelected ? updatedTask
                    : t)
                }
            } else return board
        });

        // Demo Mode Only

        if (isDemo(state.userData.user.email)) {
            demoUpdate(state.userData)
        }
    },
    deleteTask(state: State, _id: string): void {
        state.userData.boards = state.userData.boards = state.userData.boards.map((board: Board) => {
            if (board.tasks.some((task: Task) => task._id.toString() === state.taskSelected)) {
                return {...board, tasks: board.tasks.filter((t: Task) => 
                    t._id.toString() !== state.taskSelected)
                }
            } else return board
        });

        // Demo Mode Only

        if (isDemo(state.userData.user.email)) {
            demoUpdate(state.userData)
        }
    },
    setModalErrorMessage(state: State, errorMessage: string): void {
        state.modalErrorMessage = errorMessage;
    },
    setTaskItemDragging(state: State, itemDragging: TaskItemDragging): void {
        state.taskItemDragging = itemDragging;
    }
}